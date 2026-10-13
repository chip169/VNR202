// Web Audio API Sound Synthesizer Engine - Âm thanh trong trẻo, không tiếng rè
class GameSoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.bgmPlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  // Tiếng nhấp chuột / UI tap nhẹ nhàng, êm ái
  playClick() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.045);
  }

  // Tiếng đố vui: Trả lời Đúng (Hào hùng, trong trẻo ngân vang)
  playCorrect() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const chords = [523.25, 659.25, 783.99, 1046.50]; // Đô - Mi - Sol - Đô cao

    chords.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.5);
    });
  }

  // Tiếng đố vui: Trả lời Sai (Âm trầm ấm, không rè, không chói tai)
  playWrong() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    
    // Hai nốt trầm nhẹ nhàng
    [261.63, 220.00].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0, now + idx * 0.12);
      gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.24);
    });
  }

  // Tiếng kim đồng hồ đếm ngược (Gõ nhịp trong vắt)
  playTick(isUrgent = false) {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(isUrgent ? 987.77 : 659.25, now);

    gain.gain.setValueAtTime(isUrgent ? 0.1 : 0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.045);
  }

  // Tiếng kích hoạt Combo Streak
  playCombo(level) {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const baseFreq = 523.25 + level * 65.4;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.22);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.23);
  }

  // Tiếng kèn khải hoàn chiến thắng (Âm vang hào hùng, mượt mà không gai góc)
  playFanfare() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const notes = [
      { f: 523.25, t: 0, d: 0.14 },    // C5
      { f: 523.25, t: 0.14, d: 0.14 }, // C5
      { f: 523.25, t: 0.28, d: 0.14 }, // C5
      { f: 659.25, t: 0.42, d: 0.3 },  // E5
      { f: 587.33, t: 0.74, d: 0.15 }, // D5
      { f: 783.99, t: 0.9, d: 0.6 }    // G5 (ngân vang)
    ];

    notes.forEach(n => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, now + n.t);

      gain.gain.setValueAtTime(0, now + n.t);
      gain.gain.linearRampToValueAtTime(0.18, now + n.t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + n.t);
      osc.stop(now + n.t + n.d);
    });
  }

  // Âm hưởng chuyển cảnh Intro mở màn (Dịu dàng ngân vang, triệt tiêu tần số trầm gây rè loa)
  playIntroStinger(step = 1) {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    
    const notes = step === 1 ? [440, 659.25] : (step === 2 ? [523.25, 783.99] : [587.33, 880]);
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 1.25);
    });
  }

  // Triệt tiêu hoàn toàn tiếng rè nền (drone)
  startAmbient() {
    // Để không gian tĩnh lặng, không phát âm nền gây rè loa
    this.bgmPlaying = false;
  }
}

const soundEngine = new GameSoundEngine();
