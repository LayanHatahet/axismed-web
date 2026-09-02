/* ============================================================
   BENZERSIZ® sound department — 100% synthesized, no assets.
   Boot key clicks · CRT power-on · static burst · card flips ·
   shredder motor · golden chime · rotary clicks · dial tone
   ============================================================ */

const PREF_KEY = 'bz-sound';

let ctx = null;
let master = null;
let enabled = (localStorage.getItem(PREF_KEY) ?? 'on') === 'on';
let noiseBuf = null;

// continuous voices
let staticSrc = null, staticGain = null;
let shredSrc = null, shredGain = null;
let toneOsc1 = null, toneOsc2 = null, toneGain = null;
let chimePlayed = false;

function ensure() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = enabled ? 0.5 : 0;
    master.connect(ctx.destination);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx.state === 'running';
}

function ready() {
  return ctx && ctx.state === 'running' && enabled;
}

/* ---- one-shots ---- */

function blip(freq, dur = 0.04, vol = 0.06, type = 'square') {
  if (!ready()) return;
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + dur + 0.03);
}

function click(vol = 0.09, dur = 0.03, filterFreq = 3200) {
  if (!ready()) return;
  const t = ctx.currentTime;
  const s = ctx.createBufferSource();
  s.buffer = noiseBuf;
  s.playbackRate.value = 1.6;
  const f = ctx.createBiquadFilter();
  f.type = 'bandpass';
  f.frequency.value = filterFreq;
  f.Q.value = 1.2;
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f).connect(g).connect(master);
  s.start(t, Math.random() * 1.5, dur + 0.05);
}

export const sound = {
  get enabled() { return enabled; },

  /* call from any user gesture */
  unlock() { ensure(); },

  toggle() {
    enabled = !enabled;
    localStorage.setItem(PREF_KEY, enabled ? 'on' : 'off');
    ensure();
    if (master) master.gain.linearRampToValueAtTime(enabled ? 0.5 : 0, ctx.currentTime + 0.15);
    return enabled;
  },

  /* boot line typed */
  key() { click(0.05, 0.025, 2600 + Math.random() * 1200); },

  /* boot complete beep */
  beep() { blip(880, 0.09, 0.05); setTimeout(() => blip(1320, 0.12, 0.05), 110); },

  /* CRT power-on: thunk + rising hum */
  powerOn() {
    if (!ready()) return;
    const t = ctx.currentTime;
    click(0.22, 0.06, 240);
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(60, t);
    o.frequency.exponentialRampToValueAtTime(15600, t + 0.5);
    g.gain.setValueAtTime(0.07, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
    o.connect(g).connect(master);
    o.start(t);
    o.stop(t + 0.6);
  },

  /* exhibit card flip */
  flip() { click(0.11, 0.05, 900); setTimeout(() => click(0.06, 0.03, 1800), 45); },

  /* golden floppy chime */
  chime() {
    if (!ready()) return;
    [660, 880, 1108, 1320].forEach((f, i) => setTimeout(() => blip(f, 0.5, 0.035, 'sine'), i * 105));
  },

  /* per-frame continuous mixing.
     state: { statik 0..1, shred 0..1 (activity), contact bool, dialDelta rad } */
  frame(state) {
    if (!ctx || !enabled) return;
    const t = ctx.currentTime;

    // CRT static burst (the monitor dive)
    if (state.statik > 0.01) {
      if (!staticSrc) {
        staticSrc = ctx.createBufferSource();
        staticSrc.buffer = noiseBuf;
        staticSrc.loop = true;
        staticGain = ctx.createGain();
        staticGain.gain.value = 0;
        staticSrc.connect(staticGain).connect(master);
        staticSrc.start();
      }
      staticGain.gain.setTargetAtTime(state.statik * 0.16, t, 0.05);
    } else if (staticGain) {
      staticGain.gain.setTargetAtTime(0, t, 0.08);
    }

    // shredder motor: lowpassed noise while shredding
    if (state.shred > 0.001) {
      if (!shredSrc) {
        shredSrc = ctx.createBufferSource();
        shredSrc.buffer = noiseBuf;
        shredSrc.loop = true;
        shredSrc.playbackRate.value = 0.55;
        const f = ctx.createBiquadFilter();
        f.type = 'lowpass';
        f.frequency.value = 520;
        shredGain = ctx.createGain();
        shredGain.gain.value = 0;
        shredSrc.connect(f).connect(shredGain).connect(master);
        shredSrc.start();
      }
      shredGain.gain.setTargetAtTime(Math.min(0.3, state.shred * 3.2), t, 0.06);
    } else if (shredGain) {
      shredGain.gain.setTargetAtTime(0, t, 0.12);
    }

    // dial tone while the contact scene is on
    if (state.contact) {
      if (!toneOsc1) {
        toneOsc1 = ctx.createOscillator();
        toneOsc2 = ctx.createOscillator();
        toneOsc1.frequency.value = 350;
        toneOsc2.frequency.value = 440;
        toneGain = ctx.createGain();
        toneGain.gain.value = 0;
        toneOsc1.connect(toneGain);
        toneOsc2.connect(toneGain);
        toneGain.connect(master);
        toneOsc1.start();
        toneOsc2.start();
      }
      toneGain.gain.setTargetAtTime(0.012, t, 0.4);
    } else if (toneGain) {
      toneGain.gain.setTargetAtTime(0, t, 0.2);
    }

    // rotary dial ticks
    if (state.dialTick) click(0.05, 0.02, 1400);
  },

  /* floppy chime once per visit */
  floppy(entered) {
    if (entered && !chimePlayed) { chimePlayed = true; this.chime(); }
    if (!entered) chimePlayed = false;
  },
};
