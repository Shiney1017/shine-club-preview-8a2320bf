/* Talk to <assistant>: in-app Grok Voice for signed-in members. Hidden unless the server says voice is on
   (VOICE_LIVE=on + XAI_API_KEY + MEMBERS_LIVE=on). Preview-only demo: ?demo=voice (no connection, no mic). */
(() => {
  const TEL = '+17576899821', TELH = '(757) 689-9821';
  const demo = window.SHINE_MEMBERS_LIVE !== true && new URLSearchParams(location.search).get('demo') === 'voice';
  const HIDE = /^#\/(tour|invite|signin|code|welcome|building)/;
  let name = 'Sparkle', live = false, sess = null;
  const $ = (h) => { const d = document.createElement('div'); d.innerHTML = h.trim(); return d.firstChild; };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const mic = '<svg viewBox="0 0 24 24"><path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-2.1a7 7 0 0 0 6-6.9h-2Z"/></svg>';
  let fab, sheet;
  function mount() {
    fab = $(`<button class="vt-fab" type="button" hidden aria-label="Talk to ${esc(name)}"><span class="vt-orb">${mic}</span><span>Talk to ${esc(name)}</span></button>`);
    sheet = $(`<section class="vt-sheet" hidden role="dialog" aria-label="${esc(name)} voice chat" data-state="idle">
      <div class="vt-head"><span class="vt-orb">${mic}</span><div><b>${esc(name)}</b><small>Shine My Ride's AI assistant</small></div><button class="vt-x" type="button" aria-label="Close">×</button></div>
      <div class="vt-big" aria-hidden="true"></div><p class="vt-status">Connecting…</p>
      <div class="vt-log" aria-live="polite"></div><div class="vt-acts"></div>
      <div class="vt-acts"><button class="vt-btn ghost vt-end" type="button">End chat</button></div>
      <p class="vt-fine">AI assistant. Booking requests go to our team to confirm. Nothing is charged.</p></section>`);
    document.body.append(fab, sheet);
    fab.onclick = open; sheet.querySelector('.vt-x').onclick = sheet.querySelector('.vt-end').onclick = close;
    addEventListener('hashchange', vis); vis();
  }
  const vis = () => { if (fab) fab.hidden = !(live || demo) || HIDE.test(location.hash); };
  const st = (state, text) => { sheet.dataset.state = state; sheet.querySelector('.vt-status').textContent = text; };
  const say = (who, text) => { const log = sheet.querySelector('.vt-log'); let p = who === 'a' && log.lastChild?.dataset.live ? log.lastChild : null;
    if (!p) { p = document.createElement('p'); p.className = who; if (who === 'a') p.dataset.live = '1'; log.append(p); }
    p.textContent = text; log.scrollTop = log.scrollHeight; return p; };
  const action = (ui) => { const box = sheet.querySelectorAll('.vt-acts')[0];
    if (ui.type === 'call') box.innerHTML = `<a class="vt-btn" href="tel:${TEL}">Call ${TELH}</a>`;
    if (ui.type === 'booking_link' && /^https:\/\/book\.squareup\.com\//.test(ui.url)) box.innerHTML = `<a class="vt-btn" href="${esc(ui.url)}" target="_blank" rel="noopener">${esc(ui.label)}</a>`; };
  const fallback = (msg) => { st('error', msg || "Voice isn't available right now."); action({ type: 'call' }); };

  async function open() {
    sheet.hidden = false; fab.hidden = true; sheet.querySelector('.vt-log').innerHTML = ''; sheet.querySelectorAll('.vt-acts')[0].innerHTML = '';
    if (demo) return demoRun();
    st('connecting', 'Connecting…');
    try { await start(); } catch (e) { stop(); fallback(e.message === 'mic' ? 'Mic is off. You can call us instead.' : e.message); }
  }
  function close() { if (sess) end(); sheet.hidden = true; vis(); }

  // ---------- live ----------
  async function start() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } }).catch(() => { throw new Error('mic'); });
    const r = await fetch('/api/voice/session', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    const j = await r.json().catch(() => ({})); if (!r.ok) { stream.getTracks().forEach((t) => t.stop()); throw new Error(j.error || "Voice isn't available right now."); }
    const ctx = new AudioContext({ sampleRate: 24000 }); await ctx.resume();
    sess = { id: j.sessionId, stream, ctx, srcs: [], playAt: 0, item: null, playedStart: 0, pending: 0 };
    const ws = new WebSocket(j.url, [`xai-client-secret.${j.token}`]); sess.ws = ws;
    sess.timer = setTimeout(() => { st('idle', 'Time is up for this chat.'); end(); }, j.maxSeconds * 1000);
    const worklet = `class C extends AudioWorkletProcessor{constructor(){super();this.b=new Int16Array(2400);this.n=0}process(i){const x=i[0][0];if(x){for(let k=0;k<x.length;k++){const s=Math.max(-1,Math.min(1,x[k]));this.b[this.n++]=s<0?s*32768:s*32767;if(this.n===2400){this.port.postMessage(this.b.buffer,[this.b.buffer]);this.b=new Int16Array(2400);this.n=0}}}return true}}registerProcessor('c',C)`;
    await ctx.audioWorklet.addModule(URL.createObjectURL(new Blob([worklet], { type: 'text/javascript' })));
    const node = new AudioWorkletNode(ctx, 'c'); ctx.createMediaStreamSource(stream).connect(node); sess.node = node;
    node.port.onmessage = (e) => { if (ws.readyState === 1) ws.send(JSON.stringify({ type: 'input_audio_buffer.append', audio: b64(e.data) })); }; // 100 ms @ 24 kHz
    ws.onopen = () => { ws.send(JSON.stringify(j.sessionUpdate));
      ws.send(JSON.stringify({ type: 'conversation.item.create', item: { type: 'force_message', role: 'assistant', interruptible: true, content: [{ type: 'output_text', text: j.opening }] } }));
      st('listening', 'Listening…'); };
    ws.onerror = () => { stop(); fallback(); };
    ws.onclose = () => { if (sess) { stop(); fallback('Chat ended.'); } };
    ws.onmessage = (m) => onEvent(JSON.parse(m.data));
  }
  function onEvent(ev) {
    switch (ev.type) {
      case 'response.output_audio.delta': case 'response.audio.delta': sess.item = ev.item_id; play(ev.delta); st('speaking', `${name} is talking…`); break;
      case 'response.output_audio_transcript.delta': case 'response.audio_transcript.delta': sess.aText = (sess.aText || '') + ev.delta; say('a', sess.aText); break;
      case 'response.output_audio_transcript.done': case 'response.audio_transcript.done': if (ev.transcript) say('a', ev.transcript); sess.aText = ''; const l = sheet.querySelector('.vt-log').lastChild; if (l) delete l.dataset.live; break;
      case 'conversation.item.input_audio_transcription.completed': if (ev.transcript) say('u', ev.transcript); break;
      case 'input_audio_buffer.speech_started': interrupt(); st('listening', 'Listening…'); break;
      case 'response.done': if (!sess.pending) setTimeout(() => sess && sess.srcs.length === 0 && st('listening', 'Listening…'), 50); break;
      case 'response.function_call_arguments.done': tool(ev); break;
      case 'error': console.warn('voice error', ev.error?.message); break;
    }
  }
  async function tool(ev) {
    sess.pending++; st('thinking', 'One sec…');
    let result = { ok: false, error: 'tool failed' };
    try { const r = await fetch('/api/voice/tool', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId: sess.id, name: ev.name, args: ev.arguments }) });
      result = (await r.json()).result || result; } catch {}
    if (!sess) return; if (result.ui) action(result.ui);
    sess.ws.send(JSON.stringify({ type: 'conversation.item.create', item: { type: 'function_call_output', call_id: ev.call_id, output: JSON.stringify(result) } }));
    if (--sess.pending === 0) { const wait = Math.max(0, (sess.playAt - sess.ctx.currentTime) * 1000); setTimeout(() => sess && sess.ws.send(JSON.stringify({ type: 'response.create' })), wait); }
  }
  function play(b) {
    const bin = atob(b), n = bin.length >> 1, f = new Float32Array(n);
    for (let i = 0; i < n; i++) { let v = bin.charCodeAt(2 * i) | (bin.charCodeAt(2 * i + 1) << 8); if (v > 32767) v -= 65536; f[i] = v / 32768; }
    const { ctx } = sess, buf = ctx.createBuffer(1, n, 24000); buf.copyToChannel(f, 0);
    const s = ctx.createBufferSource(); s.buffer = buf; s.connect(ctx.destination);
    if (sess.playAt < ctx.currentTime) { sess.playAt = ctx.currentTime + 0.03; sess.playedStart = sess.playAt; }
    s.start(sess.playAt); sess.playAt += buf.duration; sess.srcs.push(s);
    s.onended = () => { sess && (sess.srcs = sess.srcs.filter((x) => x !== s)); if (sess && !sess.srcs.length && !sess.pending) st('listening', 'Listening…'); };
  }
  function interrupt() {
    if (!sess || !sess.srcs.length) return;
    const ms = Math.max(0, Math.round((sess.ctx.currentTime - sess.playedStart) * 1000));
    sess.srcs.forEach((s) => { try { s.stop(); } catch {} }); sess.srcs = []; sess.playAt = 0;
    if (sess.item) sess.ws.send(JSON.stringify({ type: 'conversation.item.truncate', item_id: sess.item, content_index: 0, audio_end_ms: ms }));
  }
  function stop() { if (!sess) return; const s = sess; sess = null; clearTimeout(s.timer);
    try { s.ws && s.ws.close(); } catch {} s.stream.getTracks().forEach((t) => t.stop()); try { s.ctx.close(); } catch {}
    fetch('/api/voice/end', { method: 'POST', credentials: 'same-origin', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId: s.id }) }).catch(() => {}); }
  function end() { stop(); st('idle', 'Chat ended.'); }
  const b64 = (ab) => { const u = new Uint8Array(ab); let s = ''; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return btoa(s); };

  // ---------- preview demo (no network, no mic) ----------
  function demoRun() {
    const first = (window.SC?.member?.first) || 'there';
    const lines = [['a', `Hey ${first}, I'm ${name}, Shine My Ride's AI assistant. How can I help with your car today?`], ['u', 'Can I get the SUV shampooed next weekend?'],
      ['a', "Yeah, for sure. Shampoo is a Gold interior or higher. I'll send that request to the team. It isn't confirmed until they confirm with you."]];
    st('speaking', `${name} is talking… (preview)`); let i = 0;
    const next = () => { if (sheet.hidden) return; if (i < lines.length) { const [w, t] = lines[i++]; const p = say(w, t); if (p) delete p.dataset.live; setTimeout(next, 1100); }
      else { st('listening', 'Listening… (preview, not connected)'); action({ type: 'booking_link', label: 'Book Gold Interior', url: 'https://book.squareup.com/appointments/wh75rtw86875x0/location/LX06E1Q8R55V6/services/L3HJIXLG4FOTNLIRFWLPV7BK' }); } };
    next();
  }

  async function init() {
    if (!demo) try { const r = await fetch('/api/voice/config', { credentials: 'same-origin' }); const j = await r.json();
      if (j.assistantName) name = j.assistantName; live = !!j.enabled && !!(window.AudioWorkletNode && navigator.mediaDevices); } catch {}
    if (live || demo) mount();
  }
  document.readyState === 'loading' ? addEventListener('DOMContentLoaded', init) : init();
})();
