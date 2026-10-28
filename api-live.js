/* LIVE client for the Garage 3D backend (server/handler.js). Used only when window.SHINE_GARAGE3D_LIVE === true.
   Same interface as api-stub.js. Photos go to our own server only; no API keys in the browser. */
const NAMES = ['front', 'driver', 'passenger', 'rear'];
export async function createModelJob(files) {
  const fd = new FormData(); files.forEach((f, i) => f && fd.append(NAMES[i], f, NAMES[i] + '.jpg'));
  const r = await fetch('/api/garage/models', { method: 'POST', body: fd, credentials: 'same-origin' });
  const b = await r.json(); if (!r.ok) throw new Error(b.error || 'upload failed'); return b;
}
export function watchJob(id, onUpdate) {
  const steps = ['Uploading your photos', 'Lining up the 4 angles', 'Sculpting the body', 'Painting & reflections', 'Studio polish'];
  let stop = false;
  (async function loop() { while (!stop) {
    try { const r = await fetch('/api/garage/models/' + encodeURIComponent(id), { credentials: 'same-origin' }); const j = await r.json();
      onUpdate({ ...j, step: steps[Math.min(4, Math.floor((j.progress || 0) / 20))] }); if (j.status === 'done' || j.status === 'failed') return;
    } catch { /* retry */ }
    await new Promise((s) => setTimeout(s, 4000)); } })();
  return () => { stop = true; };
}
