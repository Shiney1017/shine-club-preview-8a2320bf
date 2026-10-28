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
const TOUR = [['garage','Your car in 3D','Spin it, zoom in, see it in a studio spotlight.'],['add','Add your car','Four photos, front, both sides and rear. We build the model.'],['plan','Your membership card','Your tier, your rate, your member number, always on hand.'],['perks','The perks vault','Members-only extras, unlocked as you go.'],['book','Book in seconds','Pick a service and confirm in Square.']];
const routes = [
 ['home','Lounge','home',1],['garage','Garage','garage',1],['book','Book','book',1],['perks','Vault','perks',1],['more','More','more',1],
 ['history','History'],['add','Add car'],['building','Building'],['care','Care'],['refer','Refer'],['concierge','Concierge'],['plan','Plan'],['tour','Tour'],['car','Car'],['transfer','Transfer car'],['rate','Rate visit'],['share','Share'],['invite','Invitation'],['code','Enter code'],['signin','Sign in'],['welcome','Welcome'],['savings','Savings']
];
$('.tabs').innerHTML = routes.filter(r => r[3]).map(r => `<a href="#/${r[0]}" data-r="${r[0]}">${svg(r[2])}<span>${r[1]}</span></a>`).join('');
$('.side').innerHTML = routes.filter(r => ['home','garage','book','perks','history','care','refer','concierge','plan'].includes(r[0])).map(r => `<a href="#/${r[0]}" data-r="${r[0]}">${r[1]}</a>`).join('');
const toast = m => { const t = $('.toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('on'), 2600); };
const m = S.member;
const ring = (v, size = 64) => { const r = size / 2 - 5, c = 2 * Math.PI * r; return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="Shine health ${v} of 100"><circle cx="${size/2}" cy="${size/2}" r="${r}" class="bg"/><circle cx="${size/2}" cy="${size/2}" r="${r}" class="fg" style="--c:${c};--o:${c * (1 - v / 100)}"/><text x="50%" y="54%" text-anchor="middle">${v}</text></svg>`; };
const bookBtn = (label = 'Book on Square', cls = 'btn gold') => `<a class="${cls}" href="${S.bookingUrl}" target="_blank" rel="noopener">${label} <span aria-hidden="true">↗</span></a>`;
const card3d = () => `<div class="cardwrap"><div class="bcard tilt" aria-label="Shine Club member card (demo)"><div class="shine"></div>
 <div class="bc-top"><img src="brand/smr-logo-96.webp" width="34" height="34" alt=""><span>SHINE CLUB</span><em>${esc(m.tier)}</em></div>
 <div class="bc-num">${esc(m.number)}</div>
 <div class="bc-bot"><div><small>Member</small><b>${esc(m.first)} ${esc(m.last)}</b></div><div><small>Rate</small><b>${/Complimentary/.test(m.billing||'') ? 'Comp' : '$' + m.rate + '/mo'}</b></div><div><small>Since</small><b>Oct 2026</b></div></div></div>${/Complimentary/.test(m.billing||'') ? '' : '<p class="lockbadge">🔒 Founding $99 locked while membership stays continuous</p>'}</div>`;
const monthsSince = (d) => { const a = new Date(d), b = new Date(); return Math.max(1, (b.getFullYear() - a.getFullYear()) * 12 + b.getMonth() - a.getMonth() + 1); };
const pages = {
car: () => { const id = (location.hash.split('?id=')[1]||'v1'), v = S.vehicles.find(x=>x.id===id)||S.vehicles[0], R = (S.reports||{})[v.id]||[], D = (S.docs||{})[v.id]||[];
 return `<p class="eyebrow rise">Your garage</p><h1 class="rise">${esc(v.name)}</h1><p class="muted rise">${esc(v.detail)} · ${esc(v.plate)} · ${esc(v.coat)}</p>
 <div class="row rise"><a class="btn ghost" href="#/garage">View in 3D</a><a class="btn ghost" href="#/transfer?id=${v.id}">Transfer car</a></div>
 <h2 class="rise sec">Condition reports</h2><div class="stack">${R.map(r=>`<article class="panel report rise"><div class="rhead"><div><p class="eyebrow">${esc(r.date)}</p><h2>After your visit</h2></div>${ring(r.score,58)}</div>
 <div class="pics">${r.photos.map(ph=>`<figure><div class="ph"></div><figcaption>${esc(ph)} · demo photo</figcaption></figure>`).join('')}</div>
 <dl class="rlist"><div><dt>Paint</dt><dd>${esc(r.paint)}</dd></div><div><dt>Protection</dt><dd>${esc(r.coat)}</dd></div><div><dt>Wheels</dt><dd>${esc(r.wheels)}</dd></div><div><dt>Interior</dt><dd>${esc(r.interior)}</dd></div></dl>
 <p class="nextstep"><b>Next step</b> ${esc(r.next)}</p></article>`).join('')||'<p class="muted">No reports yet.</p>'}</div>
 <h2 class="rise sec">Service history</h2><ol class="timeline">${S.history.filter(h=>h.vehicle===v.name).map(h=>`<li class="rise"><time>${esc(h.date)}</time><b>${esc(h.service)}</b><p class="muted">${esc(h.notes)}</p></li>`).join('')}</ol>
 <h2 class="rise sec">Warranty &amp; documents</h2><div class="stack">${D.map(d=>`<article class="panel doc rise"><span>📄</span><div><b>${esc(d.t)}</b><p class="muted">${esc(d.d)}</p></div></article>`).join('')}</div>
 <p class="fine">Demo data. Reports, photos and documents will come from each real visit.</p>`; },
transfer: () => { const id = (location.hash.split('?id=')[1]||'v1'), v = S.vehicles.find(x=>x.id===id)||S.vehicles[0];
 return `<h1 class="rise">Transfer a car</h1><p class="muted rise">Sold it or got a new one? Move your membership visits to another car.</p>
 <article class="panel rise"><p class="eyebrow">From</p><h2>${esc(v.name)}</h2><p class="muted">${esc(v.plate)}</p></article>
 <article class="panel rise"><p class="eyebrow">To</p><label class="fld">Year, make &amp; model<input placeholder="e.g. 2024 Honda Accord"></label><label class="fld">Color<input placeholder="e.g. Pearl White"></label></article>
 <div class="row rise"><button class="btn gold" disabled>Request transfer</button></div><p class="fine">Preview only. Your concierge confirms every transfer, and the car's report history stays with you.</p>`; },
rate: () => `<h1 class="rise">Rate your visit</h1><p class="muted rise">${esc(S.lastVisit.vehicle)} · ${esc(S.lastVisit.date)}</p>
 <article class="panel rise ratebox"><div class="bigstars" role="radiogroup" aria-label="Rating">${[1,2,3,4,5].map(n=>`<button data-star="${n}" aria-label="${n} stars">★</button>`).join('')}</div>
 <div class="tips" hidden><p class="eyebrow">Add a tip? Optional</p><div class="row">${['$5','$10','$20','Custom','No tip'].map(t=>`<button class="btn ghost" data-tip>${t}</button>`).join('')}</div></div></article>
 <a class="panel msgline rise" href="sms:${S.tel}"><span>💬</span><span><b>Message us directly</b><br><span class="muted">Text ${esc(S.phone)}. A real person answers.</span></span></a>
 <p class="fine">Preview: tips and ratings aren't sent anywhere.</p>`,
invite: () => `<section class="vip"><img class="vip-logo rise" src="brand/smr-logo-192.webp" width="88" height="88" alt="Shine My Ride 757">
 <p class="eyebrow rise">By invitation</p><h1 class="rise">You've been invited to Shine Club</h1>
 <p class="muted rise">A private members lounge from Shine My Ride 757. Your car in 3D, every visit on record, and a real person one text away.</p>
 <article class="panel rise vipcard"><p class="eyebrow">Your membership</p><h2>Founding Member</h2><p class="muted">Billing: Complimentary (invited)</p></article>
 <button class="btn gold rise" data-act="accept">Accept my invitation</button><p class="fine rise" id="authmsg" role="status"></p>
 <p class="fine rise">Already a member? <a href="#/signin">Sign in</a></p></section>`,
signin: () => `<section class="vip"><p class="eyebrow rise">Members</p><h1 class="rise">Welcome back</h1><p class="muted rise">We'll email you a 6-digit code. No password to remember.</p>
 <label class="fld rise">Email<input id="authemail" type="email" autocomplete="email" inputmode="email" placeholder="you@example.com"></label>
 <button class="btn gold rise" data-act="sendcode">Email me a code</button><p class="fine rise" id="authmsg" role="status"></p></section>`,
code: () => `<section class="vip"><p class="eyebrow rise">Check your inbox</p><h1 class="rise">Enter your code</h1>
 <p class="muted rise">We sent a 6-digit code to ${esc(sessionStorage.getItem('sc_hint') || 'your email')}. It works for 10 minutes.</p>
 <label class="fld rise">Email<input id="authemail" type="email" autocomplete="email" inputmode="email" value="${esc(sessionStorage.getItem('sc_email') || '')}" placeholder="The email your invite went to"></label>
 <div class="otp rise">${[0,1,2,3,4,5].map(i=>`<input inputmode="numeric" aria-label="Digit ${i+1}" data-otp="${i}" ${i?'':'autocomplete="one-time-code"'}>`).join('')}</div>
 <button class="btn gold rise" data-act="verify">Continue</button><p class="fine rise" id="authmsg" role="status"></p>
 <p class="fine rise"><a href="#/signin">Send a new code</a></p></section>`,
welcome: () => `<section class="vip"><p class="eyebrow rise">You're in</p><h1 class="rise">Welcome to Shine Club${m.first && m.first !== 'Demo' ? ', ' + esc(m.first) : ''}</h1>
 ${card3d()}
 <article class="panel rise"><dl class="rlist one"><div><dt>Membership</dt><dd>${esc(m.badge || 'Founding Member')}</dd></div><div><dt>Billing</dt><dd>${esc(m.billing || 'Complimentary (invited)')}</dd></div></dl></article>
 <div class="row rise"><a class="btn gold" href="#/add">Add my car in 3D</a><a class="btn ghost" href="#/home" data-skip>Go to my dashboard</a></div></section>`,
tour: () => `<h1 class="rise">Tour the Club</h1><p class="muted rise">Everything your membership opens up, in one place.</p>
 <section class="tour"><div class="phone-wrap"><div class="phone" id="phone"><div class="notch"></div>${TOUR.map((t,i)=>`<img src="tour/${t[0]}.webp" alt="${esc(t[1])} screen" ${i?'loading="lazy"':''} class="${i?'':'on'}" data-i="${i}">`).join('')}</div></div>
 <div class="tsteps">${TOUR.map((t,i)=>`<div class="tstep" data-i="${i}"><p class="eyebrow">0${i+1}</p><h2>${esc(t[1])}</h2><p class="muted">${esc(t[2])}</p></div>`).join('')}</div></section>
 <div class="row rise"><a class="btn gold" href="#/home" data-skip>Go to my dashboard</a></div><a class="skip-pill" href="#/home" data-skip>Skip to my dashboard →</a>`,
home: () => `
 <section class="hero rise"><p class="eyebrow">Good ${greet()}, ${esc(m.first)}</p><h1>Your Members Lounge</h1>
 <p class="muted">${esc(m.tier)} member · <span class="ok">● ${esc(m.status)}</span> · ${m.billing ? esc(m.billing) : 'next bill ' + esc(m.nextBill)}</p><div class="row">${bookBtn('Book my next shine')}<a class="btn ghost" href="#/perks">Open the vault</a><a class="btn ghost" href="#/tour">Tour the Club</a></div></section>
 <section class="stats rise"><div class="panel"><b data-count="${S.rating.stars}">0</b><small>Star rating</small></div><div class="panel"><b data-count="${S.rating.reviews}">0</b><small>Verified reviews</small></div><div class="panel"><b>$<span data-count="${m.rate}">0</span></b><small>Your rate</small><span class="demo">DEMO MEMBER</span></div></section>
 <section class="panel alert rise"><p class="eyebrow">Next service due</p><h2>${esc(S.next.date)} · ${esc(S.next.time)}</h2><p class="muted">${esc(S.next.vehicle)} · ${esc(S.next.where)}</p>
  <div class="wx"><span>🌧</span><p><b>Rain in the forecast (demo alert)</b><br><span class="muted">If weather moves in, we'll text you a new time to choose. Nothing changes until you pick.</span></p></div></section>
 <a class="panel ratecta rise" href="#/rate"><span><p class="eyebrow">Last visit · ${esc(S.lastVisit.date)}</p><b>How did we do?</b> <span class="muted">Rate it, tip if you want.</span></span><span class="stars">★★★★★</span></a>
 ${card3d()}
 <section class="grid2">
  <article class="panel next rise"><p class="eyebrow">Next detail</p><h2>${esc(S.next.date)} · ${esc(S.next.time)}</h2><p>${esc(S.next.service)}<br><span class="muted">${esc(S.next.vehicle)} · ${esc(S.next.where)}</span></p>
   <div class="row">${bookBtn('Reschedule on Square','btn ghost')}<a class="btn ghost" href="#/concierge">Message concierge</a></div></article>
  <article class="panel rise"><p class="eyebrow">Your garage</p>${S.vehicles.map(v => `<a class="veh" href="#/car?id=${v.id}">${ring(v.health,52)}<span><b>${esc(v.name)}</b><small>${esc(v.detail)}</small></span><i>›</i></a>`).join('')}</article>
 </section>
 <section class="quick rise">${[['book','Book a detail'],['perks','Perks vault'],['care','Care tips'],['refer','Refer a friend'],['history','History'],['add','Add car'],['building','Building'],['plan','My plan']].map(([r,l]) => `<a href="#/${r}" class="q"><span>${l}</span></a>`).join('')}</section>
 <section class="panel trust rise"><b>★ ${S.rating.stars}</b> from ${S.rating.reviews} verified reviews<span class="muted"> · Mobile detailing across the 757</span></section>`,
garage: () => `<h1 class="rise">Your Garage</h1>
 <section class="studio rise" aria-label="3D studio viewer"><div class="stage" id="stage"><div class="loader"><span></span><em>Rolling into the studio…</em></div></div>
  <div class="stage-ui"><span class="pill">SAMPLE MODEL · not your car</span><span class="hint">Drag to rotate · pinch to zoom</span></div>
  <div class="paints" role="group" aria-label="Preview paint">${[['Shine Blue','#1658d8'],['Obsidian','#0a0d14'],['Pearl','#d9dde2'],['Carmine','#5a0710'],['Midnight','#0b1a3a']].map(([n,c],i)=>`<button class="paint${i?'':' on'}" data-paint="${c}" style="--c:${c}" aria-label="${n}"></button>`).join('')}</div></section>
 <p class="credit rise">Sample 3D car: “CarConcept” by Eric Chadwick / Darmstadt Graphics Group, <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>, via Khronos glTF Sample Assets (plate texture removed, paint recolored).</p>
 <a class="addcta rise" href="#/add"><span class="plus">＋</span><span><b>Add your car in 3D</b><small>4 photos · front, both sides, rear · we build the model</small></span><i>›</i></a>
 <div class="stack">${S.vehicles.map(v => `<article class="panel rise"><div class="vrow"><div><h2>${esc(v.name)}</h2><p class="muted">${esc(v.detail)} · ${esc(v.plate)}</p></div>${ring(v.health)}</div><a class="btn ghost sm" href="#/car?id=${v.id}">Reports, history &amp; docs →</a>
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
 <div class="vault">${S.perks.map((p,i) => `<button class="perk rise${p.unlocked?'':' locked'}" data-perk="${i}" aria-pressed="false"><span class="pi">${p.icon}</span><b>${esc(p.t)}</b><span class="pd">${p.unlocked ? esc(p.d) : 'Coming soon'}</span></button>`).join('')}</div>
 <div class="stack"><a class="panel msgline rise" href="#/savings"><span>💰</span><span><b>Your savings &amp; loyalty</b><br><span class="muted">${S.config.addonDiscountPct}% off add-ons, your rate lock, your tier</span></span></a></div>`,
savings: () => { const C = S.config, months = monthsSince(m.since), lock = (C.newRate - C.foundingRate) * months, add = Math.round(C.demoBooked.price * C.addonDiscountPct) / 100;
 const L = C.loyalty, cur = [...L].reverse().find(t => months >= t.from), nxt = L.find(t => t.from > months);
 return `<h1 class="rise">Your Savings</h1><p class="muted rise">Demo math with real Shine My Ride prices.</p>
 <article class="panel rise meter"><small>Saved so far (demo)</small><b class="display">$<span data-count="${(lock + add).toFixed(2)}">0</span></b></article>
 <details class="panel rise"><summary>How we got that</summary><dl class="rlist one"><div><dt>Founding rate lock</dt><dd>$${C.newRate} − $${C.foundingRate} = $${C.newRate - C.foundingRate}/mo × ${months} mo = $${lock}</dd></div>
 <div><dt>Members-only add-on discount (${C.addonDiscountPct}%)</dt><dd>${esc(C.demoBooked.name)} $${C.demoBooked.price} → you save $${add.toFixed(2)} (demo booking)</dd></div></dl></details>
 <article class="panel rise"><p class="eyebrow">Loyalty</p><h2>${esc(cur.t)}</h2><p class="muted">${nxt ? `${nxt.from - months} more month${nxt.from - months === 1 ? '' : 's'} to ${esc(nxt.t)}` : 'Top tier reached'}</p>
 <div class="bar"><i style="width:${nxt ? Math.round(100 * (months - cur.from) / (nxt.from - cur.from)) : 100}%"></i></div><p class="fine">Tiers grow with continuous membership. Tier perks are announced by the owners.</p></article>`; },
refer: () => { const R = S.config.referral; return `<h1 class="rise">Refer a Friend</h1>
 <article class="panel rise"><div class="refer2"><div><b class="display">$${R.friend}</b><small>off for your friend</small></div><div><b class="display">$${R.referrer}</b><small>credit for you</small></div></div>
 <div class="copy"><code>smrdetailing.com/shine-club?ref=DEMO</code><button class="btn gold" data-act="copy">Copy</button></div></article>
 <a class="panel msgline rise" href="#/share"><span>🎁</span><span><b>Gift a membership or add a household car</b><br><span class="muted">See the options</span></span></a>`; },
share: () => { const C = S.config, p = (v) => v ? '$' + v + '/mo' : 'Price set by owner'; return `<h1 class="rise">Share the Club</h1>
 <article class="panel rise"><p class="eyebrow">Gift membership</p><h2>Give someone their first month of shine</h2><p class="muted">${p(C.giftPrice)}</p><button class="btn ghost sm" disabled>Coming soon</button></article>
 <article class="panel rise"><p class="eyebrow">Household plan</p><h2>Every car in the driveway, one plan</h2><p class="muted">${p(C.householdPrice)}</p><a class="btn ghost sm" href="#/concierge">Ask concierge</a></article>`; },
concierge: () => `<h1 class="rise">Concierge</h1><p class="muted rise">A real person on our team answers. Preview: nothing is sent.</p>
 <form class="panel rise" id="cform"><label>What do you need?<select name="k"><option>Reschedule my visit</option><option>Quote: ceramic or correction</option><option>Add interior shampoo (Gold+)</option><option>Something else</option></select></label><label>Details<textarea name="d" rows="4" required placeholder="Tell us about it"></textarea></label><button class="btn gold">Send request</button></form>
 <div class="row rise"><a class="btn ghost" href="tel:${S.tel}">Call ${S.phone}</a><a class="btn ghost" href="sms:${S.tel}">Text us</a></div>`,
plan: () => `<h1 class="rise">My Plan</h1>${card3d()}<p class="spots rise"><b>${S.config.foundingLeft} of ${S.config.foundingTotal}</b> founding spots left · ${esc(S.config.foundingNote)}</p><article class="panel rise"><dl><div><dt>Tier</dt><dd>${esc(m.tier)} member</dd></div><div><dt>Monthly rate</dt><dd>$${m.rate}/mo, locked while your membership stays continuous</dd></div><div><dt>New-member rate</dt><dd>$${m.newRate}/mo</dd></div><div><dt>Status</dt><dd class="ok">${esc(m.status)}</dd></div>${m.billing ? `<div><dt>Billing</dt><dd>${esc(m.billing)}</dd></div>` : `<div><dt>Next bill</dt><dd>${esc(m.nextBill)}</dd></div>`}</dl>
 <p class="fine">Each month includes one maintenance visit (not a full detail). Cancel anytime from your portal. If you cancel or your membership lapses, the founding rate ends and rejoining is at $${m.newRate}/mo.</p>
 <div class="row"><button class="btn ghost" data-act="pause">Pause</button><button class="btn ghost danger" data-act="cancel">Cancel membership</button></div></article>`,
more: () => `<h1 class="rise">More</h1><div class="stack">${[['tour','Replay the tour','See everything the Club includes'],['savings','Savings &amp; loyalty','Your rate lock, discount and tier'],['share','Gift & household','Share the Club'],['history','Service history','Every visit, every car'],['care','Care tips','Keep the shine between visits'],['refer','Refer a friend','Share the club'],['concierge','Concierge','Talk to our team'],['plan','My plan','Rate, billing, pause or cancel']].map(([r,t,d]) => `<a class="panel link rise" href="#/${r}"><b>${t}</b><span class="muted">${d}</span><i>›</i></a>`).join('')}</div>`
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
 if (key === 'garage') { const stage = $('#stage'); const go = async () => { const m = await import('./garage3d.js'); stop3d = m.mount(stage, 'models/sample-car.glb', { paint: 0x1658d8, onReady: () => stage.classList.add('ready'), onProgress: p => stage.style.setProperty('--p', p) }); };
  ('IntersectionObserver' in window) ? new IntersectionObserver((e,o)=>{ if(e[0].isIntersecting){ o.disconnect(); const idle = window.requestIdleCallback || (f => setTimeout(f, 1)); (document.readyState === 'complete' ? Promise.resolve() : new Promise(r => addEventListener('load', r, { once: true }))).then(() => setTimeout(() => idle(go, { timeout: 2000 }), 1800)); } }).observe(stage) : go(); }
 if (key === 'building') { const { createModelJob, watchJob } = await import(window.SHINE_GARAGE3D_LIVE === true ? './api-live.js' : './api-stub.js'); const job = await createModelJob(window.SHINE_GARAGE3D_LIVE === true ? shots : shots.filter(Boolean)); const c = 2*Math.PI*52;
  $('#pg').style.strokeDasharray = c; $('#pg').style.strokeDashoffset = c;
  watchJob(job.id, u => { if (!$('#pg')) return; $('#pg').style.strokeDashoffset = c*(1-u.progress/100); $('#pct').textContent = u.progress+'%'; $('#step').textContent = u.step;
   if (u.status === 'done') setTimeout(() => { toast('Preview: showing the sample model'); location.hash = '#/garage'; }, 700); }); }
}
function greet(){ const h = new Date().getHours(); return h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening'; }
function render(){
 const r = (location.hash.match(/#\/(\w+)/) || [,(localStorage.getItem('sc_tour_done') ? 'home' : 'tour')])[1], key = pages[r] ? r : 'home';
 view.innerHTML = pages[key](); view.dataset.page = key; document.body.classList.toggle('auth', ['invite','code','signin'].includes(key));
 document.querySelectorAll('[data-r]').forEach(a => a.toggleAttribute('aria-current', a.dataset.r === key || (key !== 'home' && a.dataset.r === 'more' && !['garage','book','perks'].includes(key) && a.closest('.tabs'))));
 document.title = (key === 'home' ? 'Members Lounge' : routes.find(x => x[0] === key)[1]) + ' · Shine Club';
 [...view.querySelectorAll('.rise')].forEach((el, i) => el.style.setProperty('--d', Math.min(i, 8) * 45 + 'ms'));
 requestAnimationFrame(() => view.classList.add('in')); window.scrollTo(0, 0); afterRender(key);
}
window.addEventListener('hashchange', () => { view.classList.remove('in'); render(); });
document.addEventListener('click', e => { const st = e.target.closest('[data-star]'); if (st) { const n=+st.dataset.star; document.querySelectorAll('[data-star]').forEach(b=>b.classList.toggle('on', +b.dataset.star<=n)); document.querySelector('.tips').hidden=false; } if (e.target.closest('[data-tip]')) toast('Preview: thank you! Nothing was charged.'); if (e.target.closest('[data-skip]')) try { localStorage.setItem('sc_tour_done', '1'); } catch {}
 const p = e.target.closest('[data-perk]'); if (p) { p.classList.toggle('open'); p.setAttribute('aria-pressed', p.classList.contains('open')); if (navigator.vibrate) navigator.vibrate(8); return; }
 const f = e.target.closest('[data-f]'); if (f) { document.querySelectorAll('[data-f]').forEach(b => b.classList.toggle('on', b === f)); document.querySelectorAll('#care [data-t]').forEach(c => c.hidden = f.dataset.f !== 'All' && c.dataset.t !== f.dataset.f); return; }
 const a = e.target.closest('[data-act]'); if (!a) return;
 if (['accept','sendcode','verify'].includes(a.dataset.act)) { authAct(a); return; }
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

// ---- Accounts (invite / email code). Live only when window.SHINE_MEMBERS_LIVE === true; otherwise a safe demo.
const LIVE = window.SHINE_MEMBERS_LIVE === true;
async function api(path, body) { const r = await fetch(path, { method: body ? 'POST' : 'GET', credentials: 'same-origin', headers: body ? { 'Content-Type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined });
 const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.error || 'Something went wrong. Try again.'); return j; }
async function authAct(btn) {
 const msg = document.getElementById('authmsg'), say = (t) => { if (msg) msg.textContent = t; };
 btn.disabled = true; say('');
 try {
  if (btn.dataset.act === 'accept') { const token = (location.hash.split('/')[2] || '').trim();
   const r = LIVE ? await api('/api/invite/start', { token }) : { emailHint: 'y•••@example.com (demo)' };
   sessionStorage.setItem('sc_hint', r.emailHint); location.hash = '#/code'; }
  if (btn.dataset.act === 'sendcode') { const email = document.getElementById('authemail').value.trim();
   if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { say('Enter the email you joined with.'); return; }
   if (LIVE) await api('/api/login/start', { email }); sessionStorage.setItem('sc_email', email); sessionStorage.setItem('sc_hint', email); location.hash = '#/code'; }
  if (btn.dataset.act === 'verify') { const email = document.getElementById('authemail').value.trim(), code = [...document.querySelectorAll('[data-otp]')].map(i => i.value).join('');
   if (!/^\d{6}$/.test(code)) { say('Enter all 6 digits.'); return; }
   if (LIVE) { const r = await api('/api/login/verify', { email, code }); applyMember(r.member); } else applyMember({ name: 'Demo Member', badge: 'Founding Member', billing: 'Complimentary (invited)' });
   localStorage.setItem('sc_tour_done', '1'); location.hash = '#/welcome'; }
 } catch (err) { say(err.message); } finally { btn.disabled = false; }
}
function applyMember(x) { if (!x) return; const m = S.member; const [first, ...rest] = String(x.name || '').split(' ');
 Object.assign(m, { first: first || m.first, last: rest.join(' ') || '', badge: x.badge, billing: x.billing, tier: x.founding ? 'Founding' : (x.tier || m.tier),
  initials: ((first || '')[0] || '') + ((rest[0] || '')[0] || ''), number: x.id ? 'SC-' + String(x.id).slice(0, 6).toUpperCase() : m.number, status: 'Active' });
 if (Array.isArray(x.cars) && x.cars.length) S.vehicles = x.cars; const av = document.querySelector('.avatar'); if (av && m.initials) av.textContent = m.initials; }
document.addEventListener('input', (e) => { const i = e.target.closest('[data-otp]'); if (!i) return;
 const v = i.value.replace(/\D/g, ''); if (v.length > 1) { [...v].slice(0, 6).forEach((d, k) => { const t = document.querySelector(`[data-otp="${k}"]`); if (t) t.value = d; }); document.querySelector(`[data-otp="${Math.min(5, v.length - 1)}"]`)?.focus(); return; }
 i.value = v; if (v) document.querySelector(`[data-otp="${+i.dataset.otp + 1}"]`)?.focus(); });
document.addEventListener('keydown', (e) => { const i = e.target.closest?.('[data-otp]'); if (i && e.key === 'Backspace' && !i.value) document.querySelector(`[data-otp="${+i.dataset.otp - 1}"]`)?.focus(); });
if (LIVE) api('/api/me').then((r) => { applyMember(r.member || r); render(); }).catch(() => { if (!/#\/(invite|code|signin)/.test(location.hash)) location.hash = '#/signin'; });

})();
