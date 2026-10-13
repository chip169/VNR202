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
    
    this.initParallax();
    this.initLobbySimulation();
    this.bindEvents();
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

    // Nút "VÀO CHƠI TRỰC TUYẾN" chính
    const playBtn = document.getElementById('btn-main-play');
    playBtn.addEventListener('click', () => {
      soundEngine.playClick();
      soundEngine.startAmbient();
      this.mode = 'multiplayer';
      this.openLobby();
    });

    // Nút Chế độ Chiến Dịch
    const campaignBtn = document.getElementById('btn-mode-campaign');
    if (campaignBtn) {
      campaignBtn.addEventListener('click', () => {
        soundEngine.playClick();
        soundEngine.startAmbient();
        this.mode = 'campaign';
        this.startQuizBattle();
      });
    }

    // Nút Bắt đầu thi đấu từ Sảnh Chờ
    const startBattleBtn = document.getElementById('btn-start-lobby-game');
    if (startBattleBtn) {
      startBattleBtn.addEventListener('click', () => {
        soundEngine.playClick();
        this.startQuizBattle();
      });
    }

    // Nút Quay lại màn hình chính từ Sảnh chờ
    const backBtn = document.getElementById('btn-lobby-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        soundEngine.playClick();
        this.switchScreen('start-screen');
      });
    }

    // Nút Chơi lại từ Màn hình Vinh danh
    const replayBtn = document.getElementById('btn-replay-game');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        soundEngine.playClick();
        this.switchScreen('start-screen');
      });
    }

    // Hỗ trợ phím tắt bàn phím A, B, C, D hoặc 1, 2, 3, 4
    window.addEventListener('keydown', (e) => {
      if (this.currentScreen === 'battle-screen' && !this.isAnswerLocked) {
        const key = e.key.toUpperCase();
        const map = { '1': 0, 'A': 0, '2': 1, 'B': 1, '3': 2, 'C': 2, '4': 3, 'D': 3 };
        if (key in map) {
          const btns = document.querySelectorAll('.btn-answer-choice');
          const idx = map[key];
          if (btns[idx]) {
            btns[idx].click();
          }
        }
      }
    });
  }

  // Mở sảnh chờ đối kháng
  openLobby() {
    this.switchScreen('lobby-screen');
    const container = document.getElementById('lobby-players-grid');
    container.innerHTML = `
      <div class="player-chip is-you">
        <span class="player-avatar">⭐</span>
        <span class="player-name">Bạn (Đại Biểu 1930)</span>
      </div>
    `;

    // Chỉ người chơi thực tế, không có bot ảo
    this.playerList = [
      { name: "Bạn (Đại Biểu 1930)", avatar: "⭐", score: 0, isPlayer: true }
    ];

    const readyCount = document.getElementById('lobby-ready-count');
    if (readyCount) readyCount.innerText = '1 đại biểu';
  }

  // Khởi động vòng thi đấu
  startQuizBattle() {
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.currentQuestionIdx = 0;
    // Xáo trộn ngẫu nhiên 10 câu hỏi từ ngân hàng 100 câu
    const shuffled = [...HISTORICAL_QUESTIONS].sort(() => 0.5 - Math.random());
    this.roundQuestions = shuffled.slice(0, 10);
    this.updateHUD();
    this.switchScreen('battle-screen');
    this.loadQuestion(this.currentQuestionIdx);
  }

  updateHUD() {
    this.scoreDisplay.innerText = this.score;
    if (this.combo >= 2) {
      this.comboBadge.style.display = 'inline-block';
      this.comboBadge.innerText = `🔥 Combo x${this.combo}`;
    } else {
      this.comboBadge.style.display = 'none';
    }
    this.updateRivalTicker();
  }

  updateRivalTicker() {
    const ticker = document.getElementById('rival-ticker-bar');
    if (ticker) ticker.style.display = 'none';
  }

  loadQuestion(index) {
    if (!this.roundQuestions || index >= this.roundQuestions.length) {
      this.showSummary();
      return;
    }

    const q = this.roundQuestions[index];
    this.isAnswerLocked = false;
    this.timer = 15;

    // Reset UI Popover tư liệu
    const popover = document.getElementById('insight-popover');
    if (popover) popover.classList.remove('visible');

    // Cập nhật nội dung câu hỏi
    document.getElementById('question-era-tag').innerHTML = `🏛️ Câu ${index + 1}/${this.roundQuestions.length} — ${q.era}`;
    document.getElementById('question-text').innerText = q.question;
    document.getElementById('question-context').innerText = `"${q.context}"`;

    // Render 4 đáp án
    const container = document.getElementById('answers-grid');
    container.innerHTML = '';
    const keys = ['A', 'B', 'C', 'D'];

    q.options.forEach((opt, optIdx) => {
      const btn = document.createElement('button');
      btn.className = 'btn-answer-choice';
      btn.innerHTML = `
        <span class="choice-key">${keys[optIdx]}</span>
        <span class="choice-text">${opt}</span>
      `;
      btn.addEventListener('click', () => this.handleAnswerSelect(optIdx, btn));
      container.appendChild(btn);
    });

    this.startTimer(q);
  }

  startTimer(currentQ) {
    clearInterval(this.timerInterval);
    const totalTime = 15;
    const maxOffset = 200; // SVG dasharray

    this.timerText.innerText = this.timer;
    this.timerRing.style.strokeDashoffset = '0';
    this.timerRing.style.stroke = 'var(--gold-primary)';

    this.timerInterval = setInterval(() => {
      this.timer--;
      this.timerText.innerText = this.timer;

      // Stroke progress
      const progress = (totalTime - this.timer) / totalTime;
      this.timerRing.style.strokeDashoffset = progress * maxOffset;

      if (this.timer <= 4) {
        this.timerRing.style.stroke = '#ff1744';
        soundEngine.playTick(true);
      } else {
        soundEngine.playTick(false);
      }

      if (this.timer <= 0) {
        clearInterval(this.timerInterval);
        this.handleTimeOut(currentQ);
      }
    }, 1000);
  }

  handleAnswerSelect(selectedIndex, buttonEl) {
    if (this.isAnswerLocked) return;
    this.isAnswerLocked = true;
    clearInterval(this.timerInterval);

    const q = this.roundQuestions ? this.roundQuestions[this.currentQuestionIdx] : HISTORICAL_QUESTIONS[this.currentQuestionIdx];
    const isCorrect = selectedIndex === q.correctIndex;
    const buttons = document.querySelectorAll('.btn-answer-choice');

    // Đánh dấu đúng/sai
    if (isCorrect) {
      buttonEl.classList.add('correct');
      soundEngine.playCorrect();
      this.combo++;
      if (this.combo > this.maxCombo) this.maxCombo = this.combo;

      // Tính điểm: Điểm cơ bản + Điểm tốc độ + Thưởng chuỗi Combo
      const speedBonus = this.timer * 8;
      const comboMultiplier = 1 + (this.combo - 1) * 0.25;
      const earned = Math.round((q.points + speedBonus) * comboMultiplier);
      this.score += earned;

      if (this.combo >= 2) soundEngine.playCombo(this.combo);
    } else {
      buttonEl.classList.add('wrong');
      soundEngine.playWrong();
      this.combo = 0;
      // Làm sáng đáp án đúng
      buttons[q.correctIndex].classList.add('correct');
    }

    // Cập nhật điểm người chơi trong danh sách đối kháng
    const me = this.playerList.find(p => p.isPlayer);
    if (me) me.score = this.score;

    this.updateHUD();

    // Hiển thị tư liệu lịch sử giải thích
    this.showInsight(q.insight);

    // Chuyển câu tiếp theo sau 3.5 giây để người chơi đọc hiểu lịch sử
    setTimeout(() => {
      this.playerList.forEach(p => p.hasAnsweredCurrent = false);
      this.currentQuestionIdx++;
      this.loadQuestion(this.currentQuestionIdx);
    }, 3800);
  }

  handleTimeOut(question) {
    if (this.isAnswerLocked) return;
    this.isAnswerLocked = true;
    soundEngine.playWrong();
    this.combo = 0;

    const q = this.roundQuestions ? this.roundQuestions[this.currentQuestionIdx] : question;
    const buttons = document.querySelectorAll('.btn-answer-choice');
    if (buttons[q.correctIndex]) {
      buttons[q.correctIndex].classList.add('correct');
    }

    this.updateHUD();
    this.showInsight("Hết thời gian! " + q.insight);

    setTimeout(() => {
      this.playerList.forEach(p => p.hasAnsweredCurrent = false);
      this.currentQuestionIdx++;
      this.loadQuestion(this.currentQuestionIdx);
    }, 3500);
  }

  showInsight(text) {
    const popover = document.getElementById('insight-popover');
    const body = document.getElementById('insight-text');
    if (popover && body) {
      body.innerText = text;
      popover.classList.add('visible');
    }
  }

  // Màn hình tổng kết và vinh danh
  showSummary() {
    clearInterval(this.timerInterval);
    soundEngine.playFanfare();
    this.switchScreen('summary-screen');

    document.getElementById('final-score-val').innerText = `${this.score}đ`;
    document.getElementById('final-combo-val').innerText = `x${this.maxCombo}`;
    document.getElementById('final-rank-val').innerText = `10/10 câu`;

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
  new HistoricalQuizApp();
  new ParticleAtmosphere('fx-canvas');
});
