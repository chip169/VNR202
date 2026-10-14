// Dữ liệu & Logic Mini-game: Trục Thời Gian Siêu Tốc & Giải Mã Điện Tín Lịch Sử 1930

const SPEED_TIMELINE_STAGES = [
  {
    title: "Chặng 1: Tìm Đường Cứu Nước & Chuẩn Bị Lực Lượng (1911 - 1925)",
    yearOptions: ["1911", "1917", "1919", "1920", "1923", "1924", "1925", "1926"],
    events: [
      {
        id: "ev-1911",
        year: "1911",
        title: "Khởi Đầu Hải Trình Bôn Ba Ba Đại Dương",
        desc: "Người thanh niên Nguyễn Tất Thành bước chân lên con tàu Đô đốc Latouche-Tréville rời Bến cảng Nhà Rồng ra đi tìm con đường giải phóng cho dân tộc.",
        hint: "Bến cảng Nhà Rồng (Sài Gòn) - Nghề phụ bếp Văn Ba",
        icon: "🚢"
      },
      {
        id: "ev-1917",
        year: "1917",
        title: "Ngọn Hải Đăng Cách Mạng Tháng Mười Nga",
        desc: "Thắng lợi của Cách mạng Xã hội chủ nghĩa Tháng Mười rung chuyển thế giới, mở ra thời đại mới thức tỉnh phong trào giải phóng các dân tộc thuộc địa.",
        hint: "Mùa thu nước Nga - Lãnh tụ V.I.Lênin - Quốc tế Cộng sản",
        icon: "🌍"
      },
      {
        id: "ev-1920",
        year: "1920",
        title: "Bỏ Phiếu Gia Nhập Quốc Tế III & Đọc Sơ Thảo Luận Cương",
        desc: "Tại Đại hội Tours (Pháp), Nguyễn Ái Quốc đọc Sơ thảo Luận cương của Lênin, tìm thấy con đường cứu nước duy nhất: Con đường cách mạng vô sản.",
        hint: "Thủ đô Paris (Pháp) - Báo L'Humanité (Nhân đạo)",
        icon: "📜"
      },
      {
        id: "ev-1924",
        year: "1924",
        title: "Tiếng Bom Sa Diện Vang Dội",
        desc: "Chiến sĩ anh hùng Phạm Hồng Thái ném bom mưu sát Toàn quyền Merlin rồi gieo mình xuống dòng Châu Giang, 'như cánh én nhỏ báo hiệu mùa xuân'.",
        hint: "Khách sạn Victoria - Tô giới Sa Diện (Quảng Châu)",
        icon: "⚡"
      },
      {
        id: "ev-1925",
        year: "1925",
        title: "Thành Lập Hội Việt Nam Cách Mạng Thanh Niên",
        desc: "Tổ chức tiền thân trực tiếp chuẩn bị về chính trị, tư tưởng và tổ chức cho sự ra đời của Đảng được sáng lập và xuất bản tuần báo Thanh Niên.",
        hint: "Nhóm Cộng sản đoàn làm nòng cốt - Quảng Châu",
        icon: "📰"
      }
    ]
  },
  {
    title: "Chặng 2: Bước Ngoặt Khai Sinh Chính Đảng (1927 - 1930)",
    yearOptions: ["1926", "1927", "1928", "1929", "1930", "1931"],
    events: [
      {
        id: "ev-1927",
        year: "1927",
        title: "Xuất Bản Cuốn Sách Lý Luận 'Đường Kách Mệnh'",
        desc: "Tập hợp các bài giảng huấn luyện chính trị của Nguyễn Ái Quốc, trang bị lý luận chủ nghĩa Mác - Lênin cốt lõi cho phong trào cách mạng Việt Nam.",
        hint: "Vũ khí tư tưởng gối đầu giường - Đào tạo cán bộ tại Quảng Châu",
        icon: "📖"
      },
      {
        id: "ev-1928",
        year: "1928",
        title: "Cao Trào Phong Trào 'Vô Sản Hóa'",
        desc: "Kỳ bộ Bắc Kỳ phát động chủ trương đưa cán bộ thâm nhập vào hầm mỏ than, xí nghiệp, đồn điền cùng ăn, cùng ở, cùng lao động với giai cấp công nhân.",
        hint: "Mỏ than Hòn Gai - Nhà máy xi măng Hải Phòng",
        icon: "⚒️"
      },
      {
        id: "ev-1929",
        year: "1929",
        title: "Sự Phân Hóa & Xuất Hiện Ba Tổ Chức Cộng Sản",
        desc: "Phong trào phát triển mạnh mẽ dẫn tới sự ra đời nối tiếp của Đông Dương Cộng sản Đảng, An Nam Cộng sản Đảng và Đông Dương Cộng sản Liên đoàn.",
        hint: "Chi bộ số 5D Hàm Long - Khách sạn Phong Cảnh (Sài Gòn)",
        icon: "🔥"
      },
      {
        id: "ev-1930",
        year: "1930",
        title: "Hội Nghị Hợp Nhất Thành Lập Đảng Cộng Sản Việt Nam",
        desc: "Nguyễn Ái Quốc với tư cách phái viên Quốc tế Cộng sản chủ trì Hội nghị tại bán đảo Cửu Long, thống nhất các tổ chức cộng sản thành một chính đảng duy nhất.",
        hint: "Mùa xuân lịch sử 3/2/1930 - Bán đảo Cửu Long (Hương Cảng)",
        icon: "⭐"
      }
    ]
  }
];

const CIPHER_REPORTS = [
  {
    id: "rep-1",
    hero: { id: "h1", name: "Nguyễn Ái Quốc", role: "Lãnh tụ Cách mạng", icon: "⭐" },
    event: { id: "e1", name: "Đường Kách mệnh", desc: "Tác phẩm lý luận cách mạng vô sản đầu tiên", icon: "📖" },
    locale: { id: "l1", name: "Quảng Châu (1927)", desc: "Địa bàn đào tạo lớp cán bộ cốt cán", icon: "📍" },
    summary: "Năm 1927 tại Quảng Châu, đồng chí Nguyễn Ái Quốc xuất bản 'Đường Kách mệnh', trang bị thế giới quan Mác - Lênin cho phong trào cách mạng Việt Nam."
  },
  {
    id: "rep-2",
    hero: { id: "h2", name: "Nguyễn Tất Thành", role: "Văn Ba (Phụ bếp)", icon: "🚢" },
    event: { id: "e2", name: "Tàu Latouche-Tréville", desc: "Chuyến hải trình vượt ba đại dương", icon: "🌊" },
    locale: { id: "l2", name: "Bến Nhà Rồng (1911)", desc: "Khởi đầu con đường cứu nước", icon: "📍" },
    summary: "Ngày 5/6/1911 từ Bến cảng Nhà Rồng, người thanh niên yêu nước Nguyễn Tất Thành bước lên tàu Đô đốc Latouche-Tréville ra đi tìm đường giải phóng dân tộc."
  },
  {
    id: "rep-3",
    hero: { id: "h3", name: "Phạm Hồng Thái", role: "Chiến sĩ Tâm Tâm Xã", icon: "💣" },
    event: { id: "e3", name: "Tiếng bom Sa Diện", desc: "Mưu sát Toàn quyền Merlin, tuẫn tiết sông Châu Giang", icon: "⚡" },
    locale: { id: "l3", name: "Khách sạn Victoria (1924)", desc: "Tô giới Sa Diện - Quảng Châu", icon: "📍" },
    summary: "Tháng 6/1924, người anh hùng Phạm Hồng Thái ném bom Sa Diện mưu sát Toàn quyền Merlin, hy sinh anh dũng và báo hiệu mùa xuân cách mạng."
  },
  {
    id: "rep-4",
    hero: { id: "h4", name: "Trần Phú", role: "Tổng Bí thư đầu tiên", icon: "📜" },
    event: { id: "e4", name: "Luận cương chính trị tháng 10", desc: "Xác định đường lối cách mạng tư sản dân quyền", icon: "🖋️" },
    locale: { id: "l4", name: "Hương Cảng (10/1930)", desc: "Hội nghị BCH Trung ương lâm thời", icon: "📍" },
    summary: "Tháng 10/1930 tại Hương Cảng, đồng chí Trần Phú chủ trì Hội nghị Trung ương, thông qua Luận cương chính trị và được bầu làm Tổng Bí thư đầu tiên."
  },
  {
    id: "rep-5",
    hero: { id: "h5", name: "Nguyễn Đức Cảnh", role: "Bí thư Xứ ủy Bắc Kỳ", icon: "⚒️" },
    event: { id: "e5", name: "Chủ trương 'Vô sản hóa'", desc: "Cùng ăn, cùng ở, cùng lao động với thợ thuyền", icon: "🔥" },
    locale: { id: "l5", name: "Mỏ than Hòn Gai - Hải Phòng (1928)", desc: "Trung tâm công nghiệp than & cảng biển", icon: "📍" },
    summary: "Năm 1928, đồng chí Nguyễn Đức Cảnh chỉ đạo đưa cán bộ vào các mỏ than Hòn Gai và xí nghiệp Hải Phòng, rèn luyện lập trường giai cấp công nhân."
  }
];

class MiniGameEngine {
  constructor(appRef) {
    this.app = appRef;
    
    // Speed Timeline state (Màn 1 mới: Ghim sự kiện siêu tốc)
    this.speedStageIdx = 0;
    this.speedEventIdx = 0;
    this.timelineScore = 0;
    this.speedCombo = 1;
    this.speedMaxCombo = 1;
    this.speedCountdownTimer = null;
    this.speedRemainingMs = 10000; // 10 giây
    this.isSpeedLocked = false;
    this.pinnedYears = [];
    
    // Cipher state (Màn 2)
    this.selectedHero = null;
    this.selectedEvent = null;
    this.selectedLocale = null;
    this.decodedReports = [];

    // Stopwatch & Time Tracking
    this.gameStartTime = null;
    this.stopwatchInterval = null;
    this.elapsedSeconds = 0;
  }

  formatTime(totalSec) {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  startStopwatch() {
    this.stopStopwatch();
    const updateDisplay = () => {
      if (!this.gameStartTime) return;
      this.elapsedSeconds = Math.floor((Date.now() - this.gameStartTime) / 1000);
      const str = this.formatTime(this.elapsedSeconds);
      const tlVal = document.getElementById('timeline-stopwatch-val');
      const cpVal = document.getElementById('cipher-stopwatch-val');
      if (tlVal) tlVal.innerText = str;
      if (cpVal) cpVal.innerText = str;
    };
    updateDisplay();
    this.stopwatchInterval = setInterval(updateDisplay, 1000);
  }

  stopStopwatch() {
    if (this.stopwatchInterval) {
      clearInterval(this.stopwatchInterval);
      this.stopwatchInterval = null;
    }
  }

  // ================= 1. MINI-GAME MÀN 1: GHIM DÒNG THỜI GIAN SIÊU TỐC =================
  startTimelineGame() {
    this.speedStageIdx = 0;
    this.speedEventIdx = 0;
    this.timelineScore = 0;
    this.speedCombo = 1;
    this.speedMaxCombo = 1;
    this.pinnedYears = [];
    this.isSpeedLocked = false;
    this.gameStartTime = Date.now();
    this.startStopwatch();

    this.app.switchScreen('timeline-game-screen');
    this.loadSpeedEvent();
  }

  loadSpeedEvent() {
    this.clearSpeedTimer();
    this.isSpeedLocked = false;

    const stage = SPEED_TIMELINE_STAGES[this.speedStageIdx];
    if (!stage) {
      this.finishTimelineToCipher();
      return;
    }

    if (this.speedEventIdx >= stage.events.length) {
      // Hoàn thành chặng hiện tại -> Sang chặng tiếp theo
      this.speedStageIdx++;
      this.speedEventIdx = 0;
      this.pinnedYears = [];
      if (this.speedStageIdx >= SPEED_TIMELINE_STAGES.length) {
        this.finishTimelineToCipher();
        return;
      }
      soundEngine.playFanfare();
      const banner = document.getElementById('timeline-stage-title');
      if (banner) banner.innerText = `🎉 HOÀN THÀNH CHẶNG! TIẾN VÀO CHẶNG ${this.speedStageIdx + 1}...`;
      setTimeout(() => this.loadSpeedEvent(), 1400);
      return;
    }

    const currentEvent = stage.events[this.speedEventIdx];

    // Cập nhật HUD
    const titleEl = document.getElementById('timeline-stage-title');
    const scoreEl = document.getElementById('timeline-score-val');
    const comboEl = document.getElementById('timeline-combo-val');
    const comboPill = document.getElementById('timeline-combo-pill');
    const stepEl = document.getElementById('speed-step-indicator');

    if (titleEl) titleEl.innerText = stage.title;
    if (scoreEl) scoreEl.innerText = `${this.timelineScore}đ`;
    if (comboEl) comboEl.innerText = `x${this.speedCombo}`;
    if (comboPill) comboPill.classList.toggle('combo-active', this.speedCombo > 1);
    if (stepEl) stepEl.innerText = `Sự kiện ${this.speedEventIdx + 1} / ${stage.events.length}`;

    // Cập nhật Ribbon tiến trình các mốc năm
    const ribbonEl = document.getElementById('timeline-pinned-ribbon');
    if (ribbonEl) {
      ribbonEl.innerHTML = '';
      stage.events.forEach((ev, idx) => {
        const dot = document.createElement('div');
        dot.className = 'pinned-node';
        if (idx < this.speedEventIdx) {
          dot.classList.add('completed');
          dot.innerHTML = `<span>⭐</span> <strong>${ev.year}</strong>`;
        } else if (idx === this.speedEventIdx) {
          dot.classList.add('current');
          dot.innerHTML = `<span>⏳</span> <strong>?</strong>`;
        } else {
          dot.classList.add('pending');
          dot.innerHTML = `<span>○</span> <strong>?</strong>`;
        }
        ribbonEl.appendChild(dot);
      });
    }

    // Hiển thị Thẻ sự kiện trung tâm (KHÔNG HIỆN SỐ NĂM ĐỂ TĂNG ĐỘ KHÓ)
    const cardIcon = document.getElementById('speed-card-icon');
    const cardTitle = document.getElementById('speed-event-title');
    const cardDesc = document.getElementById('speed-event-desc');
    const cardHint = document.getElementById('speed-event-hint');
    const cardEl = document.getElementById('speed-event-card');

    if (cardIcon) cardIcon.innerText = currentEvent.icon || '📜';
    if (cardTitle) cardTitle.innerText = currentEvent.title;
    if (cardDesc) cardDesc.innerText = currentEvent.desc;
    if (cardHint) cardHint.innerText = `💡 Gợi ý: ${currentEvent.hint}`;

    if (cardEl) {
      cardEl.classList.remove('card-slide-in', 'correct-pulse', 'error-shake');
      void cardEl.offsetWidth; // Trigger reflow
      cardEl.classList.add('card-slide-in');
    }

    // Render Lưới Các Mốc Năm Lựa Chọn
    const gridEl = document.getElementById('speed-years-grid');
    if (gridEl) {
      gridEl.innerHTML = '';
      stage.yearOptions.forEach(year => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'speed-year-btn';
        btn.dataset.year = year;
        btn.innerHTML = `<span>${year}</span>`;
        btn.onclick = () => this.handleSpeedYearPick(year, btn, currentEvent);
        gridEl.appendChild(btn);
      });
    }

    // Khởi động đồng hồ đếm ngược 10 giây
    this.startSpeedCountdown(currentEvent);
  }

  startSpeedCountdown(currentEvent) {
    this.clearSpeedTimer();
    const totalMs = 10000;
    this.speedRemainingMs = totalMs;

    const fillEl = document.getElementById('speed-progress-fill');
    const numEl = document.getElementById('speed-countdown-num');

    if (fillEl) {
      fillEl.style.width = '100%';
      fillEl.className = 'speed-progress-fill color-green';
    }
    if (numEl) {
      numEl.innerText = '10s';
      numEl.classList.remove('urgent');
    }

    const intervalTime = 50;
    this.speedCountdownTimer = setInterval(() => {
      this.speedRemainingMs -= intervalTime;

      if (this.speedRemainingMs <= 0) {
        this.clearSpeedTimer();
        if (fillEl) fillEl.style.width = '0%';
        if (numEl) numEl.innerText = '0s';
        this.handleSpeedTimeout(currentEvent);
        return;
      }

      const percent = (this.speedRemainingMs / totalMs) * 100;
      const secLeft = Math.ceil(this.speedRemainingMs / 1000);

      if (fillEl) {
        fillEl.style.width = `${percent}%`;
        if (secLeft > 5) {
          fillEl.className = 'speed-progress-fill color-green';
        } else if (secLeft > 2) {
          fillEl.className = 'speed-progress-fill color-yellow';
        } else {
          fillEl.className = 'speed-progress-fill color-red';
        }
      }

      if (numEl) {
        numEl.innerText = `${secLeft}s`;
        if (secLeft <= 3) numEl.classList.add('urgent');
      }
    }, intervalTime);
  }

  clearSpeedTimer() {
    if (this.speedCountdownTimer) {
      clearInterval(this.speedCountdownTimer);
      this.speedCountdownTimer = null;
    }
  }

  handleSpeedYearPick(chosenYear, btnEl, currentEvent) {
    if (this.isSpeedLocked) return;

    if (chosenYear === currentEvent.year) {
      // Ghép chính xác mốc thời gian!
      this.isSpeedLocked = true;
      this.clearSpeedTimer();
      soundEngine.playCorrect();

      // Tính điểm thưởng siêu tốc theo thời gian còn lại
      const timeBonus = Math.floor((this.speedRemainingMs / 10000) * 150);
      const earned = (150 + timeBonus) * this.speedCombo;
      this.timelineScore += earned;

      this.speedCombo++;
      if (this.speedCombo > this.speedMaxCombo) this.speedMaxCombo = this.speedCombo;

      // Cập nhật điểm HUD & Multiplayer
      const scoreEl = document.getElementById('timeline-score-val');
      const comboEl = document.getElementById('timeline-combo-val');
      if (scoreEl) scoreEl.innerText = `${this.timelineScore}đ`;
      if (comboEl) comboEl.innerText = `x${this.speedCombo}`;

      if (this.app && this.app.multiplayer) {
        this.app.multiplayer.sendScoreUpdate(this.timelineScore);
      }

      // Hiệu ứng thắng cuộc trên nút và thẻ
      btnEl.classList.add('btn-correct-glow');
      const cardEl = document.getElementById('speed-event-card');
      if (cardEl) cardEl.classList.add('correct-pulse');

      // Tự động chuyển sự kiện tiếp theo sau 1 giây
      setTimeout(() => {
        this.speedEventIdx++;
        this.loadSpeedEvent();
      }, 1000);
    } else {
      // Chọn sai mốc năm -> Cảnh báo rung lắc và trừ chuỗi combo
      soundEngine.playWrong();
      btnEl.classList.add('error-shake', 'btn-wrong');
      setTimeout(() => btnEl.classList.remove('error-shake', 'btn-wrong'), 500);

      this.speedCombo = 1;
      const comboEl = document.getElementById('timeline-combo-val');
      const comboPill = document.getElementById('timeline-combo-pill');
      if (comboEl) comboEl.innerText = `x1`;
      if (comboPill) comboPill.classList.remove('combo-active');

      this.timelineScore = Math.max(0, this.timelineScore - 40);
      const scoreEl = document.getElementById('timeline-score-val');
      if (scoreEl) scoreEl.innerText = `${this.timelineScore}đ`;
    }
  }

  handleSpeedTimeout(currentEvent) {
    if (this.isSpeedLocked) return;
    this.isSpeedLocked = true;
    soundEngine.playWrong();

    // Reset combo
    this.speedCombo = 1;
    const comboEl = document.getElementById('timeline-combo-val');
    if (comboEl) comboEl.innerText = `x1`;

    // Hiển thị mốc năm đúng để người chơi quan sát học hỏi
    const correctBtn = document.querySelector(`.speed-year-btn[data-year="${currentEvent.year}"]`);
    if (correctBtn) correctBtn.classList.add('btn-reveal-correct');

    const cardEl = document.getElementById('speed-event-card');
    if (cardEl) cardEl.classList.add('error-shake');

    setTimeout(() => {
      this.speedEventIdx++;
      this.loadSpeedEvent();
    }, 1500);
  }

  finishTimelineToCipher() {
    this.clearSpeedTimer();
    soundEngine.playFanfare();
    const banner = document.getElementById('timeline-stage-title');
    if (banner) banner.innerText = "🎉 HOÀN THÀNH MÀN 1! TIẾN VÀO MÀN 2: GIẢI MÃ ĐIỆN TÍN CỬU LONG";
    setTimeout(() => {
      this.startCipherGame();
    }, 1800);
  }

  // ================= 2. MINI-GAME: GIẢI MÃ ĐIỆN TÍN =================
  startCipherGame() {
    this.decodedReports = [];
    this.selectedHero = null;
    this.selectedEvent = null;
    this.selectedLocale = null;
    this.activeCipherTab = 'heroes';
    this.app.switchScreen('cipher-game-screen');
    this.initCipherTabs();
    this.renderCipherColumns();
  }

  initCipherTabs() {
    const tabBtns = document.querySelectorAll('.cipher-tab-btn');
    tabBtns.forEach(btn => {
      btn.onclick = () => {
        soundEngine.playClick();
        const tab = btn.dataset.tab;
        this.switchCipherTab(tab);
      };
    });
  }

  switchCipherTab(tabName) {
    this.activeCipherTab = tabName;
    document.querySelectorAll('.cipher-tab-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tabName);
    });

    const colMap = {
      heroes: 'col-card-heroes',
      events: 'col-card-events',
      locales: 'col-card-locales'
    };

    ['heroes', 'events', 'locales'].forEach(t => {
      const el = document.getElementById(colMap[t]);
      if (el) {
        if (t === tabName) {
          el.classList.add('active');
        } else {
          el.classList.remove('active');
        }
      }
    });
  }

  updateCipherMatchBar() {
    const valHero = document.getElementById('match-val-hero');
    const chipHero = document.getElementById('match-chip-hero');
    const dotHero = document.getElementById('tab-dot-heroes');

    const valEvent = document.getElementById('match-val-event');
    const chipEvent = document.getElementById('match-chip-event');
    const dotEvent = document.getElementById('tab-dot-events');

    const valLocale = document.getElementById('match-val-locale');
    const chipLocale = document.getElementById('match-chip-locale');
    const dotLocale = document.getElementById('tab-dot-locales');

    // Hero
    if (this.selectedHero) {
      const rep = CIPHER_REPORTS.find(r => r.id === this.selectedHero);
      if (valHero) valHero.innerText = rep ? rep.hero.name : 'Đã chọn';
      if (chipHero) chipHero.classList.add('has-val');
      if (dotHero) dotHero.classList.add('active');
    } else {
      if (valHero) valHero.innerText = 'Chưa chọn';
      if (chipHero) chipHero.classList.remove('has-val');
      if (dotHero) dotHero.classList.remove('active');
    }

    // Event
    if (this.selectedEvent) {
      const rep = CIPHER_REPORTS.find(r => r.id === this.selectedEvent);
      if (valEvent) valEvent.innerText = rep ? rep.event.name : 'Đã chọn';
      if (chipEvent) chipEvent.classList.add('has-val');
      if (dotEvent) dotEvent.classList.add('active');
    } else {
      if (valEvent) valEvent.innerText = 'Chưa chọn';
      if (chipEvent) chipEvent.classList.remove('has-val');
      if (dotEvent) dotEvent.classList.remove('active');
    }

    // Locale
    if (this.selectedLocale) {
      const rep = CIPHER_REPORTS.find(r => r.id === this.selectedLocale);
      if (valLocale) valLocale.innerText = rep ? rep.locale.name : 'Đã chọn';
      if (chipLocale) chipLocale.classList.add('has-val');
      if (dotLocale) dotLocale.classList.add('active');
    } else {
      if (valLocale) valLocale.innerText = 'Chưa chọn';
      if (chipLocale) chipLocale.classList.remove('has-val');
      if (dotLocale) dotLocale.classList.remove('active');
    }
  }

  renderCipherColumns() {
    const heroesCol = document.getElementById('cipher-col-heroes');
    const eventsCol = document.getElementById('cipher-col-events');
    const localesCol = document.getElementById('cipher-col-locales');
    const feedEl = document.getElementById('cipher-decoded-feed');

    heroesCol.innerHTML = '';
    eventsCol.innerHTML = '';
    localesCol.innerHTML = '';
    feedEl.innerHTML = '';

    this.selectedHero = null;
    this.selectedEvent = null;
    this.selectedLocale = null;
    this.updateCipherMatchBar();
    this.switchCipherTab('heroes');

    // Lấy các thẻ chưa giải mã
    const activeData = CIPHER_REPORTS.filter(r => !this.decodedReports.includes(r.id));
    document.getElementById('cipher-remaining-badge').innerText = `Còn ${activeData.length} Bức Điện Mật`;

    if (activeData.length === 0) {
      // Đã giải mã thành công tất cả 5 bức điện mật!
      this.finishAllMiniGames();
      return;
    }

    // Xáo trộn từng cột độc lập
    const heroes = [...activeData.map(r => ({ ...r.hero, repId: r.id }))].sort(() => 0.5 - Math.random());
    const events = [...activeData.map(r => ({ ...r.event, repId: r.id }))].sort(() => 0.5 - Math.random());
    const locales = [...activeData.map(r => ({ ...r.locale, repId: r.id }))].sort(() => 0.5 - Math.random());

    // Render Cột 1: Nhân Vật
    heroes.forEach(h => {
      const item = document.createElement('div');
      item.className = 'cipher-card-item hero-item';
      item.dataset.repId = h.repId;
      item.innerHTML = `
        <span class="cipher-icon">${h.icon}</span>
        <div class="cipher-text-meta">
          <strong>${h.name}</strong>
          <small>${h.role}</small>
        </div>
      `;
      item.addEventListener('click', () => this.selectCipherCard('hero', h.repId, item));
      heroesCol.appendChild(item);
    });

    // Render Cột 2: Sự Kiện / Tác Phẩm
    events.forEach(e => {
      const item = document.createElement('div');
      item.className = 'cipher-card-item event-item';
      item.dataset.repId = e.repId;
      item.innerHTML = `
        <span class="cipher-icon">${e.icon}</span>
        <div class="cipher-text-meta">
          <strong>${e.name}</strong>
          <small>${e.desc}</small>
        </div>
      `;
      item.addEventListener('click', () => this.selectCipherCard('event', e.repId, item));
      eventsCol.appendChild(item);
    });

    // Render Cột 3: Địa Bàn
    locales.forEach(l => {
      const item = document.createElement('div');
      item.className = 'cipher-card-item locale-item';
      item.dataset.repId = l.repId;
      item.innerHTML = `
        <span class="cipher-icon">${l.icon}</span>
        <div class="cipher-text-meta">
          <strong>${l.name}</strong>
          <small>${l.desc}</small>
        </div>
      `;
      item.addEventListener('click', () => this.selectCipherCard('locale', l.repId, item));
      localesCol.appendChild(item);
    });
  }

  selectCipherCard(type, repId, el) {
    soundEngine.playClick();

    if (type === 'hero') {
      document.querySelectorAll('#cipher-col-heroes .cipher-card-item').forEach(c => c.classList.remove('selected'));
      this.selectedHero = this.selectedHero === repId ? null : repId;
      if (this.selectedHero) {
        el.classList.add('selected');
        // Tự động chuyển tab tiếp theo trên mobile để người chơi không phải cuộn trang
        setTimeout(() => this.switchCipherTab('events'), 220);
      }
    } else if (type === 'event') {
      document.querySelectorAll('#cipher-col-events .cipher-card-item').forEach(c => c.classList.remove('selected'));
      this.selectedEvent = this.selectedEvent === repId ? null : repId;
      if (this.selectedEvent) {
        el.classList.add('selected');
        // Tự động chuyển tab địa bàn tiếp theo trên mobile
        setTimeout(() => this.switchCipherTab('locales'), 220);
      }
    } else if (type === 'locale') {
      document.querySelectorAll('#cipher-col-locales .cipher-card-item').forEach(c => c.classList.remove('selected'));
      this.selectedLocale = this.selectedLocale === repId ? null : repId;
      if (this.selectedLocale) el.classList.add('selected');
    }

    this.updateCipherMatchBar();

    // Khi người chơi đã chọn cả 3 cột -> Kiểm tra khớp logic
    if (this.selectedHero && this.selectedEvent && this.selectedLocale) {
      this.verifyTriadMatch();
    }
  }

  verifyTriadMatch() {
    const matchBar = document.getElementById('cipher-match-bar');

    if (this.selectedHero === this.selectedEvent && this.selectedEvent === this.selectedLocale) {
      // Khớp chính xác bức điện mật!
      const matchedRepId = this.selectedHero;
      const rep = CIPHER_REPORTS.find(r => r.id === matchedRepId);
      soundEngine.playCorrect();
      this.decodedReports.push(matchedRepId);
      this.timelineScore += 250;
      if (this.app && this.app.multiplayer) {
        this.app.multiplayer.sendScoreUpdate(this.timelineScore);
      }

      if (matchBar) matchBar.classList.add('matched-success');

      // Highlight các thẻ đúng
      document.querySelectorAll(`[data-rep-id="${matchedRepId}"]`).forEach(el => {
        el.classList.add('matched-success');
      });

      // Thêm vào danh mục Báo cáo đã giải mã
      const feedEl = document.getElementById('cipher-decoded-feed');
      const badge = document.createElement('div');
      badge.className = 'decoded-report-card';
      badge.innerHTML = `
        <div class="report-stamp">⭐ ĐÃ GIẢI MÃ</div>
        <p><strong>[${rep.hero.name}] + [${rep.event.name}] + [${rep.locale.name}]:</strong> ${rep.summary}</p>
      `;
      feedEl.prepend(badge);

      setTimeout(() => {
        if (matchBar) matchBar.classList.remove('matched-success');
        this.renderCipherColumns();
      }, 1200);
    } else {
      // Không khớp logic -> Rung lắc và đặt lại
      soundEngine.playWrong();
      if (matchBar) matchBar.classList.add('error-shake');
      const selectedEls = document.querySelectorAll('.cipher-card-item.selected');
      selectedEls.forEach(el => el.classList.add('error-shake'));

      setTimeout(() => {
        if (matchBar) matchBar.classList.remove('error-shake');
        selectedEls.forEach(el => el.classList.remove('error-shake', 'selected'));
        this.selectedHero = null;
        this.selectedEvent = null;
        this.selectedLocale = null;
        this.updateCipherMatchBar();
        this.switchCipherTab('heroes');
      }, 600);
    }
  }

  finishAllMiniGames() {
    soundEngine.playFanfare();
    this.stopStopwatch();

    // Tính chính xác thời gian hoàn thành
    const totalSec = Math.max(1, Math.floor((Date.now() - (this.gameStartTime || Date.now())) / 1000));
    const formattedTime = this.formatTime(totalSec);

    // Tính điểm thưởng tốc độ (Speed Bonus)
    let speedBonus = 50;
    if (totalSec <= 60) {
      speedBonus = 600;
    } else if (totalSec <= 90) {
      speedBonus = 450;
    } else if (totalSec <= 120) {
      speedBonus = 300;
    } else if (totalSec <= 180) {
      speedBonus = 150;
    }

    const totalFinalScore = this.timelineScore + speedBonus;
    this.app.score = totalFinalScore;

    // Báo cáo hoàn thành lên máy chủ / phòng multiplayer nếu có
    if (this.app && this.app.multiplayer) {
      this.app.multiplayer.sendPlayerFinished({
        score: totalFinalScore,
        timeSeconds: totalSec,
        formattedTime: formattedTime
      });
    }

    // Hiển thị màn hình tổng kết & bảng vinh danh
    this.app.showSummary({
      score: totalFinalScore,
      rawScore: this.timelineScore,
      speedBonus: speedBonus,
      timeSeconds: totalSec,
      formattedTime: formattedTime
    });

    this.gameStartTime = null;
  }
}
