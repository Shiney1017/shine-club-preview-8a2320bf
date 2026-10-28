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
 ['history','History'],['care','Care'],['refer','Refer'],['concierge','Concierge'],['plan','Plan']
];
$('.tabs').innerHTML = routes.filter(r => r[3]).map(r => `<a href="#/${r[0]}" data-r="${r[0]}">${svg(r[2])}<span>${r[1]}</span></a>`).join('');
$('.side').innerHTML = routes.filter(r => r[0] !== 'more').map(r => `<a href="#/${r[0]}" data-r="${r[0]}">${r[1]}</a>`).join('');
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
 <section class="quick rise">${[['book','Book a detail'],['perks','Perks vault'],['care','Care tips'],['refer','Refer a friend'],['history','History'],['plan','My plan']].map(([r,l]) => `<a href="#/${r}" class="q"><span>${l}</span></a>`).join('')}</section>
 <section class="panel trust rise"><b>★ ${S.rating.stars}</b> from ${S.rating.reviews} verified reviews<span class="muted"> · Mobile detailing across the 757</span></section>`,
garage: () => `<h1 class="rise">Your Garage</h1><p class="muted rise">Shine health is a demo score from days since your last visit and protection type.</p>
 <div class="stack">${S.vehicles.map(v => `<article class="panel vcard rise" style="--h:${v.hue}"><div class="carart" aria-hidden="true"><svg viewBox="0 0 320 110"><defs><linearGradient id="g${v.id}" x1="0" x2="1"><stop offset="0" stop-color="hsl(${v.hue} 30% 30%)"/><stop offset=".5" stop-color="hsl(${v.hue} 40% 70%)"/><stop offset="1" stop-color="hsl(${v.hue} 30% 25%)"/></linearGradient></defs><path d="M20 80 Q30 55 80 50 L120 28 Q160 18 210 28 L255 50 Q298 55 302 80 Z" fill="url(#g${v.id})"/><circle cx="85" cy="82" r="17" fill="#0b0c10" stroke="#555" stroke-width="4"/><circle cx="240" cy="82" r="17" fill="#0b0c10" stroke="#555" stroke-width="4"/></svg><span class="sweep"></span></div>
 <div class="vrow"><div><h2>${esc(v.name)}</h2><p class="muted">${esc(v.detail)} · ${esc(v.plate)}</p></div>${ring(v.health)}</div>
 <dl><div><dt>Last visit</dt><dd>${esc(v.last)}</dd></div><div><dt>Protection</dt><dd>${esc(v.coat)}</dd></div></dl>
 <div class="row">${bookBtn('Book this car')}<a class="btn ghost" href="#/history">History</a></div></article>`).join('')}
 <button class="panel add rise" data-act="addcar">＋ Add a vehicle</button></div>`,
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
function greet(){ const h = new Date().getHours(); return h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening'; }
function render(){
 const r = (location.hash.match(/#\/(\w+)/) || [,'home'])[1], key = pages[r] ? r : 'home';
 view.innerHTML = pages[key](); view.dataset.page = key;
 document.querySelectorAll('[data-r]').forEach(a => a.toggleAttribute('aria-current', a.dataset.r === key || (key !== 'home' && a.dataset.r === 'more' && !['garage','book','perks'].includes(key) && a.closest('.tabs'))));
 document.title = (key === 'home' ? 'Members Lounge' : routes.find(x => x[0] === key)[1]) + ' · Shine Club';
 [...view.querySelectorAll('.rise')].forEach((el, i) => el.style.setProperty('--d', Math.min(i, 8) * 45 + 'ms'));
 requestAnimationFrame(() => view.classList.add('in')); window.scrollTo(0, 0);
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
document.addEventListener('submit', e => { e.preventDefault(); e.target.reset(); toast('Preview: request not sent. Concierge goes live at launch.'); });
document.addEventListener('pointermove', e => { const c = e.target.closest?.('.tilt'); if (!c || matchMedia('(prefers-reduced-motion: reduce)').matches) return; const b = c.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5; c.style.transform = `perspective(900px) rotateY(${x*10}deg) rotateX(${-y*10}deg)`; c.style.setProperty('--mx', (x+.5)*100 + '%'); });
document.addEventListener('pointerleave', e => { if (e.target.classList?.contains('tilt')) e.target.style.transform = ''; }, true);
render();
})();
