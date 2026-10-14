// Game Logic, State Management & Multiplayer Engine
class HistoricalQuizApp {
  constructor() {
    this.currentScreen = 'start-screen';
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.currentQuestionIdx = 0;
    this.timer = 15;
    this.timerInterval = null;
    this.isAnswerLocked = false;
    this.playerList = [];
    this.mode = 'multiplayer'; // 'multiplayer' | 'campaign'
    
    // Intro Sequence State
    this.introStep = 0;
    this.introTimeout = null;
    this.introTypeInterval = null;
    this.introScenes = [
      {
        year: 'step-1911',
        badge: 'BẾN CẢNG NHÀ RỒNG - NĂM 1911',
        image: 'assets/intro_1911.jpg',
        text: 'Ngày 5 tháng 6 năm 1911... Người thanh niên yêu nước Nguyễn Tất Thành bước lên con tàu Đô đốc Latouche-Tréville, bắt đầu hành trình bôn ba ba đại dương tìm đường cứu nước.',
        duration: 7500
      },
      {
        year: 'step-1920',
        badge: 'PARIS (PHÁP) - MÙA HÈ NĂM 1920',
        image: 'assets/intro_1920.jpg',
        text: 'Tháng 7 năm 1920... Đọc Sơ thảo Luận cương của Lênin, Nguyễn Ái Quốc xúc động nghẹn ngào: "Hỡi đồng bào bị đọa đày! Đây là cái cần thiết cho chúng ta, đây là con đường giải phóng chúng ta!"',
        duration: 7500
      },
      {
        year: 'step-1928',
        badge: 'PHONG TRÀO VÔ SẢN HÓA - 1928 - 1929',
        image: 'assets/concept_art_main.jpg',
        text: 'Đưa cán bộ cách mạng thâm nhập các hầm mỏ, đồn điền, bến cảng Hải Phòng, Sài Gòn... giác ngộ công nông, tạo tiền đề chín muồi cho sự ra đời của chính đảng cách mạng.',
        duration: 7000
      },
      {
        year: 'step-1930',
        badge: 'CỬU LONG (HƯƠNG CẢNG) - MÙA XUÂN 1930',
        image: 'assets/concept_art_main.jpg',
        text: 'Dưới sự chủ trì của đồng chí Nguyễn Ái Quốc, Hội nghị hợp nhất đã thống nhất các tổ chức cộng sản, khai sinh ĐẢNG CỘNG SẢN VIỆT NAM — mở ra kỷ nguyên vẻ vang của dân tộc!',
        duration: 8000
      }
    ];

    // Elements
    this.bgLayer = document.querySelector('.scene-layer-bg');
    this.timerText = document.getElementById('timer-val');
    this.timerRing = document.getElementById('timer-ring');
    this.scoreDisplay = document.getElementById('player-score');
    this.comboBadge = document.getElementById('combo-badge');
    
    this.miniGame = new MiniGameEngine(this);
    this.multiplayer = new MultiplayerManager(this);
    this.selectedAvatar = '⭐';
    this.selectedRoomCode = '';

    this.initParallax();
    this.initLobbySimulation();
    this.bindEvents();

    // Hỗ trợ kiểm thử trực tiếp & Quét mã QR tham gia phòng
    const urlParams = new URLSearchParams(window.location.search);
    const joinCode = urlParams.get('join') || urlParams.get('room');
    if (joinCode) {
      // Khi quét mã QR hoặc mở link có ?join=... -> Vào THẲNG màn hình nhập tên đại biểu!
      this.openJoinScreen(joinCode);
    } else if (urlParams.get('screen') === 'timeline') {
      this.miniGame.startTimelineGame();
    } else if (urlParams.get('screen') === 'cipher') {
      this.miniGame.startCipherGame();
    }
  }

  // Khởi động chuỗi Video Intro Điện Ảnh
  playCinematicIntro() {
    this.switchScreen('intro-screen');
    soundEngine.init();
    soundEngine.startAmbient();
    this.introStep = 0;
    this.renderIntroScene(0);
  }

  renderIntroScene(stepIdx) {
    clearTimeout(this.introTimeout);
    clearInterval(this.introTypeInterval);

    if (stepIdx >= this.introScenes.length) {
      this.endCinematicIntro();
      return;
    }

    const scene = this.introScenes[stepIdx];
    this.introStep = stepIdx;
    soundEngine.playIntroStinger(stepIdx + 1);

    // Cập nhật mốc thời gian
    document.querySelectorAll('.timeline-step').forEach(s => s.classList.remove('active'));
    const currentStepEl = document.getElementById(scene.year);
    if (currentStepEl) currentStepEl.classList.add('active');

    // Chuyển hình ảnh với hiệu ứng máy quay phim Ken Burns
    const visual = document.getElementById('cinema-visual');
    if (visual) {
      visual.style.opacity = '0';
      visual.classList.remove('animate-ken-burns');
      setTimeout(() => {
        visual.style.backgroundImage = `url('${scene.image}')`;
        visual.style.opacity = '1';
        visual.classList.add('animate-ken-burns');
      }, 150);
    }

    // Hiển thị huy hiệu thời kỳ
    const badgeEl = document.getElementById('narrator-era');
    if (badgeEl) badgeEl.innerText = scene.badge;

    // Hiệu ứng chữ gõ máy typewriter thuyết minh chính xác tiếng Việt
    const textEl = document.getElementById('narrator-text');
    if (textEl) {
      textEl.textContent = '';
      let charIdx = 0;
      this.introTypeInterval = setInterval(() => {
        if (charIdx <= scene.text.length) {
          textEl.textContent = scene.text.substring(0, charIdx);
          charIdx++;
        } else {
          clearInterval(this.introTypeInterval);
        }
      }, 30);
    }

    // Hẹn giờ chuyển màn tiếp theo
    this.introTimeout = setTimeout(() => {
      this.renderIntroScene(stepIdx + 1);
    }, scene.duration);
  }

  endCinematicIntro() {
    clearTimeout(this.introTimeout);
    clearInterval(this.introTypeInterval);
    soundEngine.playFanfare();
    this.switchScreen('start-screen');
  }

  // Hiệu ứng nghiêng 2.5D Parallax theo vị trí con trỏ chuột
  initParallax() {
    const handleMove = (clientX, clientY) => {
      const xPercent = (clientX / window.innerWidth - 0.5) * 2;
      const yPercent = (clientY / window.innerHeight - 0.5) * 2;

      // Di chuyển phông nền ngược chiều để tạo chiều sâu
      if (this.bgLayer) {
        this.bgLayer.style.transform = `scale(1.06) translate(${xPercent * -18}px, ${yPercent * -14}px)`;
      }
    };

    window.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
  }

  initLobbySimulation() {
    // Không còn cần thiết sau khi gỡ bỏ thẻ đếm
  }

  switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
      this.currentScreen = screenId;
    }

    // Nút Xem Intro chỉ hiển thị khi ở Start Screen
    const playIntroBtn = document.getElementById('btn-play-intro');
    if (playIntroBtn) {
      playIntroBtn.style.display = (screenId === 'start-screen') ? 'flex' : 'none';
    }

    // Ẩn thanh HUD góc trên khi chơi mini-game hoặc ở màn đăng ký đại biểu / sảnh chờ
    const topHud = document.querySelector('.top-hud-bar');
    if (topHud) {
      if (screenId === 'timeline-game-screen' || screenId === 'cipher-game-screen' || screenId === 'join-screen' || screenId === 'lobby-screen') {
        topHud.style.display = 'none';
      } else {
        topHud.style.display = 'flex';
      }
    }
  }

  bindEvents() {
    // Nút Bật Video Intro Điện Ảnh
    const playIntroBtn = document.getElementById('btn-play-intro');
    if (playIntroBtn) {
      playIntroBtn.addEventListener('click', () => {
        soundEngine.playClick();
        this.playCinematicIntro();
      });
    }

    // Nút Bỏ qua Intro
    const skipIntroBtn = document.getElementById('btn-skip-intro');
    if (skipIntroBtn) {
      skipIntroBtn.addEventListener('click', () => {
        soundEngine.playClick();
        this.endCinematicIntro();
      });
    }

    // Nút Bật/Tắt Âm thanh
    const soundBtn = document.getElementById('btn-toggle-sound');
    soundBtn.addEventListener('click', () => {
      const active = soundEngine.toggleSound();
      soundBtn.innerHTML = active ? '🔔' : '🔕';
      if (active) soundEngine.startAmbient();
    });

    // Nút Toàn màn hình
    const fullBtn = document.getElementById('btn-fullscreen');
    fullBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    // 1. Nút "TẠO PHÒNG ĐỐI KHÁNG TRỰC TUYẾN" (Dành cho máy chủ / màn hình chính)
    const playBtn = document.getElementById('btn-main-play');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        soundEngine.playClick();
        soundEngine.startAmbient();
        this.mode = 'multiplayer';
        this.switchScreen('lobby-screen');
        this.multiplayer.createRoom('1930-VN');
      });
    }

    // 2. Chọn Avatar Đại Biểu
    const avatarOpts = document.querySelectorAll('.avatar-opt');
    avatarOpts.forEach(btn => {
      btn.addEventListener('click', () => {
        soundEngine.playClick();
        avatarOpts.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.selectedAvatar = btn.dataset.avatar || '⭐';
      });
    });

    // 3. Nút Hủy / Quay lại từ màn hình Đăng Ký Đại Biểu
    const cancelJoinBtn = document.getElementById('btn-cancel-join');
    if (cancelJoinBtn) {
      cancelJoinBtn.addEventListener('click', () => {
        soundEngine.playClick();
        this.switchScreen('start-screen');
      });
    }

    // 4. Submit Form Đăng Ký Đại Biểu (Tham gia phòng)
    const joinForm = document.getElementById('join-room-form');
    if (joinForm) {
      joinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('input-player-name');
        const pinInput = document.getElementById('input-room-pin');
        const playerName = (nameInput ? nameInput.value : '').trim();
        if (!playerName) {
          alert('Vui lòng nhập Họ Tên hoặc Biệt danh đại biểu của bạn!');
          if (nameInput) nameInput.focus();
          return;
        }

        let roomCode = this.selectedRoomCode;
        if (!roomCode && pinInput) {
          roomCode = (pinInput.value || '').trim().toUpperCase();
        }
        if (!roomCode) {
          alert('Vui lòng nhập Mã phòng!');
          if (pinInput) pinInput.focus();
          return;
        }

        soundEngine.playFanfare();
        this.mode = 'multiplayer';
        this.multiplayer.joinRoom(roomCode, playerName, this.selectedAvatar, () => {
          this.switchScreen('lobby-screen');
        });
      });
    }

    // 5. Nút Bắt đầu Mini-Game từ Sảnh Chờ (Chủ tọa phát lệnh)
    const startBattleBtn = document.getElementById('btn-start-lobby-game');
    if (startBattleBtn) {
      startBattleBtn.addEventListener('click', () => {
        soundEngine.playClick();
        if (this.multiplayer.isHost) {
          this.multiplayer.broadcastStartGame('minigame');
        }
        this.miniGame.startTimelineGame();
      });
    }

    // 6. Nút Thoát Mini-Game quay về Màn hình chính
    const tlBack = document.getElementById('btn-timeline-back');
    if (tlBack) {
      tlBack.addEventListener('click', () => {
        soundEngine.playClick();
        this.switchScreen('start-screen');
      });
    }
    const cpBack = document.getElementById('btn-cipher-back');
    if (cpBack) {
      cpBack.addEventListener('click', () => {
        soundEngine.playClick();
        this.switchScreen('start-screen');
      });
    }

    // 7. Nút Rời phòng từ Sảnh chờ
    const backBtn = document.getElementById('btn-lobby-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        soundEngine.playClick();
        this.multiplayer.leaveRoom();
        this.switchScreen('start-screen');
      });
    }

    // 8. Nút Chơi lại từ Màn hình Vinh danh
    const replayBtn = document.getElementById('btn-replay-game');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        soundEngine.playClick();
        this.switchScreen('start-screen');
      });
    }
  }

  // Mở màn hình Đăng Ký Đại Biểu (khi quét mã QR hoặc mở link tham gia)
  openJoinScreen(prefillCode) {
    this.switchScreen('join-screen');
    const pinGroup = document.getElementById('group-room-pin');
    const pinDisplay = document.getElementById('join-room-code-display');
    const pinInput = document.getElementById('input-room-pin');
    const nameInput = document.getElementById('input-player-name');

    if (prefillCode) {
      this.selectedRoomCode = prefillCode.trim().toUpperCase();
      if (pinGroup) pinGroup.style.display = 'none';
      if (pinDisplay) pinDisplay.innerText = `#${this.selectedRoomCode}`;
    } else {
      this.selectedRoomCode = '1930-VN';
      if (pinGroup) pinGroup.style.display = 'none';
      if (pinDisplay) pinDisplay.innerText = `#${this.selectedRoomCode}`;
    }

    if (nameInput) {
      nameInput.value = '';
      setTimeout(() => nameInput.focus(), 300);
    }
  }

  // Màn hình tổng kết và vinh danh
  showSummary() {
    clearInterval(this.timerInterval);
    soundEngine.playFanfare();
    this.switchScreen('summary-screen');

    document.getElementById('final-score-val').innerText = `${this.score}đ`;
    document.getElementById('final-combo-val').innerText = `x${this.maxCombo}`;
    document.getElementById('final-rank-val').innerText = `Hoàn thành 2 Màn Chơi!`;

    // Danh hiệu lịch sử
    let rankTitle = "Chiến Sĩ Tiên Phong Cách Mạng (1930)";
    if (this.score >= 1400) {
      rankTitle = "Đại Biểu Xuất Sắc Cửu Long (1930) 🌟";
    } else if (this.score >= 900) {
      rankTitle = "Đại Biểu Kiên Trung Cách Mạng (1930) ⭐";
    } else {
      rankTitle = "Hội Viên Thanh Niên Cách Mạng (1925)";
    }
    document.getElementById('summary-rank-badge').innerText = rankTitle;

    // Render bảng tổng kết vinh danh
    const podiumEl = document.getElementById('final-podium-list');
    podiumEl.innerHTML = `
      <div class="podium-item highlight">
        <span>🏆 ⭐ Bạn (Đại Biểu 1930)</span>
        <strong>${this.score} điểm</strong>
      </div>
    `;
  }
}

// Khởi chạy khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
  window.quizApp = new HistoricalQuizApp();
  new ParticleAtmosphere('fx-canvas');
});
