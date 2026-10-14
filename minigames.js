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

    // Endless Arena State (Đấu trường 10 phút vô tận)
    this.questionQueue = [];
    this.currentQuestion = null;
    this.questionIndex = 0;
    this.timelineScore = 0;
    this.speedCombo = 1;
    this.speedMaxCombo = 1;
    this.streakCount = 0;
    this.recentResults = []; // Lưu 8 kết quả gần nhất cho Ribbon tiến trình

    // Countdown & Timers
    this.speedCountdownTimer = null;
    this.speedRemainingMs = 12000; // 12 giây mỗi câu
    this.questionTotalMs = 12000;
    this.isSpeedLocked = false;
    this.freezeTimer = null;

    // Master 10-Minute Room Timer
    this.gameStartTime = null;
    this.gameEndTime = null;
    this.masterTimer = null;
    this.remainingMasterSeconds = 600; // Mặc định 10 phút (600 giây)

    // Cipher state (Màn 2 hỗ trợ dự phòng)
    this.selectedHero = null;
    this.selectedEvent = null;
    this.selectedLocale = null;
    this.decodedReports = [];
  }

  formatTime(totalSec) {
    const mins = Math.floor(Math.max(0, totalSec) / 60);
    const secs = Math.max(0, totalSec) % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  getFormattedTime() {
    if (!this.gameStartTime) return "00:00";
    const elapsed = Math.floor((Date.now() - this.gameStartTime) / 1000);
    return this.formatTime(elapsed);
  }

  stopStopwatch() {
    this.stopMasterTimer();
  }

  getMultiplier() {
    if (this.streakCount >= 12) return 3.0;
    if (this.streakCount >= 8) return 2.5;
    if (this.streakCount >= 5) return 2.0;
    if (this.streakCount >= 3) return 1.5;
    return 1.0;
  }

  getRankTitle(score) {
    if (score >= 3000) {
      return { icon: "👑", title: "Lãnh Tụ Cửu Long", class: "rank-gold" };
    }
    if (score >= 1500) {
      return { icon: "📜", title: "Ủy Viên Hiệp Thương", class: "rank-cyan" };
    }
    if (score >= 500) {
      return { icon: "⚔️", title: "Chiến Sĩ Tiên Phong", class: "rank-bronze" };
    }
    return { icon: "🎖️", title: "Tân Đại Biểu", class: "" };
  }

  // Khởi tạo hàng đợi câu hỏi vô hạn (Endless Queue)
  initQuestionQueue() {
    this.questionQueue = [];
    this.refillQuestionQueue();
  }

  // Bổ sung và xáo trộn câu hỏi từ ngân hàng 100 câu & timeline
  refillQuestionQueue() {
    const pool = [];

    // 1. Thêm các sự kiện Dòng thời gian mốc năm (Timeline Year Events)
    if (typeof SPEED_TIMELINE_STAGES !== 'undefined') {
      SPEED_TIMELINE_STAGES.forEach(stage => {
        stage.events.forEach(ev => {
          pool.push({
            type: 'timeline',
            id: ev.id || `ev-${ev.year}`,
            badge: '📜 DÒNG THỜI GIAN LỊCH SỬ',
            icon: ev.icon || '⏳',
            title: ev.title,
            desc: ev.desc,
            hint: ev.hint || '',
            correctYear: ev.year,
            yearOptions: stage.yearOptions || ["1911", "1917", "1920", "1924", "1925", "1927", "1928", "1929", "1930"]
          });
        });
      });
    }

    // 2. Thêm toàn bộ các câu hỏi trắc nghiệm lịch sử Đảng phong phú từ questions.js
    if (typeof HISTORICAL_QUESTIONS !== 'undefined' && Array.isArray(HISTORICAL_QUESTIONS)) {
      HISTORICAL_QUESTIONS.forEach(q => {
        pool.push({
          type: 'quiz',
          id: `quiz-${q.id}`,
          badge: '⭐ TRI THỨC LỊCH SỬ ĐẢNG 1930',
          icon: '⭐',
          title: q.question,
          desc: q.era || 'Hội nghị thành lập Đảng & Bối cảnh cách mạng',
          hint: q.insight ? (q.insight.length > 90 ? q.insight.substring(0, 88) + '...' : q.insight) : 'Chọn 1 trong 4 phương án đúng',
          options: q.options,
          correctIndex: q.correctIndex
        });
      });
    }

    // Xáo trộn ngẫu nhiên (Fisher-Yates Shuffle)
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    this.questionQueue.push(...pool);
  }

  // ================= 1. BẮT ĐẦU ĐẤU TRƯỜNG 10 PHÚT VÔ TẬN =================
  startTimelineGame() {
    this.timelineScore = 0;
    this.speedCombo = 1;
    this.speedMaxCombo = 1;
    this.streakCount = 0;
    this.questionIndex = 0;
    this.recentResults = [];
    this.isSpeedLocked = false;
    this.gameStartTime = Date.now();

    // Đồng bộ thời gian 10 phút theo phòng (nếu có multiplayer host phát endAt)
    if (this.app && this.app.multiplayer && this.app.multiplayer.gameEndAt && this.app.multiplayer.gameEndAt > Date.now()) {
      this.gameEndTime = this.app.multiplayer.gameEndAt;
      this.remainingMasterSeconds = Math.max(10, Math.floor((this.gameEndTime - Date.now()) / 1000));
    } else {
      this.remainingMasterSeconds = 600; // 10 phút mặc định
      this.gameEndTime = Date.now() + 600000;
    }

    this.initQuestionQueue();
    this.startMasterCountdown();

    this.app.switchScreen('timeline-game-screen');
    this.updateHUD();
    this.loadNextQuestion();
  }

  // Vòng lặp đếm ngược 10 phút xuyên suốt màn chơi
  startMasterCountdown() {
    this.stopMasterTimer();
    const updateDisplay = () => {
      const now = Date.now();
      const secLeft = Math.max(0, Math.floor((this.gameEndTime - now) / 1000));
      this.remainingMasterSeconds = secLeft;
      const str = this.formatTime(secLeft);

      const tlVal = document.getElementById('timeline-stopwatch-val');
      const cpVal = document.getElementById('cipher-stopwatch-val');
      if (tlVal) tlVal.innerText = str;
      if (cpVal) cpVal.innerText = str;

      // Khi đếm về 00:00 -> Tự động kết thúc trận đấu và xuất bảng xếp hạng
      if (secLeft <= 0) {
        this.stopMasterTimer();
        this.clearSpeedTimer();
        this.finishAllMiniGames();
      }
    };

    updateDisplay();
    this.masterTimer = setInterval(updateDisplay, 1000);
  }

  stopMasterTimer() {
    if (this.masterTimer) {
      clearInterval(this.masterTimer);
      this.masterTimer = null;
    }
  }

  // Tải câu hỏi tiếp theo
  loadNextQuestion() {
    this.clearSpeedTimer();
    this.isSpeedLocked = false;

    // Đảm bảo hàng đợi luôn có câu hỏi vô tận
    if (this.questionQueue.length < 5) {
      this.refillQuestionQueue();
    }

    const currentItem = this.questionQueue.shift();
    this.currentQuestion = currentItem;
    this.questionIndex++;

    this.updateHUD();
    this.renderQuestionCard(currentItem);
    this.renderOptions(currentItem);
    this.startQuestionCountdown(currentItem);
  }

  // Cập nhật giao diện HUD (Điểm, Combo, Cấp bậc, Ribbon)
  updateHUD() {
    const scoreEl = document.getElementById('timeline-score-val');
    const comboEl = document.getElementById('timeline-combo-val');
    const comboPill = document.getElementById('timeline-combo-pill');
    const stepEl = document.getElementById('speed-step-indicator');
    const rankChip = document.getElementById('player-rank-chip');
    const rankIcon = document.getElementById('player-rank-icon');
    const rankName = document.getElementById('player-rank-name');

    if (scoreEl) scoreEl.innerText = `${this.timelineScore.toLocaleString()}đ`;

    const mult = this.getMultiplier();
    if (comboEl) comboEl.innerText = `x${mult}`;

    if (comboPill) {
      comboPill.classList.toggle('combo-active', this.streakCount >= 2);
      comboPill.classList.toggle('combo-fire', this.streakCount >= 5);
      comboPill.classList.toggle('combo-lightning', this.streakCount >= 8);
    }

    if (stepEl) {
      stepEl.innerText = `Câu ${this.questionIndex} (Chuỗi đúng: ${this.streakCount})`;
    }

    // Cập nhật Danh hiệu đại biểu theo điểm số
    const rank = this.getRankTitle(this.timelineScore);
    if (rankIcon) rankIcon.innerText = rank.icon;
    if (rankName) rankName.innerText = rank.title;
    if (rankChip) {
      rankChip.className = `player-rank-chip ${rank.class}`;
    }
  }

  // Kết xuất Thẻ Thử Thách Trung Tâm
  renderQuestionCard(item) {
    const cardBadge = document.getElementById('speed-card-badge');
    const cardIcon = document.getElementById('speed-card-icon');
    const cardTitle = document.getElementById('speed-event-title');
    const cardDesc = document.getElementById('speed-event-desc');
    const cardEl = document.getElementById('speed-event-card');

    if (cardBadge) cardBadge.innerText = item.badge || '📜 THỬ THÁCH TRI THỨC';
    if (cardIcon) cardIcon.innerText = item.icon || '⭐';
    if (cardTitle) cardTitle.innerText = item.title;
    if (cardDesc) cardDesc.innerText = item.desc;

    if (cardEl) {
      cardEl.classList.remove('card-slide-in', 'correct-pulse', 'error-shake');
      void cardEl.offsetWidth; // Force reflow
      cardEl.classList.add('card-slide-in');
    }
  }

  // Kết xuất các nút lựa chọn (Hỗ trợ cả Timeline Year buttons & Trắc nghiệm 4 đáp án A-B-C-D)
  renderOptions(item) {
    const gridEl = document.getElementById('speed-years-grid');
    const promptEl = document.getElementById('speed-options-prompt');
    if (!gridEl) return;

    gridEl.innerHTML = '';

    if (item.type === 'timeline') {
      // Dạng 1: Ghim năm diễn ra sự kiện
      gridEl.classList.remove('quiz-options-mode');
      if (promptEl) promptEl.innerText = '👇 CHẠM NHANH VÀO NĂM DIỄN RA SỰ KIỆN:';

      const years = item.yearOptions || ["1911", "1917", "1920", "1924", "1925", "1927", "1928", "1929", "1930"];
      years.forEach(year => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'speed-year-btn';
        btn.dataset.year = year;
        btn.innerHTML = `<span>${year}</span>`;
        btn.onclick = () => this.handleOptionPick(year === item.correctYear, btn, item);
        gridEl.appendChild(btn);
      });
    } else {
      // Dạng 2: Câu hỏi trắc nghiệm 4 phương án A - B - C - D
      gridEl.classList.add('quiz-options-mode');
      if (promptEl) promptEl.innerText = '👇 CHẠM VÀO ĐÁP ÁN ĐÚNG NHẤT:';

      const letters = ['A', 'B', 'C', 'D'];
      item.options.forEach((optText, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quiz-opt-btn';
        btn.dataset.index = idx;
        btn.innerHTML = `
          <span class="quiz-opt-letter">${letters[idx]}</span>
          <span class="quiz-opt-text">${optText}</span>
        `;
        btn.onclick = () => this.handleOptionPick(idx === item.correctIndex, btn, item);
        gridEl.appendChild(btn);
      });
    }
  }

  // Khởi động đếm ngược 12 giây cho câu hỏi
  startQuestionCountdown(item) {
    this.clearSpeedTimer();
    this.questionTotalMs = 12000;
    this.speedRemainingMs = this.questionTotalMs;

    const fillEl = document.getElementById('speed-progress-fill');
    const numEl = document.getElementById('speed-countdown-num');

    if (fillEl) {
      fillEl.style.width = '100%';
      fillEl.className = 'speed-progress-fill color-green';
    }
    if (numEl) {
      numEl.innerText = '12s';
      numEl.classList.remove('urgent');
    }

    const intervalTime = 50;
    this.speedCountdownTimer = setInterval(() => {
      this.speedRemainingMs -= intervalTime;

      if (this.speedRemainingMs <= 0) {
        this.clearSpeedTimer();
        if (fillEl) fillEl.style.width = '0%';
        if (numEl) numEl.innerText = '0s';
        this.handleQuestionTimeout(item);
        return;
      }

      const percent = (this.speedRemainingMs / this.questionTotalMs) * 100;
      const secLeft = Math.ceil(this.speedRemainingMs / 1000);

      if (fillEl) {
        fillEl.style.width = `${percent}%`;
        if (secLeft > 6) {
          fillEl.className = 'speed-progress-fill color-green';
        } else if (secLeft > 3) {
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

  // Xử lý khi người chơi bấm chọn đáp án
  handleOptionPick(isCorrect, btnEl, item) {
    if (this.isSpeedLocked) return;
    this.isSpeedLocked = true;
    this.clearSpeedTimer();

    if (isCorrect) {
      // TRẢ LỜI ĐÚNG!
      soundEngine.playCorrect();

      // Điểm cơ bản 100đ + Thưởng tốc độ theo thời gian còn lại (tối đa 100đ)
      const timeBonus = Math.floor((this.speedRemainingMs / this.questionTotalMs) * 100);
      const mult = this.getMultiplier();
      const earned = Math.round((100 + timeBonus) * mult);
      this.timelineScore += earned;

      this.streakCount++;
      if (this.streakCount > this.speedMaxCombo) this.speedMaxCombo = this.streakCount;

      this.recentResults.push({ status: 'correct', label: item.type === 'timeline' ? item.correctYear : 'ĐÚNG' });

      // Hiệu ứng phát sáng trên nút bấm và thẻ câu hỏi
      btnEl.classList.add('btn-correct-glow');
      const cardEl = document.getElementById('speed-event-card');
      if (cardEl) cardEl.classList.add('correct-pulse');

      // Đồng bộ điểm thời gian thực tới phòng máy chiếu qua MQTT
      if (this.app && this.app.multiplayer) {
        this.app.multiplayer.sendScoreUpdate(this.timelineScore);
      }

      this.updateHUD();

      // Chuyển câu tiếp theo sau 0.75 giây
      setTimeout(() => {
        this.loadNextQuestion();
      }, 750);
    } else {
      // TRẢ LỜI SAI -> KÍCH HOẠT HÌNH PHẠT ĐÓNG BĂNG 3S (ANTI-SPAM)
      soundEngine.playWrong();
      btnEl.classList.add('btn-wrong', 'error-shake');

      // Trừ điểm và xóa chuỗi combo
      this.timelineScore = Math.max(0, this.timelineScore - 80);
      this.streakCount = 0;
      this.recentResults.push({ status: 'wrong', label: 'SAI' });

      if (this.app && this.app.multiplayer) {
        this.app.multiplayer.sendScoreUpdate(this.timelineScore);
      }

      this.updateHUD();

      // Kích hoạt bảng đóng băng phạt 3 giây
      this.triggerFreezePenalty(item);
    }
  }

  // Cơ chế đóng băng phạt 3 giây ngăn chặn triệt để hành vi spam đoán mò
  triggerFreezePenalty(item) {
    const overlay = document.getElementById('freeze-overlay');
    const cdVal = document.getElementById('freeze-countdown-val');
    if (overlay) overlay.style.display = 'flex';

    let freezeSeconds = 3;
    if (cdVal) cdVal.innerText = `${freezeSeconds}s`;

    clearInterval(this.freezeTimer);
    this.freezeTimer = setInterval(() => {
      freezeSeconds--;
      if (cdVal) cdVal.innerText = `${freezeSeconds}s`;

      if (freezeSeconds <= 0) {
        clearInterval(this.freezeTimer);
        if (overlay) overlay.style.display = 'none';
        // Hết thời gian phạt -> Lập tức chuyển sang câu hỏi mới để không thể spam lại câu cũ
        this.loadNextQuestion();
      }
    }, 1000);
  }

  // Xử lý khi hết thời gian 12 giây mà chưa chọn
  handleQuestionTimeout(item) {
    if (this.isSpeedLocked) return;
    this.isSpeedLocked = true;
    soundEngine.playWrong();

    this.streakCount = 0;
    this.recentResults.push({ status: 'wrong', label: 'HẾT GIỜ' });
    this.updateHUD();

    // Rung lắc thẻ và hiển thị đáp án đúng để học tập
    const cardEl = document.getElementById('speed-event-card');
    if (cardEl) cardEl.classList.add('error-shake');

    if (item.type === 'timeline') {
      const correctBtn = document.querySelector(`.speed-year-btn[data-year="${item.correctYear}"]`);
      if (correctBtn) correctBtn.classList.add('btn-reveal-correct');
    } else {
      const correctBtn = document.querySelector(`.quiz-opt-btn[data-index="${item.correctIndex}"]`);
      if (correctBtn) correctBtn.classList.add('btn-reveal-correct');
    }

    setTimeout(() => {
      this.loadNextQuestion();
    }, 1200);
  }

  // Kết thúc lượt đấu khi hết 10 phút hoặc Host phát lệnh kết thúc sớm
  finishAllMiniGames() {
    this.clearSpeedTimer();
    this.stopMasterTimer();
    clearInterval(this.freezeTimer);
    const overlay = document.getElementById('freeze-overlay');
    if (overlay) overlay.style.display = 'none';

    soundEngine.playFanfare();

    const totalSec = Math.max(1, Math.floor((Date.now() - (this.gameStartTime || Date.now())) / 1000));
    const formattedTime = this.formatTime(totalSec);

    const totalFinalScore = this.timelineScore;
    this.app.score = totalFinalScore;

    // Báo cáo hoàn thành lên máy chủ / phòng thi đấu
    if (this.app && this.app.multiplayer) {
      this.app.multiplayer.sendPlayerFinished({
        score: totalFinalScore,
        timeSeconds: totalSec,
        formattedTime: formattedTime
      });
    }

    // Hiển thị màn hình vinh danh & kết quả cá nhân
    this.app.showSummary({
      score: totalFinalScore,
      rawScore: totalFinalScore,
      speedBonus: 0,
      timeSeconds: totalSec,
      formattedTime: formattedTime
    });

    this.gameStartTime = null;
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
