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
  next: { date: "Sat, Nov 7", time: "9:00 AM", service: "Monthly maintenance visit", vehicle: "Sample SUV", where: "At your driveway" },
  history: [
    { date: "Oct 14, 2026", service: "Monthly maintenance visit", vehicle: "Sample SUV", notes: "Hand wash, wheels, quick vacuum, spray sealant." },
    { date: "Sep 30, 2026", service: "Gold detail + interior shampoo", vehicle: "Sample Coupe", notes: "Shampoo is a Gold-or-higher service." },
    { date: "Sep 12, 2026", service: "Monthly maintenance visit", vehicle: "Sample SUV", notes: "Sample record." }
  ],
  services: [
    { id: "m", name: "Monthly maintenance visit", desc: "Hand wash & dry, wheels & tires, quick interior vacuum, spray sealant.", tag: "Included" },
    { id: "g", name: "Gold detail", desc: "Full interior + exterior. Interior shampoo available at Gold and higher.", tag: "Member pricing" },
    { id: "c", name: "Ceramic coating", desc: "Long-term gloss and protection. Quote by vehicle.", tag: "Member savings" },
    { id: "p", name: "Paint correction", desc: "Swirl and scratch removal before protection. Quote after inspection.", tag: "Quote" }
  ],
  perks: [
    { t: "Priority booking", d: "First access to the calendar May through August.", icon: "⚡", unlocked: true },
    { t: "Upgrade savings", d: "Member savings on ceramic coating and upgrades. Ask concierge for current terms.", icon: "◆", unlocked: true },
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
