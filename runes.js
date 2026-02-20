/* ── Floating Arcane Runes — shared across all pages ── */
(function() {
  const canvas = document.getElementById('runeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const RUNES = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ','ᚺ','ᚾ','ᛁ','ᛃ','ᛇ','ᛈ','ᛉ','ᛊ','ᛏ','ᛒ','ᛖ','ᛗ','ᛚ','ᛜ','ᛞ','ᛟ'];

  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randBetween(a, b) { return a + Math.random() * (b - a); }

  function spawnParticle() {
    return {
      x: randBetween(0, W),
      y: randBetween(H * 0.9, H + 40),
      rune: RUNES[Math.floor(Math.random() * RUNES.length)],
      size: randBetween(16, 36),
      speed: randBetween(0.25, 0.7),
      drift: randBetween(-0.25, 0.25),
      opacity: 0,
      maxOpacity: randBetween(0.18, 0.45),
      life: 0,
      maxLife: randBetween(220, 440),
    };
  }

  // Seed with spread-out starting positions across full screen
  for (let i = 0; i < 36; i++) {
    const p = spawnParticle();
    p.y = randBetween(0, H);           // start anywhere on screen
    p.life = randBetween(0, p.maxLife); // stagger lifecycle so they don't all fade in at once
    particles.push(p);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      const half = p.maxLife / 2;
      p.opacity = p.life < half
        ? p.maxOpacity * (p.life / half)
        : p.maxOpacity * (1 - (p.life - half) / half);

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = 'rgba(176, 122, 255, 1)';
      ctx.shadowColor = 'rgba(176, 122, 255, 0.8)';
      ctx.shadowBlur = 10;
      ctx.font = `${p.size}px serif`;
      ctx.fillText(p.rune, p.x, p.y);
      ctx.restore();

      p.y -= p.speed;
      p.x += p.drift;
      p.life++;

      if (p.life >= p.maxLife) Object.assign(p, spawnParticle());
    });

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
})();
