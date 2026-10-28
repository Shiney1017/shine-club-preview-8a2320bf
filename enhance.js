// Ambient light, count-up on scroll, gentle tilt/parallax. Honors reduced motion.
(() => {
  const TIPS=["Hand washing with clean mitts is gentler than brush tunnel washes, which can leave fine swirl marks in clear coat.","Use two buckets, one soapy and one for rinsing the mitt, so grit goes back in the bucket instead of onto your paint.","Bird droppings are acidic. Remove them soon, especially in the sun, before they etch the clear coat.","UV light slowly fades and oxidizes paint. Shade, a garage, or a protective coating all help.","A ceramic coating isn't a force field. It still needs regular, gentle pH-neutral washes to keep its gloss and water beading.","Let a new ceramic coating cure before its first wash. Follow the cure time your installer gives you.","Wash in the shade on a cool panel. Soap that dries in the sun leaves spots.","Dry with a plush microfiber towel or filtered air. Old bath towels and squeegees can scratch.","Wipe leather with a cleaner made for leather, then condition it so it stays supple instead of cracking.","Tree sap and bug splatter come off more easily, and with less risk, the sooner you deal with them.","Rinse road salt off the underbody in winter. Salt speeds up rust.","Clean your glass inside and out. Interior haze is often what causes glare at night.","Use dedicated wheel cleaners and brushes. Brake dust is abrasive and can bake onto wheel finishes."];

  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const amb = document.createElement('div'); amb.className = 'ambient'; amb.innerHTML = '<i></i><i></i><i></i>'; document.body.prepend(amb);
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting) return; io.unobserve(e.target); count(e.target); }), { threshold: .4 }) : null;
  const qo = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); qo.unobserve(e.target); } }), { threshold: .3 }) : null;
  function count(el) { const to = parseFloat(el.dataset.count), dec = (el.dataset.count.split('.')[1] || '').length;
    if (still) { el.textContent = to.toFixed(dec); return; } const t0 = performance.now(), D = 1400;
    (function f(t) { const k = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - k, 3); el.textContent = (to * e).toFixed(dec); if (k < 1) requestAnimationFrame(f); })(t0); }
  function quotes() { const v = document.getElementById('view'); if (v.querySelector('.pq')) return;
    const kids = [...v.children].filter((k) => k.tagName !== 'H1' && !k.classList.contains('muted')); if (kids.length < 2) return;
    const pick = [...TIPS].sort(() => Math.random() - .5); const spots = kids.length > 6 ? [3, kids.length - 2] : [kids.length - 1];
    spots.forEach((at, i) => { const q = document.createElement('blockquote'); q.className = 'pq'; q.innerHTML = pick[i] + '<small>Care note</small>'; kids[at].after(q);
      qo ? qo.observe(q) : q.classList.add('in'); }); }
  function tour() { const ph = document.getElementById('phone'); if (!ph || ph.dataset.t) return; ph.dataset.t = 1;
    const imgs = ph.querySelectorAll('img'), steps = document.querySelectorAll('.tstep'); steps[0]?.classList.add('on');
    const so = new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting) return; const i = +e.target.dataset.i;
      steps.forEach((s) => s.classList.toggle('on', s === e.target)); imgs.forEach((im) => im.classList.toggle('on', +im.dataset.i === i));
      if (!still) ph.style.transform = `rotateY(${i % 2 ? 12 : -14}deg) rotateX(6deg) rotateZ(${i % 2 ? -2 : 2}deg)`; }), { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach((s) => so.observe(s)); }
  function scan() { tour(); if (!document.getElementById('phone')) quotes(); document.querySelectorAll('[data-count]:not([data-c])').forEach((el) => { el.dataset.c = 1; io ? io.observe(el) : count(el); });
    if (still) return; document.querySelectorAll('.bcard,.stats div,.addcta').forEach((el) => el.classList.add('float')); }
  new MutationObserver(scan).observe(document.getElementById('view'), { childList: true }); scan();
  if (still) return;
  addEventListener('pointermove', (e) => { const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
    document.querySelectorAll('.float').forEach((el, i) => el.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 5}deg) translateY(${Math.sin(i) * 2}px)`); }, { passive: true });
  addEventListener('scroll', () => { const s = scrollY; document.querySelectorAll('.float').forEach((el, i) => { if (!matchMedia('(hover:none)').matches) return;
    el.style.transform = `perspective(900px) rotateX(${Math.sin(s / 300 + i) * 2.5}deg) translateY(${Math.sin(s / 200 + i) * 4}px)`; }); amb.style.transform = `translateY(${s * -.05}px)`; }, { passive: true });
})();
