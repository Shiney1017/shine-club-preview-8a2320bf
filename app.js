(() => {
const S = window.SC, $ = (s, r = document) => r.querySelector(s), view = $('#view');
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ico = {
 home:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
 garage:'<path d="M5 17h14M6 17l1.5-5h9L18 17M7 17v2M17 17v2M8.5 9l1-3h5l1 3"/>',
 book:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
 perks:'<path d="M12 3l2.6 5.5 6 .8-4.4 4.2 1.1 6L12 16.8 6.7 19.5l1.1-6L3.4 9.3l6-.8z"/>',
 more:'<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>'
};
const svg = k => `<svg viewBox="0 0 24 24" aria-hidden="true">${ico[k]}</svg>`;
const routes = [
 ['home','Lounge','home',1],['garage','Garage','garage',1],['book','Book','book',1],['perks','Vault','perks',1],['more','More','more',1],
 ['history','History'],['add','Add car'],['building','Building'],['care','Care'],['refer','Refer'],['concierge','Concierge'],['plan','Plan']
];
$('.tabs').innerHTML = routes.filter(r => r[3]).map(r => `<a href="#/${r[0]}" data-r="${r[0]}">${svg(r[2])}<span>${r[1]}</span></a>`).join('');
$('.side').innerHTML = routes.filter(r => !['more','add','building'].includes(r[0])).map(r => `<a href="#/${r[0]}" data-r="${r[0]}">${r[1]}</a>`).join('');
const toast = m => { const t = $('.toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('on'), 2600); };
const m = S.member;
const ring = (v, size = 64) => { const r = size / 2 - 5, c = 2 * Math.PI * r; return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="Shine health ${v} of 100"><circle cx="${size/2}" cy="${size/2}" r="${r}" class="bg"/><circle cx="${size/2}" cy="${size/2}" r="${r}" class="fg" style="--c:${c};--o:${c * (1 - v / 100)}"/><text x="50%" y="54%" text-anchor="middle">${v}</text></svg>`; };
const bookBtn = (label = 'Book on Square', cls = 'btn gold') => `<a class="${cls}" href="${S.bookingUrl}" target="_blank" rel="noopener">${label} <span aria-hidden="true">↗</span></a>`;
const card3d = () => `<div class="bcard tilt" aria-label="Shine Club member card (demo)"><div class="shine"></div>
 <div class="bc-top"><img src="brand/smr-logo-96.webp" width="34" height="34" alt=""><span>SHINE CLUB</span><em>${esc(m.tier)}</em></div>
 <div class="bc-num">${esc(m.number)}</div>
 <div class="bc-bot"><div><small>Member</small><b>${esc(m.first)} ${esc(m.last)}</b></div><div><small>Rate</small><b>$${m.rate}/mo</b></div><div><small>Since</small><b>Oct 2026</b></div></div></div>`;
const pages = {
home: () => `
 <section class="hero rise"><p class="eyebrow">Good ${greet()}, ${esc(m.first)}</p><h1>Your Members Lounge</h1>
 <p class="muted">${esc(m.tier)} member · <span class="ok">● ${esc(m.status)}</span> · next bill ${esc(m.nextBill)}</p><div class="row">${bookBtn('Book my next shine')}<a class="btn ghost" href="#/perks">Open the vault</a></div></section>
 ${card3d()}
 <section class="grid2">
  <article class="panel next rise"><p class="eyebrow">Next detail</p><h2>${esc(S.next.date)} · ${esc(S.next.time)}</h2><p>${esc(S.next.service)}<br><span class="muted">${esc(S.next.vehicle)} · ${esc(S.next.where)}</span></p>
   <div class="row">${bookBtn('Reschedule on Square','btn ghost')}<a class="btn ghost" href="#/concierge">Message concierge</a></div></article>
  <article class="panel rise"><p class="eyebrow">Your garage</p>${S.vehicles.map(v => `<a class="veh" href="#/garage">${ring(v.health,52)}<span><b>${esc(v.name)}</b><small>${esc(v.detail)}</small></span><i>›</i></a>`).join('')}</article>
 </section>
 <section class="quick rise">${[['book','Book a detail'],['perks','Perks vault'],['care','Care tips'],['refer','Refer a friend'],['history','History'],['add','Add car'],['building','Building'],['plan','My plan']].map(([r,l]) => `<a href="#/${r}" class="q"><span>${l}</span></a>`).join('')}</section>
 <section class="panel trust rise"><b>★ ${S.rating.stars}</b> from ${S.rating.reviews} verified reviews<span class="muted"> · Mobile detailing across the 757</span></section>`,
garage: () => `<h1 class="rise">Your Garage</h1>
 <section class="studio rise" aria-label="3D studio viewer"><div class="stage" id="stage"><div class="loader"><span></span><em>Rolling into the studio…</em></div></div>
  <div class="stage-ui"><span class="pill">SAMPLE MODEL · not your car</span><span class="hint">Drag to rotate · pinch to zoom</span></div>
  <div class="paints" role="group" aria-label="Preview paint">${[['Obsidian','#0a0d14'],['Pearl','#d9dde2'],['Carmine','#5a0710'],['Midnight','#0b1a3a']].map(([n,c],i)=>`<button class="paint${i?'':' on'}" data-paint="${c}" style="--c:${c}" aria-label="${n}"></button>`).join('')}</div></section>
 <p class="credit rise">Sample 3D car: “CarConcept” by Eric Chadwick / Darmstadt Graphics Group, <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>, via Khronos glTF Sample Assets (plate texture removed, paint recolored).</p>
 <a class="addcta rise" href="#/add"><span class="plus">＋</span><span><b>Add your car in 3D</b><small>4 photos · front, both sides, rear · we build the model</small></span><i>›</i></a>
 <div class="stack">${S.vehicles.map(v => `<article class="panel rise"><div class="vrow"><div><h2>${esc(v.name)}</h2><p class="muted">${esc(v.detail)} · ${esc(v.plate)}</p></div>${ring(v.health)}</div>
 <dl class="two"><div><dt>Last visit</dt><dd>${esc(v.last)}</dd></div><div><dt>Protection</dt><dd>${esc(v.coat)}</dd></div></dl>
 <div class="row">${bookBtn('Book this car')}<a class="btn ghost" href="#/history">History</a></div></article>`).join('')}</div>
 <p class="fine">Shine health is a demo score. 3D models are a visual illustration, not a guarantee of results.</p>`,
add: () => `<h1 class="rise">Add your car in 3D</h1><p class="muted rise">Four clear photos, about 10 steps back, whole car in frame. Daylight or a bright garage works best.</p>
 <div class="shots rise">${SHOTS.map((sh,i)=>`<div class="shot" data-shot="${i}"><div class="frame">${sh.svg}<img alt="" hidden><span class="tag">${i+1} · ${sh.n}</span></div>
 <label class="btn ghost sm">Take / choose<input type="file" accept="image/*" capture="environment" data-file="${i}" hidden></label><p class="chk" data-chk="${i}">${sh.tip}</p></div>`).join('')}</div>
 <div class="sticky rise"><button class="btn gold" id="build" disabled>Build my 3D model</button></div>
 <p class="fine">Preview: photos stay on this device and a sample model is shown. At launch, photos upload securely to Shine My Ride 757 to build your model.</p>`,
building: () => `<section class="build"><div class="orb"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" class="bg"/><circle cx="60" cy="60" r="52" class="fg" id="pg"/></svg><b id="pct">0%</b></div>
 <h1>Building your 3D model</h1><p class="muted" id="step">Uploading your photos</p><p class="fine">Usually a few minutes. We’ll text you when it’s in your garage.</p></section>`,
book: () => `<h1 class="rise">Book a Detail</h1><p class="muted rise">All bookings are confirmed in Square. Pick a service to start.</p>
 <div class="stack">${S.services.map(s => `<article class="panel svc rise"><div><h2>${esc(s.name)}</h2><p class="muted">${esc(s.desc)}</p></div><span class="chip">${esc(s.tag)}</span></article>`).join('')}</div>
 <div class="sticky rise">${bookBtn('Open Square booking')}</div>
 <p class="fine">Interior shampoo is available on Gold and higher. 24-hour notice to reschedule; $25 no-show fee per Square booking policy.</p>`,
history: () => `<h1 class="rise">Service History</h1><ol class="timeline">${S.history.map(h => `<li class="rise"><time>${esc(h.date)}</time><b>${esc(h.service)}</b><span class="muted">${esc(h.vehicle)} · ${esc(h.notes)}</span></li>`).join('')}</ol><p class="fine">Sample records for preview.</p>`,
care: () => `<h1 class="rise">Care Between Visits</h1><div class="filters rise">${['All',...new Set(S.care.map(c => c.tag))].map((t,i) => `<button class="chip${i?'':' on'}" data-f="${t}">${t}</button>`).join('')}</div>
 <div class="stack" id="care">${S.care.map(c => `<details class="panel tip rise" data-t="${c.tag}"><summary><span class="chip">${c.tag}</span>${esc(c.t)}</summary><p>${esc(c.d)}</p></details>`).join('')}</div>`,
perks: () => `<h1 class="rise">Perks Vault</h1><p class="muted rise">Members-only. Tap a perk to reveal.</p>
 <div class="vault">${S.perks.map((p,i) => `<button class="perk rise${p.unlocked?'':' locked'}" data-perk="${i}" aria-pressed="false"><span class="pi">${p.icon}</span><b>${esc(p.t)}</b><span class="pd">${p.unlocked ? esc(p.d) : 'Coming soon'}</span></button>`).join('')}</div>`,
refer: () => `<h1 class="rise">Refer a Friend</h1><article class="panel rise"><p>Share your link. When a friend joins, our team follows up with you about your thank-you.</p>
 <div class="copy"><code>smrdetailing.com/shine-club?ref=DEMO</code><button class="btn gold" data-act="copy">Copy</button></div><p class="fine">Referral reward terms to be confirmed by the owners before launch.</p></article>`,
concierge: () => `<h1 class="rise">Concierge</h1><p class="muted rise">A real person on our team answers. Preview: nothing is sent.</p>
 <form class="panel rise" id="cform"><label>What do you need?<select name="k"><option>Reschedule my visit</option><option>Quote: ceramic or correction</option><option>Add interior shampoo (Gold+)</option><option>Something else</option></select></label><label>Details<textarea name="d" rows="4" required placeholder="Tell us about it"></textarea></label><button class="btn gold">Send request</button></form>
 <div class="row rise"><a class="btn ghost" href="tel:${S.tel}">Call ${S.phone}</a><a class="btn ghost" href="sms:${S.tel}">Text us</a></div>`,
plan: () => `<h1 class="rise">My Plan</h1>${card3d()}<article class="panel rise"><dl><div><dt>Tier</dt><dd>${esc(m.tier)} member</dd></div><div><dt>Monthly rate</dt><dd>$${m.rate}/mo, locked while your membership stays continuous</dd></div><div><dt>New-member rate</dt><dd>$${m.newRate}/mo</dd></div><div><dt>Status</dt><dd class="ok">${esc(m.status)}</dd></div><div><dt>Next bill</dt><dd>${esc(m.nextBill)}</dd></div></dl>
 <p class="fine">Each month includes one maintenance visit (not a full detail). Cancel anytime from your portal. If you cancel or your membership lapses, the founding rate ends and rejoining is at $${m.newRate}/mo.</p>
 <div class="row"><button class="btn ghost" data-act="pause">Pause</button><button class="btn ghost danger" data-act="cancel">Cancel membership</button></div></article>`,
more: () => `<h1 class="rise">More</h1><div class="stack">${[['history','Service history','Every visit, every car'],['care','Care tips','Keep the shine between visits'],['refer','Refer a friend','Share the club'],['concierge','Concierge','Talk to our team'],['plan','My plan','Rate, billing, pause or cancel']].map(([r,t,d]) => `<a class="panel link rise" href="#/${r}"><b>${t}</b><span class="muted">${d}</span><i>›</i></a>`).join('')}</div>`
};
const out = (cls, p) => `<svg class="guide" viewBox="0 0 200 120" aria-hidden="true"><path d="${p}"/></svg>`;
const SHOTS = [
 { n:'Front', tip:'Stand centered, headlights level.', svg: out(0,'M40 92 V62 Q42 48 60 44 L72 28 Q100 20 128 28 L140 44 Q158 48 160 62 V92 M40 92 H160 M52 66 h22 M126 66 h22 M80 80 h40') },
 { n:'Driver side', tip:'Full length, wheels in frame.', svg: out(0,'M14 88 Q18 66 50 62 L76 40 Q104 32 136 40 L160 62 Q186 66 188 88 Z M54 88 a14 14 0 0 0 28 0 M126 88 a14 14 0 0 0 28 0') },
 { n:'Passenger side', tip:'Same distance as the driver side.', svg: out(0,'M186 88 Q182 66 150 62 L124 40 Q96 32 64 40 L40 62 Q14 66 12 88 Z M146 88 a14 14 0 0 1 -28 0 M74 88 a14 14 0 0 1 -28 0') },
 { n:'Rear', tip:'Centered, plate area visible.', svg: out(0,'M40 92 V60 Q44 46 62 42 L74 28 Q100 22 126 28 L138 42 Q156 46 160 60 V92 M40 92 H160 M50 62 h26 M124 62 h26 M84 76 h32') }
];
const shots = [];
async function checkImage(file){ const bmp = await createImageBitmap(file); const w = bmp.width, h = bmp.height;
 const c = document.createElement('canvas'); c.width = 64; c.height = Math.max(1, Math.round(64*h/w)); const g = c.getContext('2d'); g.drawImage(bmp,0,0,c.width,c.height);
 const d = g.getImageData(0,0,c.width,c.height).data; let sum=0, sq=0; for (let i=0;i<d.length;i+=4){ const l=.2126*d[i]+.7152*d[i+1]+.0722*d[i+2]; sum+=l; sq+=l*l; }
 const n=d.length/4, mean=sum/n, sd=Math.sqrt(sq/n-mean*mean), issues=[];
 if (Math.min(w,h) < 720) issues.push('low resolution'); if (mean < 45) issues.push('too dark'); if (mean > 225) issues.push('too bright'); if (sd < 18) issues.push('looks blurry or blank'); if (h > w*1.15) issues.push('turn phone sideways');
 return { ok: !issues.length, issues, w, h }; }
let stop3d = null;
async function afterRender(key){
 if (stop3d) { stop3d(); stop3d = null; }
 if (key === 'garage') { const stage = $('#stage'); const go = async () => { const m = await import('./garage3d.js'); stop3d = m.mount(stage, 'models/sample-car.glb', { onReady: () => stage.classList.add('ready'), onProgress: p => stage.style.setProperty('--p', p) }); };
  ('IntersectionObserver' in window) ? new IntersectionObserver((e,o)=>{ if(e[0].isIntersecting){ o.disconnect(); const idle = window.requestIdleCallback || (f => setTimeout(f, 1)); (document.readyState === 'complete' ? Promise.resolve() : new Promise(r => addEventListener('load', r, { once: true }))).then(() => setTimeout(() => idle(go, { timeout: 2000 }), 1800)); } }).observe(stage) : go(); }
 if (key === 'building') { const { createModelJob, watchJob } = await import('./api-stub.js'); const job = await createModelJob(shots.filter(Boolean)); const c = 2*Math.PI*52;
  $('#pg').style.strokeDasharray = c; $('#pg').style.strokeDashoffset = c;
  watchJob(job.id, u => { if (!$('#pg')) return; $('#pg').style.strokeDashoffset = c*(1-u.progress/100); $('#pct').textContent = u.progress+'%'; $('#step').textContent = u.step;
   if (u.status === 'done') setTimeout(() => { toast('Preview: showing the sample model'); location.hash = '#/garage'; }, 700); }); }
}
function greet(){ const h = new Date().getHours(); return h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening'; }
function render(){
 const r = (location.hash.match(/#\/(\w+)/) || [,'home'])[1], key = pages[r] ? r : 'home';
 view.innerHTML = pages[key](); view.dataset.page = key;
 document.querySelectorAll('[data-r]').forEach(a => a.toggleAttribute('aria-current', a.dataset.r === key || (key !== 'home' && a.dataset.r === 'more' && !['garage','book','perks'].includes(key) && a.closest('.tabs'))));
 document.title = (key === 'home' ? 'Members Lounge' : routes.find(x => x[0] === key)[1]) + ' · Shine Club';
 [...view.querySelectorAll('.rise')].forEach((el, i) => el.style.setProperty('--d', Math.min(i, 8) * 45 + 'ms'));
 requestAnimationFrame(() => view.classList.add('in')); window.scrollTo(0, 0); afterRender(key);
}
window.addEventListener('hashchange', () => { view.classList.remove('in'); render(); });
document.addEventListener('click', e => {
 const p = e.target.closest('[data-perk]'); if (p) { p.classList.toggle('open'); p.setAttribute('aria-pressed', p.classList.contains('open')); if (navigator.vibrate) navigator.vibrate(8); return; }
 const f = e.target.closest('[data-f]'); if (f) { document.querySelectorAll('[data-f]').forEach(b => b.classList.toggle('on', b === f)); document.querySelectorAll('#care [data-t]').forEach(c => c.hidden = f.dataset.f !== 'All' && c.dataset.t !== f.dataset.f); return; }
 const a = e.target.closest('[data-act]'); if (!a) return;
 ({ copy: () => { navigator.clipboard?.writeText('smrdetailing.com/shine-club?ref=DEMO'); toast('Link copied'); },
    addcar: () => toast('Preview: adding vehicles goes through concierge at launch'),
    pause: () => toast('Preview: pause is handled by the secure portal at launch'),
    cancel: () => toast('Preview: one-click cancel runs in the secure portal at launch') })[a.dataset.act]?.();
});
document.addEventListener('change', async e => { const i = e.target.dataset.file; if (i == null || !e.target.files[0]) return; const f = e.target.files[0], box = $(`[data-shot="${i}"]`), chk = $(`[data-chk="${i}"]`);
 chk.textContent = 'Checking photo…'; chk.className = 'chk'; let r; try { r = await checkImage(f); } catch { r = { ok:false, issues:['could not read image'] }; }
 const img = box.querySelector('img'); img.src = URL.createObjectURL(f); img.hidden = false; box.classList.add('has');
 chk.textContent = r.ok ? '✓ Looks good' : '⚠ ' + r.issues.join(', ') + ' — retake?'; chk.className = 'chk ' + (r.ok ? 'good' : 'warn'); shots[i] = f;
 $('#build').disabled = shots.filter(Boolean).length < 4; });
document.addEventListener('click', e => { if (e.target.id === 'build') location.hash = '#/building'; const p = e.target.closest('[data-paint]'); if (p) { document.querySelectorAll('[data-paint]').forEach(b => b.classList.toggle('on', b === p)); window.dispatchEvent(new CustomEvent('paint', { detail: p.dataset.paint })); } });
document.addEventListener('submit', e => { e.preventDefault(); e.target.reset(); toast('Preview: request not sent. Concierge goes live at launch.'); });
document.addEventListener('pointermove', e => { const c = e.target.closest?.('.tilt'); if (!c || matchMedia('(prefers-reduced-motion: reduce)').matches) return; const b = c.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5; c.style.transform = `perspective(900px) rotateY(${x*10}deg) rotateX(${-y*10}deg)`; c.style.setProperty('--mx', (x+.5)*100 + '%'); });
document.addEventListener('pointerleave', e => { if (e.target.classList?.contains('tilt')) e.target.style.transform = ''; }, true);
render();
})();
