// Module Đồng Bộ Nhiều Người Chơi Trực Tuyến Thời Gian Thực (Multiplayer Real-time via MQTT)
// Sử dụng HiveMQ Public WebSocket Broker (Hoàn toàn miễn phí, không cần tài khoản hay backend)

class MultiplayerManager {
  constructor(appRef) {
    this.app = appRef;
    this.client = null;
    this.isConnected = false;
    this.isHost = false;
    this.roomId = '1930-VN';
    this.playerId = 'p_' + Math.random().toString(36).substring(2, 9);
    this.playerName = 'Đại biểu Cách mạng';
    this.playerAvatar = '⭐';
    this.players = []; // Danh sách người chơi trong phòng
    this.qrInstance = null;
  }

  // Kết nối tới MQTT Broker qua WebSockets bảo mật (WSS)
  connect(onSuccessCallback) {
    if (this.isConnected && this.client) {
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
        return;
      }

      this.client = new Paho.MQTT.Client(brokerHost, brokerPort, brokerPath, clientId);

      this.client.onConnectionLost = (responseObject) => {
        this.isConnected = false;
        console.warn('Mất kết nối MQTT:', responseObject.errorMessage);
        if (responseObject.errorCode !== 0) {
          // Tự động kết nối lại sau 2 giây
          setTimeout(() => this.connect(), 2000);
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
          if (onSuccessCallback) onSuccessCallback();
        },
        onFailure: (err) => {
          this.isConnected = false;
          console.error('❌ Lỗi kết nối MQTT:', err.errorMessage);
          // Thử kết nối lại
          setTimeout(() => this.connect(onSuccessCallback), 3000);
        }
      });
    } catch (e) {
      console.error('Khởi tạo MQTT Client thất bại:', e);
    }
  }

  // 1. TẠO PHÒNG MỚI (Dành cho Máy Chủ / Màn hình trình chiếu)
  createRoom(customRoomId) {
    this.isHost = true;
    this.roomId = customRoomId || '1930-VN';
    this.playerName = 'Chủ Tọa (Máy Chủ)';
    this.playerAvatar = '🏛️';
    this.players = [
      { id: this.playerId, name: this.playerName, avatar: this.playerAvatar, score: 0, isHost: true }
    ];

    // Cập nhật giao diện và render mã QR ngay tức thì (không đợi kết nối MQTT)
    this.updateLobbyUI();
    this.renderQRCode();

    this.connect(() => {
      // Đăng ký nhận tin nhắn của phòng
      const topic = `vnr202_game/${this.roomId}/#`;
      this.client.subscribe(topic, { qos: 1 });
      console.log('Đã đăng ký topic Host:', topic);

      // Cập nhật lại giao diện và đồng bộ danh sách
      this.updateLobbyUI();
      this.renderQRCode();
      this.broadcastRoster();
    });
  }

  // 2. THAM GIA PHÒNG (Dành cho Điện thoại quét mã QR hoặc nhập mã)
  joinRoom(roomId, playerName, playerAvatar, onJoinedCallback) {
    this.isHost = false;
    this.roomId = (roomId || '1930-VN').trim().toUpperCase();
    this.playerName = (playerName || 'Đại biểu Khách').trim();
    this.playerAvatar = playerAvatar || '⭐';

    // Cập nhật giao diện và mã QR ngay tức thì
    this.updateLobbyUI();
    this.renderQRCode();

    this.connect(() => {
      const topic = `vnr202_game/${this.roomId}/#`;
      this.client.subscribe(topic, { qos: 1 });
      console.log('Đã đăng ký topic Client:', topic);

      // Gửi tín hiệu tham gia phòng
      const joinPayload = {
        type: 'PLAYER_JOIN',
        player: {
          id: this.playerId,
          name: this.playerName,
          avatar: this.playerAvatar,
          score: 0,
          isHost: false
        }
      };
      this.publishMessage(`vnr202_game/${this.roomId}/events`, joinPayload);

      if (onJoinedCallback) onJoinedCallback();
    });
  }

  // Gửi thông điệp JSON lên topic
  publishMessage(topic, dataObj) {
    if (!this.isConnected || !this.client) return;
    try {
      const msgStr = JSON.stringify(dataObj);
      const message = new Paho.MQTT.Message(msgStr);
      message.destinationName = topic;
      message.qos = 1;
      this.client.send(message);
    } catch (e) {
      console.error('Lỗi gửi message MQTT:', e);
    }
  }

  // Xử lý thông điệp nhận được từ các máy trong phòng
  handleIncomingMessage(topic, payloadStr) {
    try {
      const data = JSON.parse(payloadStr);

      switch (data.type) {
        // Khi có người chơi mới tham gia
        case 'PLAYER_JOIN':
          if (this.isHost) {
            const incomingPlayer = data.player;
            // Kiểm tra tránh trùng lặp
            const exists = this.players.some(p => p.id === incomingPlayer.id);
            if (!exists) {
              this.players.push(incomingPlayer);
              soundEngine.playFanfare(); // Âm thanh ting chào mừng
              this.updateLobbyUI();
              this.broadcastRoster();
            }
          }
          break;

        // Đồng bộ danh sách đại biểu cho tất cả người chơi
        case 'ROSTER_SYNC':
          if (!this.isHost) {
            this.players = data.players || [];
            this.updateLobbyUI();
          }
          break;

        // Lệnh bắt đầu trò chơi từ Máy Chủ
        case 'START_GAME':
          console.log('Nhận lệnh bắt đầu game');
          soundEngine.playFanfare();
          this.finishedPlayers = [];
          this.players.forEach(p => {
            p.isFinished = false;
            p.score = 0;
            p.timeSeconds = 0;
            p.formattedTime = null;
          });
          if (this.app && this.app.miniGame) {
            this.app.miniGame.startTimelineGame();
          }
          break;

        // Cập nhật điểm số trực tiếp (Live Score)
        case 'SCORE_UPDATE':
          const target = this.players.find(p => p.id === data.playerId);
          if (target) {
            target.score = data.score;
            if (this.isHost) {
              this.updateLiveRosterScores();
            }
          }
          break;

        // Khi một đại biểu hoàn thành toàn bộ nhiệm vụ
        case 'PLAYER_FINISHED':
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
            if (this.app && typeof this.app.updateLiveLeaderboard === 'function') {
              this.app.updateLiveLeaderboard();
            }
          }
          break;

        // Người chơi rời phòng
        case 'PLAYER_LEAVE':
          this.players = this.players.filter(p => p.id !== data.playerId);
          this.finishedPlayers = this.finishedPlayers.filter(p => p.id !== data.playerId);
          this.updateLobbyUI();
          if (this.isHost) this.broadcastRoster();
          break;
      }
    } catch (err) {
      console.warn('Lỗi đọc message payload:', err);
    }
  }

  // Host phát sóng danh sách người chơi cho tất cả máy con
  broadcastRoster() {
    if (!this.isHost) return;
    this.publishMessage(`vnr202_game/${this.roomId}/events`, {
      type: 'ROSTER_SYNC',
      players: this.players
    });
  }

  // Bắt đầu game cho tất cả các máy trong phòng
  broadcastStartGame(mode) {
    if (!this.isHost) return;
    this.finishedPlayers = [];
    this.players.forEach(p => {
      p.isFinished = false;
      p.score = 0;
      p.timeSeconds = 0;
      p.formattedTime = null;
    });
    this.publishMessage(`vnr202_game/${this.roomId}/events`, {
      type: 'START_GAME',
      mode: mode // 'minigame' hoặc 'quiz'
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

  // Trả về danh sách xếp hạng của phòng hiện tại
  getRoomLeaderboard() {
    // Kết hợp tất cả người chơi trong phòng
    const list = this.players.map(p => {
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

    // Sắp xếp: Ai đã hoàn thành xếp trước (theo điểm DESC, thời gian ASC), sau đó là người chưa hoàn thành (theo điểm DESC)
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
    if (this.isConnected) {
      this.publishMessage(`vnr202_game/${this.roomId}/events`, {
        type: 'PLAYER_LEAVE',
        playerId: this.playerId
      });
      try {
        this.client.unsubscribe(`vnr202_game/${this.roomId}/#`);
      } catch (e) {}
    }
    this.isHost = false;
    this.players = [];
  }

  // Cập nhật giao diện Sảnh Chờ
  updateLobbyUI() {
    const codeEl = document.getElementById('lobby-room-code-val');
    if (codeEl) codeEl.innerText = `#${this.roomId}`;

    const countEl = document.getElementById('lobby-ready-count');
    if (countEl) {
      countEl.innerText = `${this.players.length} đại biểu`;
    }

    // Render danh sách thẻ đại biểu trong sảnh
    const gridEl = document.getElementById('lobby-players-grid');
    if (gridEl) {
      gridEl.innerHTML = '';
      this.players.forEach((p, idx) => {
        const item = document.createElement('div');
        item.className = 'player-card animate-appear';
        if (p.id === this.playerId) item.classList.add('is-me');
        if (p.isHost) item.classList.add('is-host');

        item.innerHTML = `
          <div class="player-avatar">${p.avatar || '⭐'}</div>
          <div class="player-info">
            <div class="player-name">
              ${p.name} ${p.id === this.playerId ? '<span class="you-tag">(Bạn)</span>' : ''}
              ${p.isHost ? '<span class="host-tag">Chủ Tọa</span>' : ''}
            </div>
            <div class="player-status">${p.score > 0 ? `${p.score}đ` : 'Sẵn sàng'}</div>
          </div>
        `;
        gridEl.appendChild(item);
      });
    }

    // Khung mã QR: Luôn hiển thị ở sảnh chờ cho cả Chủ tọa và Đại biểu để mọi người có thể quét tham gia
    const hostQrBox = document.getElementById('lobby-host-qr-box');
    const clientWaitBox = document.getElementById('lobby-client-wait-box');
    const hostActions = document.getElementById('lobby-host-actions');

    if (hostQrBox) hostQrBox.style.display = 'flex';

    if (this.isHost) {
      if (clientWaitBox) clientWaitBox.style.display = 'none';
      if (hostActions) hostActions.style.display = 'flex';
    } else {
      if (clientWaitBox) clientWaitBox.style.display = 'flex';
      if (hostActions) hostActions.style.display = 'none';

      // Cập nhật tên của mình trên thẻ chờ của Client
      const myAvatarEl = document.getElementById('client-my-avatar');
      const myNameEl = document.getElementById('client-my-name');
      if (myAvatarEl) myAvatarEl.innerText = this.playerAvatar;
      if (myNameEl) myNameEl.innerText = `Đại biểu ${this.playerName}`;
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
