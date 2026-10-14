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
    } else {
      // Tự động khôi phục phiên khi người chơi hoặc Host bấm F5 / Refresh trang!
      this.restoreSession();
    }
  }

  // Lưu trữ phiên hoạt động vào sessionStorage để khi F5/Refresh không bị văng về trang chủ
  saveSession(extra = {}) {
    try {
      const isHost = this.multiplayer && this.multiplayer.isHost;
      const session = {
        screen: this.currentScreen,
        mode: this.mode,
        role: isHost ? 'host' : 'player',
        roomId: this.multiplayer ? this.multiplayer.roomId : (this.selectedRoomCode || '1930-VN'),
        playerName: this.multiplayer ? this.multiplayer.playerName : '',
        playerAvatar: this.multiplayer ? this.multiplayer.playerAvatar : (this.selectedAvatar || '⭐'),
        gameEndAt: (this.multiplayer && this.multiplayer.gameEndAt) || this.projectorEndAt || (this.miniGame && this.miniGame.gameEndTime) || 0,
        gameDuration: (this.multiplayer && this.multiplayer.gameDuration) || this.projectorDuration || 300,
        score: (this.miniGame && this.miniGame.timelineScore) || this.score || 0,
        streakCount: (this.miniGame && this.miniGame.streakCount) || 0,
        timestamp: Date.now(),
        ...extra
      };
      sessionStorage.setItem('vnr202_active_session', JSON.stringify(session));
    } catch (e) {
      console.warn('Lỗi lưu session:', e);
    }
  }

  // Xóa phiên khi chủ động bấm nút rời phòng / về trang chủ
  clearSession() {
    try {
      sessionStorage.removeItem('vnr202_active_session');
    } catch (e) {}
  }

  // Khôi phục phiên làm việc sau khi F5 / Refresh trang
  restoreSession() {
    try {
      const raw = sessionStorage.getItem('vnr202_active_session');
      if (!raw) return false;
      const s = JSON.parse(raw);
      if (!s || !s.screen || s.screen === 'start-screen' || s.screen === 'intro-screen') return false;

      // Hết hạn sau 3 tiếng
      if (s.timestamp && (Date.now() - s.timestamp) > 10800000) {
        this.clearSession();
        return false;
      }

      console.log('🔄 Đang khôi phục phiên làm việc từ refresh:', s.screen, s.role);
      this.mode = s.mode || 'multiplayer';

      if (s.role === 'host') {
        // Phục hồi phiên Chủ Tọa / Màn Chiếu
        this.multiplayer.createRoom(s.roomId || '1930-VN');
        if (s.screen === 'projector-screen') {
          this.switchScreen('projector-screen');
          this.startProjectorMode(s.gameDuration || 300, s.gameEndAt || 0);
          return true;
        } else if (s.screen === 'lobby-screen') {
          this.switchScreen('lobby-screen');
          return true;
        }
      } else {
        // Phục hồi phiên Điện thoại Đại Biểu
        const pName = s.playerName || 'Đại biểu';
        const pAvatar = s.playerAvatar || '⭐';
        const pRoom = s.roomId || '1930-VN';
        this.selectedAvatar = pAvatar;
        this.selectedRoomCode = pRoom;

        if (s.screen === 'timeline-game-screen') {
          this.multiplayer.joinRoom(pRoom, pName, pAvatar, () => {
            this.multiplayer.gameEndAt = s.gameEndAt || 0;
            this.multiplayer.gameDuration = s.gameDuration || 300;
            if (this.miniGame) {
              this.miniGame.timelineScore = s.score || 0;
              this.miniGame.streakCount = s.streakCount || 0;
              this.miniGame.startTimelineGame();
            }
          });
          return true;
        } else if (s.screen === 'player-wait-screen') {
          this.multiplayer.joinRoom(pRoom, pName, pAvatar, () => {
            this.switchScreen('player-wait-screen');
          });
          return true;
        } else if (s.screen === 'join-screen') {
          this.openJoinScreen(pRoom);
          return true;
        } else if (s.screen === 'summary-screen') {
          this.showSummary({ score: s.score || 0, formattedTime: '--:--' });
          return true;
        }
      }
    } catch (e) {
      console.warn('Lỗi khôi phục session:', e);
    }
    return false;
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

    // Tự động lưu màn hình hiện tại vào phiên làm việc
    if (screenId !== 'start-screen' && screenId !== 'intro-screen') {
      this.saveSession({ screen: screenId });
    } else {
      this.clearSession();
    }

    // Nút Xem Intro chỉ hiển thị khi ở Start Screen
    const playIntroBtn = document.getElementById('btn-play-intro');
    if (playIntroBtn) {
      playIntroBtn.style.display = (screenId === 'start-screen') ? 'flex' : 'none';
    }

    // Ẩn thanh HUD góc trên khi chơi mini-game hoặc ở màn đăng ký đại biểu / sảnh chờ
    const topHud = document.querySelector('.top-hud-bar');
    if (topHud) {
      if (screenId === 'timeline-game-screen' || screenId === 'cipher-game-screen' || screenId === 'join-screen' || screenId === 'lobby-screen' || screenId === 'player-wait-screen' || screenId === 'projector-screen' || screenId === 'podium-screen') {
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

    // 1. Nút "MÁY CHIẾU: TẠO PHÒNG QR"
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

    // 1b. Nút "ĐIỆN THOẠI VÀO PHÒNG"
    const phoneJoinBtn = document.getElementById('btn-mode-phone-join');
    if (phoneJoinBtn) {
      phoneJoinBtn.addEventListener('click', () => {
        soundEngine.playClick();
        this.openJoinScreen('1930-VN');
      });
    }

    // 1c. Nút "CHƠI ĐƠN LUYỆN TẬP"
    const soloPlayBtn = document.getElementById('btn-mode-solo-play');
    if (soloPlayBtn) {
      soloPlayBtn.addEventListener('click', () => {
        soundEngine.playClick();
        soundEngine.startAmbient();
        this.mode = 'solo';
        this.miniGame.startTimelineGame();
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

    // 4. Submit Form Đăng Ký Đại Biểu (Tham gia phòng -> Vào Màn Hình Chờ Đại Biểu)
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
          // Điện thoại chuyển vào Màn hình chờ đại biểu (KHÔNG vào màn chiếu QR)
          this.switchScreen('player-wait-screen');
        });
      });
    }

    // 4b. Nút Rời phòng từ Màn hình chờ đại biểu
    const waitExitBtn = document.getElementById('btn-wait-exit');
    if (waitExitBtn) {
      waitExitBtn.addEventListener('click', () => {
        soundEngine.playClick();
        this.multiplayer.leaveRoom();
        this.switchScreen('start-screen');
      });
    }

    // 5. Nút Bắt đầu từ Sảnh Chờ (Chủ tọa phát lệnh) - Host vào màn chiếu Spectator
    const startBattleBtn = document.getElementById('btn-start-lobby-game');
    if (startBattleBtn) {
      startBattleBtn.addEventListener('click', () => {
        if (!this.multiplayer.isHost) {
          alert('Chỉ có Chủ tọa (máy tạo phòng) mới có quyền phát lệnh bắt đầu trò chơi!');
          return;
        }
        soundEngine.playFanfare();
        const durationSel = document.getElementById('select-game-duration');
        const dur = durationSel ? parseInt(durationSel.value, 10) : 300;
        this.multiplayer.broadcastStartGame('minigame', dur);
        // Host vào màn chiếu Spectator để quan sát, KHÔNG chơi
        this.switchScreen('projector-screen');
        this.startProjectorMode(dur, this.multiplayer.gameEndAt);
      });
    }

    // 6. Nút Thoát Mini-Game quay về Màn hình chính
    const tlBack = document.getElementById('btn-timeline-back');
    if (tlBack) {
      tlBack.addEventListener('click', () => {
        soundEngine.playClick();
        if (this.miniGame) {
          this.miniGame.savePlayerState();
          this.miniGame.clearSpeedTimer();
          this.miniGame.stopStopwatch();
        }
        if (this.multiplayer) {
          this.multiplayer.leaveRoom();
        }
        this.switchScreen('start-screen');
      });
    }
    const cpBack = document.getElementById('btn-cipher-back');
    if (cpBack) {
      cpBack.addEventListener('click', () => {
        soundEngine.playClick();
        if (this.miniGame) {
          this.miniGame.savePlayerState();
          this.miniGame.stopStopwatch();
        }
        if (this.multiplayer) {
          this.multiplayer.leaveRoom();
        }
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

    // 9. Nút mở Bảng Xếp Hạng từ thanh Top HUD & Start Screen
    const hudLbBtn = document.getElementById('btn-leaderboard-hud');
    if (hudLbBtn) {
      hudLbBtn.addEventListener('click', () => {
        soundEngine.playClick();
        this.openLeaderboardModal(this.multiplayer.players.length > 1 ? 'room' : 'hall');
      });
    }

    const startLbBtn = document.getElementById('btn-start-leaderboard');
    if (startLbBtn) {
      startLbBtn.addEventListener('click', () => {
        soundEngine.playClick();
        this.openLeaderboardModal('hall');
      });
    }

    // 10. Đóng Modal Bảng Xếp Hạng
    const closeLbBtn = document.getElementById('btn-close-leaderboard');
    if (closeLbBtn) closeLbBtn.addEventListener('click', () => this.closeLeaderboardModal());

    const closeLbFoot = document.getElementById('btn-close-leaderboard-footer');
    if (closeLbFoot) closeLbFoot.addEventListener('click', () => this.closeLeaderboardModal());

    const lbModalOverlay = document.getElementById('modal-leaderboard');
    if (lbModalOverlay) {
      lbModalOverlay.addEventListener('click', (e) => {
        if (e.target === lbModalOverlay) this.closeLeaderboardModal();
      });
    }

    // 11. Tabs trong Modal Bảng Xếp Hạng
    const modalTabRoom = document.getElementById('modal-tab-room');
    const modalTabHall = document.getElementById('modal-tab-hall');
    if (modalTabRoom && modalTabHall) {
      modalTabRoom.addEventListener('click', () => {
        soundEngine.playClick();
        modalTabRoom.classList.add('active');
        modalTabHall.classList.remove('active');
        this.activeModalTab = 'room';
        this.renderLeaderboard(document.getElementById('modal-leaderboard-list'), 'room');
      });

      modalTabHall.addEventListener('click', () => {
        soundEngine.playClick();
        modalTabHall.classList.add('active');
        modalTabRoom.classList.remove('active');
        this.activeModalTab = 'hall';
        this.renderLeaderboard(document.getElementById('modal-leaderboard-list'), 'hall');
      });
    }

    // 12. Tabs trong Summary Screen
    const sumTabRoom = document.getElementById('sum-tab-room');
    const sumTabHall = document.getElementById('sum-tab-hall');
    if (sumTabRoom && sumTabHall) {
      sumTabRoom.addEventListener('click', () => {
        soundEngine.playClick();
        sumTabRoom.classList.add('active');
        sumTabHall.classList.remove('active');
        this.activeSummaryTab = 'room';
        this.renderLeaderboard(document.getElementById('final-podium-list'), 'room');
      });

      sumTabHall.addEventListener('click', () => {
        soundEngine.playClick();
        sumTabHall.classList.add('active');
        sumTabRoom.classList.remove('active');
        this.activeSummaryTab = 'hall';
        this.renderLeaderboard(document.getElementById('final-podium-list'), 'hall');
      });
    }

    // 13. Nút Projector Screen: Quay lại sảnh
    const projBackBtn = document.getElementById('btn-projector-back');
    if (projBackBtn) {
      projBackBtn.addEventListener('click', () => {
        soundEngine.playClick();
        this.stopProjectorMode();
        this.switchScreen('lobby-screen');
      });
    }

    // 13.5. Nút Chuyển sang Chặng 2 (Giải Mã Điện Tín Cửu Long) từ Màn chiếu
    const nextStageBtn = document.getElementById('btn-projector-next-stage');
    if (nextStageBtn) {
      nextStageBtn.addEventListener('click', () => {
        soundEngine.playFanfare();
        this.projectorInStage2 = true;
        if (this.multiplayer) {
          this.multiplayer.broadcastSwitchStage('cipher');
        }
        const projBadge = document.querySelector('.projector-title-group .proj-badge');
        if (projBadge) projBadge.innerText = '📻 CHẶNG 2: GIẢI MÃ ĐIỆN TÍN CỬU LONG';
        nextStageBtn.style.display = 'none';
        this.addProjectorActivity('Chủ Tọa đã phát lệnh chuyển sang Chặng 2: Giải Mã Điện Tín Cửu Long', 'broadcast');
        // Đồng hồ 5 phút tiếp tục cho Chặng 2
        this.projectorDuration = 300;
        this.projectorEndAt = Date.now() + 300000;
      });
    }

    // 14. Nút Kết thúc sớm từ Projector Screen (Không dùng confirm chặn luồng)
    const endEarlyBtn = document.getElementById('btn-end-game-early');
    if (endEarlyBtn) {
      endEarlyBtn.addEventListener('click', () => {
        soundEngine.playFanfare();
        this.stopProjectorMode();
        if (this.multiplayer) {
          this.multiplayer.broadcastGameOver();
        }
        this.showPodiumScreen();
      });
    }

    // 15. Podium Screen button: Về Trang Chủ
    const podiumHomeBtn = document.getElementById('btn-podium-home');
    if (podiumHomeBtn) {
      podiumHomeBtn.addEventListener('click', () => {
        soundEngine.playClick();
        this.multiplayer.leaveRoom();
        this.switchScreen('start-screen');
      });
    }
  }

  // ================= CHẾ ĐỘ MÀN CHIẾU SPECTATOR =================

  // Khởi động chế độ quan sát màn chiếu (Host) với đồng hồ đếm ngược
  startProjectorMode(durationSeconds, endAt) {
    this.projectorDuration = durationSeconds || 300;
    this.projectorEndAt = endAt || (Date.now() + this.projectorDuration * 1000);
    this.projectorActivityFeed = [];
    this.projectorInStage2 = false;

    const nextStageBtn = document.getElementById('btn-projector-next-stage');
    if (nextStageBtn) nextStageBtn.style.display = 'inline-flex';

    const projBadge = document.querySelector('.projector-title-group .proj-badge');
    if (projBadge) projBadge.innerText = '📜 CHẶNG 1: TRI THỨC LỊCH SỬ SIÊU TỐC';

    // Render QR code nhỏ trong màn chiếu
    const projQrBox = document.getElementById('proj-qr-box');
    if (projQrBox) {
      projQrBox.innerHTML = '';
      const baseUrl = window.location.origin + window.location.pathname;
      const joinUrl = `${baseUrl}?join=${encodeURIComponent(this.multiplayer.roomId)}`;
      const roomCodeEl = document.getElementById('proj-room-code-display');
      if (roomCodeEl) roomCodeEl.innerText = `#${this.multiplayer.roomId}`;
      if (typeof QRCode !== 'undefined') {
        try {
          new QRCode(projQrBox, { text: joinUrl, width: 110, height: 110, colorDark: '#0a0504', colorLight: '#f6c85f', correctLevel: QRCode.CorrectLevel.L });
        } catch (e) {
          projQrBox.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(joinUrl)}&bgcolor=f6c85f&color=0a0504&margin=2" style="width:100%;height:100%;object-fit:contain;" />`;
        }
      }
    }

    // Đồng hồ đếm ngược mỗi giây
    this.projectorTimer = setInterval(() => {
      this.updateProjectorCountdown();
    }, 1000);

    // Leaderboard refresh mỗi 2 giây
    this.projectorLbTimer = setInterval(() => {
      this.updateProjectorLeaderboard();
    }, 2000);

    this.updateProjectorCountdown();
    this.updateProjectorLeaderboard();
  }

  // Dừng chế độ quan sát
  stopProjectorMode() {
    clearInterval(this.projectorTimer);
    clearInterval(this.projectorLbTimer);
    this.projectorTimer = null;
    this.projectorLbTimer = null;
  }

  // Cập nhật đồng hồ đếm ngược trên màn chiếu
  updateProjectorCountdown() {
    const countdownEl = document.getElementById('proj-countdown-val');
    const barFill = document.getElementById('proj-countdown-bar-fill');
    const totalEl = document.getElementById('proj-total-players');
    const finEl = document.getElementById('proj-finished-players');

    // Cập nhật số đại biểu (CHỈ ĐẾM ĐẠI BIỂU THỰC SỰ, LOẠI BỎ TÀI KHOẢN CHỦ TỌA)
    const delegates = this.multiplayer ? this.multiplayer.getRealDelegates() : [];
    if (totalEl) totalEl.innerText = delegates.length;
    if (finEl) finEl.innerText = delegates.filter(p => p.isFinished).length;

    if (!this.projectorEndAt || this.projectorEndAt === 0) {
      if (countdownEl) countdownEl.innerText = '∞';
      if (barFill) barFill.style.width = '100%';
      return;
    }

    const remaining = Math.max(0, this.projectorEndAt - Date.now());
    const secs = Math.floor(remaining / 1000);
    const mins = Math.floor(secs / 60);
    const ss = String(secs % 60).padStart(2, '0');
    const timeStr = `${mins}:${ss}`;

    if (countdownEl) {
      countdownEl.innerText = timeStr;
      countdownEl.classList.toggle('countdown-warning', secs <= 60);
      countdownEl.classList.toggle('countdown-danger', secs <= 30);
    }

    const pct = this.projectorDuration > 0 ? (remaining / (this.projectorDuration * 1000)) * 100 : 100;
    if (barFill) barFill.style.width = `${Math.max(0, pct)}%`;

    // Khi hết giờ:
    if (remaining === 0) {
      if (!this.projectorInStage2) {
        // Hết 5 phút Chặng 1 -> Tự động chuyển toàn hội nghị sang Chặng 2!
        this.projectorInStage2 = true;
        soundEngine.playFanfare();
        if (this.multiplayer) {
          this.multiplayer.broadcastSwitchStage('cipher');
        }
        const projBadge = document.querySelector('.projector-title-group .proj-badge');
        if (projBadge) projBadge.innerText = '📻 CHẶNG 2: GIẢI MÃ ĐIỆN TÍN CỬU LONG';
        const nextStageBtn = document.getElementById('btn-projector-next-stage');
        if (nextStageBtn) nextStageBtn.style.display = 'none';
        this.addProjectorActivity('Hết 5 phút Chặng 1 ➜ Tự động chuyển toàn hội nghị sang Chặng 2: Giải Mã Điện Tín', 'broadcast');

        // Bắt đầu 5 phút cho Chặng 2
        this.projectorDuration = 300;
        this.projectorEndAt = Date.now() + 300000;
        return;
      }

      // Hết giờ Chặng 2 -> Tự động kết thúc và hiện podium
      this.stopProjectorMode();
      soundEngine.playFanfare();
      if (this.multiplayer) {
        this.multiplayer.broadcastGameOver();
      }
      this.showPodiumScreen();
    }
  }

  // Cập nhật bảng xếp hạng live trên màn chiếu
  updateProjectorLeaderboard() {
    const rowsEl = document.getElementById('proj-lb-rows');
    if (!rowsEl) return;

    const lb = this.multiplayer.getRoomLeaderboard();
    const topN = lb.slice(0, 10);

    // Cập nhật số liệu thống kê ở header (chỉ đếm đại biểu thực sự)
    const totalEl = document.getElementById('proj-total-players');
    const finEl = document.getElementById('proj-finished-players');
    const delegates = this.multiplayer ? this.multiplayer.getRealDelegates() : [];
    if (totalEl) totalEl.innerText = delegates.length;
    if (finEl) finEl.innerText = delegates.filter(p => p.isFinished).length;

    rowsEl.innerHTML = '';
    if (topN.length === 0) {
      rowsEl.innerHTML = `
        <div class="proj-lb-empty">
          <span class="proj-empty-icon">📱</span>
          <div class="proj-empty-title">CHƯA CÓ ĐẠI BIỂU THAM GIA THI ĐẤU</div>
          <div class="proj-empty-sub">Hãy dùng điện thoại quét mã QR góc bên phải để gia nhập hội nghị!</div>
        </div>
      `;
      return;
    }

    topN.forEach((item, idx) => {
      const row = document.createElement('div');
      const isOffline = item.hasLeft || !item.isOnline;
      row.className = `proj-lb-row ${item.isFinished ? 'proj-finished' : ''} ${isOffline ? 'proj-offline' : ''}`;

      const rankBadges = ['🥇', '🥈', '🥉'];
      const rankStr = idx < 3 ? rankBadges[idx] : `${idx + 1}`;

      let timeText;
      if (item.isFinished) {
        timeText = item.formattedTime || '--:--';
      } else if (isOffline) {
        timeText = '🚪 Đã rời';
      } else if (item.score > 0) {
        timeText = '⏳ đang thi';
      } else {
        timeText = '⏳ chờ...';
      }

      // Progress: nếu đã xong thì 100%, còn thì ước lượng theo điểm
      const progressPct = item.isFinished ? 100 : Math.min(99, Math.floor((item.score / 2500) * 100));

      const statusBadge = item.isFinished
        ? '<span class="plb-done-badge">✓ XONG</span>'
        : (isOffline ? '<span class="plb-offline-badge">ĐÃ LƯU</span>' : '');

      row.innerHTML = `
        <span class="plb-col-rank plbr-${idx + 1}">${rankStr}</span>
        <div class="plb-col-player">
          <span class="plb-avatar">${item.avatar || '⭐'}</span>
          <span class="plb-name">${item.name}</span>
          ${statusBadge}
        </div>
        <div class="plb-col-progress">
          <div class="plb-progress-bar"><div class="plb-progress-fill" style="width:${progressPct}%"></div></div>
          <span class="plb-pct">${progressPct}%</span>
        </div>
        <span class="plb-col-time">${timeText}</span>
        <strong class="plb-col-score">${item.score.toLocaleString()}đ</strong>
      `;
      rowsEl.appendChild(row);
    });
  }

  // Thêm dòng vào feed hoạt động gần đây
  addProjectorActivity(message, type = 'info') {
    const feedEl = document.getElementById('proj-activity-list');
    if (!feedEl) return;

    const item = document.createElement('div');
    item.className = `proj-activity-item proj-act-${type}`;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
    item.innerHTML = `<span class="proj-act-time">${timeStr}</span> ${message}`;
    feedEl.insertBefore(item, feedEl.firstChild);

    // Giữ tối đa 8 dòng
    while (feedEl.children.length > 8) feedEl.removeChild(feedEl.lastChild);
  }

  // ================= MÀN VINH DANH TOP 5 (PODIUM CEREMONY) =================

  showPodiumScreen() {
    soundEngine.playFanfare();
    this.switchScreen('podium-screen');

    const lb = this.multiplayer.getRoomLeaderboard();
    const top5 = lb.slice(0, 5);
    const total = lb.length;
    const finished = lb.filter(p => p.isFinished).length;
    const topScore = top5.length > 0 ? top5[0].score : 0;

    // Thống kê
    const totEl = document.getElementById('podium-total-players');
    const finEl = document.getElementById('podium-finished-count');
    const scoreEl = document.getElementById('podium-top-score');
    if (totEl) totEl.innerText = total;
    if (finEl) finEl.innerText = finished;
    if (scoreEl) scoreEl.innerText = `${topScore.toLocaleString()}đ`;

    // Render bục Top 3
    const stageEl = document.getElementById('podium-top3-stage');
    if (stageEl) {
      stageEl.innerHTML = '';
      // Hiển thị theo thứ tự sân khấu: [2] [1] [3]
      const podiumOrder = [1, 0, 2]; // index trong top5
      const heights = ['120px', '160px', '90px'];
      const labels = ['🥈 Hạng Nhì', '🥇 Hạng Nhất', '🥉 Hạng Ba'];
      const glows = ['#c0c0c0', '#ffd700', '#cd7f32'];

      podiumOrder.forEach((dataIdx, stagePos) => {
        const player = top5[dataIdx];
        const block = document.createElement('div');
        block.className = `podium-pillar podium-pos-${stagePos + 1}`;
        if (!player) {
          block.innerHTML = `<div class="podium-empty-slot">${labels[stagePos]}</div>`;
          stageEl.appendChild(block);
          return;
        }
        block.style.setProperty('--pillar-h', heights[stagePos]);
        block.style.setProperty('--pillar-glow', glows[stagePos]);
        block.innerHTML = `
          <div class="podium-player-card animate-appear">
            <div class="podium-avatar-big">${player.avatar || '⭐'}</div>
            <div class="podium-player-name">${player.name}</div>
            <div class="podium-player-score">${player.score.toLocaleString()}đ</div>
            ${player.formattedTime ? `<div class="podium-player-time">⏱️ ${player.formattedTime}</div>` : ''}
          </div>
          <div class="podium-base" style="height:var(--pillar-h);">
            <div class="podium-rank-label">${labels[stagePos]}</div>
          </div>
        `;
        stageEl.appendChild(block);
      });
    }

    // Render hạng 4-5
    const restEl = document.getElementById('podium-rest-list');
    if (restEl) {
      restEl.innerHTML = '';
      top5.slice(3).forEach((player, idx) => {
        const row = document.createElement('div');
        row.className = 'podium-rest-row animate-appear';
        row.innerHTML = `
          <span class="podium-rest-rank">${idx + 4}.</span>
          <span class="podium-rest-avatar">${player.avatar || '⭐'}</span>
          <span class="podium-rest-name">${player.name}</span>
          <span class="podium-rest-time">${player.formattedTime || '--:--'}</span>
          <strong class="podium-rest-score">${player.score.toLocaleString()}đ</strong>
        `;
        restEl.appendChild(row);
      });
    }
  }

  // Xử lý khi nhận GAME_OVER từ Host (điện thoại người chơi)
  onGameOverReceived(leaderboard) {
    // Người chơi trên điện thoại tự lưu kết quả và hiện màn tổng kết
    if (this.miniGame) {
      this.miniGame.clearSpeedTimer && this.miniGame.clearSpeedTimer();
      this.miniGame.stopStopwatch && this.miniGame.stopStopwatch();
    }
    soundEngine.playFanfare();
    // Hiện màn summary cá nhân cho điện thoại người chơi
    const scoreNow = this.score || 0;
    this.showSummary({ score: scoreNow, formattedTime: this.miniGame ? this.miniGame.getFormattedTime() : '00:00', timeSeconds: 0, speedBonus: 0 });
  }

  // Đồng hồ đếm ngược nhỏ trên màn hình điện thoại người chơi (hiển thị ở HUD)
  startClientCountdown(endAt, durationSeconds) {
    clearInterval(this.clientCountdownTimer);
    if (!endAt || endAt === 0) return;
    const hudTimerEl = document.getElementById('timeline-stopwatch-val');
    this.clientCountdownTimer = setInterval(() => {
      const remaining = Math.max(0, endAt - Date.now());
      const secs = Math.floor(remaining / 1000);
      const mm = String(Math.floor(secs / 60)).padStart(2, '0');
      const ss = String(secs % 60).padStart(2, '0');
      if (hudTimerEl) hudTimerEl.innerText = `${mm}:${ss}`;
      if (remaining === 0) {
        clearInterval(this.clientCountdownTimer);
      }
    }, 1000);
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

  // ================= BẢNG XẾP HẠNG & KỶ LỤC =================
  getHallOfFame() {
    try {
      const stored = localStorage.getItem('vnr202_hall_of_fame');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Lọc bỏ triệt để mọi dữ liệu mẫu ảo trước đây
          const mockNames = ["Nguyễn Ái Quốc", "Trần Phú", "Nguyễn Đức Cảnh", "Đại Biểu Nam Kỳ", "Chiến Sĩ Sa Diện"];
          const mockDates = ["3/2/1930", "10/1930", "1928", "1929", "1924"];
          const realRecords = parsed.filter(item => {
            if (!item || !item.name) return false;
            const nameTrim = item.name.trim();
            if (mockNames.includes(nameTrim)) return false;
            if (mockDates.includes(item.date)) return false;
            if (item.isMock) return false;
            return true;
          });
          localStorage.setItem('vnr202_hall_of_fame', JSON.stringify(realRecords));
          return realRecords;
        }
      }
    } catch (e) {
      console.warn('Lỗi đọc localStorage:', e);
    }
    return [];
  }

  saveRecordToHallOfFame(record) {
    try {
      const list = this.getHallOfFame();
      list.push(record);
      // Sắp xếp theo điểm DESC, sau đó theo thời gian ASC
      list.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.timeSeconds - b.timeSeconds;
      });
      // Giữ tối đa top 15 kỷ lục thực tế xuất sắc nhất
      const topList = list.slice(0, 15);
      localStorage.setItem('vnr202_hall_of_fame', JSON.stringify(topList));
      return topList;
    } catch (e) {
      console.warn('Lỗi lưu kỷ lục:', e);
      return [];
    }
  }

  // Tự động lưu hoặc cập nhật kỷ lục người chơi (dành cho cập nhật realtime & khi thoát giữa chừng)
  saveOrUpdateHallOfFame(record) {
    try {
      const list = this.getHallOfFame();
      const existingIdx = list.findIndex(r => r.name === record.name);
      if (existingIdx >= 0) {
        if ((record.score || 0) >= (list[existingIdx].score || 0)) {
          list[existingIdx] = Object.assign({}, list[existingIdx], record);
        }
      } else {
        list.push(record);
      }
      list.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.timeSeconds - b.timeSeconds;
      });
      const topList = list.slice(0, 20);
      localStorage.setItem('vnr202_hall_of_fame', JSON.stringify(topList));
      return topList;
    } catch (e) {
      console.warn('Lỗi lưu/cập nhật kỷ lục:', e);
      return [];
    }
  }

  // Kết xuất danh sách Bảng Xếp Hạng vào thẻ container
  renderLeaderboard(containerEl, tabType = 'room') {
    if (!containerEl) return;
    containerEl.innerHTML = '';

    let items = [];

    if (tabType === 'room') {
      // Lấy từ phòng thi đấu trực tiếp (Multiplayer)
      items = this.multiplayer ? this.multiplayer.getRoomLeaderboard() : [];
      if (items.length === 0 && this.score > 0) {
        // Nếu chơi đơn thì hiển thị kết quả thật của người chơi vừa thi đấu
        items = [{
          id: this.multiplayer ? this.multiplayer.playerId : 'me',
          name: (this.multiplayer && this.multiplayer.playerName) ? this.multiplayer.playerName : 'Bạn',
          avatar: (this.multiplayer && this.multiplayer.playerAvatar) ? this.multiplayer.playerAvatar : '⭐',
          score: this.score,
          formattedTime: this.lastFormattedTime || '--:--',
          isFinished: true
        }];
      }
    } else {
      // Lấy từ Bảng Vàng Kỷ Lục (chỉ lưu kết quả người chơi thực)
      items = this.getHallOfFame();
    }

    if (!items || items.length === 0) {
      containerEl.innerHTML = `
        <div class="podium-empty-state">
          <span>${tabType === 'room' ? '📜 Chưa có đại biểu nào hoàn thành lượt chơi trong phòng.' : '⭐ Chưa có kỷ lục nào được ghi nhận. Hãy hoàn thành nhiệm vụ để lưu danh!'}</span>
        </div>
      `;
      return;
    }

    items.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = 'podium-item';

      const isMe = (this.multiplayer && item.id === this.multiplayer.playerId) || item.isCurrentPlayer;
      if (isMe) row.classList.add('highlight');

      let rankBadge = `#${idx + 1}`;
      if (idx === 0) rankBadge = '🥇';
      else if (idx === 1) rankBadge = '🥈';
      else if (idx === 2) rankBadge = '🥉';

      const timeText = item.formattedTime ? `⏱️ ${item.formattedTime}` : (item.isFinished ? 'Hoàn thành' : 'Đang giải mã...');
      const scoreText = `${item.score.toLocaleString()}đ`;

      row.innerHTML = `
        <span class="col-rank rank-${idx + 1}">${rankBadge}</span>
        <div class="col-player">
          <span class="player-mini-avatar">${item.avatar || '⭐'}</span>
          <span class="player-mini-name">${item.name} ${isMe ? '<strong class="me-tag">(Bạn)</strong>' : ''}</span>
        </div>
        <span class="col-time">${timeText}</span>
        <strong class="col-score">${scoreText}</strong>
      `;

      containerEl.appendChild(row);
    });
  }

  // Cập nhật live leaderboard khi có người chơi khác về đích
  updateLiveLeaderboard() {
    const sumPodium = document.getElementById('final-podium-list');
    if (sumPodium && this.activeSummaryTab === 'room') {
      this.renderLeaderboard(sumPodium, 'room');
    }
    const modalList = document.getElementById('modal-leaderboard-list');
    if (modalList && this.activeModalTab === 'room') {
      this.renderLeaderboard(modalList, 'room');
    }
  }

  openLeaderboardModal(tab = 'room') {
    this.activeModalTab = tab;
    const modal = document.getElementById('modal-leaderboard');
    const tabRoom = document.getElementById('modal-tab-room');
    const tabHall = document.getElementById('modal-tab-hall');
    const listEl = document.getElementById('modal-leaderboard-list');

    if (tabRoom && tabHall) {
      tabRoom.classList.toggle('active', tab === 'room');
      tabHall.classList.toggle('active', tab === 'hall');
    }

    this.renderLeaderboard(listEl, tab);
    if (modal) modal.style.display = 'flex';
  }

  closeLeaderboardModal() {
    const modal = document.getElementById('modal-leaderboard');
    if (modal) modal.style.display = 'none';
  }

  // ================= MÀN HÌNH TỔNG KẾT VÀ VINH DANH =================
  showSummary(summaryData = {}) {
    clearInterval(this.timerInterval);
    soundEngine.playFanfare();
    this.switchScreen('summary-screen');

    const finalScore = summaryData.score !== undefined ? summaryData.score : this.score;
    const formattedTime = summaryData.formattedTime || '01:30';
    const totalSec = summaryData.timeSeconds || 90;
    const speedBonus = summaryData.speedBonus !== undefined ? summaryData.speedBonus : 150;
    this.lastFormattedTime = formattedTime;

    const scoreEl = document.getElementById('final-score-val');
    const timeEl = document.getElementById('final-time-val');
    const bonusEl = document.getElementById('final-speed-bonus');
    const rankEl = document.getElementById('final-rank-val');

    if (scoreEl) scoreEl.innerText = `${finalScore.toLocaleString()}đ`;
    if (timeEl) timeEl.innerText = formattedTime;
    if (bonusEl) bonusEl.innerText = `+${speedBonus}đ`;
    if (rankEl) rankEl.innerText = `2/2 Màn`;

    // Lưu vào Bảng Vàng Kỷ Lục LocalStorage
    const playerName = (this.multiplayer && this.multiplayer.playerName) ? this.multiplayer.playerName : 'Đại biểu Hội nghị';
    const playerAvatar = (this.multiplayer && this.multiplayer.playerAvatar) ? this.multiplayer.playerAvatar : '⭐';
    
    this.saveRecordToHallOfFame({
      name: playerName,
      avatar: playerAvatar,
      score: finalScore,
      timeSeconds: totalSec,
      formattedTime: formattedTime,
      date: new Date().toLocaleDateString('vi-VN'),
      isCurrentPlayer: true
    });

    // Danh hiệu lịch sử theo điểm số
    let rankTitle = "Chiến Sĩ Tiên Phong Cách Mạng (1930)";
    if (finalScore >= 1900) {
      rankTitle = "🏆 ĐẠI BIỂU XUẤT SẮC HỘI NGHỊ CỬU LONG (1930) 🌟";
    } else if (finalScore >= 1400) {
      rankTitle = "⭐ ĐẠI BIỂU KIÊN TRUNG CÁCH MẠNG (1930) ⭐";
    } else {
      rankTitle = "📜 HỘI VIÊN THANH NIÊN CÁCH MẠNG (1925)";
    }
    const badgeEl = document.getElementById('summary-rank-badge');
    if (badgeEl) badgeEl.innerText = rankTitle;

    // Hiển thị tab phòng đấu mặc định
    this.activeSummaryTab = 'room';
    const sumTabRoom = document.getElementById('sum-tab-room');
    const sumTabHall = document.getElementById('sum-tab-hall');
    if (sumTabRoom && sumTabHall) {
      sumTabRoom.classList.add('active');
      sumTabHall.classList.remove('active');
    }
    this.renderLeaderboard(document.getElementById('final-podium-list'), 'room');
  }
}

// Khởi chạy khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
  window.quizApp = new HistoricalQuizApp();
  new ParticleAtmosphere('fx-canvas');
});
