/* PREVIEW STUB of the server endpoint. Live version: POST /api/garage/models (multipart, 4 photos, session cookie)
   -> server uploads to Higgsfield, calls generate_3d server-side, stores GLB per member. Nothing leaves the browser here. */
export async function createModelJob(files) {
  const id = 'demo-' + Math.random().toString(36).slice(2, 8);
  return { id, status: 'queued', count: files.length };
}
export function watchJob(id, onUpdate) {
  const steps = ['Uploading your photos', 'Lining up the 4 angles', 'Sculpting the body', 'Painting & reflections', 'Studio polish'];
  let i = 0, p = 0;
  const t = setInterval(() => { p += 2 + Math.random() * 3; if (p >= 100) { p = 100; clearInterval(t); }
    i = Math.min(steps.length - 1, Math.floor(p / 20));
    onUpdate({ id, progress: Math.round(p), step: steps[i], status: p >= 100 ? 'done' : 'running', glbUrl: p >= 100 ? 'models/sample-car.glb' : null, sample: true }); }, 160);
  return () => clearInterval(t);
}
