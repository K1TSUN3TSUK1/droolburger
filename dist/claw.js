(() => {
  const stage = document.querySelector('#claw-stage');
  const subject = stage?.querySelector('.claw-subject');
  if (!subject) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false, hovering = false, raf = 0, lastFrame = 0;
  let angle = 0, speed = 0, pitch = 0, pitchSpeed = 0;
  let target = 0, pitchTarget = 0, previousPointer = null;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function draw() {
    subject.style.transform = `rotateZ(${angle}deg) rotateX(${pitch}deg)`;
  }

  function frame(now) {
    raf = 0;
    if (!visible || document.hidden || reduced.matches) return;
    const dt = lastFrame ? Math.min((now - lastFrame) / 1000, .035) : 1 / 60;
    lastFrame = now;
    speed += ((target - angle) * 28 - speed * 3.7) * dt;
    pitchSpeed += ((pitchTarget - pitch) * 23 - pitchSpeed * 4.4) * dt;
    angle = clamp(angle + speed * dt, -13, 13);
    pitch = clamp(pitch + pitchSpeed * dt, -8, 8);
    draw();
    if (Math.abs(speed) + Math.abs(pitchSpeed) + Math.abs(target - angle) + Math.abs(pitchTarget - pitch) > .025) {
      raf = requestAnimationFrame(frame);
    } else {
      angle = target; pitch = pitchTarget; draw(); lastFrame = 0;
    }
  }

  function wake() {
    if (!raf && visible && !document.hidden && !reduced.matches) raf = requestAnimationFrame(frame);
  }

  function reset() {
    cancelAnimationFrame(raf);
    raf = 0; lastFrame = 0; angle = 0; pitch = 0; speed = 0; pitchSpeed = 0;
    target = 0; pitchTarget = 0; hovering = false; previousPointer = null;
    stage.dataset.entry = ''; draw();
  }

  function enter(event) {
    if (!visible || reduced.matches || document.hidden) return;
    const rect = stage.getBoundingClientRect();
    const x = event.clientX - rect.left, y = event.clientY - rect.top;
    const edges = [
      { name: 'left', distance: x, kick: 76, tilt: 0 },
      { name: 'right', distance: rect.width - x, kick: -76, tilt: 0 },
      { name: 'top', distance: y, kick: x < rect.width / 2 ? 24 : -24, tilt: -42 },
      { name: 'bottom', distance: rect.height - y, kick: x < rect.width / 2 ? 24 : -24, tilt: 42 }
    ];
    const entry = edges.sort((a, b) => a.distance - b.distance)[0];
    stage.dataset.entry = entry.name;
    speed = clamp(speed + entry.kick, -100, 100);
    pitchSpeed = clamp(pitchSpeed + entry.tilt, -60, 60);
    hovering = event.pointerType !== 'touch';
    previousPointer = { x: event.clientX, y: event.clientY };
    wake();
  }

  stage.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') enter(event); });
  stage.addEventListener('pointerdown', event => { if (event.pointerType === 'touch') enter(event); });
  stage.addEventListener('pointermove', event => {
    if (!hovering || event.pointerType === 'touch' || reduced.matches) return;
    const rect = stage.getBoundingClientRect();
    target = -clamp(((event.clientX - rect.left) / rect.width - .5) * 2, -1, 1) * 3;
    pitchTarget = clamp(((event.clientY - rect.top) / rect.height - .5) * 2, -1, 1) * 2;
    if (previousPointer) {
      speed -= clamp(event.clientX - previousPointer.x, -35, 35) * .12;
      pitchSpeed += clamp(event.clientY - previousPointer.y, -35, 35) * .07;
    }
    previousPointer = { x: event.clientX, y: event.clientY };
    wake();
  });
  stage.addEventListener('pointerleave', () => {
    hovering = false; previousPointer = null; target = 0; pitchTarget = 0; wake();
  });
  stage.addEventListener('focus', () => { if (visible) { speed = 38; wake(); } });
  stage.addEventListener('blur', () => { target = 0; pitchTarget = 0; wake(); });

  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (!visible) reset();
  }, { threshold: 0 });
  observer.observe(stage);
  document.addEventListener('visibilitychange', () => { if (document.hidden) reset(); });
  reduced.addEventListener('change', reset);
})();
