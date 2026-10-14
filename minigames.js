// Dữ liệu & Logic Mini-game: Trục Thời Gian & Giải Mã Điện Tín Lịch Sử 1930

const TIMELINE_LEVELS = [
  {
    title: "Chặng 1: Hành Trình Tìm Đường Cứu Nước (1911 - 1925)",
    slots: [
      { year: "1911", title: "Rời Bến Cảng Nhà Rồng", hint: "Tàu buôn Đô đốc Latouche-Tréville ra khơi" },
      { year: "1920", title: "Đại Hội Tours (Pháp)", hint: "Đọc Luận cương Lênin, gia nhập Quốc tế III" },
      { year: "1923", title: "Thành Lập Tâm Tâm Xã", hint: "Tổ chức cách mạng cấp tiến tại Quảng Châu" },
      { year: "1924", title: "Tiếng Bom Sa Diện", hint: "Phạm Hồng Thái mưu sát Toàn quyền Merlin" },
      { year: "1925", title: "Hội VN Cách Mạng Thanh Niên", hint: "Xuất bản báo Thanh Niên tại Quảng Châu" }
    ],
    cards: [
      { id: "c1911", year: "1911", label: "Người thanh niên Nguyễn Tất Thành rời Bến cảng Nhà Rồng tìm đường cứu nước", era: "1911" },
      { id: "c1920", year: "1920", label: "Nguyễn Ái Quốc đọc Sơ thảo Luận cương Lênin và bỏ phiếu gia nhập Quốc tế III", era: "1920" },
      { id: "c1923", year: "1923", label: "Nhóm thanh niên yêu nước Lê Hồng Sơn, Hồ Tùng Mậu thành lập Tâm Tâm Xã", era: "1923" },
      { id: "c1924", year: "1924", label: "Phạm Hồng Thái ném bom Sa Diện gây chấn động dư luận quốc tế", era: "1924" },
      { id: "c1925", year: "1925", label: "Nguyễn Ái Quốc sáng lập Hội Việt Nam Cách mạng Thanh niên tại Quảng Châu", era: "1925" }
    ]
  },
  {
    title: "Chặng 2: Bước Ngoặt Khai Sinh Chính Đảng (1927 - 1930)",
    slots: [
      { year: "1927", title: "Tác Phẩm Đường Kách Mệnh", hint: "Vũ khí tư tưởng gối đầu giường của chiến sĩ CS" },
      { year: "1928", title: "Phong Trào Vô Sản Hóa", hint: "Cán bộ thâm nhập hầm mỏ than, xí nghiệp" },
      { year: "1929", title: "Ba Tổ Chức Cộng Sản Ra Đời", hint: "Đông Dương CS Đảng, An Nam CS Đảng, ĐD CS Liên đoàn" },
      { year: "1930", title: "Hội Nghị Hợp Nhất Cửu Long", hint: "Thành lập Đảng Cộng sản Việt Nam (3/2/1930)" }
    ],
    cards: [
      { id: "c1927", year: "1927", label: "Xuất bản cuốn sách lý luận kinh điển 'Đường Kách mệnh' tại Quảng Châu", era: "1927" },
      { id: "c1928", year: "1928", label: "Kỳ bộ Bắc Kỳ phát động phong trào 'Vô sản hóa' đưa cán bộ vào nhà máy hầm mỏ", era: "1928" },
      { id: "c1929", year: "1929", label: "Sự phân hóa và xuất hiện của ba tổ chức cộng sản nối tiếp nhau trên cả ba kỳ", era: "1929" },
      { id: "c1930", year: "1930", label: "Nguyễn Ái Quốc chủ trì Hội nghị hợp nhất thành lập Đảng Cộng sản Việt Nam", era: "1930" }
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
    
    // Timeline state
    this.timelineLevelIdx = 0;
    this.timelineScore = 0;
    this.selectedCardId = null;
    
    // Cipher state
    this.selectedHero = null;
    this.selectedEvent = null;
    this.selectedLocale = null;
    this.decodedReports = [];
  }

  // ================= 1. MINI-GAME: TRỤC THỜI GIAN =================
  startTimelineGame() {
    this.timelineLevelIdx = 0;
    this.timelineScore = 0;
    this.app.switchScreen('timeline-game-screen');
    this.loadTimelineStage(this.timelineLevelIdx);
  }

  loadTimelineStage(stageIdx) {
    const stage = TIMELINE_LEVELS[stageIdx];
    if (!stage) {
      // Hoàn thành cả 2 chặng timeline -> Chuyển tiếp sang Màn 2: Giải Mã Điện Tín
      this.finishTimelineToCipher();
      return;
    }

    this.selectedCardId = null;
    document.getElementById('timeline-stage-title').innerText = stage.title;
    document.getElementById('timeline-score-val').innerText = `${this.timelineScore}đ`;

    // Render Slots trên trục thời gian
    const trackEl = document.getElementById('timeline-track-slots');
    trackEl.innerHTML = '';
    stage.slots.forEach(slot => {
      const slotBox = document.createElement('div');
      slotBox.className = 'timeline-slot-dropzone';
      slotBox.dataset.year = slot.year;
      slotBox.innerHTML = `
        <div class="slot-year-tag">${slot.year}</div>
        <div class="slot-drop-target" id="slot-target-${slot.year}">
          <span class="slot-placeholder-hint">${slot.title}</span>
        </div>
      `;
      
      // Hỗ trợ Click to Drop
      slotBox.addEventListener('click', () => this.handleSlotClick(slot.year, slotBox));

      // Hỗ trợ Drag & Drop HTML5
      slotBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        slotBox.classList.add('drag-over');
      });
      slotBox.addEventListener('dragleave', () => slotBox.classList.remove('drag-over'));
      slotBox.addEventListener('drop', (e) => {
        e.preventDefault();
        slotBox.classList.remove('drag-over');
        const cardId = e.dataTransfer.getData('text/plain');
        this.verifyAndDropCard(cardId, slot.year, slotBox);
      });

      trackEl.appendChild(slotBox);
    });

    // Render Thẻ sự kiện xáo trộn
    const dockEl = document.getElementById('timeline-cards-dock');
    dockEl.innerHTML = '';
    const shuffledCards = [...stage.cards].sort(() => 0.5 - Math.random());
    shuffledCards.forEach(card => {
      const cardEl = document.createElement('div');
      cardEl.className = 'timeline-event-card';
      cardEl.id = `card-${card.id}`;
      cardEl.dataset.id = card.id;
      cardEl.dataset.year = card.year;
      cardEl.draggable = true;
      cardEl.innerHTML = `
        <div class="card-glow-edge"></div>
        <div class="card-badge-icon">📜</div>
        <div class="card-desc-text">${card.label}</div>
      `;

      // Click to Select
      cardEl.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleCardSelect(card.id, cardEl);
      });

      // Dragstart
      cardEl.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', card.id);
        cardEl.classList.add('dragging');
      });
      cardEl.addEventListener('dragend', () => cardEl.classList.remove('dragging'));

      dockEl.appendChild(cardEl);
    });
  }

  handleCardSelect(cardId, cardEl) {
    soundEngine.playClick();
    if (this.selectedCardId === cardId) {
      this.selectedCardId = null;
      cardEl.classList.remove('selected');
      document.querySelectorAll('.timeline-slot-dropzone').forEach(s => s.classList.remove('pulse-target'));
      return;
    }

    document.querySelectorAll('.timeline-event-card').forEach(c => c.classList.remove('selected'));
    this.selectedCardId = cardId;
    cardEl.classList.add('selected');
    // Làm sáng các mốc năm trên trục thời gian để người chơi trên điện thoại chạm ngay
    document.querySelectorAll('.timeline-slot-dropzone:not(.completed)').forEach(s => s.classList.add('pulse-target'));
  }

  handleSlotClick(year, slotBox) {
    if (!this.selectedCardId) {
      // Nếu chạm mốc năm trước khi chọn thẻ -> Rung nhẹ nhắc nhở
      slotBox.classList.add('slot-hint-pulse');
      setTimeout(() => slotBox.classList.remove('slot-hint-pulse'), 500);
      return;
    }
    this.verifyAndDropCard(this.selectedCardId, year, slotBox);
  }

  verifyAndDropCard(cardId, targetYear, slotBox) {
    const cardEl = document.getElementById(`card-${cardId}`);
    if (!cardEl) return;

    const cardYear = cardEl.dataset.year;
    if (cardYear === targetYear) {
      // Ghép chính xác!
      soundEngine.playCorrect();
      this.timelineScore += 150;
      document.getElementById('timeline-score-val').innerText = `${this.timelineScore}đ`;
      if (this.app && this.app.multiplayer) {
        this.app.multiplayer.sendScoreUpdate(this.timelineScore);
      }

      document.querySelectorAll('.timeline-slot-dropzone').forEach(s => s.classList.remove('pulse-target'));
      const targetDropZone = slotBox.querySelector('.slot-drop-target');
      targetDropZone.innerHTML = '';
      cardEl.classList.remove('selected');
      cardEl.classList.add('slotted-success');
      cardEl.draggable = false;
      targetDropZone.appendChild(cardEl);
      slotBox.classList.add('completed');

      this.selectedCardId = null;

      // Kiểm tra hoàn thành màn
      const remaining = document.querySelectorAll('#timeline-cards-dock .timeline-event-card').length;
      if (remaining === 0) {
        soundEngine.playFanfare();
        setTimeout(() => {
          this.timelineLevelIdx++;
          this.loadTimelineStage(this.timelineLevelIdx);
        }, 1600);
      }
    } else {
      // Ghép sai -> Rung lắc cảnh báo
      soundEngine.playWrong();
      cardEl.classList.add('error-shake');
      setTimeout(() => cardEl.classList.remove('error-shake'), 450);
    }
  }

  finishTimelineToCipher() {
    const banner = document.getElementById('timeline-stage-title');
    banner.innerText = "🎉 XUẤT SẮC! TIẾN VÀO MÀN 2: GIẢI MÃ ĐIỆN TÍN CỬU LONG";
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
    this.app.score = this.timelineScore;
    this.app.maxCombo = 5;
    this.app.showSummary();
    
    // Tùy chỉnh danh hiệu vinh danh đặc biệt cho người hoàn thành Mini-game
    document.getElementById('summary-rank-badge').innerText = "🏆 ĐẠI BIỂU XUẤT SẮC HỘI NGHỊ CỬU LONG (1930) 🌟";
    document.getElementById('final-rank-val').innerText = "Hoàn thành 2 Màn Chơi!";
  }
}
