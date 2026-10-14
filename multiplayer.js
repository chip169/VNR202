// Module Đồng Bộ Nhiều Người Chơi Trực Tuyến Thời Gian Thực (Multiplayer Real-time via MQTT)
// Sử dụng HiveMQ Public WebSocket Broker (Miễn phí, WSS bảo mật)
// Kiến trúc P2P Mesh: Mọi đại biểu tự động tìm thấy nhau, tự bầu Chủ tọa nếu không có máy chủ riêng

class MultiplayerManager {
  constructor(appRef) {
    this.app = appRef;
    this.client = null;
    this.isConnected = false;
    this.isHost = false;
    this.createdAsHost = false;
    this.roomId = '1930-VN';
    
    // Lưu giữ và tái sử dụng playerId qua sessionStorage để khi F5 / Refresh không sinh đại biểu mới trùng lặp
    let persistentId = null;
    try {
      persistentId = sessionStorage.getItem('vnr202_player_id');
    } catch (e) {}
    if (!persistentId) {
      persistentId = 'p_' + Math.random().toString(36).substring(2, 9);
      try {
        sessionStorage.setItem('vnr202_player_id', persistentId);
      } catch (e) {}
    }
    this.playerId = persistentId;

    this.playerName = 'Đại biểu Cách mạng';
    this.playerAvatar = '⭐';
    this.joinedAt = Date.now();
    this.players = []; // Danh sách tất cả người chơi trong phòng
    this.finishedPlayers = [];
    this.heartbeatTimer = null;
    this.reconnectTimer = null;
    this.qrInstance = null;
  }

  // Lấy bản ghi thông tin đại biểu của máy hiện tại
  getMyRecord() {
    return {
      id: this.playerId,
      name: this.playerName,
      avatar: this.playerAvatar,
      score: this.players.find(p => p.id === this.playerId)?.score || 0,
      isHost: this.isHost,
      joinedAt: this.joinedAt,
      lastSeen: Date.now()
    };
  }

  // Kết nối tới MQTT Broker qua WebSockets bảo mật (WSS)
  connect(onSuccessCallback) {
    if (this.isConnected && this.client) {
      this.ensureSubscription();
      if (onSuccessCallback) onSuccessCallback();
      return;
    }

    const brokerHost = 'broker.hivemq.com';
    const brokerPort = 8884; // SSL WebSocket Port
    const brokerPath = '/mqtt';
    const clientId = 'vnr202_' + this.playerId + '_' + Math.floor(Math.random() * 10000);

    try {
      if (typeof Paho === 'undefined' || !Paho.MQTT) {
        console.warn('Paho MQTT library chưa sẵn sàng, thử tải lại...');
        setTimeout(() => this.connect(onSuccessCallback), 1500);
        return;
      }

      this.client = new Paho.MQTT.Client(brokerHost, brokerPort, brokerPath, clientId);

      this.client.onConnectionLost = (responseObject) => {
        this.isConnected = false;
        console.warn('Mất kết nối MQTT:', responseObject.errorMessage);
        if (responseObject.errorCode !== 0) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = setTimeout(() => this.connect(), 2000);
        }
      };

      this.client.onMessageArrived = (message) => {
        this.handleIncomingMessage(message.destinationName, message.payloadString);
      };

      this.client.connect({
        useSSL: true,
        timeout: 6,
        keepAliveInterval: 30,
        cleanSession: true,
        onSuccess: () => {
          this.isConnected = true;
          console.log('✅ Kết nối MQTT Broker thành công:', clientId);

          // Luôn tự động đăng ký topic của phòng khi kết nối thành công
          this.ensureSubscription();

          // Phát thông báo tham gia & yêu cầu đồng bộ danh sách phòng
          this.sendJoinNotice();

          // Khởi động chu kỳ phát nhịp tim (Heartbeat) để giữ phòng luôn sống
          this.startHeartbeat();

          if (onSuccessCallback) onSuccessCallback();
        },
        onFailure: (err) => {
          this.isConnected = false;
          console.error('❌ Lỗi kết nối MQTT:', err.errorMessage);
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = setTimeout(() => this.connect(onSuccessCallback), 3000);
        }
      });
    } catch (e) {
      console.error('Khởi tạo MQTT Client thất bại:', e);
    }
  }

  // Đảm bảo client luôn subscribe đúng topic của phòng
  ensureSubscription() {
    if (!this.isConnected || !this.client) return;
    const topic = `vnr202_game/${this.roomId}/#`;
    try {
      this.client.subscribe(topic, { qos: 0 });
      console.log('Đã đăng ký lắng nghe topic phòng:', topic);
    } catch (e) {
      console.warn('Lỗi subscribe topic:', e);
    }
  }

  // 1. TẠO PHÒNG MỚI (Dành riêng cho Máy Chủ / Màn hình máy chiếu lớn)
  createRoom(customRoomId) {
    this.createdAsHost = true;
    this.isHost = true;
    this.roomId = (customRoomId || '1930-VN').trim().toUpperCase();
    this.playerName = 'Chủ Tọa (Máy Chiếu)';
    this.playerAvatar = '🏛️';
    this.joinedAt = Date.now();

    // Đưa ngay bản thân vào danh sách người chơi
    this.players = [this.getMyRecord()];

    // Cập nhật giao diện và render mã QR trên màn chiếu máy chủ
    this.updateLobbyUI();
    this.renderQRCode();

    this.connect(() => {
      this.broadcastRoster();
    });
  }

  // 2. THAM GIA PHÒNG (Dành riêng cho Điện thoại đại biểu - KHÔNG PHẢI MÁY CHIẾU)
  joinRoom(roomId, playerName, playerAvatar, onJoinedCallback) {
    this.createdAsHost = false;
    this.isHost = false;
    this.roomId = (roomId || '1930-VN').trim().toUpperCase();
    this.playerName = (playerName || 'Đại biểu').trim();
    this.playerAvatar = playerAvatar || '⭐';
    this.joinedAt = Date.now();

    // Đưa ngay bản thân vào danh sách đại biểu
    this.players = [this.getMyRecord()];
    this.evaluateHost();

    // Cập nhật giao diện phòng chờ của đại biểu (không render QR code)
    this.updateLobbyUI();
    this.updatePlayerWaitUI();

    this.connect(() => {
      if (onJoinedCallback) onJoinedCallback();
    });
  }

  // Gửi tín hiệu thông báo mình vừa bước vào phòng & yêu cầu lấy danh sách người chơi hiện có
  sendJoinNotice() {
    const myRec = this.getMyRecord();
    this.publishMessage(`vnr202_game/${this.roomId}/events`, {
      type: 'PLAYER_JOIN',
      player: myRec
    });
    this.publishMessage(`vnr202_game/${this.roomId}/events`, {
      type: 'ROSTER_REQUEST',
      fromId: this.playerId
    });
  }

  // Gửi sự hiện diện định kỳ (Heartbeat)
  sendMyPresence() {
    this.publishMessage(`vnr202_game/${this.roomId}/events`, {
      type: 'PEER_PRESENCE',
      player: this.getMyRecord()
    });
  }

  // Vòng lặp nhịp tim định kỳ 2.5s
  startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (!this.isConnected) return;
      this.sendMyPresence();

      // Dọn dẹp những người chơi không còn phản hồi trong hơn 10 giây (ngoại trừ chính mình)
      const now = Date.now();
      const beforeCount = this.players.length;
      this.players = this.players.filter(p => {
        if (p.id === this.playerId) return true;
        return (now - (p.lastSeen || now)) < 10000;
      });

      if (this.players.length !== beforeCount) {
        this.evaluateHost();
        this.updateLobbyUI();
      }
    }, 2500);
  }

  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // Cơ chế xác định Chủ tọa phòng (Chỉ máy chiếu tạo phòng mới có quyền Chủ tọa)
  evaluateHost() {
    if (!this.createdAsHost) {
      this.isHost = false;
      const myRec = this.players.find(p => p.id === this.playerId);
      if (myRec) myRec.isHost = false;
      return;
    }
    this.isHost = true;
    const myRec = this.players.find(p => p.id === this.playerId);
    if (myRec) myRec.isHost = true;
  }

  // Gửi thông điệp JSON lên topic
  publishMessage(topic, dataObj) {
    if (!this.isConnected || !this.client) return;
    try {
      const msgStr = JSON.stringify(dataObj);
      const message = new Paho.MQTT.Message(msgStr);
      message.destinationName = topic;
      message.qos = 0;
      this.client.send(message);
    } catch (e) {
      console.warn('Lỗi gửi message MQTT:', e);
    }
  }

  // Xử lý thông điệp nhận được từ các máy trong phòng
  handleIncomingMessage(topic, payloadStr) {
    try {
      const data = JSON.parse(payloadStr);

      switch (data.type) {
        // Khi có người chơi mới tham gia phòng
        case 'PLAYER_JOIN': {
          const incoming = data.player;
          if (!incoming || incoming.id === this.playerId) break;
          // Bỏ qua nếu là tài khoản Chủ Tọa / Máy Chủ khác
          if (incoming.isHost || (incoming.name && incoming.name.includes('Chủ Tọa'))) break;

          let existing = this.players.find(p => p.id === incoming.id);
          if (!existing) {
            this.players.push({
              ...incoming,
              lastSeen: Date.now()
            });
            soundEngine.playFanfare(); // Âm thanh ting chào mừng đại biểu mới
          } else {
            Object.assign(existing, incoming, { lastSeen: Date.now() });
          }

          // Lập tức gửi lại sự hiện diện của mình để đại biểu mới nhận diện ngay
          this.sendMyPresence();
          this.evaluateHost();
          this.updateLobbyUI();

          if (this.isHost) {
            this.broadcastRoster();
          }
          if (this.app && typeof this.app.addProjectorActivity === 'function') {
            this.app.addProjectorActivity(`👋 Đại biểu <b>${incoming.name}</b> đã vào phòng!`, 'join');
          }
          if (this.app && typeof this.app.updateProjectorLeaderboard === 'function') {
            this.app.updateProjectorLeaderboard();
          }
          break;
        }

        // Nhịp tim báo hiệu sự hiện diện của các máy trong phòng
        case 'PEER_PRESENCE': {
          const peer = data.player;
          if (!peer || peer.id === this.playerId) break;
          // Bỏ qua nhịp tim từ các máy Chủ Tọa / Máy Chiếu khác
          if (peer.isHost || (peer.name && peer.name.includes('Chủ Tọa'))) break;

          let existing = this.players.find(p => p.id === peer.id);
          if (!existing) {
            this.players.push({
              ...peer,
              lastSeen: Date.now()
            });
            soundEngine.playFanfare();
          } else {
            Object.assign(existing, peer, { lastSeen: Date.now() });
          }

          this.evaluateHost();
          this.updateLobbyUI();
          break;
        }

        // Yêu cầu đồng bộ danh sách phòng từ thành viên mới
        case 'ROSTER_REQUEST': {
          if (data.fromId !== this.playerId) {
            this.sendMyPresence();
            if (this.isHost) {
              this.broadcastRoster();
            }
          }
          break;
        }

        // Đồng bộ danh sách đại biểu cho tất cả người chơi
        case 'ROSTER_SYNC': {
          if (Array.isArray(data.players)) {
            data.players.forEach(p => {
              if (p.id === this.playerId) return;
              if (p.isHost || (p.name && p.name.includes('Chủ Tọa'))) return; // Không nạp host khác vào danh sách đại biểu
              let existing = this.players.find(ex => ex.id === p.id);
              if (!existing) {
                this.players.push({ ...p, lastSeen: Date.now() });
              } else {
                Object.assign(existing, p, { lastSeen: Date.now() });
              }
            });
            this.evaluateHost();
            this.updateLobbyUI();
          }

          // Xử lý các trường hợp vào sau ("vào sau phải chịu"):
          if (!this.isHost && data.isGameStarted) {
            this.isGameStarted = true;
            this.gameEndAt = data.gameEndAt || 0;
            this.gameDuration = data.gameDuration || 300;

            if (data.currentStage === 'cipher') {
              // Phòng thi đã sang Chặng 2 -> Cắt Chặng 1, đưa thẳng vào Chặng 2!
              if (this.app && this.app.currentScreen !== 'cipher-game-screen' && this.app.currentScreen !== 'summary-screen') {
                console.log('⚡ Phòng đã chuyển Chặng 2 -> Ép người vào sau vào thẳng Chặng 2');
                if (this.app.miniGame) {
                  this.app.miniGame.startCipherGame();
                }
              }
            } else if (data.currentStage === 'timeline') {
              // Phòng đang ở Chặng 1 -> Tự động đưa vào Chặng 1 thi đấu theo thời gian còn lại
              if (this.app && this.app.currentScreen === 'player-wait-screen') {
                if (this.app.miniGame) {
                  this.app.miniGame.startTimelineGame();
                }
              }
            }
          }
          break;
        }

        // Lệnh bắt đầu trò chơi từ Chủ tọa
        case 'START_GAME': {
          // Bỏ qua nếu là Chủ tọa (máy chiếu) hoặc chính máy mình vừa phát đi lệnh
          if (this.isHost || data.senderId === this.playerId) break;

          // Kiểm tra xác thực lệnh bắt đầu phải từ Chủ tọa
          const currentHost = this.players.find(p => p.isHost);
          if (currentHost && data.senderId && data.senderId !== currentHost.id) {
            console.warn('Từ chối lệnh START_GAME vì người phát không phải Chủ tọa hợp lệ');
            break;
          }

          console.log('✅ Nhận lệnh bắt đầu game từ Chủ tọa:', data.senderId);
          soundEngine.playFanfare();
          this.finishedPlayers = [];
          this.players.forEach(p => {
            p.isFinished = false;
            p.score = 0;
            p.timeSeconds = 0;
            p.formattedTime = null;
          });
          // Lưu thông tin đồng hồ và trạng thái game
          this.isGameStarted = true;
          this.currentStage = data.stage || 'timeline';
          this.gameDuration = data.durationSeconds || 300;
          this.gameEndAt = data.endAt || 0;
          if (this.app && this.app.miniGame) {
            this.app.miniGame.startTimelineGame();
          }
          // Nhắc nhở đồng hồ đếm ngược phía client
          if (this.app && typeof this.app.startClientCountdown === 'function') {
            this.app.startClientCountdown(data.endAt, data.durationSeconds);
          }
          break;
        }

        // Nhận lệnh chuyển chặng từ Chủ tọa (Chặng 1 -> Chặng 2)
        case 'SWITCH_STAGE': {
          // Chủ tọa (máy chiếu) KHÔNG ĐƯỢC CHƠI, luôn giữ nguyên màn chiếu Spectator
          if (this.isHost || data.senderId === this.playerId) break;

          console.log('⏩ Nhận lệnh SWITCH_STAGE từ Chủ tọa:', data);
          soundEngine.playFanfare();
          this.currentStage = data.targetStage || 'cipher';
          this.gameDuration = data.durationSeconds || 300;
          this.gameEndAt = data.endAt || (Date.now() + 300000);

          if (this.app && this.app.miniGame) {
            // Chuyển sang Chặng 2 ngay lập tức cho đại biểu
            this.app.miniGame.transitionToCipherStage();
          }
          break;
        }

        // Nhận lệnh kết thúc game từ chủ tọa
        case 'GAME_OVER': {
          // Chủ tọa (máy chiếu) KHÔNG xử lý ở đây vì đã hiển thị podium trên màn chiếu
          if (this.isHost || data.senderId === this.playerId) break;
          console.log('🏁 Nhận GAME_OVER từ chủ tọa');
          if (this.app && typeof this.app.onGameOverReceived === 'function') {
            this.app.onGameOverReceived(data.leaderboard || []);
          }
          break;
        }

        // Cập nhật điểm số trực tiếp (Live Score)
        case 'SCORE_UPDATE': {
          const target = this.players.find(p => p.id === data.playerId);
          if (target) {
            target.score = data.score;
            if (this.app && typeof this.app.updateProjectorLeaderboard === 'function') {
              this.app.updateProjectorLeaderboard();
            }
          }
          break;
        }

        // Khi một đại biểu hoàn thành toàn bộ nhiệm vụ
        case 'PLAYER_FINISHED': {
          const finPlayer = data.player;
          if (finPlayer) {
            const fIdx = this.finishedPlayers.findIndex(p => p.id === finPlayer.id);
            if (fIdx >= 0) {
              this.finishedPlayers[fIdx] = finPlayer;
            } else {
              this.finishedPlayers.push(finPlayer);
            }
            // Cập nhật trong danh sách người chơi phòng
            const pRoom = this.players.find(p => p.id === finPlayer.id);
            if (pRoom) {
              pRoom.score = finPlayer.score;
              pRoom.timeSeconds = finPlayer.timeSeconds;
              pRoom.formattedTime = finPlayer.formattedTime;
              pRoom.isFinished = true;
            }
            if (this.app && typeof this.app.updateProjectorLeaderboard === 'function') {
              this.app.updateProjectorLeaderboard();
            }
            if (this.app && typeof this.app.addProjectorActivity === 'function') {
              this.app.addProjectorActivity(`🎉 <b>${finPlayer.name}</b> đã hoàn thành xuất sắc! (${finPlayer.score.toLocaleString()}đ - ⏱️ ${finPlayer.formattedTime})`, 'finish');
            }
            if (this.app && typeof this.app.updateLiveLeaderboard === 'function') {
              this.app.updateLiveLeaderboard();
            }
          }
          break;
        }

        // Người chơi rời phòng
        case 'PLAYER_LEAVE': {
          this.players = this.players.filter(p => p.id !== data.playerId);
          this.finishedPlayers = this.finishedPlayers.filter(p => p.id !== data.playerId);
          this.evaluateHost();
          this.updateLobbyUI();
          if (this.isHost) this.broadcastRoster();
          break;
        }
      }
    } catch (err) {
      console.warn('Lỗi đọc message payload:', err);
    }
  }

  // Host phát sóng danh sách người chơi cho tất cả máy con
  broadcastRoster() {
    this.publishMessage(`vnr202_game/${this.roomId}/events`, {
      type: 'ROSTER_SYNC',
      players: this.players,
      isGameStarted: this.isGameStarted || false,
      currentStage: this.currentStage || 'timeline',
      gameDuration: this.gameDuration || 300,
      gameEndAt: this.gameEndAt || 0
    });
  }

  // Bắt đầu game cho tất cả các máy trong phòng (Chỉ Chủ tọa mới có quyền phát lệnh)
  broadcastStartGame(mode, durationSeconds) {
    if (!this.isHost) {
      console.warn('Từ chối phát lệnh vì chỉ có Chủ tọa mới có quyền bắt đầu trò chơi!');
      return;
    }
    this.finishedPlayers = [];
    this.players.forEach(p => {
      p.isFinished = false;
      p.score = 0;
      p.timeSeconds = 0;
      p.formattedTime = null;
    });
    const dur = (durationSeconds !== undefined ? durationSeconds : 300);
    const endAt = dur > 0 ? (Date.now() + dur * 1000) : 0;
    this.isGameStarted = true;
    this.currentStage = 'timeline';
    this.gameDuration = dur;
    this.gameEndAt = endAt;
    this.publishMessage(`vnr202_game/${this.roomId}/events`, {
      type: 'START_GAME',
      senderId: this.playerId,
      mode: mode || 'minigame',
      durationSeconds: dur,
      endAt: endAt,
      stage: 'timeline'
    });
  }

  // Phát lệnh chuyển sang Chặng 2 (Host only hoặc khi hết 5 phút Chặng 1)
  broadcastSwitchStage(targetStage = 'cipher') {
    if (!this.isHost) return;
    this.currentStage = targetStage;
    this.gameDuration = 300;
    this.gameEndAt = Date.now() + 300000;
    this.publishMessage(`vnr202_game/${this.roomId}/events`, {
      type: 'SWITCH_STAGE',
      senderId: this.playerId,
      targetStage: targetStage,
      durationSeconds: 300,
      endAt: this.gameEndAt
    });
    this.broadcastRoster();
  }

  // Phát lệnh kết thúc game sớm (Host only)
  broadcastGameOver() {
    if (!this.isHost) return;
    this.publishMessage(`vnr202_game/${this.roomId}/events`, {
      type: 'GAME_OVER',
      senderId: this.playerId,
      leaderboard: this.getRoomLeaderboard().slice(0, 5)
    });
  }

  // Gửi thông báo đại biểu hoàn thành tất cả nhiệm vụ
  sendPlayerFinished(finishData) {
    const myFinishEntry = {
      id: this.playerId,
      name: this.playerName,
      avatar: this.playerAvatar,
      score: finishData.score,
      timeSeconds: finishData.timeSeconds,
      formattedTime: finishData.formattedTime,
      finishedAt: Date.now()
    };

    const exIdx = this.finishedPlayers.findIndex(p => p.id === this.playerId);
    if (exIdx >= 0) this.finishedPlayers[exIdx] = myFinishEntry;
    else this.finishedPlayers.push(myFinishEntry);

    const me = this.players.find(p => p.id === this.playerId);
    if (me) {
      me.score = finishData.score;
      me.timeSeconds = finishData.timeSeconds;
      me.formattedTime = finishData.formattedTime;
      me.isFinished = true;
    }

    if (this.isConnected) {
      this.publishMessage(`vnr202_game/${this.roomId}/events`, {
        type: 'PLAYER_FINISHED',
        player: myFinishEntry
      });
    }
  }

  // Lọc chỉ lấy danh sách các đại biểu dự thi thực sự (loại trừ tài khoản Chủ Tọa / Máy Chiếu)
  getRealDelegates() {
    return this.players.filter(p => !p.isHost && (!p.name || !p.name.includes('Chủ Tọa')));
  }

  // Trả về danh sách xếp hạng của phòng hiện tại (chỉ lấy các đại biểu dự thi)
  getRoomLeaderboard() {
    const list = this.players
      .filter(p => !p.isHost && p.name !== 'Chủ Tọa (Máy Chiếu)')
      .map(p => {
        const fin = this.finishedPlayers.find(f => f.id === p.id);
        return {
          id: p.id,
          name: p.name,
          avatar: p.avatar,
          score: fin ? fin.score : (p.score || 0),
          timeSeconds: fin ? fin.timeSeconds : (p.timeSeconds || 9999),
          formattedTime: fin ? fin.formattedTime : (p.formattedTime || '--:--'),
          isFinished: !!fin || !!p.isFinished
        };
      });

    list.sort((a, b) => {
      if (a.isFinished && !b.isFinished) return -1;
      if (!a.isFinished && b.isFinished) return 1;
      if (b.score !== a.score) return b.score - a.score;
      return a.timeSeconds - b.timeSeconds;
    });

    return list;
  }

  // Gửi cập nhật điểm số của máy hiện tại
  sendScoreUpdate(newScore) {
    if (!this.isConnected) return;
    const me = this.players.find(p => p.id === this.playerId);
    if (me) me.score = newScore;

    this.publishMessage(`vnr202_game/${this.roomId}/events`, {
      type: 'SCORE_UPDATE',
      playerId: this.playerId,
      name: this.playerName,
      avatar: this.playerAvatar,
      score: newScore
    });
  }

  // Rời phòng
  leaveRoom() {
    this.stopHeartbeat();
    if (this.isConnected) {
      this.publishMessage(`vnr202_game/${this.roomId}/events`, {
        type: 'PLAYER_LEAVE',
        playerId: this.playerId
      });
      try {
        this.client.unsubscribe(`vnr202_game/${this.roomId}/#`);
      } catch (e) {}
    }
    this.createdAsHost = false;
    this.isHost = false;
    this.players = [];
  }

  // Cập nhật giao diện Sảnh Chờ Máy Chiếu
  updateLobbyUI() {
    const codeEl = document.getElementById('lobby-room-code-val');
    if (codeEl) codeEl.innerText = `#${this.roomId}`;

    // Lọc danh sách các đại biểu thực tế thi đấu (loại bỏ hoàn toàn tài khoản Chủ Tọa / Máy Chiếu)
    const delegates = this.getRealDelegates();

    const countEl = document.getElementById('lobby-ready-count');
    if (countEl) {
      countEl.innerText = `${delegates.length} đại biểu`;
    }

    // Render danh sách thẻ đại biểu trong sảnh máy chiếu
    const gridEl = document.getElementById('lobby-players-grid');
    if (gridEl) {
      gridEl.innerHTML = '';
      if (delegates.length === 0) {
        gridEl.innerHTML = `
          <div class="lobby-empty-placeholder">
            <span class="lobby-empty-icon">⏳</span>
            <div class="lobby-empty-title">ĐANG CHỜ ĐẠI BIỂU VÀO PHÒNG...</div>
            <div class="lobby-empty-hint">Dùng camera điện thoại quét mã QR bên phải để tham gia!</div>
          </div>
        `;
      } else {
        delegates.forEach((p) => {
          const item = document.createElement('div');
          item.className = 'player-card animate-appear';
          if (p.id === this.playerId) item.classList.add('is-me');

          item.innerHTML = `
            <div class="player-avatar">${p.avatar || '⭐'}</div>
            <div class="player-info">
              <div class="player-name">
                ${p.name} ${p.id === this.playerId ? '<span class="you-tag">(Bạn)</span>' : ''}
              </div>
              <div class="player-status">${p.score > 0 ? `${p.score}đ` : 'Sẵn sàng'}</div>
            </div>
          `;
          gridEl.appendChild(item);
        });
      }
    }

    // Khung nút phát lệnh bắt đầu: chỉ hiển thị cho máy chiếu chủ tọa
    const hostActions = document.getElementById('lobby-host-actions');
    if (hostActions) {
      hostActions.style.display = this.isHost ? 'flex' : 'none';
    }

    // Luôn đồng bộ giao diện phòng chờ trên điện thoại
    this.updatePlayerWaitUI();
  }

  // Cập nhật giao diện Màn hình Chờ trên điện thoại đại biểu
  updatePlayerWaitUI() {
    const waitRoomCode = document.getElementById('wait-room-code-display');
    if (waitRoomCode) waitRoomCode.innerText = `#${this.roomId}`;

    const myAvatarEl = document.getElementById('wait-my-avatar');
    const myNameEl = document.getElementById('wait-my-name');
    if (myAvatarEl) myAvatarEl.innerText = this.playerAvatar || '⭐';
    if (myNameEl) myNameEl.innerText = `Đại biểu ${this.playerName || 'Khách'}`;

    const delegates = this.getRealDelegates();

    const rosterCountEl = document.getElementById('wait-roster-count');
    if (rosterCountEl) {
      rosterCountEl.innerText = `${delegates.length} đại biểu`;
    }

    const rosterChipsEl = document.getElementById('wait-roster-chips');
    if (rosterChipsEl) {
      rosterChipsEl.innerHTML = '';
      if (delegates.length === 0) {
        rosterChipsEl.innerHTML = `<span style="font-size:0.82rem;color:var(--parchment-dim);font-style:italic;padding:8px 12px;">Đang chờ các đại biểu khác vào phòng...</span>`;
      } else {
        delegates.forEach((p) => {
          const chip = document.createElement('div');
          chip.className = 'wait-chip-item animate-appear';
          if (p.id === this.playerId) chip.classList.add('is-me');

          chip.innerHTML = `
            <span class="chip-avatar">${p.avatar || '⭐'}</span>
            <span class="chip-name">${p.name} ${p.id === this.playerId ? '(Bạn)' : ''}</span>
          `;
          rosterChipsEl.appendChild(chip);
        });
      }
    }
  }

  // Cập nhật điểm trực tiếp trong màn hình thi đấu
  updateLiveRosterScores() {
    this.updateLobbyUI();
  }

  // Sinh mã QR động chuẩn xác trỏ thẳng tới link tham gia phòng
  renderQRCode() {
    const qrContainer = document.getElementById('dynamic-qr-box');
    const urlDisplay = document.getElementById('qr-join-url-text');
    if (!qrContainer) return;

    // Đường dẫn tham gia trực tiếp
    const baseUrl = window.location.origin + window.location.pathname;
    const joinUrl = `${baseUrl}?join=${encodeURIComponent(this.roomId)}`;

    if (urlDisplay) urlDisplay.innerText = joinUrl;

    qrContainer.innerHTML = '';

    // Thử vẽ QR Code bằng thư viện QRCodeJS cục bộ trước (tức thì 0ms, không phụ thuộc mạng)
    let localRenderSuccess = false;
    if (typeof QRCode !== 'undefined') {
      try {
        new QRCode(qrContainer, {
          text: joinUrl,
          width: 154,
          height: 154,
          colorDark: '#0a0504',
          colorLight: '#f6c85f',
          correctLevel: QRCode.CorrectLevel.L
        });
        localRenderSuccess = true;
      } catch (err) {
        console.warn('QRCodeJS local error, using API fallback:', err);
      }
    }

    // Nếu chưa có canvas/img cục bộ -> tạo ảnh QR API sắc nét
    if (!localRenderSuccess || !qrContainer.querySelector('canvas, img')) {
      qrContainer.innerHTML = '';
      const qrImg = document.createElement('img');
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(joinUrl)}&bgcolor=f6c85f&color=0a0504&margin=2`;
      qrImg.alt = "Mã QR Tham Gia Hội Nghị";
      qrImg.style.width = "100%";
      qrImg.style.height = "100%";
      qrImg.style.objectFit = "contain";
      qrImg.style.borderRadius = "8px";
      qrImg.style.display = "block";
      qrContainer.appendChild(qrImg);
    }

    // Nhấp vào mã QR hoặc liên kết để sao chép link tham gia nhanh chóng
    qrContainer.onclick = () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(joinUrl).then(() => {
          alert('✅ Đã sao chép liên kết vào phòng:\n' + joinUrl);
        }).catch(() => {});
      }
    };
  }
}
