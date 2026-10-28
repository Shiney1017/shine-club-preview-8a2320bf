/* Shine Club studio turntable viewer. Lazy-loaded only on the Garage page. */
import * as T from './vendor/three.module.min.js';
import { GLTFLoader } from './vendor/GLTFLoader.js';
import { OrbitControls } from './vendor/OrbitControls.js';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';

export function mount(host, url, { onProgress, onReady, paint } = {}) {
  const low = (navigator.deviceMemory || 8) < 4 || matchMedia('(max-width:600px)').matches;
  const r = new T.WebGLRenderer({ antialias: !low, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: location.search.includes('shot') });
  r.setPixelRatio(Math.min(devicePixelRatio, low ? 1.5 : 2));
  r.toneMapping = T.ACESFilmicToneMapping; r.toneMappingExposure = 1.15; r.outputColorSpace = T.SRGBColorSpace;
  host.appendChild(r.domElement);
  const scene = new T.Scene(); scene.background = new T.Color(0x000000);
  const cam = new T.PerspectiveCamera(30, 1, 0.1, 100);

  // Studio env: neutral room + strip softboxes for long clean highlights on the paint
  const envS = new RoomEnvironment(); envS.background = new T.Color(0x000000);
  envS.children.forEach(o => { if (o.material && o.material.color) o.material.color.multiplyScalar(0.25); });
  const strip = (x, y, z, w, h, k) => { const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: new T.Color(k, k, k), side: T.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); envS.add(m); };
  strip(0, 9, 0, 12, 1.2, 9); strip(-8, 4, 4, 0.5, 7, 5); strip(8, 4, -4, 0.5, 7, 5);
  const pm = new T.PMREMGenerator(r); scene.environment = pm.fromScene(envS, 0.02).texture;

  // Key + rim lights for drama
  const key = new T.DirectionalLight(0xffffff, 2.2); key.position.set(3, 6, 4); scene.add(key);
  const rim = new T.DirectionalLight(0xbcd2ff, 1.6); rim.position.set(-5, 3, -6); scene.add(rim);

  // Mirror-black floor with faint concentric rings
  const c = document.createElement('canvas'); c.width = c.height = 1024; const g = c.getContext('2d');
  const grd = g.createRadialGradient(512, 512, 0, 512, 512, 512); grd.addColorStop(0, '#1c1c20'); grd.addColorStop(.3, '#0c0c0e'); grd.addColorStop(.6, '#040405'); grd.addColorStop(1, '#000');
  g.fillStyle = grd; g.fillRect(0, 0, 1024, 1024);
  for (let i = 1; i < 14; i++) { g.strokeStyle = `rgba(255,255,255,${0.05 - i * 0.003})`; g.lineWidth = 1.5; g.beginPath(); g.arc(512, 512, i * 36, 0, 7); g.stroke(); }
  const ft = new T.CanvasTexture(c); ft.colorSpace = T.SRGBColorSpace; ft.anisotropy = 4;
  const floor = new T.Mesh(new T.CircleGeometry(12, 96), new T.MeshBasicMaterial({ map: ft, transparent: true, opacity: 0.78 }));
  floor.rotation.x = -Math.PI / 2; floor.renderOrder = 1; if (!location.search.includes('nofloor')) scene.add(floor);

  // Soft contact shadow
  const sc = document.createElement('canvas'); sc.width = sc.height = 256; const sg = sc.getContext('2d');
  const sgr = sg.createRadialGradient(128, 128, 10, 128, 128, 128); sgr.addColorStop(0, 'rgba(255,255,255,1)'); sgr.addColorStop(1, 'rgba(0,0,0,1)'); sg.fillStyle = sgr; sg.fillRect(0, 0, 256, 256);
  const shadow = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ color: 0x000000, alphaMap: new T.CanvasTexture(sc), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.003; shadow.renderOrder = 2; if (!location.search.includes('noshadow')) scene.add(shadow);

  const ctl = new OrbitControls(cam, r.domElement);
  Object.assign(ctl, { enableDamping: true, dampingFactor: 0.07, enablePan: false, autoRotate: true, autoRotateSpeed: 60 / 8.5 /* ≈8.5 s per turn */, minPolarAngle: 0.9, maxPolarAngle: 1.45 });
  ctl.addEventListener('start', () => { ctl.autoRotate = false; clearTimeout(ctl.t); });
  ctl.addEventListener('end', () => { ctl.t = setTimeout(() => ctl.autoRotate = true, 2500); });

  let paints = []; const onPaint = e => paints.forEach(m => m.color.set(e.detail)); addEventListener('paint', onPaint);
  const turn = new T.Group(); scene.add(turn);
  const mirror = new T.Group(); mirror.scale.y = -1; if (!location.search.includes('nomirror')) scene.add(mirror);
  new GLTFLoader().load(url, gltf => {
    const car = gltf.scene;
    car.traverse(o => { if (!o.isMesh) return; const m = o.material;
      if (/licen/i.test(m.name || '')) { m.map = null; m.color = new T.Color(0x111111); m.emissiveMap = null; }
      if (/^Paint 1/i.test(m.name || '')) { m.color = new T.Color(paint || 0x0a0d14); m.normalMap = null; m.metalness = 0.55; m.roughness = 0.28; if ('clearcoat' in m) { m.clearcoat = 1; m.clearcoatRoughness = 0.03; } m.envMapIntensity = 1.4; }
    });
    paints = []; car.traverse(o => { if (o.isMesh && /^Paint 1/i.test(o.material.name || '')) paints.push(o.material); });
    const box = new T.Box3().setFromObject(car), size = box.getSize(new T.Vector3()), ctr = box.getCenter(new T.Vector3());
    const s = 4.4 / Math.max(size.x, size.z); car.scale.setScalar(s);
    const wb = new T.Box3(); car.traverse(o => { if (o.isMesh && /^Wheel|Tire/i.test((o.parent && o.parent.name) + ' ' + o.name)) wb.expandByObject(o); });
    const minY = wb.isEmpty() ? box.min.y : wb.min.y; car.position.set(-ctr.x * s, -minY * s, -ctr.z * s);
    turn.add(car);
    const refl = car.clone(true); mirror.add(refl);
    shadow.scale.set(size.x * s * 1.5, size.z * s * 1.35, 1);
    const h = size.y * s; ctl.target.set(0, h * 0.42, 0); cam.position.set(4.3, h * 0.85 + 0.3, 5.3); ctl.minDistance = 4.5; ctl.maxDistance = 12; ctl.update();
    onReady && onReady();
  }, e => onProgress && e.total && onProgress(e.loaded / e.total), () => host.dataset.err = '1');

  const fit = () => { const w = host.clientWidth, hh = host.clientHeight; r.setSize(w, hh, false); cam.aspect = w / hh; cam.fov = cam.aspect < 1.3 ? 30 * Math.min(2, 1.75 / cam.aspect) : 30; cam.updateProjectionMatrix(); };
  const ro = new ResizeObserver(fit); ro.observe(host); fit();
  let vis = true; const io = new IntersectionObserver(([e]) => vis = e.isIntersecting); io.observe(host);
  let last = 0; const minDt = low ? 1000 / 40 : 0; r.setAnimationLoop(t => { if (!vis || document.hidden || t - last < minDt) return; last = t; ctl.update(); mirror.quaternion.copy(turn.quaternion); r.render(scene, cam); });
  return () => { removeEventListener('paint', onPaint); r.setAnimationLoop(null); ro.disconnect(); io.disconnect(); r.dispose(); host.innerHTML = ''; };
}
