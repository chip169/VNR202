// Canvas Particle & 2.5D Atmospheric Lighting Engine
class ParticleAtmosphere {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.sparks = [];
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.mouseX = this.width / 2;
    this.mouseY = this.height / 2;
    this.targetMouseX = this.mouseX;
    this.targetMouseY = this.mouseY;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));

    this.initParticles();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  onMouseMove(e) {
    this.targetMouseX = e.clientX;
    this.targetMouseY = e.clientY;
  }

  initParticles() {
    // 60 hạt tàn lửa bay từ dưới lên
    this.sparks = [];
    for (let i = 0; i < 60; i++) {
      this.sparks.push({
        x: Math.random() * this.width,
        y: this.height + Math.random() * 200,
        size: Math.random() * 2.8 + 1,
        speedY: Math.random() * 1.8 + 0.8,
        speedX: (Math.random() - 0.5) * 0.9,
        opacity: Math.random() * 0.8 + 0.2,
        decay: Math.random() * 0.003 + 0.002,
        color: Math.random() > 0.4 ? '#ffb300' : '#ff4500' // Vàng kim và Cam đỏ
      });
    }

    // 40 hạt bụi lịch sử lơ lửng trong không gian ánh sáng vàng
    this.particles = [];
    for (let i = 0; i < 40; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 1.6 + 0.6,
        alpha: Math.random() * 0.5 + 0.1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.3
      });
    }
  }

  animate() {
    // Smooth mouse follow
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Ánh sáng vàng dịu phản chiếu từ bánh răng trung tâm
    const centerX = this.width * 0.5 + (this.mouseX - this.width / 2) * 0.02;
    const centerY = this.height * 0.45 + (this.mouseY - this.height / 2) * 0.02;
    const radialGrad = this.ctx.createRadialGradient(
      centerX, centerY, 40,
      centerX, centerY, this.width * 0.45
    );
    const pulse = 0.06 + Math.sin(Date.now() * 0.002) * 0.02;
    radialGrad.addColorStop(0, `rgba(255, 215, 0, ${pulse * 1.5})`);
    radialGrad.addColorStop(0.5, `rgba(218, 50, 20, ${pulse * 0.8})`);
    radialGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    this.ctx.fillStyle = radialGrad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // 2. Đèn dầu lập lòe phía phòng họp Hương Cảng (góc phải)
    const lanternX = this.width * 0.82;
    const lanternY = this.height * 0.38;
    const lanternFlicker = 0.08 + Math.sin(Date.now() * 0.007) * 0.03 + (Math.random() - 0.5) * 0.015;
    const lanternGrad = this.ctx.createRadialGradient(
      lanternX, lanternY, 10,
      lanternX, lanternY, 260
    );
    lanternGrad.addColorStop(0, `rgba(255, 220, 140, ${lanternFlicker})`);
    lanternGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    this.ctx.fillStyle = lanternGrad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // 3. Vẽ bụi cổ điển (Vintage dust)
    this.ctx.fillStyle = 'rgba(255, 240, 200, 0.4)';
    for (let p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 235, 180, ${p.alpha})`;
      this.ctx.fill();
    }

    // 4. Vẽ tàn lửa bốc lên (Rising revolutionary embers)
    for (let s of this.sparks) {
      s.y -= s.speedY;
      s.x += s.speedX + Math.sin(s.y * 0.02) * 0.5;
      s.opacity -= s.decay;

      if (s.y < -20 || s.opacity <= 0) {
        s.y = this.height + Math.random() * 50;
        s.x = Math.random() * this.width;
        s.opacity = Math.random() * 0.85 + 0.2;
        s.speedY = Math.random() * 2.0 + 0.8;
      }

      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      this.ctx.fillStyle = s.color;
      this.ctx.shadowColor = s.color;
      this.ctx.shadowBlur = 8;
      this.ctx.globalAlpha = Math.max(0, s.opacity);
      this.ctx.fill();
    }
    this.ctx.shadowBlur = 0;
    this.ctx.globalAlpha = 1.0;

    requestAnimationFrame(() => this.animate());
  }
}
