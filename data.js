/* DEMO DATA ONLY. No real customers. Replace with portal API (/shine-club/member) at launch. */
window.SC = {
  demo: true,
  bookingUrl: "https://book.squareup.com/appointments/wh75rtw86875x0/location/LX06E1Q8R55V6/services",
  phone: "(757) 689-9821", tel: "+17576899821",
  rating: { stars: 4.9, reviews: 307 },
  member: { first: "Demo", last: "Member", initials: "DM", since: "2026-10-01", number: "SC-0000-DEMO", tier: "Founding", rate: 99, newRate: 149, status: "Active", nextBill: "Nov 1, 2026", level: "Gold" },
  vehicles: [
    { id: "v1", name: "Sample SUV", detail: "Large SUV · Midnight Black", plate: "DEMO-01", health: 86, last: "Oct 14, 2026", coat: "Spray sealant", hue: 220 },
    { id: "v2", name: "Sample Coupe", detail: "Coupe · Pearl White", plate: "DEMO-02", health: 72, last: "Sep 30, 2026", coat: "Ceramic (demo)", hue: 350 }
  ],
  // Owner-approved config (Oct 28, 2026). Change values here only.
  config: {
    foundingLeft: 23, foundingTotal: 100, foundingNote: "100 new spots added each quarter",
    addonDiscountPct: 10,               // members-only add-on discount, approved range 10-20%
    referral: { friend: 100, referrer: 100 }, // smr_price_list.md, Jay approved Oct 22, 2026
    newRate: 149, foundingRate: 99,
    demoBooked: { name: "Gold Full (Sedan)", price: 525 }, // real Square price, demo booking
    // Loyalty (owner-approved Oct 28, 2026): months of continuous membership. One perk per tier; add-on discount stays within 10-20%.
    loyalty: [
      { t: "Member", from: 0, addonPct: 10, perk: "10% off add-ons" },
      { t: "Silver Circle", from: 3, addonPct: 15, perk: "15% off add-ons" },
      { t: "Gold Circle", from: 6, addonPct: 15, perk: "Priority booking" },
      { t: "Platinum Circle", from: 12, addonPct: 20, perk: "20% off add-ons plus a yearly bonus perk" }
    ],
    giftPrice: null, householdPrice: null // owner sets; shown as "set by owner" until filled
  },
  reports: {
    v1: [{ date: "Oct 14, 2026", score: 86, paint: "Good", coat: "Sealant beading well", wheels: "Light brake dust", interior: "Clean", next: "Keep the monthly visit; consider ceramic before summer.", photos: ["Hood", "Driver door", "Wheel"] },
         { date: "Sep 12, 2026", score: 81, paint: "Fair: light water spots", coat: "Sealant applied", wheels: "Cleaned", interior: "Vacuumed", next: "Park in shade after washing when you can.", photos: ["Hood", "Roof"] }],
    v2: [{ date: "Sep 30, 2026", score: 72, paint: "Light swirls on doors", coat: "Ceramic (demo): beading reduced", wheels: "Good", interior: "Shampooed", next: "Ask us about a paint-correction quote.", photos: ["Door", "Seat"] }]
  },
  docs: { v1: [{ t: "Spray sealant · service record", d: "Oct 14, 2026" }], v2: [{ t: "Ceramic coating · care sheet (demo)", d: "Sep 30, 2026" }, { t: "Coating warranty (demo · terms from installer)", d: "Sep 30, 2026" }] },
  lastVisit: { date: "Oct 14, 2026", vehicle: "Sample SUV", tech: "Demo tech" },
  next: { date: "Sat, Nov 7", time: "9:00 AM", service: "Monthly maintenance visit", vehicle: "Sample SUV", where: "At your driveway" },
  history: [
    { date: "Oct 14, 2026", service: "Monthly maintenance visit", vehicle: "Sample SUV", notes: "Hand wash, wheels, quick vacuum, spray sealant." },
    { date: "Sep 30, 2026", service: "Gold detail + interior shampoo", vehicle: "Sample Coupe", notes: "Shampoo is a Gold-or-higher service." },
    { date: "Sep 12, 2026", service: "Monthly maintenance visit", vehicle: "Sample SUV", notes: "Sample record." }
  ],
  services: [
    { id: "m", name: "Monthly maintenance visit", desc: "Hand wash & dry, wheels & tires, quick interior vacuum, spray sealant.", tag: "Included" },
    { id: "g", name: "Gold detail", desc: "Full interior + exterior. Interior shampoo available at Gold and higher.", tag: "Member pricing" },
    { id: "c", name: "Ceramic coating", desc: "Long-term gloss and protection. Quote by vehicle.", tag: "Quote" },
    { id: "p", name: "Paint correction", desc: "Swirl and scratch removal before protection. Quote after inspection.", tag: "Quote" }
  ],
  perks: [
    { t: "Priority booking", d: "First access to the calendar May through August.", icon: "⚡", unlocked: true },
    { t: "Members-only add-on discount", d: "10% off add-ons and upgrades.", icon: "◆", unlocked: true },
    { t: "Locked founding rate", d: "$99/mo locked while your membership stays continuous.", icon: "🔒", unlocked: true },
    { t: "Seasonal drop", d: "Members-only seasonal offer. Announced in the lounge first.", icon: "✦", unlocked: false }
  ],
  care: [
    { t: "Wash in the shade", d: "Hot panels dry soap into spots. Morning or evening is best.", tag: "Exterior" },
    { t: "Two-bucket rule", d: "One bucket for soap, one for rinse. Fewer swirls.", tag: "Exterior" },
    { t: "Skip the tunnel wash", d: "Brushes undo protection. Touchless only between visits.", tag: "Protection" },
    { t: "Spills: blot, don't rub", d: "Blot with a microfiber, then text us. Shampoo is a Gold-or-higher service.", tag: "Interior" },
    { t: "Bird droppings fast", d: "Remove within 24 h with quick detailer to avoid etching.", tag: "Paint" }
  ]
};
/* Loyalty helper: months = continuous months (+ any starting credit, e.g. comped VIP starts at top tier). */
window.SC.loyaltyFor = function (months, L) {
  L = L || window.SC.config.loyalty; var cur = L[0], nxt = null;
  for (var i = 0; i < L.length; i++) { if (months >= L[i].from) cur = L[i]; else { nxt = L[i]; break; } }
  var perks = L.filter(function (t) { return t.from <= cur.from && t.from > 0; }).map(function (t) { return t.perk; });
  return { cur: cur, nxt: nxt, addonPct: cur.addonPct, perks: perks };
};
