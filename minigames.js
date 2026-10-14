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
    locale: { id: "l1", name: "Năm 1927 - Quảng Châu", desc: "Địa bàn huấn luyện chính trị (1927)", icon: "📅" },
    summary: "Năm 1927 tại Quảng Châu, đồng chí Nguyễn Ái Quốc xuất bản 'Đường Kách mệnh', trang bị thế giới quan Mác - Lênin cho phong trào cách mạng Việt Nam."
  },
  {
    id: "rep-2",
    hero: { id: "h2", name: "Nguyễn Tất Thành", role: "Văn Ba (Phụ bếp)", icon: "🚢" },
    event: { id: "e2", name: "Tàu Latouche-Tréville", desc: "Chuyến hải trình vượt ba đại dương", icon: "🌊" },
    locale: { id: "l2", name: "Năm 1911 - Bến Nhà Rồng", desc: "Khởi đầu con đường cứu nước (1911)", icon: "📅" },
    summary: "Ngày 5/6/1911 từ Bến cảng Nhà Rồng, người thanh niên yêu nước Nguyễn Tất Thành bước lên tàu Đô đốc Latouche-Tréville ra đi tìm đường giải phóng dân tộc."
  },
  {
    id: "rep-3",
    hero: { id: "h3", name: "Phạm Hồng Thái", role: "Chiến sĩ Tâm Tâm Xã", icon: "💣" },
    event: { id: "e3", name: "Tiếng bom Sa Diện", desc: "Mưu sát Toàn quyền Merlin, tuẫn tiết sông Châu Giang", icon: "⚡" },
    locale: { id: "l3", name: "Năm 1924 - Sa Diện (Quảng Châu)", desc: "Khách sạn Victoria Sa Diện (1924)", icon: "📅" },
    summary: "Tháng 6/1924, người anh hùng Phạm Hồng Thái ném bom Sa Diện mưu sát Toàn quyền Merlin, hy sinh anh dũng và báo hiệu mùa xuân cách mạng."
  },
  {
    id: "rep-4",
    hero: { id: "h4", name: "Trần Phú", role: "Tổng Bí thư đầu tiên", icon: "📜" },
    event: { id: "e4", name: "Luận cương chính trị tháng 10", desc: "Xác định đường lối cách mạng tư sản dân quyền", icon: "🖋️" },
    locale: { id: "l4", name: "Năm 1930 - Hương Cảng", desc: "Hội nghị BCH Trung ương lâm thời (10/1930)", icon: "📅" },
    summary: "Tháng 10/1930 tại Hương Cảng, đồng chí Trần Phú chủ trì Hội nghị Trung ương, thông qua Luận cương chính trị và được bầu làm Tổng Bí thư đầu tiên."
  },
  {
    id: "rep-5",
    hero: { id: "h5", name: "Nguyễn Đức Cảnh", role: "Bí thư Xứ ủy Bắc Kỳ", icon: "⚒️" },
    event: { id: "e5", name: "Chủ trương 'Vô sản hóa'", desc: "Cùng ăn, cùng ở, cùng lao động với thợ thuyền", icon: "🔥" },
    locale: { id: "l5", name: "Năm 1928 - Mỏ than Hòn Gai", desc: "Trung tâm mỏ than & xí nghiệp Hải Phòng (1928)", icon: "📅" },
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
    this.transitionInterval = null;

    // Master Room Timer (5 phút mỗi chặng)
    this.matchStartTime = null; // Thời điểm bắt đầu toàn bộ trận đấu
    this.gameStartTime = null;
    this.gameEndTime = null;
    this.masterTimer = null;
    this.remainingMasterSeconds = 300; // Mặc định 5 phút (300 giây)
    this.finalFormattedTime = null;
    this.finalTimeSeconds = null;

    // Cipher state (Màn 2 hỗ trợ dự phòng)
    this.selectedHero = null;
    this.selectedEvent = null;
    this.selectedLocale = null;
    this.decodedReports = [];

    // Mystery Gift Power-ups
    this.hasShield = false; // Khiên bảo vệ chống đóng băng
    this.nextQuestionDouble = false; // Nhân đôi điểm câu kế

    // Tự động lưu tiến trình và điểm số khi đóng tab/rời trang
    window.addEventListener('beforeunload', () => this.savePlayerState());
    window.addEventListener('pagehide', () => this.savePlayerState());
  }

  // Lưu trạng thái và điểm số của người chơi vào LocalStorage
  savePlayerState() {
    try {
      const room = this.app?.multiplayer?.roomId || '1930-VN';
      const state = {
        roomId: room,
        score: this.timelineScore,
        streakCount: this.streakCount,
        speedMaxCombo: this.speedMaxCombo,
        questionIndex: this.questionIndex,
        stage: this.app?.currentScreen === 'cipher-game-screen' ? 'cipher' : 'timeline',
        timestamp: Date.now()
      };
      localStorage.setItem('vnr202_current_player_state', JSON.stringify(state));

      // Tự động lưu hoặc cập nhật ngay vào Bảng Vàng kỷ lục (Hall of Fame) để thoát giữa chừng vẫn lưu điểm
      if (this.timelineScore > 0 && this.app && typeof this.app.saveOrUpdateHallOfFame === 'function') {
        const elapsedSec = Math.max(1, Math.floor((Date.now() - (this.gameStartTime || Date.now())) / 1000));
        this.app.saveOrUpdateHallOfFame({
          name: this.app.multiplayer?.playerName || 'Đại biểu',
          avatar: this.app.multiplayer?.playerAvatar || '⭐',
          score: this.timelineScore,
          timeSeconds: elapsedSec,
          formattedTime: this.formatTime(elapsedSec),
          date: new Date().toLocaleDateString('vi-VN'),
          isCurrentPlayer: true,
          note: 'Đã lưu điểm trực tiếp'
        });
      }
    } catch (e) {
      console.warn('Lỗi lưu trạng thái người chơi:', e);
    }
  }

  formatTime(totalSec) {
    const mins = Math.floor(Math.max(0, totalSec) / 60);
    const secs = Math.max(0, totalSec) % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  getFormattedTime() {
    if (this.finalFormattedTime) return this.finalFormattedTime;
    const start = this.matchStartTime || this.gameStartTime;
    if (!start) return "00:00";
    const elapsed = Math.max(1, Math.floor((Date.now() - start) / 1000));
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

  // Bổ sung và xáo trộn câu hỏi từ ngân hàng 100 câu trắc nghiệm A - B - C - D vô hạn
  refillQuestionQueue() {
    const pool = [];

    // Chặng 1 giữ nguyên CHỈ toàn bộ các câu hỏi trắc nghiệm A, B, C, D từ questions.js
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
    // Phục hồi điểm số nếu người chơi vô tình F5, refresh hoặc vào lại cùng phòng
    let restoredScore = 0;
    try {
      const savedState = JSON.parse(localStorage.getItem('vnr202_current_player_state') || '{}');
      const curRoom = this.app?.multiplayer?.roomId || '1930-VN';
      if (savedState.roomId === curRoom && typeof savedState.score === 'number' && (Date.now() - (savedState.timestamp || 0)) < 1800000) {
        restoredScore = savedState.score;
        this.speedMaxCombo = savedState.speedMaxCombo || 1;
        this.streakCount = savedState.streakCount || 0;
        console.log('🔄 Đã phục hồi điểm số trước đó của người chơi:', restoredScore);
      }
    } catch (e) {}

    this.timelineScore = restoredScore;
    this.speedCombo = 1;
    this.speedMaxCombo = this.speedMaxCombo || 1;
    this.streakCount = this.streakCount || 0;
    this.questionIndex = 0;
    this.recentResults = [];
    this.isSpeedLocked = false;
    if (!this.matchStartTime) {
      this.matchStartTime = Date.now();
    }
    this.gameStartTime = this.matchStartTime;

    // Đồng bộ thời gian 5 phút cho Chặng 1 theo phòng (nếu có multiplayer host phát endAt)
    if (this.app && this.app.multiplayer && this.app.multiplayer.gameEndAt && this.app.multiplayer.gameEndAt > Date.now()) {
      this.gameEndTime = this.app.multiplayer.gameEndAt;
      this.remainingMasterSeconds = Math.max(10, Math.floor((this.gameEndTime - Date.now()) / 1000));
    } else {
      this.remainingMasterSeconds = 300; // 5 phút mặc định cho Chặng 1
      this.gameEndTime = Date.now() + 300000;
    }

    this.initQuestionQueue();
    this.startMasterCountdown();

    this.app.switchScreen('timeline-game-screen');
    this.updateHUD();
    this.loadNextQuestion();
  }

  // Vòng lặp đếm ngược xuyên suốt màn chơi
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

      // Khi đếm về 00:00:
      // Nếu đang ở Chặng 1 -> Tự động chuyển sang Chặng 2!
      // Nếu đang ở Chặng 2 -> Hoàn tất trò chơi và xuất kết quả
      if (secLeft <= 0) {
        this.stopMasterTimer();
        this.clearSpeedTimer();
        if (this.app && this.app.currentScreen === 'timeline-game-screen') {
          this.transitionToCipherStage();
        } else {
          this.finishAllMiniGames();
        }
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

    // Xóa triệt để mọi trạng thái focus / hover còn sót lại trên nút bấm
    if (document.activeElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }

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
      stepEl.innerText = `Câu ${this.questionIndex} • Chuỗi: ${this.streakCount}`;
    }

    // Cập nhật Danh hiệu đại biểu theo điểm số
    const rank = this.getRankTitle(this.timelineScore);
    if (rankIcon) rankIcon.innerText = rank.icon;
    if (rankName) rankName.innerText = rank.title;
    if (rankChip) {
      rankChip.className = `player-rank-chip ${rank.class}`;
    }
  }

  // Kết xuất Thẻ Thử Thách Trung Tâm (Chỉ giữ lại Câu Hỏi)
  renderQuestionCard(item) {
    const cardBadge = document.getElementById('speed-card-badge');
    const cardIcon = document.getElementById('speed-card-icon');
    const cardTitle = document.getElementById('speed-event-title');
    const cardDesc = document.getElementById('speed-event-desc');
    const cardEl = document.getElementById('speed-event-card');

    if (cardBadge) cardBadge.innerText = item.badge || '📜 THỬ THÁCH TRI THỨC';
    if (cardIcon) cardIcon.innerText = item.icon || '⭐';
    if (cardTitle) cardTitle.innerText = item.title;
    if (cardDesc) cardDesc.innerText = ''; // Bỏ hoàn toàn phần chữ thường bên dưới câu hỏi

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
      let earned = Math.round((100 + timeBonus) * mult);

      // Nếu có kích hoạt quà nhân đôi (x2)
      if (this.nextQuestionDouble) {
        earned *= 2;
        this.nextQuestionDouble = false;
        if (typeof this.app?.showToastNotification === 'function') {
          this.app.showToastNotification('⚡ Đã kích hoạt x2 Điểm Số!');
        }
      }

      this.timelineScore += earned;

      this.streakCount++;
      if (this.streakCount > this.speedMaxCombo) this.speedMaxCombo = this.streakCount;

      this.recentResults.push({ status: 'correct', label: item.type === 'timeline' ? item.correctYear : 'ĐÚNG' });

      // Hiệu ứng phát sáng trên nút bấm và thẻ câu hỏi
      btnEl.classList.add('btn-correct-glow');
      const cardEl = document.getElementById('speed-event-card');
      if (cardEl) cardEl.classList.add('correct-pulse');

      // Đồng bộ điểm và tiến độ thực tế tới phòng máy chiếu qua MQTT và lưu cục bộ
      const stage1Elapsed = Math.min(300, (Date.now() - (this.matchStartTime || this.gameStartTime || Date.now())) / 1000);
      const timePart = Math.floor((stage1Elapsed / 300) * 35);
      const qPart = Math.min(15, this.questionIndex * 2);
      const currentProgress = Math.min(50, Math.max(5, timePart + qPart));

      if (this.app && this.app.multiplayer) {
        this.app.multiplayer.sendScoreUpdate(this.timelineScore, {
          stage: 'timeline',
          progress: currentProgress
        });
      }
      this.savePlayerState();

      this.updateHUD();

      // KIỂM TRA MỐC 3 CÂU ĐÚNG LIÊN TIẾP -> MỞ HỘP QUÀ MAY MẮN
      if (this.streakCount > 0 && this.streakCount % 3 === 0) {
        setTimeout(() => {
          document.querySelectorAll('.speed-year-btn, .quiz-opt-btn').forEach(b => {
            b.classList.remove('btn-correct-glow', 'btn-wrong', 'btn-reveal-correct');
            if (typeof b.blur === 'function') b.blur();
          });
          this.triggerMysteryGift();
        }, 600);
        return;
      }

      // Chuyển câu tiếp theo sau 0.75 giây (Chế độ vô hạn cho đủ 5 phút)
      setTimeout(() => {
        document.querySelectorAll('.speed-year-btn, .quiz-opt-btn').forEach(b => {
          b.classList.remove('btn-correct-glow', 'btn-wrong', 'btn-reveal-correct');
          if (typeof b.blur === 'function') b.blur();
        });
        this.loadNextQuestion();
      }, 750);
    } else {
      // KIỂM TRA NẾU CÓ KHIÊN BẢO VỆ CHỐNG ĐÓNG BĂNG
      if (this.hasShield) {
        this.hasShield = false;
        soundEngine.playCorrect();
        btnEl.classList.add('btn-wrong');
        const cardEl = document.getElementById('speed-event-card');
        if (cardEl) cardEl.classList.add('correct-pulse');

        if (typeof this.app?.showToastNotification === 'function') {
          this.app.showToastNotification('🛡️ Khiên bảo vệ: Miễn trừ phạt đóng băng 3 giây!');
        }

        setTimeout(() => {
          document.querySelectorAll('.speed-year-btn, .quiz-opt-btn').forEach(b => {
            b.classList.remove('btn-correct-glow', 'btn-wrong', 'btn-reveal-correct');
            if (typeof b.blur === 'function') b.blur();
          });
          this.loadNextQuestion();
        }, 750);
        return;
      }

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
      this.savePlayerState();

      this.updateHUD();

      // Kích hoạt bảng đóng băng phạt 3 giây
      this.triggerFreezePenalty(item);
    }
  }

  // ================= 1.5. HỘP QUÀ MAY MẮN (CHỌN 1 TRONG 3 KHI ĐẠT CHUỖI 3 CÂU ĐÚNG) =================
  triggerMysteryGift() {
    this.clearSpeedTimer();
    const overlay = document.getElementById('mystery-gift-overlay');
    const chestsGrid = document.getElementById('mystery-chests-grid');
    const revealBox = document.getElementById('gift-reward-reveal');
    if (!overlay) return;

    soundEngine.playFanfare();
    overlay.style.display = 'flex';
    if (chestsGrid) chestsGrid.style.display = 'grid';
    if (revealBox) revealBox.style.display = 'none';

    // Tạo ngẫu nhiên 3 phần quà cho 3 rương
    // Tỷ lệ xuất hiện quà ĐỔI ĐIỂM đúng chuẩn 1:15 (khoảng 6.67%)
    const normalGifts = ['bonus_points', 'double_points', 'freeze_shield'];
    const chestGifts = [];

    // Tỷ lệ ra hộp trao đổi điểm là 1:15 (1/15)
    const hasSwapGift = Math.random() < (1 / 15);
    if (hasSwapGift) {
      chestGifts.push('swap_score');
    }
    while (chestGifts.length < 3) {
      const g = normalGifts[Math.floor(Math.random() * normalGifts.length)];
      chestGifts.push(g);
    }
    // Shuffle 3 rương
    for (let i = chestGifts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chestGifts[i], chestGifts[j]] = [chestGifts[j], chestGifts[i]];
    }

    // Gắn sự kiện click cho từng rương
    const chestEls = document.querySelectorAll('.mystery-chest-box');
    chestEls.forEach((box, idx) => {
      box.classList.remove('opened', 'disabled');
      box.onclick = () => {
        chestEls.forEach(b => b.classList.add('disabled'));
        box.classList.add('opened');
        this.openMysteryChest(chestGifts[idx], box);
      };
    });
  }

  openMysteryChest(giftType, boxEl) {
    soundEngine.playFanfare();
    const chestsGrid = document.getElementById('mystery-chests-grid');
    const revealBox = document.getElementById('gift-reward-reveal');
    const iconEl = document.getElementById('gift-reveal-icon');
    const titleEl = document.getElementById('gift-reveal-title');
    const descEl = document.getElementById('gift-reveal-desc');
    const scoresEl = document.getElementById('gift-reveal-scores');
    const continueBtn = document.getElementById('btn-gift-continue');

    if (chestsGrid) chestsGrid.style.display = 'none';
    if (revealBox) revealBox.style.display = 'flex';

    if (giftType === 'swap_score') {
      iconEl.innerText = '🔄';
      titleEl.innerText = 'BỐC TRÚNG: HOÁN ĐỔI ĐIỂM SỐ!';
      
      // Thực hiện hoán đổi điểm với một người chơi ngẫu nhiên
      const result = this.app.multiplayer ? this.app.multiplayer.executeScoreSwap() : null;
      if (result && result.success) {
        descEl.innerHTML = `Bạn vừa tráo đổi điểm số ngoạn mục với đại biểu <strong>${result.target.name}</strong>!`;
        scoresEl.innerHTML = `
          <div class="swap-scores-box">
            <div class="swap-score-col">
              <span class="swap-col-label">Điểm Trước Của Bạn</span>
              <strong class="swap-old-val">${result.initiatorOldScore.toLocaleString()}đ</strong>
            </div>
            <div class="swap-arrow">⇄</div>
            <div class="swap-score-col highlight">
              <span class="swap-col-label">Điểm Mới Nhận</span>
              <strong class="swap-new-val">${result.initiatorNewScore.toLocaleString()}đ</strong>
            </div>
          </div>
        `;
      } else {
        // Nếu chơi solo hoặc chưa có ai khác trong phòng
        this.timelineScore += 300;
        this.updateHUD();
        this.savePlayerState();
        if (this.app && this.app.multiplayer) this.app.multiplayer.sendScoreUpdate(this.timelineScore);
        descEl.innerHTML = `Hiện tại chưa có đại biểu khác trong phòng để đổi điểm.<br>Trung ương tặng thưởng cho bạn <strong>+300 điểm danh dự</strong>!`;
        scoresEl.innerHTML = `<strong style="font-size:1.35rem;color:#ffd700;">+300 ĐIỂM THƯỞNG DANH DỰ</strong>`;
      }
    } else if (giftType === 'bonus_points') {
      iconEl.innerText = '⭐';
      titleEl.innerText = 'ĐIỆN TÍN KHEN NGỢI TỪ TRUNG ƯƠNG!';
      this.timelineScore += 300;
      this.updateHUD();
      this.savePlayerState();
      if (this.app && this.app.multiplayer) this.app.multiplayer.sendScoreUpdate(this.timelineScore);
      descEl.innerHTML = `Thành tích xuất sắc! Bạn được cộng ngay <strong>+300 điểm thưởng</strong> vào tổng điểm!`;
      scoresEl.innerHTML = `<strong style="font-size:1.35rem;color:#ffd700;">+300 ĐIỂM THƯỞNG</strong>`;
    } else if (giftType === 'double_points') {
      iconEl.innerText = '⚡';
      titleEl.innerText = 'KHÍ THẾ TIẾN CÔNG: x2 ĐIỂM CÂU TIẾP!';
      this.nextQuestionDouble = true;
      descEl.innerHTML = `Câu hỏi tiếp theo bạn trả lời đúng sẽ được <strong>nhân đôi (x2)</strong> toàn bộ số điểm ghi được!`;
      scoresEl.innerHTML = `<strong style="font-size:1.35rem;color:#ff9800;">⚡ KÍCH HOẠT x2 ĐIỂM CÂU KẾ TIẾP</strong>`;
    } else if (giftType === 'freeze_shield') {
      iconEl.innerText = '🛡️';
      titleEl.innerText = 'LÁ CHẮN BẢO VỆ BÍ MẬT!';
      this.hasShield = true;
      descEl.innerHTML = `Bạn nhận được <strong>01 Khiên bảo vệ</strong>: Miễn trừ hoàn toàn hình phạt đóng băng 3 giây nếu chọn sai câu kế tiếp!`;
      scoresEl.innerHTML = `<strong style="font-size:1.35rem;color:#4caf50;">🛡️ KHIÊN BẢO VỆ ĐÃ SẴN SÀNG</strong>`;
    }

    let countdown = 4;
    let autoTimer = null;

    const cleanupAndNext = () => {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
      const overlay = document.getElementById('mystery-gift-overlay');
      if (overlay) overlay.style.display = 'none';
      this.loadNextQuestion();
    };

    if (continueBtn) {
      continueBtn.innerText = `TIẾP TỤC THI ĐẤU (${countdown}s) ➔`;
      continueBtn.onclick = () => {
        soundEngine.playClick();
        cleanupAndNext();
      };
    }

    autoTimer = setInterval(() => {
      countdown--;
      if (continueBtn) continueBtn.innerText = `TIẾP TỤC THI ĐẤU (${countdown}s) ➔`;
      if (countdown <= 0) {
        cleanupAndNext();
      }
    }, 1000);
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
        document.querySelectorAll('.speed-year-btn, .quiz-opt-btn').forEach(b => {
          b.classList.remove('btn-correct-glow', 'btn-wrong', 'btn-reveal-correct');
          if (typeof b.blur === 'function') b.blur();
        });
        // Hết thời gian phạt -> Lập tức chuyển sang câu hỏi mới vô hạn
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
      document.querySelectorAll('.speed-year-btn, .quiz-opt-btn').forEach(b => {
        b.classList.remove('btn-correct-glow', 'btn-wrong', 'btn-reveal-correct');
        if (typeof b.blur === 'function') b.blur();
      });
      this.loadNextQuestion();
    }, 1200);
  }

  // Chuyển đổi giữa 2 chặng: Chặng 1 (Trắc nghiệm A-B-C-D 5 phút) -> Chặng 2 (Ghép năm & Nối sự kiện)
  transitionToCipherStage() {
    this.clearSpeedTimer();
    clearInterval(this.freezeTimer);
    const freezeOverlay = document.getElementById('freeze-overlay');
    if (freezeOverlay) freezeOverlay.style.display = 'none';

    soundEngine.playFanfare();

    const overlay = document.getElementById('stage-transition-overlay');
    const scoreVal = document.getElementById('trans-stage1-score');
    const btnContinue = document.getElementById('btn-trans-continue');

    if (scoreVal) scoreVal.innerText = `${this.timelineScore.toLocaleString()}đ`;
    if (overlay) overlay.style.display = 'flex';

    let secLeft = 3;
    if (btnContinue) {
      btnContinue.innerHTML = `<span>VÀO CHẶNG 2: GHÉP NĂM & NỐI SỰ KIỆN (${secLeft}s)</span> ➔`;
    }

    const startStage2 = () => {
      clearInterval(this.transitionInterval);
      this.transitionInterval = null;
      if (overlay) overlay.style.display = 'none';
      this.startCipherGame();
    };

    if (btnContinue) {
      btnContinue.onclick = () => {
        soundEngine.playClick();
        startStage2();
      };
    }

    clearInterval(this.transitionInterval);
    this.transitionInterval = setInterval(() => {
      secLeft--;
      if (btnContinue) {
        btnContinue.innerHTML = `<span>VÀO CHẶNG 2: GHÉP NĂM & NỐI SỰ KIỆN (${secLeft}s)</span> ➔`;
      }
      if (secLeft <= 0) {
        startStage2();
      }
    }, 1000);
  }

  // ================= 2. MINI-GAME: GIẢI MÃ ĐIỆN TÍN (CHẶNG 2) =================
  startCipherGame() {
    this.decodedReports = [];
    this.selectedHero = null;
    this.selectedEvent = null;
    this.selectedLocale = null;
    this.activeCipherTab = 'heroes';

    if (!this.matchStartTime) {
      this.matchStartTime = Date.now();
    }
    this.gameStartTime = this.matchStartTime;

    // Phục hồi điểm nếu vào trực tiếp hoặc F5
    if (!this.timelineScore || this.timelineScore === 0) {
      try {
        const savedState = JSON.parse(localStorage.getItem('vnr202_current_player_state') || '{}');
        const curRoom = this.app?.multiplayer?.roomId || '1930-VN';
        if (savedState.roomId === curRoom && typeof savedState.score === 'number') {
          this.timelineScore = savedState.score;
        }
      } catch (e) {}
    }

    this.app.switchScreen('cipher-game-screen');

    // Cập nhật điểm tích lũy kế thừa từ Chặng 1 lên HUD Chặng 2
    const scoreEl = document.getElementById('cipher-score-val');
    if (scoreEl) scoreEl.innerText = `${this.timelineScore.toLocaleString()}đ`;

    // Cập nhật đồng hồ đếm ngược phòng thi: Chặng 2 có 5 phút riêng
    this.remainingMasterSeconds = 300;
    this.gameEndTime = Date.now() + 300000;
    const cpVal = document.getElementById('cipher-stopwatch-val');
    if (cpVal) cpVal.innerText = this.formatTime(this.remainingMasterSeconds);

    this.startMasterCountdown();

    // Đồng bộ tiến độ bắt đầu Chặng 2 (50%)
    if (this.app && this.app.multiplayer) {
      this.app.multiplayer.sendScoreUpdate(this.timelineScore, {
        stage: 'cipher',
        progress: 50,
        ciphersSolved: 0
      });
    }

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
      const scoreEl = document.getElementById('cipher-score-val');
      if (scoreEl) scoreEl.innerText = `${this.timelineScore.toLocaleString()}đ`;

      const solvedCount = this.decodedReports.length;
      // Chặng 2 có 5 bức điện, mỗi bức tăng 10% (từ 50% đến 100%)
      const cipherProgress = Math.min(100, 50 + solvedCount * 10);
      if (this.app && this.app.multiplayer) {
        this.app.multiplayer.sendScoreUpdate(this.timelineScore, {
          stage: 'cipher',
          progress: cipherProgress,
          ciphersSolved: solvedCount
        });
      }
      this.savePlayerState();

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
    this.clearSpeedTimer();
    clearInterval(this.freezeTimer);
    clearInterval(this.transitionInterval);
    const freezeOverlay = document.getElementById('freeze-overlay');
    if (freezeOverlay) freezeOverlay.style.display = 'none';
    const transOverlay = document.getElementById('stage-transition-overlay');
    if (transOverlay) transOverlay.style.display = 'none';

    // Tính chính xác thời gian hoàn thành
    const startTime = this.matchStartTime || this.gameStartTime || Date.now();
    const totalSec = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
    const formattedTime = this.formatTime(totalSec);
    this.finalFormattedTime = formattedTime;
    this.finalTimeSeconds = totalSec;

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
  }
}
