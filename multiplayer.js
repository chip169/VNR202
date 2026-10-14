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

    this.connect(() => {
      // Đăng ký nhận tin nhắn của phòng
      const topic = `vnr202_game/${this.roomId}/#`;
      this.client.subscribe(topic, { qos: 1 });
      console.log('Đã đăng ký topic Host:', topic);

      // Cập nhật giao diện Sảnh Chờ
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
          console.log('Nhận lệnh bắt đầu game:', data.mode);
          soundEngine.playFanfare();
          if (this.app) {
            if (data.mode === 'minigame') {
              this.app.miniGame.startTimelineGame();
            } else if (data.mode === 'quiz') {
              this.app.startQuizBattle();
            }
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

        // Người chơi rời phòng
        case 'PLAYER_LEAVE':
          this.players = this.players.filter(p => p.id !== data.playerId);
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
    this.publishMessage(`vnr202_game/${this.roomId}/events`, {
      type: 'START_GAME',
      mode: mode // 'minigame' hoặc 'quiz'
    });
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

    // Nếu là Host: Hiện khung mã QR, hiện các nút bắt đầu
    // Nếu là Client: Ẩn khung mã QR, hiện thông báo chờ chủ tọa, ẩn các nút bắt đầu
    const hostQrBox = document.getElementById('lobby-host-qr-box');
    const clientWaitBox = document.getElementById('lobby-client-wait-box');
    const hostActions = document.getElementById('lobby-host-actions');

    if (this.isHost) {
      if (hostQrBox) hostQrBox.style.display = 'flex';
      if (clientWaitBox) clientWaitBox.style.display = 'none';
      if (hostActions) hostActions.style.display = 'flex';
    } else {
      if (hostQrBox) hostQrBox.style.display = 'none';
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

    if (typeof QRCode !== 'undefined') {
      try {
        this.qrInstance = new QRCode(qrContainer, {
          text: joinUrl,
          width: 170,
          height: 170,
          colorDark: '#0a0504',
          colorLight: '#f6c85f', // Nền vàng kim ánh sáng Cửu Long
          correctLevel: QRCode.CorrectLevel.M
        });
      } catch (e) {
        this.fallbackQRImage(qrContainer, joinUrl);
      }
    } else {
      this.fallbackQRImage(qrContainer, joinUrl);
    }
  }

  fallbackQRImage(container, url) {
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${encodeURIComponent(url)}&bgcolor=f6c85f&color=0a0504`;
    container.innerHTML = `<img src="${qrApiUrl}" alt="Mã QR Tham Gia" style="width: 170px; height: 170px; border-radius: 8px;">`;
  }
}
