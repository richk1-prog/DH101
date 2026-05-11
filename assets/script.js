(() => {
  const body = document.body;
  if (!body) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'matrix-bg';
  canvas.setAttribute('aria-hidden', 'true');
  body.insertBefore(canvas, body.firstChild);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const glyphSize = 18;
  const color = '#77FF00';
  const glowBlur = 5;
  let dpr = Math.max(1, window.devicePixelRatio || 1);
  let columns = 0;
  let drops = [];

  const resize = () => {
    dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    columns = Math.ceil(window.innerWidth / glyphSize);
    drops = Array.from({ length: columns }, () => (Math.random() * -window.innerHeight) / glyphSize);

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  };

  const draw = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.14)';
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    ctx.fillStyle = color;
    ctx.font = `${glyphSize}px ui-monospace, Menlo, Consolas, monospace`;
    ctx.shadowColor = color;
    ctx.shadowBlur = glowBlur;

    for (let i = 0; i < columns; i += 1) {
      const char = Math.random() > 0.5 ? '1' : '0';
      const x = i * glyphSize;
      const y = drops[i] * glyphSize;

      ctx.fillText(char, x, y);

      if (y > window.innerHeight && Math.random() > 0.98) {
        drops[i] = (Math.random() * -window.innerHeight) / glyphSize;
      } else {
        drops[i] += 1;
      }
    }

    ctx.shadowBlur = 0;
  };

  let last = 0;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const frameDelay = prefersReducedMotion ? 220 : 70;

  const animate = (now) => {
    if (now - last >= frameDelay) {
      draw();
      last = now;
    }
    window.requestAnimationFrame(animate);
  };

  window.addEventListener('resize', resize);
  resize();
  window.requestAnimationFrame(animate);
})();
