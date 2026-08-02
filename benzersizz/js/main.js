/* ============================================================
   BENZERSIZ® — scroll-driven WebGL experience
   One continuous camera dolly through six scenes:
   boot → CRT hero (dive-through) → closed deals → the bureau
   → shredder → golden floppy → interface (contact)
   ============================================================ */

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { sound } from './sound.js';
import { i18n } from './i18n.js';

const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const MOBILE = window.innerWidth < 760;

/* ------------------------------------------------------------
   Injected micro-styles (JS-owned behaviors)
   ------------------------------------------------------------ */
const style = document.createElement('style');
style.textContent = `
  body:not(.live) { overflow: hidden; }
  @keyframes wcswap { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
  .work-caption.swap { animation: wcswap 0.55s cubic-bezier(0.22,1,0.36,1); }
  body.no-webgl #gl, body.no-webgl #spacer, body.no-webgl #boot, body.no-webgl #hud { display: none; }
  body.no-webgl { overflow: auto !important; }
  body.no-webgl .ov { position: relative; inset: auto; opacity: 1 !important; visibility: visible !important; pointer-events: auto; min-height: 60vh; }
`;
document.head.appendChild(style);

history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

/* ------------------------------------------------------------
   Helpers
   ------------------------------------------------------------ */
const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (a, b, v) => { const t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t); };

// piecewise keyframe interpolation with smoothstep between points
function kf(p, points) {
  if (p <= points[0][0]) return points[0][1];
  for (let i = 0; i < points.length - 1; i++) {
    const [p0, v0] = points[i], [p1, v1] = points[i + 1];
    if (p <= p1) return lerp(v0, v1, smooth(p0, p1, p));
  }
  return points[points.length - 1][1];
}

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return [c, c.getContext('2d')];
}

function canvasTexture(c) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

const SERIF = '"Times New Roman", Times, serif';
const DISPLAY = '"Archivo Black", "Arial Black", sans-serif';
const MONO = '"Courier Prime", "Courier New", monospace';
const AR_DISPLAY = '"Baloo Bhaijaan 2", "Rubik", sans-serif';   // playful, rounded (مدعبل)
const AR_BODY = '"Rubik", "Baloo Bhaijaan 2", sans-serif';      // modern, readable

/* speckle + slice degradation, the "bad photocopy" look */
function degrade(ctx, w, h, amount = 1) {
  for (let i = 0; i < 900 * amount; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(30,24,16,0.08)' : 'rgba(255,250,240,0.10)';
    ctx.fillRect(Math.random() * w, Math.random() * h, 1.4, 1.4);
  }
  for (let i = 0; i < 7 * amount; i++) {
    const y = Math.random() * h, hh = 2 + Math.random() * 5;
    ctx.drawImage(ctx.canvas, 0, y, w, hh, (Math.random() - 0.5) * 7, y, w, hh);
  }
}

/* ------------------------------------------------------------
   Content
   ------------------------------------------------------------ */
const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const arNum = (n) => String(n).split('').map((d) => AR_DIGITS[+d] ?? d).join('');

const PROJECTS = [
  { slug: 'axismed',       url: 'https://www.theaxismed.com',            title: 'AxisMed',          titleAr: 'AxisMed',
    sub: 'MEDICAL EDUCATION PLATFORM', subAr: 'مِنَصَّةُ تَعْلِيمٍ طِبِّيٍّ',            tag: 'Precision, as prescribed.',           tagAr: 'دِقَّةٌ، كَمَا فِي الوَصْفَةِ تَمَامًا.' },
  { slug: 'galmed',        url: 'https://www.galmed-group.com',          title: 'Galmed',           titleAr: 'Galmed',
    sub: 'MEDICAL SOLUTIONS, DUBAI',   subAr: 'حُلُولٌ طِبِّيَّةٌ، دُبَيّ',              tag: 'Health, at industrial scale.',        tagAr: 'الصِّحَّةُ، بِمَقَايِيسَ صِنَاعِيَّةٍ.' },
  { slug: 'medlab',        url: 'https://www.medlabinstitute.com',       title: 'Medlab Institute', titleAr: 'Medlab',
    sub: 'SURGICAL TRAINING, DUBAI',   subAr: 'تَدْرِيبٌ جِرَاحِيٌّ، دُبَيّ',            tag: 'Certified. Laminated. Framed.',       tagAr: 'مُعْتَمَدٌ. مُغَلَّفٌ. وَمُعَلَّقٌ عَلَى الجِدَارِ.' },
  { slug: 'chiniara',      url: 'https://www.chiniara-omran.com',        title: 'Chiniara & Omran', titleAr: 'شنيارة وعمران',
    sub: 'ARCHITECTURE & ENGINEERING', subAr: 'عِمَارَةٌ وَهَنْدَسَةٌ',                  tag: 'Concrete plans. Literally.',          tagAr: 'خُطَطٌ مَلْمُوسَةٌ. حَرْفِيًّا.' },
  { slug: 'alaryaf',       url: 'https://www.alaryaf.co',                title: 'Al Aryaf',         titleAr: 'الأرياف',
    sub: 'DAIRY BRAND, SYRIA',         subAr: 'عَلَامَةُ أَلْبَانٍ، سُورِيَا',           tag: 'Fresh assets, delivered daily.',      tagAr: 'خَيْرَاتُ الرِّيفِ، تَصِلُكَ كُلَّ صَبَاحٍ.' },
  { slug: 'opal',          url: 'https://www.opal-group.net',            title: 'Opal Group',       titleAr: 'مجموعة أوبال',
    sub: 'ENGINEERING CONGLOMERATE',   subAr: 'تَكَتُّلٌ هَنْدَسِيٌّ',                   tag: 'Three countries. One control room.',  tagAr: 'ثَلَاثُ دُوَلٍ. وَغُرْفَةُ تَحَكُّمٍ وَاحِدَةٌ.' },
  { slug: 'titan',         url: 'https://www.titanclinics.com',          title: 'Titan Clinics',    titleAr: 'عيادات تايتن',
    sub: 'HEALTHCARE CLINICS',         subAr: 'عِيَادَاتٌ طِبِّيَّةٌ',                   tag: 'Legendary names. Firm handshakes.',   tagAr: 'أَسْمَاءٌ أُسْطُورِيَّةٌ. وَمُصَافَحَاتٌ حَازِمَةٌ.' },
  { slug: 'drb',           url: 'https://www.drbpolyclinic.com',         title: 'Dr.B Polyclinic',  titleAr: 'Dr.B',
    sub: 'LUXURY POLYCLINIC, DUBAI',   subAr: 'عِيَادَةٌ فَاخِرَةٌ، دُبَيّ',             tag: 'All departments. One gold lobby.',    tagAr: 'كُلُّ الأَقْسَامِ. وَرَدْهَةٌ ذَهَبِيَّةٌ وَاحِدَةٌ.' },
  { slug: 'bioaesthetics', url: 'https://www.bioaesthetics.co',          title: 'Bio Aesthetics',   titleAr: 'Bio Aesthetics',
    sub: 'AESTHETIC MEDICINE',         subAr: 'طِبٌّ تَجْمِيلِيٌّ',                      tag: 'Beauty, notarized.',                  tagAr: 'الجَمَالُ، مُوَثَّقًا رَسْمِيًّا.' },
  { slug: 'hamdiaa',       url: 'https://www.hamdiaa.com',               title: 'Al Hamdia',        titleAr: 'الحمدية',
    sub: 'OLD DAMASCUS RESTAURANT',    subAr: 'مَطْعَمٌ دِمَشْقِيٌّ عَرِيقٌ',            tag: 'Ancient recipes. Modern bookings.',   tagAr: 'وَصْفَاتٌ عَرِيقَةٌ. وَحُجُوزَاتٌ فَوْرِيَّةٌ.' },
  { slug: 'lvina',         url: 'https://www.l-vina.com',                title: 'L-VINA',           titleAr: 'L-VINA',
    sub: 'FASHION HOUSE, DAMASCUS',    subAr: 'دَارُ أَزْيَاءٍ، دِمَشْق',                tag: 'Elegance, itemized.',                 tagAr: 'الأَنَاقَةُ، قِطْعَةً قِطْعَةً.' },
  { slug: 'daghoum',       url: 'https://www.daghoumcompanyco.com',      title: 'Daghoum & Co.',    titleAr: 'داغوم وشركاه',
    sub: 'TIN PACKAGING, SINCE 1992',  subAr: 'عُبُوَّاتٌ مَعْدِنِيَّةٌ، مُنْذُ ١٩٩٢',    tag: 'Everything canned. Except ambition.', tagAr: 'كُلُّ شَيْءٍ مُعَلَّبٌ. إِلَّا الطُّمُوحَ.' },
  { slug: 'levantbridge',  url: 'https://www.levantbridge.net',          title: 'Levant Bridge',    titleAr: 'Levant Bridge',
    sub: 'FRESH PRODUCE TRADING, ATHENS', subAr: 'تِجَارَةُ خُضَارٍ وَفَوَاكِهَ، أَثِينَا', tag: 'Fruit that travels first class.',   tagAr: 'فَوَاكِهُ تُسَافِرُ عَلَى الدَّرَجَةِ الأُولَى.' },
  { slug: 'barakat',       url: 'https://site-xi-two-89.vercel.app/en',  title: 'Barakat',          titleAr: 'بركات',
    sub: 'RESTAURANT & CAFE, COPENHAGEN', subAr: 'مَطْعَمٌ وَمَقْهًى، كُوبِنْهَاغِن',     tag: 'Charcoal-fired. Board-approved.',     tagAr: 'عَلَى نَارِ الفَحْمِ. وَبِمُوَافَقَةِ مَجْلِسِ الإِدَارَةِ.' },
  { slug: 'alhareef',      url: 'https://al-hareef-three.vercel.app/en', title: 'Al-Hareef',        titleAr: 'الحريف',
    sub: 'GRILL HOUSE EXPERIENCE',     subAr: 'تَجْرِبَةُ مَشَاوٍ فَاخِرَةٌ',            tag: 'Copper, charcoal, conversion.',       tagAr: 'نُحَاسٌ، وَفَحْمٌ، وَعُمَلَاءُ يَعُودُونَ.' },
].map((p, i) => ({ ...p, frames: [], ex: `EXHIBIT ${'ABCDEFGHIJKLMNO'[i]}`, exAr: `المِلَفُّ ${arNum(String(i + 1).padStart(2, '0'))}` }));

/* the scroll timeline: zoom into the CRT, portfolio plays INSIDE the
   screen (laptop pinned), glitch out, then descend the tower */
const P_GLITCH_IN = 0.100;   // static rises, terminal gives way to PORTFOLIO.EXE
const P_PORT_A   = 0.135;    // portfolio starts scrolling inside the screen
const P_PORT_B   = 0.555;    // last record reached
const P_TELE     = 0.578;    // glitch-out flash → the tower shaft

/* ------------------------------------------------------------
   Scroll re-map: the legacy timeline above keeps its numbers,
   but raw scroll now detours through the APP DEPT. — a plateau
   at P_PIN where the smartphone scene plays — and the descent
   after the computer gets 40% more scroll so people can read.
   ------------------------------------------------------------ */
const P_PIN = 0.5565;                                   // right after the last record
const P_HERO = 0.1;                                     // end of the hero → CRT dive
const OLD_PAGES = 24;                                   // the original spacer height
/* scroll pacing per segment. Touch tracks the finger 1:1, so touch gets far
   more runway; the records INSIDE the laptop are the slowest of all. The
   hero → CRT dive keeps its original pace everywhere. */
const IS_TOUCH = window.matchMedia('(hover: none), (pointer: coarse)').matches;
const SEGS = [
  { a: 0,        b: P_HERO,   mul: 1 },                            // the dive — untouched
  { a: P_HERO,   b: P_PORT_A, mul: IS_TOUCH ? 3.2 : 1.6 },
  { a: P_PORT_A, b: P_PORT_B, mul: IS_TOUCH ? 4.5 : 2.2 },         // the records — glacial
  { a: P_PORT_B, b: P_PIN,    mul: IS_TOUCH ? 3.2 : 1.6 },
  { a: P_PIN,    b: 1,        mul: (IS_TOUCH ? 3.2 : 1.6) * 1.5 }, // the descent
].map((s) => ({ ...s, pages: (s.b - s.a) * OLD_PAGES * s.mul }));
const PHONE_PAGES = IS_TOUCH ? 12 : 6;
const PIN_PAGES = SEGS[0].pages + SEGS[1].pages + SEGS[2].pages + SEGS[3].pages;
const TOTAL_PAGES = PIN_PAGES + PHONE_PAGES + SEGS[4].pages;
document.documentElement.style.setProperty('--pages', TOTAL_PAGES.toFixed(3));

/* world layout: the pinned computer at x=0, then the descent shaft */
const CENTER_X = 71.0;                                // the descent shaft
const FAX_X = 77.0;                                   // local child coords (group re-bases them)
const SHRED_X = 81.0, SLOT_Y = 0.5;
const FLOPPY_X = 85.8;
const CONTACT_X = 91.6;
const L_FAX = -8.5, L_SHRED = -17, L_FLOPPY = -25.5, L_CONTACT = -34;   // floor levels
const FLOPPY_Y = L_FLOPPY + 0.35;

/* ------------------------------------------------------------
   Boot screen (runs regardless of GL readiness)
   ------------------------------------------------------------ */
const bootEl = document.getElementById('boot');
const bootLines = document.getElementById('boot-lines');
const bootPct = document.getElementById('boot-pct');
const bootFill = document.getElementById('boot-bar-fill');
const bootPrompt = document.getElementById('boot-prompt');

/* touch devices tap, they don't "press any key" — say so clearly */
const TOUCH = matchMedia('(hover: none), (pointer: coarse)').matches;
if (TOUCH && bootPrompt) bootPrompt.innerHTML = 'TAP TO BEGIN BUSINESS <span class="blink">▮</span>';

const BOOT_TEXT = [
  '640K BASE MEMORY ................. OK',
  'EXTENDED AMBITION ................ OK',
  'MOUSE (MECHANICAL, BEIGE) ........ DETECTED',
  'SYNERGY COPROCESSOR .............. FOUND',
  'COFFEE.SYS ....................... BREWING',
  'LOADING BUSINESS ................. PLEASE HOLD',
];

let assetsReady = false;
let bootDone = false;
let started = false;

(function runBoot() {
  let li = 0;
  const addLine = () => {
    if (li < BOOT_TEXT.length) {
      const div = document.createElement('div');
      div.textContent = BOOT_TEXT[li++];
      bootLines.appendChild(div);
      sound.key();
      setTimeout(addLine, 200 + Math.random() * 200);
    }
  };
  setTimeout(addLine, 350);

  let pct = 0;
  const tick = () => {
    const cap = assetsReady ? 100 : 88;
    pct = Math.min(cap, pct + 1 + Math.random() * 3.2);
    bootPct.textContent = Math.floor(pct) + '%';
    bootFill.style.width = pct + '%';
    if (pct >= 100) {
      bootDone = true;
      bootPrompt.classList.add('on');
      sound.beep();
      const go = () => start();
      window.addEventListener('keydown', go, { once: true });
      window.addEventListener('pointerdown', go, { once: true });
      setTimeout(go, 5000); // auto-start for the patient
    } else setTimeout(tick, 40);
  };
  setTimeout(tick, 500);
})();

function start() {
  if (started || !bootDone) return;
  started = true;
  sound.unlock();
  sound.powerOn();
  bootEl.classList.add('off');
  document.body.classList.add('live');
  if (lenis) lenis.start();
}

/* audio contexts need a user gesture — unlock on the first one, whenever it comes */
window.addEventListener('pointerdown', () => sound.unlock(), { passive: true });
window.addEventListener('keydown', () => sound.unlock());

/* sound toggle — a speaker everyone understands (CSS swaps waves/mute) */
const sndBtn = document.getElementById('sound-toggle');
if (sndBtn) {
  const label = () => sndBtn.setAttribute('aria-pressed', String(sound.enabled));
  label();
  sndBtn.addEventListener('click', (e) => { e.stopPropagation(); sound.toggle(); label(); });
}

/* mobile menu */
const burgerBtn = document.getElementById('nav-burger');
const navLinksEl = document.querySelector('.nav-links');
if (burgerBtn && navLinksEl) {
  burgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = navLinksEl.classList.toggle('open');
    burgerBtn.setAttribute('aria-expanded', String(open));
  });
  navLinksEl.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    navLinksEl.classList.remove('open');
    burgerBtn.setAttribute('aria-expanded', 'false');
  }));
}

/* open WhatsApp WITHOUT leaving the page — always a new tab, never a redirect */
function openWa(url) {
  const w = window.open(url, '_blank', 'noopener');
  if (!w) {
    const a = document.createElement('a');
    a.href = url; a.target = '_blank'; a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}

/* language toggle — EN primary, AR transcreation */
const couponEl = document.querySelector('.coupon');
function syncLangExtras() {
  if (couponEl) couponEl.dataset.cutNote = i18n.t('coupon.cutnote');
}
i18n.apply();
syncLangExtras();
const langBtn = document.getElementById('lang-toggle');
if (langBtn) {
  langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    i18n.toggle();
    syncLangExtras();
    hudLabel = '';                    // force HUD re-render in new language
  });
}

/* ------------------------------------------------------------
   The cuttable voucher — drag the scissors along the dotted line
   ------------------------------------------------------------ */
(function couponCutter() {
  const scis = document.querySelector('.coupon-scissors');
  if (!couponEl || !scis) return;
  let cutting = false, cutP = 0, lastSnip = 0;
  const move = (e) => {
    if (!cutting) return;
    const r = couponEl.getBoundingClientRect();
    cutP = Math.max(cutP, clamp01((e.clientX - r.left) / r.width));   // scissors only cut forward
    couponEl.style.setProperty('--cut', (cutP * 100).toFixed(1) + '%');
    scis.style.right = 'auto';
    scis.style.left = `calc(${(cutP * 100).toFixed(1)}% - 16px)`;
    if (cutP - lastSnip > 0.08) { lastSnip = cutP; sound.flip(); }    // snip, snip
    if (cutP > 0.98) finish();
    e.preventDefault();
  };
  const finish = () => {
    cutting = false;
    couponEl.classList.remove('cutting');
    couponEl.classList.add('cut');
    sound.chime();
    if (lenis) lenis.start();
    window.removeEventListener('pointermove', move);
  };
  scis.addEventListener('pointerdown', (e) => {
    if (couponEl.classList.contains('cut')) return;
    cutting = true;
    couponEl.classList.add('cutting');
    if (lenis) lenis.stop();                 // don't scroll while operating scissors
    sound.unlock();
    window.addEventListener('pointermove', move, { passive: false });
    e.preventDefault();
  });
  window.addEventListener('pointerup', () => {
    if (!cutting) return;
    cutting = false;
    couponEl.classList.remove('cutting');
    if (lenis) lenis.start();
    window.removeEventListener('pointermove', move);
  });
})();

/* ------------------------------------------------------------
   Keyboard navigation — arrows scroll, ←/→ step the records
   ------------------------------------------------------------ */
const slideF = (p) => clamp01((p - P_PORT_A) / (P_PORT_B - P_PORT_A)) * PROJECTS.length;
window.addEventListener('keydown', (e) => {
  if (!started) return;
  if (e.target && e.target.closest && e.target.closest('button, a, input, textarea')) return;
  const max = maxScroll();
  const vh = window.innerHeight;
  const glide = (y) => {
    if (lenis) lenis.scrollTo(Math.max(0, Math.min(max, y)), { duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 3) });
    else window.scrollTo({ top: Math.max(0, Math.min(max, y)), behavior: 'smooth' });
  };
  if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
    e.preventDefault(); glide(window.scrollY + vh * 1.15);
  } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
    e.preventDefault(); glide(window.scrollY - vh * 1.15);
  } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    const p = scrollP();
    const pt = phoneRaw();
    if (p > P_PORT_A - 0.02 && p < P_PORT_B + 0.02 && !(pt > 0.02 && pt < 0.98)) {
      e.preventDefault();
      const dir = e.key === 'ArrowRight' ? 1 : -1;
      const ni = Math.min(PROJECTS.length, Math.max(0, Math.round(slideF(p)) + dir));
      glide(rawOf(P_PORT_A + (ni / PROJECTS.length) * (P_PORT_B - P_PORT_A)) * max);
    }
  }
});

/* ------------------------------------------------------------
   Smooth scroll
   ------------------------------------------------------------ */
let lenis = null;
if (window.Lenis && !RM) {
  lenis = new window.Lenis({
    lerp: 0.08,
    wheelMultiplier: 0.7,     // wheel ticks travel less
    // touch tracks the finger 1:1 — no acceleration, almost no fling
    syncTouch: true,
    touchMultiplier: 1.0,
    syncTouchLerp: 0.75,
    touchInertiaMultiplier: 2,
  });
  lenis.stop();
}

function maxScroll() {
  return document.documentElement.scrollHeight - window.innerHeight;
}
function scrollRaw() {
  // lenis drives the native scroller, so window.scrollY is always current
  return clamp01(window.scrollY / Math.max(1, maxScroll()));
}
/* raw scroll → legacy timeline position (the phone scene is a plateau at P_PIN) */
function scrollP() {
  let x = scrollRaw() * TOTAL_PAGES;
  for (let i = 0; i < 4; i++) {
    const s = SEGS[i];
    if (x <= s.pages) return s.a + (x / s.pages) * (s.b - s.a);
    x -= s.pages;
  }
  if (x <= PHONE_PAGES) return P_PIN;
  x -= PHONE_PAGES;
  const t = SEGS[4];
  return Math.min(1, t.a + (x / t.pages) * (t.b - t.a));
}
/* raw scroll → phone-scene progress 0..1 */
function phoneRaw() {
  const x = scrollRaw() * TOTAL_PAGES;
  return clamp01((x - PIN_PAGES) / PHONE_PAGES);
}
/* legacy timeline position → raw scroll fraction, for scrollTo targets */
function rawOf(p) {
  let x = 0;
  for (let i = 0; i < 4; i++) {
    const s = SEGS[i];
    if (p <= s.b) return (x + ((p - s.a) / (s.b - s.a)) * s.pages) / TOTAL_PAGES;
    x += s.pages;
  }
  x += PHONE_PAGES;
  const t = SEGS[4];
  return (x + ((p - t.a) / (t.b - t.a)) * t.pages) / TOTAL_PAGES;
}
const rawOfPhone = (pt) => (PIN_PAGES + pt * PHONE_PAGES) / TOTAL_PAGES;

document.querySelectorAll('[data-goto]').forEach((a) => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const v = a.dataset.goto;
    const frac = v === 'phone' ? rawOfPhone(0.45) : rawOf(parseFloat(v));
    const target = frac * maxScroll();
    if (lenis) lenis.scrollTo(target, { duration: 2.4, easing: (t) => 1 - Math.pow(1 - t, 3) });
    else window.scrollTo({ top: target, behavior: 'smooth' });
  });
});

/* ------------------------------------------------------------
   Overlay engine
   ------------------------------------------------------------ */
const OVERLAYS = [
  { id: 'ov-hero',         a: 0.000, b: 0.075, fi: 0, fo: 0.45 },
  { id: 'ov-hello',        a: 0.582, b: 0.618, fi: 0.25, fo: 0.30 },
  { id: 'ov-about-head',   a: 0.600, b: 0.645, fi: 0.28, fo: 0.28 },
  { id: 'ov-about-copy',   a: 0.633, b: 0.678, fi: 0.28, fo: 0.28 },
  { id: 'ov-clients',      a: 0.667, b: 0.704, fi: 0.28, fo: 0.28 },
  { id: 'ov-coupon',       a: 0.694, b: 0.724, fi: 0.28, fo: 0.28 },
  { id: 'ov-goodbuy',      a: 0.716, b: 0.750, fi: 0.25, fo: 0.30 },
  { id: 'ov-shred',        a: 0.742, b: 0.800, fi: 0.22, fo: 0.30 },
  { id: 'ov-floppy',       a: 0.812, b: 0.886, fi: 0.22, fo: 0.28 },
  { id: 'ov-contact',      a: 0.910, b: 1.000, fi: 0.30, fo: 0.00 },
].map((o) => ({ ...o, el: document.getElementById(o.id) }));

function updateOverlays(p) {
  for (const o of OVERLAYS) {
    const local = (p - o.a) / (o.b - o.a);
    if (local < -0.02 || local > 1.05) {
      if (o.el.style.visibility !== 'hidden') {
        o.el.style.visibility = 'hidden';
        o.el.style.opacity = '0';
        o.el.classList.remove('on');
      }
      continue;
    }
    const fadeIn = o.fi > 0 ? smooth(0, o.fi, local) : 1;
    const fadeOut = o.fo > 0 ? 1 - smooth(1 - o.fo, 1, local) : 1;
    const op = Math.min(fadeIn, fadeOut);
    o.el.style.visibility = 'visible';
    o.el.style.opacity = op.toFixed(3);
    const drift = o.fo === 0 ? (1 - fadeIn) * 30 : (0.5 - local) * 44;
    o.el.style.transform = `translateY(${drift.toFixed(1)}px)`;
    o.el.classList.toggle('on', op > 0.5);
  }
}

/* the CRT hotspots — real <a> elements tracking the buttons drawn on-screen */
const screenLive = document.getElementById('screen-live');
const screenSkip = document.getElementById('screen-skip');

/* which live site is under the tube's VIEW LIVE button RIGHT NOW — derived
   fresh from scroll position so a click never opens a stale/wrong site (the
   painted href can freeze if rAF throttles while a popup steals focus). */
function currentLiveUrl() {
  const p = scrollP();
  if (p < P_PORT_A - 0.006 || p > P_PORT_B + 0.012) return null;
  const nn = PROJECTS.length;
  const ff = clamp01((p - P_PORT_A) / (P_PORT_B - P_PORT_A));
  const active = Math.round(ff * nn);
  if (active < 1) return null;                       // still on the intro slide
  return PROJECTS[Math.min(nn, active) - 1].url;
}

/* navigate to the live site EXPLICITLY — the native target=_blank default is
   unreliable (headless suppresses it, mobile Lenis can swallow the tap), so we
   open it ourselves from inside the user gesture. Fire on pointerup AND click
   so touch and mouse both land it. */
if (screenLive) {
  let opened = 0;
  const openLive = (e) => {
    const url = currentLiveUrl() || screenLive.getAttribute('href');
    if (!url || url === '#') return;
    e.preventDefault();
    const now = performance.now();
    if (now - opened < 600) return;                  // de-dupe pointerup+click pair
    opened = now;
    sound.flip();
    window.open(url, '_blank', 'noopener');
  };
  screenLive.addEventListener('click', openLive);
  screenLive.addEventListener('pointerup', openLive);
}

if (screenSkip) {
  const doSkip = (e) => {
    e.preventDefault();
    sound.flip();
    const y = rawOf(0.596) * maxScroll();   // past the glitch-out, onto the bureau landing
    if (lenis) lenis.scrollTo(y, { duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 3) });
    else window.scrollTo({ top: y, behavior: 'smooth' });
  };
  screenSkip.addEventListener('click', doSkip);
  screenSkip.addEventListener('pointerup', doSkip);
}

/* HUD */
const hudFill = document.getElementById('hud-bar-fill');
const hudSection = document.getElementById('hud-section');
const SECTIONS = [
  [0.098, 'hud.1'],
  [0.580, 'hud.2'],
  [0.735, 'hud.3'],
  [0.81, 'hud.4'],
  [0.91, 'hud.5'],
  [1.01, 'hud.6'],
];
let hudLabel = '';
function updateHUD(pRaw, p, phoneOn) {
  hudFill.style.transform = `scaleX(${pRaw.toFixed(4)})`;
  let next = '';
  if (phoneOn) next = i18n.t('hud.apps');
  else {
    for (const [t, key] of SECTIONS) {
      if (p < t) { next = i18n.t(key); break; }
    }
  }
  if (next && next !== hudLabel) { hudLabel = next; hudSection.textContent = next; }
}

/* ============================================================
   THREE.JS WORLD
   ============================================================ */
let renderer, scene, camera, composer, bloomPass, grainPass;
let termCtx, termTex, lastTermDraw = 0;

const groups = {};
const stripMeshes = [];
let screenMesh = null, heroScreenGlow = null;
let sheetMesh = null;
let floppyGroup = null, sparkles = null, floppyLight = null;
let dialDisc = null, dialTarget = 0, dialVel = 0, lastDialKick = 0, dialAccum = 0;
let dialReadCtx = null, dialReadTex = null, lastReadDraw = 0;
const dialHotC = { x: 0, y: 0 };
let lastShred = 0;
let dust = null, faxPaper = null, faxLed = null;
let camLight = null;
let phoneGroup = null, phoneScreen = null, phoneCtx = null, phoneTex = null;
let phonePadRing = null, phonePadLight = null, phoneGlow = null;

/* the phone's desk berth — right of the keyboard, on a charging pad */
const PHONE_POS = { x: 2.55, z: 0.78 };
const PHONE_LIE_Y = -0.555;    // face-down on the pad
const PHONE_HOVER_Y = 0.14;    // levitating, facing the visitor

async function initGL() {
  const canvas = document.getElementById('gl');
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MOBILE ? 1.5 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.98;
  renderer.localClippingEnabled = true;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x231d17);   // warm charcoal — welcoming, not harsh black
  scene.fog = new THREE.Fog(0x1c1712, 7, 19);

  camera = new THREE.PerspectiveCamera(44, window.innerWidth / window.innerHeight, 0.05, 60);
  camera.position.set(0, 0.62, 7.0);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  // ---- lights ----
  scene.add(new THREE.HemisphereLight(0x4a4034, 0x1c1712, 0.6));   // warm sky, warm ground
  const key = new THREE.DirectionalLight(0xffd9a0, 0.95);
  key.position.set(4, 7, 6);
  scene.add(key);
  camLight = new THREE.PointLight(0xffe6c0, 7, 12, 1.8);
  scene.add(camLight);
  const screenGlow = new THREE.PointLight(0x66ff99, 4, 6, 1.8);
  screenGlow.position.set(0, 0.7, 1.8);
  scene.add(screenGlow);
  floppyLight = new THREE.PointLight(0xffc25e, 6, 10, 1.8);
  floppyLight.position.set(CENTER_X, FLOPPY_Y + 1.0, 2.6);
  scene.add(floppyLight);
  const contactLight = new THREE.PointLight(0xfff1c8, 16, 10, 1.8);
  contactLight.position.set(CENTER_X, L_CONTACT + 1.3, 3);
  scene.add(contactLight);

  // ---- shared materials ----
  const beige = new THREE.MeshStandardMaterial({ color: 0xd6c9ae, roughness: 0.62, metalness: 0.05, envMapIntensity: 0.3 });
  const beigeDark = new THREE.MeshStandardMaterial({ color: 0xb8ab90, roughness: 0.7, metalness: 0.05, envMapIntensity: 0.25 });
  const darkPlastic = new THREE.MeshStandardMaterial({ color: 0x17130e, roughness: 0.5, metalness: 0.1, envMapIntensity: 0.3 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xd4a017, roughness: 0.26, metalness: 1.0, envMapIntensity: 1.15 });
  const silver = new THREE.MeshStandardMaterial({ color: 0xc9c9c9, roughness: 0.22, metalness: 1.0, envMapIntensity: 1.0 });

  // ---- floor ----
  // the office floor ends just before the shaft — the last exhibits hang over the edge
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(108, 34),
    new THREE.MeshStandardMaterial({ color: 0x18130f, roughness: 0.92, metalness: 0 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(12, -1.2, 0);
  scene.add(floor);

  /* ------------------------------------------------------------
     HERO — beige computer on a desk
     ------------------------------------------------------------ */
  const gHero = new THREE.Group();
  groups.hero = gHero;
  scene.add(gHero);

  // desk
  const desk = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.14, 3.4), new THREE.MeshStandardMaterial({ color: 0x241a10, roughness: 0.75 }));
  desk.position.set(0, -0.67, 0.4);
  gHero.add(desk);
  for (const [lx, lz] of [[-3.0, -0.9], [3.0, -0.9], [-3.0, 1.6], [3.0, 1.6]]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.53, 0.12), darkPlastic);
    leg.position.set(lx, -0.965, lz);
    gHero.add(leg);
  }

  // monitor
  const mon = new THREE.Mesh(new RoundedBoxGeometry(2.6, 1.95, 1.7, 4, 0.07), beige);
  mon.position.set(0, 0.535, 0);
  gHero.add(mon);
  const base = new THREE.Mesh(new RoundedBoxGeometry(2.25, 0.16, 1.5, 3, 0.04), beigeDark);
  base.position.set(0, -0.52, 0.1);
  gHero.add(base);
  const bezel = new THREE.Mesh(new THREE.PlaneGeometry(2.14, 1.58), darkPlastic);
  bezel.position.set(0, 0.55, 0.856);
  gHero.add(bezel);

  // CRT screen — one live canvas: terminal at rest, PORTFOLIO.EXE when zoomed.
  // The geometry bulges slightly outward: real CRT curvature, so everything
  // shown on it (including the portfolio) warps like an old tube.
  const [termC, tctx] = makeCanvas(1024, 768);
  termCtx = tctx;
  termTex = canvasTexture(termC);
  drawTerminal(0);
  const screenGeo = new THREE.PlaneGeometry(1.86, 1.34, 32, 24);
  {
    const posA = screenGeo.attributes.position;
    for (let v = 0; v < posA.count; v++) {
      const nx = posA.getX(v) / 0.93, ny = posA.getY(v) / 0.67;   // -1..1
      posA.setZ(v, 0.05 * (1 - Math.min(1, nx * nx * 0.6 + ny * ny * 0.6)));
    }
    screenGeo.computeVertexNormals();
  }
  screenMesh = new THREE.Mesh(screenGeo, new THREE.MeshBasicMaterial({ map: termTex }));
  screenMesh.position.set(0, 0.55, 0.862);
  gHero.add(screenMesh);
  heroScreenGlow = screenGlow;

  // keyboard + keys
  const kb = new THREE.Mesh(new RoundedBoxGeometry(2.3, 0.11, 0.85, 3, 0.03), beige);
  kb.position.set(0, -0.545, 1.55);
  kb.rotation.x = 0.06;
  gHero.add(kb);
  const keyGeo = new THREE.BoxGeometry(0.125, 0.05, 0.125);
  const keys = new THREE.InstancedMesh(keyGeo, beigeDark, 70);
  const m4 = new THREE.Matrix4();
  let ki = 0;
  for (let r = 0; r < 5; r++) for (let c = 0; c < 14; c++) {
    m4.setPosition(-0.975 + c * 0.15, -0.483 + (2 - r) * 0.0085, 1.26 + r * 0.145);
    keys.setMatrixAt(ki++, m4);
  }
  gHero.add(keys);

  // tower
  const tower = new THREE.Mesh(new RoundedBoxGeometry(0.9, 2.0, 1.6, 3, 0.05), beige);
  tower.position.set(-2.75, -0.2, 0);
  gHero.add(tower);
  for (let i = 0; i < 2; i++) {
    const bay = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.09, 0.02), darkPlastic);
    bay.position.set(-2.75, 0.52 - i * 0.2, 0.81);
    gHero.add(bay);
  }

  // coffee mug
  const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.1, 0.24, 24), new THREE.MeshStandardMaterial({ color: 0xe8e0d0, roughness: 0.4 }));
  mug.position.set(1.75, -0.48, 1.15);
  gHero.add(mug);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.02, 10, 24), mug.material);
  handle.position.set(1.87, -0.48, 1.15);
  gHero.add(handle);

  // the trusty two-button mouse — on a dark mousepad so it actually reads
  const mousepad = new THREE.Mesh(
    new THREE.PlaneGeometry(1.05, 0.8),
    new THREE.MeshStandardMaterial({ color: 0x23262b, roughness: 0.95 })
  );
  mousepad.rotation.x = -Math.PI / 2;
  mousepad.position.set(1.62, -0.592, 1.55);
  gHero.add(mousepad);
  const gMouse = new THREE.Group();
  const mBody = new THREE.Mesh(new RoundedBoxGeometry(0.38, 0.17, 0.56, 4, 0.075), beige);
  gMouse.add(mBody);
  const mDivider = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.035, 0.24), darkPlastic);
  mDivider.position.set(0, 0.075, -0.145);
  gMouse.add(mDivider);
  const mSeam = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.035, 0.016), darkPlastic);
  mSeam.position.set(0, 0.075, -0.03);
  gMouse.add(mSeam);
  gMouse.position.set(1.62, -0.51, 1.55);
  gMouse.rotation.y = -0.38;
  gHero.add(gMouse);
  const cordCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(1.53, -0.52, 1.82),
    new THREE.Vector3(1.1, -0.5, 2.05),
    new THREE.Vector3(0.6, -0.56, 1.94),
    new THREE.Vector3(0.18, -0.5, 2.08),
    new THREE.Vector3(-0.35, -0.56, 1.9),
  ]);
  const cord = new THREE.Mesh(new THREE.TubeGeometry(cordCurve, 32, 0.018, 8), beigeDark);
  gHero.add(cord);

  // post-it note
  const [noteC, nctx] = makeCanvas(128, 128);
  nctx.fillStyle = '#ffd75e'; nctx.fillRect(0, 0, 128, 128);
  nctx.fillStyle = 'rgba(0,0,0,0.06)'; nctx.fillRect(0, 0, 128, 18);
  nctx.fillStyle = '#3a3126';
  nctx.font = `italic 700 30px ${SERIF}`;
  nctx.save(); nctx.translate(64, 74); nctx.rotate(-0.08);
  nctx.textAlign = 'center'; nctx.fillText('SHIP IT', 0, 0); nctx.restore();
  const note = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.3), new THREE.MeshBasicMaterial({ map: canvasTexture(noteC) }));
  note.position.set(0.92, 1.18, 0.87);
  note.rotation.z = -0.1;
  gHero.add(note);

  /* ------------------------------------------------------------
     THE APP DEPT. — a modern glass phone lies face-down on a
     charging pad; after the last record it lifts off, flips over
     and boots a working demo OS (see the PHONE section below)
     ------------------------------------------------------------ */
  phoneGroup = new THREE.Group();
  groups.phone = phoneGroup;
  phoneGroup.position.set(PHONE_POS.x, PHONE_LIE_Y, PHONE_POS.z);
  phoneGroup.rotation.x = Math.PI / 2;   // face-down: only the camera island shows
  gHero.add(phoneGroup);

  const phoneBody = new THREE.Mesh(
    new RoundedBoxGeometry(0.56, 1.14, 0.052, 4, 0.045),
    new THREE.MeshStandardMaterial({ color: 0x33363d, roughness: 0.3, metalness: 0.92, envMapIntensity: 1.15 })
  );
  phoneGroup.add(phoneBody);

  // the live screen
  const [phScreenC, phScreenCtx] = makeCanvas(512, 1080);
  phoneCtx = phScreenCtx;
  phoneTex = canvasTexture(phScreenC);
  drawPhoneOff();
  phoneScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 1.055), new THREE.MeshBasicMaterial({ map: phoneTex }));
  phoneScreen.position.z = 0.0272;
  phoneGroup.add(phoneScreen);

  // back: camera island with gold lens rings — the one luxury the board approved
  const island = new THREE.Mesh(new RoundedBoxGeometry(0.21, 0.21, 0.018, 2, 0.03), darkPlastic);
  island.position.set(-0.13, 0.39, -0.031);
  phoneGroup.add(island);
  for (const [lx, ly] of [[-0.165, 0.425], [-0.095, 0.355]]) {
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.016, 24), darkPlastic);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(lx, ly, -0.04);
    phoneGroup.add(lens);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.036, 0.006, 8, 24), gold);
    ring.position.set(lx, ly, -0.047);
    phoneGroup.add(ring);
  }
  const [pbLogoC, pbLogoCtx] = makeCanvas(256, 512);
  pbLogoCtx.clearRect(0, 0, 256, 512);
  pbLogoCtx.fillStyle = 'rgba(246,241,230,0.5)';
  pbLogoCtx.font = `400 26px ${DISPLAY}`;
  pbLogoCtx.textAlign = 'center';
  pbLogoCtx.fillText('BENZERSIZ®', 128, 400);
  pbLogoCtx.font = `500 15px ${MONO}`;
  pbLogoCtx.fillStyle = 'rgba(246,241,230,0.32)';
  pbLogoCtx.fillText('POCKET DIVISION', 128, 432);
  const backLogo = new THREE.Mesh(
    new THREE.PlaneGeometry(0.5, 1.0),
    new THREE.MeshBasicMaterial({ map: canvasTexture(pbLogoC), transparent: true })
  );
  backLogo.rotation.y = Math.PI;
  backLogo.position.z = -0.0272;
  phoneGroup.add(backLogo);

  // the charging pad — a quiet promise that something modern lives on this desk
  const padDisc = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.44, 0.02, 48),
    new THREE.MeshStandardMaterial({ color: 0x20262e, roughness: 0.4, metalness: 0.55 })
  );
  padDisc.position.set(PHONE_POS.x, -0.593, PHONE_POS.z);
  gHero.add(padDisc);
  phonePadRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.41, 0.011, 8, 64),
    new THREE.MeshBasicMaterial({ color: 0x8fd8ff, transparent: true, opacity: 0.3 })
  );
  phonePadRing.rotation.x = Math.PI / 2;
  phonePadRing.position.set(PHONE_POS.x, -0.581, PHONE_POS.z);
  gHero.add(phonePadRing);
  phonePadLight = new THREE.PointLight(0x9fd9ff, 0, 4.5, 1.8);
  phonePadLight.position.set(PHONE_POS.x, -0.1, PHONE_POS.z + 0.4);
  gHero.add(phonePadLight);
  phoneGlow = new THREE.PointLight(0xbfe9ff, 0, 3.5, 2);
  phoneGlow.position.set(PHONE_POS.x, PHONE_HOVER_Y + 0.05, PHONE_POS.z + 0.9);
  gHero.add(phoneGlow);

  // desk placard, in the house plate style
  const [mdC, mdCtx] = makeCanvas(512, 128);
  mdCtx.fillStyle = '#17130e'; mdCtx.fillRect(0, 0, 512, 128);
  mdCtx.strokeStyle = '#6c9bd2'; mdCtx.lineWidth = 3; mdCtx.strokeRect(8, 8, 496, 112);
  mdCtx.fillStyle = '#f4f1ea';
  mdCtx.font = `400 34px ${DISPLAY}`; mdCtx.textAlign = 'center';
  mdCtx.fillText('MOBILE DIVISION', 256, 55);
  mdCtx.font = `500 19px ${MONO}`; mdCtx.fillStyle = '#8fb5e3';
  mdCtx.fillText('EST. TODAY · APPS SHIPPED DAILY', 256, 94);
  const placardBack = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.2, 0.02), darkPlastic);
  placardBack.position.set(3.12, -0.5, 1.06);
  placardBack.rotation.set(-0.08, -0.42, 0);
  gHero.add(placardBack);
  const placard = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.175), new THREE.MeshBasicMaterial({ map: canvasTexture(mdC) }));
  placard.position.set(3.12, -0.5, 1.072);
  placard.rotation.set(-0.08, -0.42, 0);
  gHero.add(placard);

  // the portfolio lives INSIDE the CRT — load the site recordings for it
  loadShots();

  /* ------------------------------------------------------------
     BUREAU backdrop — the FAX-MASTER 9000, printing an endless
     inter-office memo as you scroll (plus office dust)
     ------------------------------------------------------------ */
  const gFax = new THREE.Group();
  groups.fax = gFax;
  gFax.position.set(-2.8, L_FAX, -3.4);   // bureau floor: right-of-frame, deep in the fog
  scene.add(gFax);

  const faxBody = new THREE.Mesh(new RoundedBoxGeometry(1.9, 0.62, 1.2, 4, 0.07), beige);
  faxBody.position.set(FAX_X, -0.42, -0.7);
  gFax.add(faxBody);
  const faxSlot = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.05, 0.22), darkPlastic);
  faxSlot.position.set(FAX_X, -0.1, -0.55);
  gFax.add(faxSlot);
  // keypad
  const padGeo = new THREE.BoxGeometry(0.09, 0.035, 0.09);
  const pad = new THREE.InstancedMesh(padGeo, beigeDark, 12);
  const pm = new THREE.Matrix4();
  let pi = 0;
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
    pm.setPosition(FAX_X + 0.45 + c * 0.14, -0.09, -0.62 + r * 0.14);
    pad.setMatrixAt(pi++, pm);
  }
  gFax.add(pad);
  // handset resting on the left
  const handset = new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.14, 0.85, 3, 0.06), darkPlastic);
  handset.position.set(FAX_X - 0.72, -0.05, -0.6);
  gFax.add(handset);
  // blinking LED
  faxLed = new THREE.Mesh(new THREE.SphereGeometry(0.028, 12, 12), new THREE.MeshBasicMaterial({ color: 0xff2a1a }));
  faxLed.position.set(FAX_X + 0.45, -0.09, -0.42);
  gFax.add(faxLed);
  // front plate
  const [fpC, fpCtx] = makeCanvas(512, 128);
  fpCtx.fillStyle = '#17130e'; fpCtx.fillRect(0, 0, 512, 128);
  fpCtx.strokeStyle = '#6c9bd2'; fpCtx.lineWidth = 3; fpCtx.strokeRect(8, 8, 496, 112);
  fpCtx.fillStyle = '#f4f1ea';
  fpCtx.font = `400 36px ${DISPLAY}`; fpCtx.textAlign = 'center';
  fpCtx.fillText('FAX-MASTER 9000', 256, 55);
  fpCtx.font = `500 19px ${MONO}`; fpCtx.fillStyle = '#8fb5e3';
  fpCtx.fillText('MEMOS AT THE SPEED OF PAPER', 256, 94);
  const faxPlate = new THREE.Mesh(new THREE.PlaneGeometry(1.35, 0.34), new THREE.MeshBasicMaterial({ map: canvasTexture(fpC) }));
  faxPlate.position.set(FAX_X - 0.05, -0.42, -0.095);
  gFax.add(faxPlate);
  // the memo — grows out of the slot as you scroll (geometry anchored at its base)
  const [memoC, memoCtx] = makeCanvas(512, 1024);
  drawMemo(memoCtx);
  const memoGeo = new THREE.PlaneGeometry(1.15, 2.1, 1, 1);
  memoGeo.translate(0, 1.05, 0);
  faxPaper = new THREE.Mesh(memoGeo, new THREE.MeshBasicMaterial({ map: canvasTexture(memoC), side: THREE.DoubleSide }));
  faxPaper.position.set(FAX_X, -0.1, -0.55);
  faxPaper.rotation.x = -0.22;
  faxPaper.scale.y = 0.06;
  gFax.add(faxPaper);

  const dustGeo = new THREE.BufferGeometry();
  const N = MOBILE ? 550 : 1250;
  const pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    if (i % 2) {
      // the descent shaft
      pos[i * 3] = 62 + Math.random() * 18;
      pos[i * 3 + 1] = -37 + Math.random() * 40;
      pos[i * 3 + 2] = -6 + Math.random() * 9;
    } else {
      // the office level
      pos[i * 3] = -3 + Math.random() * 76;
      pos[i * 3 + 1] = -1.1 + Math.random() * 4.4;
      pos[i * 3 + 2] = -5 + Math.random() * 8;
    }
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
    color: 0x8fb5e3, size: 0.02, transparent: true, opacity: 0.5,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  scene.add(dust);

  /* ------------------------------------------------------------
     SHREDDER
     ------------------------------------------------------------ */
  const gShred = new THREE.Group();
  groups.shred = gShred;
  gShred.position.set(CENTER_X - SHRED_X, L_SHRED, 0);   // destruction dept. floor
  scene.add(gShred);

  // floating industrial shred-head — paper feeds in the top, strips dangle below
  const shredBody = new THREE.Mesh(new RoundedBoxGeometry(2.3, 0.62, 0.9, 4, 0.06), beige);
  shredBody.position.set(SHRED_X, 0.18, 0);
  gShred.add(shredBody);
  const slot = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.05, 0.28), darkPlastic);
  slot.position.set(SHRED_X, SLOT_Y, 0);
  gShred.add(slot);
  const underSlot = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.05, 0.28), darkPlastic);
  underSlot.position.set(SHRED_X, -0.13, 0);
  gShred.add(underSlot);

  // label plate
  const [plC, plCtx] = makeCanvas(512, 128);
  plCtx.fillStyle = '#171a1e'; plCtx.fillRect(0, 0, 512, 128);
  plCtx.strokeStyle = '#6c9bd2'; plCtx.lineWidth = 3; plCtx.strokeRect(8, 8, 496, 112);
  plCtx.fillStyle = '#f4f1ea';
  plCtx.font = `400 36px ${DISPLAY}`; plCtx.textAlign = 'center';
  plCtx.fillText('SHRED-O-MATIC 3000', 256, 56);
  plCtx.font = `500 20px ${MONO}`; plCtx.fillStyle = '#8fb5e3';
  plCtx.fillText('INDUSTRIAL GRADE · FOR SERIOUS DOCUMENTS', 256, 96);
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.375), new THREE.MeshBasicMaterial({ map: canvasTexture(plC) }));
  plate.position.set(SHRED_X, 0.18, 0.462);
  gShred.add(plate);

  // the doomed document: a printout of the client's OLD website
  const [paperC, pctx] = makeCanvas(768, 1024);
  drawOldWebsite(pctx);
  const paperTex = canvasTexture(paperC);
  // clipping planes are world-space: account for the floor the shredder lives on
  const SLOT_WY = SLOT_Y + L_SHRED;
  const clipAbove = new THREE.Plane(new THREE.Vector3(0, 1, 0), -SLOT_WY);   // keep y >= slot
  const clipBelow = new THREE.Plane(new THREE.Vector3(0, -1, 0), SLOT_WY);   // keep y <= slot

  sheetMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 2.0),
    new THREE.MeshBasicMaterial({ map: paperTex, side: THREE.DoubleSide, clippingPlanes: [clipAbove] })
  );
  sheetMesh.position.set(SHRED_X, SLOT_Y + 1.0, 0.02);
  gShred.add(sheetMesh);

  const NSTRIPS = 16;
  for (let i = 0; i < NSTRIPS; i++) {
    const g = new THREE.PlaneGeometry(1.5 / NSTRIPS, 2.0, 1, 6);
    const uv = g.attributes.uv;
    for (let v = 0; v < uv.count; v++) uv.setX(v, (i + uv.getX(v)) / NSTRIPS);
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({
      map: paperTex, side: THREE.DoubleSide, transparent: true,
      clippingPlanes: [clipBelow],
    }));
    m.position.set(SHRED_X - 0.75 + (i + 0.5) * (1.5 / NSTRIPS), SLOT_Y + 1.0, 0.02 + i * 0.0012);
    m.userData.i = i;
    stripMeshes.push(m);
    gShred.add(m);
  }

  /* ------------------------------------------------------------
     THE GOLDEN FLOPPY
     ------------------------------------------------------------ */
  floppyGroup = new THREE.Group();
  groups.floppy = floppyGroup;
  floppyGroup.position.set(CENTER_X, FLOPPY_Y, 0);   // awards floor
  scene.add(floppyGroup);

  const body = new THREE.Mesh(new RoundedBoxGeometry(1.5, 1.5, 0.09, 3, 0.02), gold);
  floppyGroup.add(body);
  const shutter = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.42, 0.1), silver);
  shutter.position.set(0.05, 0.5, 0.002);
  floppyGroup.add(shutter);
  const shutterSlot = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.3, 0.104), darkPlastic);
  shutterSlot.position.set(0.14, 0.5, 0);
  floppyGroup.add(shutterSlot);
  const notch = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.095), darkPlastic);
  notch.position.set(-0.66, -0.66, 0);
  floppyGroup.add(notch);

  const [flC, flCtx] = makeCanvas(512, 352);
  drawFloppyLabel(flCtx);
  const label = new THREE.Mesh(new THREE.PlaneGeometry(0.98, 0.674), new THREE.MeshBasicMaterial({ map: canvasTexture(flC) }));
  label.position.set(0, -0.3, 0.047);
  floppyGroup.add(label);
  const labelBack = label.clone();
  labelBack.rotation.y = Math.PI;
  labelBack.position.z = -0.047;
  floppyGroup.add(labelBack);

  // sparkles
  const spGeo = new THREE.BufferGeometry();
  const SP = 160;
  const spPos = new Float32Array(SP * 3);
  for (let i = 0; i < SP; i++) {
    const a = Math.random() * Math.PI * 2, r = 1.2 + Math.random() * 2.2;
    spPos[i * 3] = Math.cos(a) * r;
    spPos[i * 3 + 1] = -1 + Math.random() * 2.6;
    spPos[i * 3 + 2] = Math.sin(a) * r * 0.6;
  }
  spGeo.setAttribute('position', new THREE.BufferAttribute(spPos, 3));
  sparkles = new THREE.Points(spGeo, new THREE.PointsMaterial({
    color: 0xffd98a, size: 0.035, transparent: true, opacity: 0.85,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  floppyGroup.add(sparkles);

  /* ------------------------------------------------------------
     INTERFACE — rotary dial + business card
     ------------------------------------------------------------ */
  const gContact = new THREE.Group();
  groups.contact = gContact;
  gContact.position.set(CENTER_X - CONTACT_X, L_CONTACT, 0);   // basement interface
  scene.add(gContact);

  const [dialC, dctx] = makeCanvas(512, 512);
  drawDial(dctx);
  dialDisc = new THREE.Mesh(new THREE.CircleGeometry(1.12, 64), new THREE.MeshBasicMaterial({ map: canvasTexture(dialC) }));
  dialDisc.position.set(CONTACT_X + 2.55, -0.05, 0.08);
  gContact.add(dialDisc);
  const dialBase = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.28, 0.16, 64), darkPlastic);
  dialBase.rotation.x = Math.PI / 2;
  dialBase.position.set(CONTACT_X + 2.55, -0.05, -0.02);
  gContact.add(dialBase);
  const brandBlue = new THREE.MeshStandardMaterial({ color: 0x4a79ab, roughness: 0.3, metalness: 0.85, envMapIntensity: 1.0 });
  const dialRing = new THREE.Mesh(new THREE.TorusGeometry(1.16, 0.035, 12, 72), brandBlue);
  dialRing.position.copy(dialDisc.position);
  gContact.add(dialRing);
  const [capC, capCtx] = makeCanvas(256, 256);
  drawDialCap(capCtx);
  const capTex = canvasTexture(capC);
  const dialCap = new THREE.Mesh(new THREE.CircleGeometry(0.42, 48), new THREE.MeshBasicMaterial({ map: capTex, transparent: true }));
  dialCap.position.set(dialDisc.position.x, dialDisc.position.y, 0.1);
  gContact.add(dialCap);

  // dial readout — the hint, and the number appearing as you dial
  const [drC, drCtx] = makeCanvas(768, 120);
  dialReadCtx = drCtx;
  dialReadTex = canvasTexture(drC);
  const dialRead = new THREE.Mesh(
    new THREE.PlaneGeometry(2.3, 0.36),
    new THREE.MeshBasicMaterial({ map: dialReadTex, transparent: true })
  );
  dialRead.position.set(CONTACT_X + 2.55, 1.44, 0.12);
  gContact.add(dialRead);

  const [bcC, bcCtx] = makeCanvas(640, 384);
  drawBusinessCard(bcCtx);
  const bcard = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.02), new THREE.MeshBasicMaterial({ map: canvasTexture(bcC) }));
  bcard.position.set(CONTACT_X + 1.1, -1.05, 0.6);
  bcard.rotation.set(-0.9, 0.12, -0.06);
  gContact.add(bcard);

  // framed Certificate of Seriousness on the basement wall
  const [certC, certCtx] = makeCanvas(512, 384);
  drawCertificate(certCtx);
  const certFrame = new THREE.Mesh(new THREE.BoxGeometry(1.52, 1.16, 0.05), darkPlastic);
  certFrame.position.set(CONTACT_X - 2.7, 0.62, -0.42);
  certFrame.rotation.y = 0.14;
  gContact.add(certFrame);
  const cert = new THREE.Mesh(new THREE.PlaneGeometry(1.38, 1.02), new THREE.MeshBasicMaterial({ map: canvasTexture(certC) }));
  cert.position.set(CONTACT_X - 2.7, 0.62, -0.39);
  cert.rotation.y = 0.14;
  gContact.add(cert);

  /* ---- post-processing ---- */
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.45, 0.7, 0.85);
  composer.addPass(bloomPass);
  composer.addPass(new OutputPass());

  grainPass = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uGrain: { value: 0.08 },
      uScan: { value: 0.25 },
      uVig: { value: 0.4 },
      uCA: { value: 1.0 },
      uSepia: { value: 0.2 },
      uFlash: { value: 0 },
      uStatic: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float uTime, uGrain, uScan, uVig, uCA, uSepia, uFlash, uStatic;
      uniform vec2 uRes;
      varying vec2 vUv;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      void main() {
        vec2 uv = vUv;
        vec2 d = uv - 0.5;
        float ca = uCA * 0.0016;
        float r = texture2D(tDiffuse, uv + d * ca).r;
        float g = texture2D(tDiffuse, uv).g;
        float b = texture2D(tDiffuse, uv - d * ca).b;
        vec3 col = vec3(r, g, b);
        col *= 1.0 - uScan * 0.45 * (0.5 + 0.5 * sin(uv.y * uRes.y * 3.14159));
        float n = hash(uv * uRes * 0.5 + fract(uTime) * 61.7);
        col += (n - 0.5) * uGrain;
        vec3 sep = vec3(
          dot(col, vec3(0.393, 0.769, 0.189)),
          dot(col, vec3(0.349, 0.686, 0.168)),
          dot(col, vec3(0.272, 0.534, 0.131)));
        col = mix(col, sep, uSepia);
        col *= 1.0 - uVig * smoothstep(0.3, 0.95, length(d) * 1.65);
        if (uStatic > 0.001) {
          float sn = hash(floor(uv * uRes / 2.5) * 2.5 + fract(uTime) * 217.0);
          col = mix(col, vec3(sn * 0.9), uStatic);
        }
        col = mix(col, vec3(0.0), uFlash);   // the teleport is a CRT power-cut, not a flash
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  composer.addPass(grainPass);

  window.addEventListener('resize', onResize);
  onResize(); // window may have resized while we were initializing
  assetsReady = true;
}

/* ------------------------------------------------------------
   Site recordings — 6 scroll-through frames per client site,
   played back inside the CRT as struggling "footage"
   ------------------------------------------------------------ */
function loadShots() {
  for (const pr of PROJECTS) {
    for (let f = 0; f < 6; f++) {
      const img = new Image();
      img.src = `shots/${pr.slug}/f${f}.webp`;
      img.onload = () => { pr.frames[f] = img; };
    }
  }
}

/* ------------------------------------------------------------
   Canvas texture painters
   ------------------------------------------------------------ */
function drawTerminal(t) {
  const ctx = termCtx, W = 512, H = 384;
  ctx.save();
  ctx.scale(2, 2);                       // canvas is 1024×768; terminal draws in 512×384 logical
  ctx.fillStyle = '#03130a';
  ctx.fillRect(0, 0, W, H);
  const g = '#58ff8a';
  ctx.fillStyle = 'rgba(88,255,138,0.12)';
  ctx.fillRect(0, 0, W, 30);
  ctx.fillStyle = g;
  ctx.font = `600 15px ${MONO}`;
  ctx.fillText('BENZERSIZ OS v2.6 — BUSINESS TERMINAL', 14, 20);
  ctx.font = `500 14px ${MONO}`;
  const lines = [
    'C:\\> LOAD BUSINESS.EXE',
    'ENUMERATING CLOSED DEALS ... 15 FOUND',
    'HANDSHAKE PROTOCOL .......... FIRM',
    '',
    'REVENUE FORECAST (OPTIMISTIC):',
  ];
  lines.forEach((l, i) => ctx.fillText(l, 14, 56 + i * 24));
  // animated bar chart
  for (let i = 0; i < 8; i++) {
    const h = 26 + Math.abs(Math.sin(t * 0.9 + i * 1.2)) * 76 + i * 7;
    ctx.fillStyle = i === 7 ? '#ffd75e' : 'rgba(88,255,138,0.8)';
    ctx.fillRect(20 + i * 42, 300 - h, 26, h);
  }
  ctx.fillStyle = g;
  ctx.font = `500 13px ${MONO}`;
  ctx.fillText('Q1   Q2   Q3   Q4   Q5*  Q6*  Q7*  Q8*', 20, 322);
  ctx.fillStyle = 'rgba(88,255,138,0.5)';
  ctx.fillText('*QUARTERS BEYOND Q4 PENDING BOARD APPROVAL', 14, 348);
  if (Math.floor(t * 2) % 2 === 0) {
    ctx.fillStyle = g;
    ctx.fillRect(14, 358, 10, 16);
  }
  // the machine itself tells you what to do
  if (Math.floor(t * 1.4) % 2 === 0) {
    ctx.fillStyle = '#ffd75e';
    ctx.font = `600 17px ${MONO}`;
    ctx.textAlign = 'center';
    ctx.fillText('▼ SCROLL TO CONTINUE ▼', W / 2, 372);
    ctx.textAlign = 'left';
  }
  // rolling brightness band
  const y = (t * 60) % (H + 80) - 40;
  const grad = ctx.createLinearGradient(0, y, 0, y + 50);
  grad.addColorStop(0, 'rgba(255,255,255,0)');
  grad.addColorStop(0.5, 'rgba(200,255,220,0.05)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, y, W, 50);
  // scanlines
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  for (let sy = 0; sy < H; sy += 3) ctx.fillRect(0, sy, W, 1);
  ctx.restore();
  termTex.needsUpdate = true;
}

/* ------------------------------------------------------------
   PORTFOLIO.EXE — the records scroll vertically INSIDE the CRT.
   The outer page scroll drives `inner`; the tube distorts, tears,
   flickers and generally struggles to display modern websites.
   ------------------------------------------------------------ */
const SLIDE_H = 768;
const SCR_W = 1024, SCR_H = 768;
let lastSlide = -1;

/* PORTFOLIO COLUMN — on portrait the camera zooms IN so the tube fills the phone
   height (you are inside the screen); only the central strip of the wide canvas
   is visible, so the whole record is laid out vertically inside that strip. */
const PC = { ox: 0, cw: SCR_W };
function computeCol() {
  const d = Math.max(0.5, camera.position.z - 0.862);
  const halfH = d * Math.tan((camera.fov * Math.PI / 180) / 2);
  const halfW = halfH * camera.aspect;
  const frac = Math.min(1, halfW / 0.93);           // 0.93 = screen half-width (world)
  const cw = Math.max(340, Math.min(SCR_W, SCR_W * frac * 0.985));
  PC.cw = cw; PC.ox = (SCR_W - cw) / 2;
}

/* shrink a font until the text fits maxW */
function fitFont(ctx, text, maxW, base, weight, family, min = 22) {
  let size = base;
  ctx.font = `${weight} ${size}px ${family}`;
  while (ctx.measureText(text).width > maxW && size > min) {
    size -= 2; ctx.font = `${weight} ${size}px ${family}`;
  }
  return size;
}

const barH = (compact) => (compact ? 56 : 40);
function portBtnRect(yTop, ar, compact) {
  if (compact) return { bx: PC.ox + 26, by: yTop + 556, bw: PC.cw - 52, bh: 68 };
  return { bx: ar ? SCR_W - 48 - 330 : 48, by: yTop + 676, bw: 330, bh: 46 };
}
function portSkipRect(ar, compact) {
  if (compact) return { x: PC.ox + 70, y: SCR_H - 62, w: PC.cw - 140, h: 46 };
  const w = 175, h = 40;
  const x = ar ? 24 : SCR_W - 24 - w;
  return { x, y: SCR_H - h - 16, w, h };
}

function drawProjectSlide(ctx, yTop, i, t, ar, compact) {
  if (compact) return drawProjectSlideCompact(ctx, yTop, i, t, ar);
  const pr = PROJECTS[i];
  // footage window
  const ix = compact ? 28 : 40, iy = yTop + (compact ? 20 : 56),
    iw = SCR_W - (compact ? 56 : 80), ih = compact ? 398 : 452;
  ctx.fillStyle = '#01100a';
  ctx.fillRect(ix - 4, iy - 4, iw + 8, ih + 8);
  ctx.strokeStyle = 'rgba(88,255,138,0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(ix - 4, iy - 4, iw + 8, ih + 8);
  const loaded = pr.frames.filter(Boolean);
  const fr = loaded.length ? pr.frames[Math.floor(t * 2.1 + i) % 6] || loaded[0] : null;
  if (fr) {
    const sh = fr.width * (ih / iw);
    const sy = Math.max(0, (fr.height - sh) / 2);
    ctx.drawImage(fr, 0, sy, fr.width, Math.min(sh, fr.height), ix, iy, iw, ih);
    // the tube struggles: green cast + darkened edges over the footage
    ctx.fillStyle = 'rgba(70,255,150,0.055)';
    ctx.fillRect(ix, iy, iw, ih);
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(ix, iy, iw, 26);
    ctx.fillStyle = '#58ff8a';
    ctx.font = `600 15px ${MONO}`;
    ctx.textAlign = 'left';
    ctx.fillText('● REC', ix + 12, iy + 19);
    ctx.textAlign = 'right';
    ctx.fillText('SIGNAL: ACCEPTABLE', ix + iw - 12, iy + 19);
  } else {
    ctx.fillStyle = '#58ff8a';
    ctx.font = `500 22px ${MONO}`;
    ctx.textAlign = 'center';
    ctx.fillText('RETRIEVING RECORD ... ▮', ix + iw / 2, iy + ih / 2);
  }
  // info panel
  const tx = ar ? SCR_W - (compact ? 28 : 48) : (compact ? 28 : 48);
  ctx.textAlign = ar ? 'right' : 'left';
  ctx.fillStyle = '#8fb5e3';
  ctx.font = ar ? `700 ${compact ? 36 : 22}px ${AR_BODY}` : `600 ${compact ? 28 : 17}px ${MONO}`;
  ctx.fillText(`${ar ? pr.exAr : pr.ex}  ·  ${ar ? pr.subAr : pr.sub}`, tx, yTop + (compact ? 478 : 556));
  ctx.fillStyle = '#eafff0';
  ctx.font = ar && /[؀-ۿ]/.test(pr.titleAr)
    ? `800 ${compact ? 66 : 50}px ${AR_DISPLAY}`
    : `400 ${compact ? 58 : 44}px ${DISPLAY}`;
  ctx.fillText((ar ? pr.titleAr : pr.title).toUpperCase(), tx, yTop + (compact ? 560 : 620));
  ctx.fillStyle = 'rgba(234,255,240,0.72)';
  ctx.font = ar ? `700 ${compact ? 38 : 26}px ${AR_BODY}` : `italic 500 ${compact ? 34 : 26}px ${SERIF}`;
  ctx.fillText(ar ? pr.tagAr : pr.tag, tx, yTop + (compact ? 616 : 664));
  // VIEW LIVE button (the DOM hotspot tracks this rect)
  const { bx, by, bw, bh } = portBtnRect(yTop, ar, compact);
  ctx.fillStyle = 'rgba(88,255,138,0.13)';
  ctx.fillRect(bx, by, bw, bh);
  ctx.strokeStyle = Math.floor(t * 1.6) % 2 === 0 ? '#58ff8a' : 'rgba(88,255,138,0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(bx, by, bw, bh);
  ctx.fillStyle = '#baffd0';
  ctx.font = ar ? `700 ${compact ? 34 : 22}px ${AR_BODY}` : `600 ${compact ? 28 : 17}px ${MONO}`;
  ctx.textAlign = 'center';
  ctx.fillText(i18n.t('work.live'), bx + bw / 2, by + bh / 2 + (ar ? (compact ? 13 : 9) : (compact ? 10 : 7)));
  ctx.textAlign = 'left';
}

function drawIntroSlide(ctx, yTop, t, ar, compact) {
  if (compact) return drawIntroSlideCompact(ctx, yTop, t, ar);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#8fb5e3';
  ctx.font = ar ? `700 ${compact ? 36 : 24}px ${AR_BODY}` : `600 ${compact ? 26 : 17}px ${MONO}`;
  ctx.fillText(i18n.t('work.overline'), SCR_W / 2, yTop + 250);
  ctx.fillStyle = '#eafff0';
  ctx.font = ar ? `800 ${compact ? 84 : 78}px ${AR_DISPLAY}` : `400 ${compact ? 74 : 72}px ${DISPLAY}`;
  ctx.fillText(i18n.t('work.title').toUpperCase(), SCR_W / 2, yTop + 380);
  ctx.fillStyle = 'rgba(234,255,240,0.65)';
  ctx.font = ar ? `700 ${compact ? 38 : 26}px ${AR_BODY}` : `500 ${compact ? 27 : 19}px ${MONO}`;
  ctx.fillText(i18n.t('work.sub'), SCR_W / 2, yTop + 448);
  if (Math.floor(t * 1.4) % 2 === 0) {
    ctx.fillStyle = '#ffd75e';
    ctx.font = ar ? `700 ${compact ? 36 : 24}px ${AR_BODY}` : `600 ${compact ? 27 : 19}px ${MONO}`;
    ctx.fillText(i18n.t('work.keep'), SCR_W / 2, yTop + 570);
  }
  ctx.textAlign = 'left';
}

/* ---- mobile: a full-height vertical record card inside the visible column ---- */
function drawProjectSlideCompact(ctx, yTop, i, t, ar) {
  const pr = PROJECTS[i];
  const cx = PC.ox + PC.cw / 2, pad = 26;
  // footage window (landscape) at the top of the card
  const fw = PC.cw - pad * 2, fh = Math.round(fw * 0.6), fx = PC.ox + pad, fy = yTop + 84;
  ctx.fillStyle = '#01100a';
  ctx.fillRect(fx - 4, fy - 4, fw + 8, fh + 8);
  ctx.strokeStyle = 'rgba(88,255,138,0.42)'; ctx.lineWidth = 2;
  ctx.strokeRect(fx - 4, fy - 4, fw + 8, fh + 8);
  const loaded = pr.frames.filter(Boolean);
  const fr = loaded.length ? pr.frames[Math.floor(t * 2.1 + i) % 6] || loaded[0] : null;
  if (fr) {
    const sh = fr.width * (fh / fw), sy = Math.max(0, (fr.height - sh) / 2);
    ctx.drawImage(fr, 0, sy, fr.width, Math.min(sh, fr.height), fx, fy, fw, fh);
    ctx.fillStyle = 'rgba(70,255,150,0.06)'; ctx.fillRect(fx, fy, fw, fh);
    ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillRect(fx, fy, fw, 32);
    ctx.fillStyle = '#58ff8a'; ctx.font = `600 21px ${MONO}`;
    ctx.textAlign = 'left'; ctx.fillText('● REC', fx + 14, fy + 24);
    ctx.textAlign = 'right';
    ctx.fillText(ar ? `المِلَفُّ ${arNum(String(i + 1).padStart(2, '0'))}` : `REC ${String(i + 1).padStart(2, '0')}/${PROJECTS.length}`, fx + fw - 14, fy + 24);
  } else {
    ctx.fillStyle = '#58ff8a'; ctx.font = `500 26px ${MONO}`; ctx.textAlign = 'center';
    ctx.fillText('RETRIEVING ▮', cx, fy + fh / 2);
  }
  // info block, centered under the footage
  ctx.textAlign = 'center';
  let y = fy + fh + 58;
  ctx.fillStyle = '#8fb5e3';
  const exLine = `${ar ? pr.exAr : pr.ex} · ${ar ? pr.subAr : pr.sub}`;
  fitFont(ctx, exLine, PC.cw - 44, ar ? 30 : 22, 600, ar ? AR_BODY : MONO, 12);
  ctx.fillText(exLine, cx, y);
  y += 72;
  const title = (ar ? pr.titleAr : pr.title).toUpperCase();
  const isAr = ar && /[؀-ۿ]/.test(pr.titleAr);
  fitFont(ctx, title, PC.cw - 52, isAr ? 66 : 56, isAr ? 800 : 400, isAr ? AR_DISPLAY : DISPLAY, 30);
  ctx.fillStyle = '#eafff0';
  ctx.fillText(title, cx, y);
  y += 56;
  ctx.fillStyle = 'rgba(234,255,240,0.78)';
  const tag = ar ? pr.tagAr : pr.tag;
  fitFont(ctx, tag, PC.cw - 52, ar ? 32 : 30, ar ? 500 : 500, ar ? AR_BODY : SERIF, 18);
  if (!ar) ctx.font = `italic ${ctx.font}`;
  ctx.fillText(tag, cx, y);
  // VIEW LIVE button
  const b = portBtnRect(yTop, ar, true);
  ctx.fillStyle = 'rgba(88,255,138,0.15)'; ctx.fillRect(b.bx, b.by, b.bw, b.bh);
  ctx.strokeStyle = Math.floor(t * 1.6) % 2 === 0 ? '#58ff8a' : 'rgba(88,255,138,0.4)';
  ctx.lineWidth = 2; ctx.strokeRect(b.bx, b.by, b.bw, b.bh);
  ctx.fillStyle = '#baffd0'; ctx.font = ar ? `700 30px ${AR_BODY}` : `600 25px ${MONO}`;
  ctx.textAlign = 'center'; ctx.fillText(i18n.t('work.live'), b.bx + b.bw / 2, b.by + b.bh / 2 + (ar ? 11 : 9));
  ctx.textAlign = 'left';
}

function drawIntroSlideCompact(ctx, yTop, t, ar) {
  const cx = PC.ox + PC.cw / 2;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#8fb5e3';
  fitFont(ctx, i18n.t('work.overline'), PC.cw - 40, ar ? 30 : 22, 600, ar ? AR_BODY : MONO, 11);
  ctx.fillText(i18n.t('work.overline'), cx, yTop + 236);
  ctx.fillStyle = '#eafff0';
  const title = i18n.t('work.title').toUpperCase();
  fitFont(ctx, title, PC.cw - 44, ar ? 92 : 78, ar ? 800 : 400, ar ? AR_DISPLAY : DISPLAY, 26);
  ctx.fillText(title, cx, yTop + 344);
  ctx.fillStyle = 'rgba(234,255,240,0.68)';
  fitFont(ctx, i18n.t('work.sub'), PC.cw - 44, ar ? 32 : 22, ar ? 600 : 500, ar ? AR_BODY : MONO, 11);
  ctx.fillText(i18n.t('work.sub'), cx, yTop + 410);
  if (Math.floor(t * 1.4) % 2 === 0) {
    ctx.fillStyle = '#ffd75e';
    fitFont(ctx, i18n.t('work.keep'), PC.cw - 40, ar ? 30 : 22, ar ? 700 : 600, ar ? AR_BODY : MONO, 11);
    ctx.fillText(i18n.t('work.keep'), cx, yTop + 540);
  }
  ctx.textAlign = 'left';
}

/* ------------------------------------------------------------
   Analog corruption engine — the tube tearing itself apart.
   RGB channel split · datamosh slice displacement · vsync roll ·
   invert blocks · signal dropout · sync streaks · dense snow.
   Runs only during the transition windows; g = 0..1 intensity.
   ------------------------------------------------------------ */
let glcv = null, glcx = null, glR, glRx, glG, glGx, glB, glBx;
function ensureGlitchBufs() {
  if (glcv) return;
  [glcv, glcx] = makeCanvas(SCR_W, SCR_H);
  [glR, glRx] = makeCanvas(SCR_W, SCR_H);
  [glG, glGx] = makeCanvas(SCR_W, SCR_H);
  [glB, glBx] = makeCanvas(SCR_W, SCR_H);
}

function drawGlitch(ctx, W, H, g, t) {
  if (g <= 0.01 || RM) return;
  ensureGlitchBufs();
  const rnd = Math.random;
  const src = ctx.canvas;

  // 1) datamosh — slice the frame into horizontal bands and shove them sideways,
  //    occasionally with a vertical hop and a signal-dropout gap
  const bands = 5 + Math.floor(30 * g);
  for (let i = 0; i < bands; i++) {
    const by = rnd() * H;
    const bh = 2 + rnd() * (8 + 70 * g);
    const dx = (rnd() - 0.5) * (24 + 240 * g);
    const dy = rnd() < 0.25 ? (rnd() - 0.5) * 22 * g : 0;
    ctx.drawImage(src, 0, by, W, bh, dx, by + dy, W, bh);
    if (rnd() < 0.16 * g) { ctx.fillStyle = 'rgba(0,0,0,0.92)'; ctx.fillRect(0, by, W, bh * 0.55); }
  }

  // 2) RGB channel split — the signature. Isolate R/G/B (multiply) then
  //    recombine additively with opposing offsets → chromatic tearing
  if (g > 0.16) {
    const dx = (3 + 30 * g) * (rnd() < 0.5 ? 1 : -1);
    const dy = (rnd() - 0.5) * 8 * g;
    const iso = (cx, col) => {
      cx.globalCompositeOperation = 'source-over';
      cx.clearRect(0, 0, W, H);
      cx.drawImage(src, 0, 0);
      cx.globalCompositeOperation = 'multiply';
      cx.fillStyle = col; cx.fillRect(0, 0, W, H);
      cx.globalCompositeOperation = 'source-over';
    };
    iso(glRx, '#ff0000'); iso(glGx, '#00ff00'); iso(glBx, '#0000ff');
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    ctx.drawImage(glR, dx, dy);
    ctx.drawImage(glG, 0, 0);
    ctx.drawImage(glB, -dx, -dy);
    ctx.globalCompositeOperation = 'source-over';
  }

  // 3) vsync loss — the whole picture rolls, with a black retrace seam
  if (g > 0.35 && rnd() < 0.55) {
    const off = (rnd() * H) | 0;
    glcx.clearRect(0, 0, W, H);
    glcx.drawImage(src, 0, 0);
    ctx.drawImage(glcv, 0, off);
    ctx.drawImage(glcv, 0, off - H);
    ctx.fillStyle = 'rgba(0,0,0,0.65)';
    ctx.fillRect(0, off - 1, W, 3);
  }

  // 4) invert / hue-corrupt blocks
  const inv = Math.floor(5 * g);
  for (let i = 0; i < inv; i++) {
    ctx.globalCompositeOperation = 'difference';
    ctx.fillStyle = rnd() < 0.5 ? '#ffffff' : '#00ffb4';
    ctx.fillRect(rnd() * W, rnd() * H, 40 + rnd() * 340, 8 + rnd() * 96);
  }
  ctx.globalCompositeOperation = 'source-over';

  // 5) dense analog snow
  const cells = Math.floor(2800 * g);
  for (let i = 0; i < cells; i++) {
    const gs = 1 + rnd() * (2 + 5 * g);
    const v = rnd();
    ctx.fillStyle = v < 0.44 ? `rgba(232,255,240,${(0.5 * g).toFixed(2)})`
      : v < 0.9 ? `rgba(0,0,0,${(0.62 * g).toFixed(2)})`
        : `rgba(120,255,182,${(0.5 * g).toFixed(2)})`;
    ctx.fillRect(rnd() * W, rnd() * H, gs, gs);
  }

  // 6) bright horizontal sync streaks
  const streaks = Math.floor(6 * g);
  for (let i = 0; i < streaks; i++) {
    ctx.fillStyle = `rgba(255,255,255,${(0.12 + 0.5 * g * rnd()).toFixed(2)})`;
    ctx.fillRect(0, rnd() * H, W, 1 + rnd() * 3);
  }

  // 7) whole-frame chroma flash at peak
  if (g > 0.7) {
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = `rgba(${rnd() < 0.5 ? '40,0,60' : '0,50,40'},${(0.12 * g).toFixed(2)})`;
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';
  }
}

function drawPortfolio(t, sp, compact, glitch = 0) {
  const ctx = termCtx, W = SCR_W, H = SCR_H;
  const ar = i18n.lang === 'ar';
  const n = PROJECTS.length;
  if (compact) computeCol(); else { PC.ox = 0; PC.cw = SCR_W; }
  const colL = PC.ox + 22, colR = PC.ox + PC.cw - 22;
  const bh0 = barH(compact);
  const f = clamp01((sp - P_PORT_A) / (P_PORT_B - P_PORT_A));
  const inner = f * n * SLIDE_H;
  ctx.fillStyle = '#050d08';
  ctx.fillRect(0, 0, W, H);
  ctx.save();
  const jit = RM ? 0 : Math.sin(t * 31) * 0.7 + (Math.random() < 0.04 ? (Math.random() - 0.5) * 6 : 0);
  ctx.translate(0, jit);
  const first = Math.floor(inner / SLIDE_H);
  for (let s = first; s <= first + 1; s++) {
    const yTop = s * SLIDE_H - inner + bh0;   // room for the status bar
    if (s === 0) drawIntroSlide(ctx, yTop, t, ar, compact);
    else if (s <= n) drawProjectSlide(ctx, yTop, s - 1, t, ar, compact);
  }
  ctx.restore();
  // status bar
  ctx.fillStyle = 'rgba(2,10,6,0.92)';
  ctx.fillRect(0, 0, W, bh0);
  ctx.fillStyle = 'rgba(88,255,138,0.14)';
  ctx.fillRect(0, bh0 - 2, W, 2);
  ctx.fillStyle = '#58ff8a';
  ctx.font = ar ? `700 ${compact ? 26 : 20}px ${AR_BODY}` : `600 ${compact ? 21 : 18}px ${MONO}`;
  const barBase = compact ? 36 : 27;
  ctx.textAlign = ar ? 'right' : 'left';
  ctx.fillText(
    ar ? (compact ? 'أَرْشِيفُ الأَعْمَالِ' : 'بنزرسيز — أَرْشِيفُ الأَعْمَالِ') : (compact ? 'PORTFOLIO.EXE' : 'BENZERSIZ OS — PORTFOLIO.EXE'),
    ar ? colR : colL, barBase
  );
  const active = Math.min(n, Math.max(0, Math.round(inner / SLIDE_H)));
  ctx.textAlign = ar ? 'left' : 'right';
  ctx.fillText(
    active === 0
      ? (ar ? `${arNum(n)} مِلَفًّا` : `${n} RECORDS`)
      : (ar ? `المِلَفُّ ${arNum(active)}/${arNum(n)}` : `REC ${String(active).padStart(2, '0')}/${n}`),
    ar ? colL : colR, barBase
  );
  ctx.textAlign = 'left';
  // right-edge progress rail (inside the visible column)
  const railX = PC.ox + PC.cw - 10;
  ctx.fillStyle = 'rgba(88,255,138,0.15)';
  ctx.fillRect(railX, bh0 + 8, compact ? 6 : 4, H - bh0 - 104);
  ctx.fillStyle = '#58ff8a';
  ctx.fillRect(railX, bh0 + 8 + f * (H - bh0 - 104 - 56), compact ? 6 : 4, 56);
  // the desktop-style SKIP button, pinned to the tube's corner
  const sk = portSkipRect(ar, compact);
  ctx.fillStyle = 'rgba(2,10,6,0.88)';
  ctx.fillRect(sk.x, sk.y, sk.w, sk.h);
  ctx.strokeStyle = Math.floor(t * 2) % 2 === 0 ? 'rgba(255,215,94,0.9)' : 'rgba(255,215,94,0.45)';
  ctx.lineWidth = 2;
  ctx.strokeRect(sk.x, sk.y, sk.w, sk.h);
  ctx.fillStyle = '#ffd75e';
  ctx.font = ar ? `700 ${compact ? 34 : 24}px ${AR_BODY}` : `600 ${compact ? 28 : 17}px ${MONO}`;
  ctx.textAlign = 'center';
  ctx.fillText(i18n.t('work.skip'), sk.x + sk.w / 2, sk.y + sk.h / 2 + (ar ? (compact ? 13 : 9) : (compact ? 10 : 6)));
  ctx.textAlign = 'left';
  // ---- the tube's suffering: band, scanlines, noise, tears, vignette, flicker ----
  const yb = (t * 130) % (H + 160) - 80;
  const grad = ctx.createLinearGradient(0, yb, 0, yb + 84);
  grad.addColorStop(0, 'rgba(255,255,255,0)');
  grad.addColorStop(0.5, 'rgba(180,255,210,0.05)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, yb, W, 84);
  ctx.fillStyle = 'rgba(0,0,0,0.24)';
  for (let sy = 0; sy < H; sy += 3) ctx.fillRect(0, sy, W, 1);
  for (let i = 0; i < 130; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(140,255,170,0.05)' : 'rgba(0,0,0,0.09)';
    ctx.fillRect(Math.random() * W, Math.random() * H, 2, 2);
  }
  if (!RM && Math.random() < 0.07) {
    const ty2 = Math.random() * H, th = 4 + Math.random() * 16;
    ctx.drawImage(ctx.canvas, 0, ty2, W, th, (Math.random() - 0.5) * 26, ty2, W, th);
  }
  const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.4, W / 2, H / 2, H * 0.8);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);
  if (!RM) {
    ctx.fillStyle = `rgba(0,0,0,${(0.045 + 0.035 * Math.sin(t * 9.7)).toFixed(3)})`;
    ctx.fillRect(0, 0, W, H);
  }
  // transition corruption — the full analog-tearing engine, ON THE GLASS ONLY
  drawGlitch(ctx, W, H, glitch, t);
  termTex.needsUpdate = true;
  // slide-change clunk + hotspot sync
  if (active !== lastSlide) { lastSlide = active; if (sp > P_PORT_A) sound.flip(); }
  updateScreenLive(active, inner, ar, sp, compact);
}

/* project in-canvas button rects onto the page so real <a> elements sit on them */
const v3a = new THREE.Vector3(), v3b = new THREE.Vector3();
function placeAnchor(el, bx, by, bw, bh) {
  const toWorld = (cx, cy, out) => {
    out.set((cx / SCR_W - 0.5) * 1.86, (0.5 - cy / SCR_H) * 1.34, 0.04);
    screenMesh.localToWorld(out);
    out.project(camera);
  };
  toWorld(bx, by, v3a);
  toWorld(bx + bw, by + bh, v3b);
  const x1 = (v3a.x * 0.5 + 0.5) * window.innerWidth, y1 = (-v3a.y * 0.5 + 0.5) * window.innerHeight;
  const x2 = (v3b.x * 0.5 + 0.5) * window.innerWidth, y2 = (-v3b.y * 0.5 + 0.5) * window.innerHeight;
  el.style.display = 'block';
  el.style.left = `${(Math.min(x1, x2) - 8).toFixed(0)}px`;      // padded hit area
  el.style.top = `${(Math.min(y1, y2) - 8).toFixed(0)}px`;
  el.style.width = `${(Math.abs(x2 - x1) + 16).toFixed(0)}px`;
  el.style.height = `${(Math.abs(y2 - y1) + 16).toFixed(0)}px`;
}

function updateScreenLive(active, inner, ar, sp, compact) {
  if (!screenMesh) return;
  // SKIP is available through the whole portfolio
  if (screenSkip) {
    if (sp > P_PORT_A - 0.015 && sp < P_PORT_B - 0.004) {
      const sk = portSkipRect(ar, compact);
      placeAnchor(screenSkip, sk.x, sk.y, sk.w, sk.h);
    } else screenSkip.style.display = 'none';
  }
  if (!screenLive) return;
  // track the drawn button whenever it is actually visible on the glass
  const slideTop = barH(compact) + (active * SLIDE_H - inner);
  const { bx, by, bw, bh } = portBtnRect(slideTop, ar, compact);
  const visible = active >= 1
    && by > barH(compact) - 12 && by + bh < SCR_H - 4
    && sp >= P_PORT_A - 0.005 && sp <= P_PORT_B + 0.01;
  if (!visible) {
    screenLive.style.display = 'none';
    return;
  }
  screenLive.href = PROJECTS[active - 1].url;
  placeAnchor(screenLive, bx, by, bw, bh);
}

/* ------------------------------------------------------------
   THE PHONE IS REAL — spin the rotary dial (or just tap it)
   to START YOUR PROJECT: it dials our number theatrically,
   then hands the client over to WhatsApp.
   ------------------------------------------------------------ */
const dialHot = document.getElementById('dial-hot');
const PHONE_NUM = '+90 534 338 84 48';
const WA_LINK = 'https://wa.me/905343388448?text=' + encodeURIComponent('Hello BENZERSIZ — I want to start a project.');
const dialSeq = { mode: 'hint', shown: '', holdKicksUntil: 0 };
const dialDrag = { active: false, lastA: 0, total: 0, lastTick: 0, moved: false };
let dialSuppressClick = false, dialTimers = [];

const wrapPI = (d) => ((d + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
const dialAngleOf = (e) => Math.atan2(e.clientY - dialHotC.y, e.clientX - dialHotC.x);

function drawDialReadout(t) {
  if (!dialReadCtx) return;
  const c = dialReadCtx, W = 768, H = 120;
  c.clearRect(0, 0, W, H);
  c.fillStyle = 'rgba(4,12,7,0.88)';
  c.fillRect(6, 8, W - 12, H - 16);
  c.strokeStyle = 'rgba(88,255,138,0.5)';
  c.lineWidth = 3;
  c.strokeRect(6, 8, W - 12, H - 16);
  let text, blink = false;
  if (dialSeq.mode === 'typing') text = dialSeq.shown + (Math.floor(t * 3) % 2 ? '▮' : ' ');
  else if (dialSeq.mode === 'connect') { text = i18n.t('dial.connecting'); blink = true; }
  else { text = i18n.t('dial.hint'); blink = true; }
  c.fillStyle = blink && Math.floor(t * 1.4) % 2 ? 'rgba(88,255,138,0.45)' : '#58ff8a';
  const isArText = /[؀-ۿ]/.test(text);
  fitFont(c, text, W - 60, isArText ? 42 : 34, isArText ? 700 : 600, isArText ? AR_BODY : MONO, 18);
  c.textAlign = 'center';
  c.fillText(text, W / 2, H / 2 + (isArText ? 16 : 12));
  c.textAlign = 'left';
  dialReadTex.needsUpdate = true;
}

function startDialSequence() {
  dialTimers.forEach(clearTimeout);
  dialTimers = [];
  dialSeq.mode = 'typing';
  dialSeq.shown = '';
  let i = 0;
  const step = () => {
    dialSeq.shown = PHONE_NUM.slice(0, ++i);
    if (PHONE_NUM[i - 1] !== ' ') sound.key();
    if (i < PHONE_NUM.length) dialTimers.push(setTimeout(step, 110));
    else {
      dialTimers.push(setTimeout(() => {
        dialSeq.mode = 'connect';
        sound.chime();
        dialTimers.push(setTimeout(() => {
          openWa(WA_LINK);   // always a new tab — the visitor keeps their place
        }, 900));
        dialTimers.push(setTimeout(() => { dialSeq.mode = 'hint'; }, 3200));
      }, 500));
    }
  };
  step();
}

if (dialHot) {
  dialHot.addEventListener('pointerdown', (e) => {
    if (dialHot.style.display === 'none') return;
    dialDrag.active = true;
    dialDrag.moved = false;
    dialDrag.total = 0;
    dialDrag.lastTick = 0;
    dialDrag.lastA = dialAngleOf(e);
    dialSeq.holdKicksUntil = performance.now() + 9000;
    try { dialHot.setPointerCapture(e.pointerId); } catch {}
    if (lenis) lenis.stop();
    sound.unlock();
    e.preventDefault();
  });
  window.addEventListener('pointermove', (e) => {
    if (!dialDrag.active) return;
    const a = dialAngleOf(e);
    dialDrag.total = Math.min(5.8, Math.max(0, dialDrag.total + wrapPI(a - dialDrag.lastA)));
    dialDrag.lastA = a;
    dialDisc.rotation.z = -dialDrag.total;
    dialTarget = -dialDrag.total;
    if (dialDrag.total > 0.12) dialDrag.moved = true;
    if (dialDrag.total - dialDrag.lastTick > 0.42) { dialDrag.lastTick = dialDrag.total; sound.flip(); }
    e.preventDefault();
  }, { passive: false });
  window.addEventListener('pointerup', () => {
    if (!dialDrag.active) return;
    dialDrag.active = false;
    if (lenis) lenis.start();
    dialTarget = 0;                                    // spring home, clicking all the way
    dialSeq.holdKicksUntil = performance.now() + 9000;
    if (dialDrag.moved && dialDrag.total > 0.35) {
      dialSuppressClick = true;
      startDialSequence();
    }
  });
  dialHot.addEventListener('click', (e) => {
    if (dialSuppressClick) { dialSuppressClick = false; e.preventDefault(); return; }
    sound.flip();                                      // plain tap → the tel: link opens the dialer
  });
}

const v3c = new THREE.Vector3(), v3d = new THREE.Vector3();
function placeDialHot() {
  const dwx = groups.contact.position.x + CONTACT_X + 2.55;
  const dwy = groups.contact.position.y - 0.05;
  v3c.set(dwx - 1.16, dwy + 1.16, 0.12).project(camera);
  v3d.set(dwx + 1.16, dwy - 1.16, 0.12).project(camera);
  const x1 = (v3c.x * 0.5 + 0.5) * window.innerWidth, y1 = (-v3c.y * 0.5 + 0.5) * window.innerHeight;
  const x2 = (v3d.x * 0.5 + 0.5) * window.innerWidth, y2 = (-v3d.y * 0.5 + 0.5) * window.innerHeight;
  dialHot.style.display = 'block';
  dialHot.style.left = `${Math.min(x1, x2).toFixed(0)}px`;
  dialHot.style.top = `${Math.min(y1, y2).toFixed(0)}px`;
  dialHot.style.width = `${Math.abs(x2 - x1).toFixed(0)}px`;
  dialHot.style.height = `${Math.abs(y2 - y1).toFixed(0)}px`;
  dialHotC.x = Math.min(x1, x2) + Math.abs(x2 - x1) / 2;
  dialHotC.y = Math.min(y1, y2) + Math.abs(y2 - y1) / 2;
}

/* the document being shredded: a printout of YOUR OLD WEBSITE, c. 1998 —
   fully readable, so the joke lands before the blades do */
function drawOldWebsite(ctx) {
  const W = 768, H = 1024;
  // printout paper edge
  ctx.fillStyle = '#f2efe6';
  ctx.fillRect(0, 0, W, H);
  // browser chrome
  ctx.fillStyle = '#001f7a';
  ctx.fillRect(18, 18, W - 36, 46);
  ctx.fillStyle = '#ffffff';
  ctx.font = `700 24px ${MONO}`;
  ctx.fillText('Your Old Website — Web Explorer 4.0', 34, 49);
  ctx.fillStyle = '#c9c4b8';
  ctx.fillRect(18, 64, W - 36, 36);
  ctx.fillStyle = '#3a382f';
  ctx.font = `500 19px ${MONO}`;
  ctx.fillText('File   Edit   View   Favorites   Help', 34, 89);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(18, 100, W - 36, 38);
  ctx.strokeStyle = '#8a867a'; ctx.lineWidth = 2; ctx.strokeRect(18, 100, W - 36, 38);
  ctx.fillStyle = '#20242c';
  ctx.font = `500 20px ${MONO}`;
  ctx.fillText('http://www.your-old-website.com/index.htm', 34, 126);
  // page body — web-safe grey
  ctx.fillStyle = '#c0c0c0';
  ctx.fillRect(18, 138, W - 36, H - 156);
  // headline banner
  ctx.fillStyle = '#ffff99';
  ctx.fillRect(60, 172, W - 120, 74);
  ctx.strokeStyle = '#6b675c'; ctx.strokeRect(60, 172, W - 120, 74);
  ctx.fillStyle = '#7a0e0e';
  ctx.textAlign = 'center';
  ctx.font = `700 34px ${SERIF}`;
  ctx.fillText('WELCOME TO OUR HOMEPAGE !!!', W / 2, 219);
  // nav links, blue + underlined
  ctx.font = `500 23px ${SERIF}`;
  ctx.fillStyle = '#0000cc';
  const nav = 'Home  |  About Us  |  Guestbook  |  Links';
  ctx.fillText(nav, W / 2, 288);
  const nw = ctx.measureText(nav).width;
  ctx.fillRect(W / 2 - nw / 2, 296, nw, 2);
  // body copy — readable Times
  ctx.fillStyle = '#20242c';
  ctx.font = `500 26px ${SERIF}`;
  ctx.fillText('This site is under construction.', W / 2, 356);
  ctx.font = `italic 500 23px ${SERIF}`;
  ctx.fillText('Established 1997. Last updated: 4 years ago.', W / 2, 396);
  // NEW! blinker
  ctx.fillStyle = '#cc0000';
  ctx.font = `700 22px ${SERIF}`;
  ctx.fillText('*** NEW ! ***  nothing is new.', W / 2, 444);
  // content table
  ctx.strokeStyle = '#6b675c'; ctx.lineWidth = 2;
  ctx.strokeRect(80, 480, W - 160, 190);
  ctx.beginPath(); ctx.moveTo(W / 2, 480); ctx.lineTo(W / 2, 670); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(80, 575); ctx.lineTo(W - 80, 575); ctx.stroke();
  ctx.fillStyle = '#20242c';
  ctx.font = `500 21px ${SERIF}`;
  ctx.fillText('Our Services', W / 4 + 40, 532);
  ctx.fillText('(coming soon)', W / 4 + 40, 560);
  ctx.fillText('Our Prices', (3 * W) / 4 - 40, 532);
  ctx.fillText('(call us)', (3 * W) / 4 - 40, 560);
  ctx.fillText('Photo Gallery', W / 4 + 40, 625);
  ctx.fillText('(broken)', W / 4 + 40, 653);
  ctx.fillText('Guestbook', (3 * W) / 4 - 40, 625);
  ctx.fillText('(2 entries)', (3 * W) / 4 - 40, 653);
  // hit counter
  ctx.fillStyle = '#000000';
  ctx.fillRect(W / 2 - 120, 706, 240, 44);
  ctx.fillStyle = '#33ff66';
  ctx.font = `700 26px ${MONO}`;
  ctx.fillText('Visitor No. 000042', W / 2, 736);
  // footer lines
  ctx.fillStyle = '#3a382f';
  ctx.font = `500 20px ${SERIF}`;
  ctx.fillText('Best viewed in 800 × 600 with lots of patience.', W / 2, 800);
  ctx.fillText('© 1998 — All rights reserved (both of them).', W / 2, 834);
  ctx.textAlign = 'left';
  // OBSOLETE stamp
  ctx.save();
  ctx.translate(W / 2, 920);
  ctx.rotate(-0.18);
  ctx.strokeStyle = 'rgba(200,52,31,0.85)';
  ctx.lineWidth = 7;
  ctx.strokeRect(-190, -50, 380, 100);
  ctx.fillStyle = 'rgba(200,52,31,0.85)';
  ctx.font = `700 62px ${SERIF}`;
  ctx.textAlign = 'center';
  ctx.fillText('OBSOLETE', 0, 22);
  ctx.restore();
  degrade(ctx, W, H, 0.25);
}

function drawMemo(ctx) {
  const W = 512, H = 1024;
  ctx.fillStyle = '#efe9da';
  ctx.fillRect(0, 0, W, H);
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, 'rgba(255,253,246,0.25)');
  g.addColorStop(1, 'rgba(90,110,140,0.12)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#1d232b';
  ctx.textAlign = 'center';
  ctx.font = `400 38px ${DISPLAY}`;
  ctx.fillText('INTERNAL MEMO', W / 2, 82);
  ctx.font = `500 15px ${MONO}`;
  ctx.fillStyle = '#4a6084';
  ctx.fillText('FORM 11-C — CIRCULATE, THEN SHRED', W / 2, 118);
  ctx.textAlign = 'left';
  ctx.font = `500 17px ${MONO}`;
  ctx.fillStyle = '#1d232b';
  ctx.fillText('TO:   ALL STAFF', 56, 175);
  ctx.fillText('FROM: THE BOARD', 56, 205);
  ctx.fillText('RE:   SYNERGY (URGENT)', 56, 235);
  ctx.fillStyle = 'rgba(74,96,132,0.5)';
  ctx.fillRect(56, 258, 400, 2);
  for (let i = 0; i < 22; i++) {
    const y = 296 + i * 24;
    if (y > 800) break;
    ctx.fillStyle = 'rgba(29,35,43,0.45)';
    ctx.fillRect(56, y, 130 + ((i * 137) % 260), 4);
  }
  // approval boxes
  ctx.strokeStyle = '#4a6084';
  ctx.lineWidth = 2;
  ctx.font = `500 14px ${MONO}`;
  ctx.fillStyle = '#4a6084';
  ['APPROVED', 'APPROVED HARDER', 'FILED'].forEach((s, i) => {
    const y = 840 + i * 52;
    ctx.strokeRect(56, y - 22, 26, 26);
    if (i < 2) { ctx.fillText('✕', 63, y - 3); }
    ctx.fillText(s, 100, y - 4);
  });
  // urgent stamp
  ctx.save();
  ctx.translate(370, 900);
  ctx.rotate(-0.2);
  ctx.strokeStyle = 'rgba(200,52,31,0.8)';
  ctx.lineWidth = 5;
  ctx.strokeRect(-100, -34, 200, 68);
  ctx.fillStyle = 'rgba(200,52,31,0.8)';
  ctx.font = `700 38px ${SERIF}`;
  ctx.textAlign = 'center';
  ctx.fillText('URGENT', 0, 13);
  ctx.restore();
  degrade(ctx, W, H, 0.5);
}

function drawFloppyLabel(ctx) {
  const W = 512, H = 352;
  ctx.fillStyle = '#f3ead8';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#d9a441';
  ctx.fillRect(0, 0, W, 74);
  ctx.fillStyle = '#241c10';
  ctx.font = `400 24px ${DISPLAY}`;
  ctx.textAlign = 'center';
  ctx.fillText('BENZERSIZ® GOLDEN MASTER', W / 2, 47);
  ctx.font = `500 19px ${MONO}`;
  ctx.fillStyle = '#4a3c26';
  ctx.fillText('1.44 MB — DOUBLE SIDED / HIGH COMMITMENT', W / 2, 116);
  ctx.font = `italic 600 30px ${SERIF}`;
  ctx.fillStyle = '#241c10';
  ctx.fillText('do not bend. do not fold.', W / 2, 182);
  ctx.fillText('do not doubt.', W / 2, 222);
  // barcode
  ctx.textAlign = 'left';
  let bx = 120;
  ctx.fillStyle = '#241c10';
  while (bx < 390) {
    const bw = 2 + Math.random() * 5;
    ctx.fillRect(bx, 264, bw, 46);
    bx += bw + 2 + Math.random() * 4;
  }
  degrade(ctx, W, H, 0.4);
}

function drawDial(ctx) {
  const W = 512, C = 256;
  ctx.clearRect(0, 0, W, W);
  ctx.fillStyle = '#171310';
  ctx.beginPath(); ctx.arc(C, C, 250, 0, Math.PI * 2); ctx.fill();
  // finger holes + digits (rotary layout)
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  digits.forEach((d, i) => {
    const a = (-52 - i * 26) * (Math.PI / 180);
    const hx = C + Math.cos(a) * 172, hy = C - Math.sin(a) * 172;
    ctx.fillStyle = '#0b0d0f';
    ctx.beginPath(); ctx.arc(hx, hy, 30, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(108,155,210,0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(hx, hy, 30, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#f7f0e3';
    ctx.font = `600 30px ${MONO}`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(String(d), hx, hy + 2);
  });
  // recessed center (the fixed cap is a separate mesh)
  ctx.fillStyle = '#0b0906';
  ctx.beginPath(); ctx.arc(C, C, 92, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(217,164,65,0.4)';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(C, C, 92, 0, Math.PI * 2); ctx.stroke();
}

function drawDialCap(ctx) {
  const C = 128;
  ctx.clearRect(0, 0, 256, 256);
  ctx.fillStyle = '#6c9bd2';
  ctx.beginPath(); ctx.arc(C, C, 124, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#10161d';
  ctx.font = `400 21px ${DISPLAY}`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('BENZERSIZ', C, C - 16);
  ctx.font = `500 16px ${MONO}`;
  ctx.fillText('1-800-SYNERGY', C, C + 26);
  ctx.textBaseline = 'alphabetic';
}

function drawCertificate(ctx) {
  const W = 512, H = 384;
  ctx.fillStyle = '#f2eddd';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#4a76ab'; ctx.lineWidth = 4; ctx.strokeRect(14, 14, W - 28, H - 28);
  ctx.lineWidth = 1.5; ctx.strokeRect(24, 24, W - 48, H - 48);
  ctx.fillStyle = '#1d232b';
  ctx.textAlign = 'center';
  ctx.font = `400 25px ${DISPLAY}`;
  ctx.fillText('CERTIFICATE OF SERIOUSNESS', W / 2, 82);
  ctx.font = `italic 500 19px ${SERIF}`;
  ctx.fillStyle = '#4a5a6e';
  ctx.fillText('hereby awarded to', W / 2, 128);
  ctx.font = `400 30px ${DISPLAY}`;
  ctx.fillStyle = '#1d232b';
  ctx.fillText('THE MANAGEMENT', W / 2, 176);
  ctx.font = `italic 500 18px ${SERIF}`;
  ctx.fillStyle = '#4a5a6e';
  ctx.fillText('for building websites unbecoming', W / 2, 220);
  ctx.fillText('of a boring company', W / 2, 246);
  ctx.font = `500 13px ${MONO}`;
  ctx.fillText('VALID: UNTIL FURTHER NOTICE', W / 2, 292);
  // seal
  ctx.strokeStyle = '#4a76ab'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(96, 316, 34, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(96, 316, 26, 0, Math.PI * 2); ctx.stroke();
  ctx.font = `700 15px ${SERIF}`;
  ctx.fillStyle = '#4a76ab';
  ctx.fillText('BZ', 96, 322);
  // signature
  ctx.strokeStyle = '#1d232b'; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(330, 330);
  ctx.bezierCurveTo(350, 300, 380, 345, 405, 312);
  ctx.bezierCurveTo(420, 295, 435, 330, 452, 318);
  ctx.stroke();
  ctx.textAlign = 'center';
  degrade(ctx, W, H, 0.3);
}

function drawBusinessCard(ctx) {
  const W = 640, H = 384;
  ctx.fillStyle = '#f3ead8';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#3a2f1e';
  ctx.lineWidth = 2;
  ctx.strokeRect(14, 14, W - 28, H - 28);
  ctx.strokeRect(20, 20, W - 40, H - 40);
  ctx.fillStyle = '#241c10';
  ctx.font = `400 38px ${DISPLAY}`;
  ctx.fillText('BENZERSIZ®', 44, 90);
  ctx.font = `italic 500 22px ${SERIF}`;
  ctx.fillStyle = '#6b5637';
  ctx.fillText('A Serious Business Technology Company™', 44, 134);
  ctx.fillStyle = 'rgba(107,86,55,0.55)';
  ctx.fillRect(44, 158, W - 88, 2);
  ctx.font = `500 20px ${MONO}`;
  ctx.fillStyle = '#241c10';
  ctx.fillText('T: 1-800-SYNERGY · F: YES', 44, 208);
  ctx.fillText('E: hello@benzersizz.com', 44, 244);
  ctx.fillText('ISTANBUL · DUBAI · DAMASCUS', 44, 280);
  ctx.save();
  ctx.translate(500, 290);
  ctx.rotate(-0.14);
  ctx.strokeStyle = 'rgba(200,52,31,0.8)';
  ctx.lineWidth = 4;
  ctx.strokeRect(-88, -30, 176, 60);
  ctx.fillStyle = 'rgba(200,52,31,0.8)';
  ctx.font = `700 32px ${SERIF}`;
  ctx.textAlign = 'center';
  ctx.fillText('APPROVED', 0, 11);
  ctx.restore();
  degrade(ctx, W, H, 0.5);
}

/* ============================================================
   THE APP DEPT. — a real, tappable demo phone.
   After the last record the timeline pauses (P_PIN plateau):
   the handset lifts off its charging pad, flips to face you,
   boots BENZERSIZ OS MOBILE and hands you a working launcher —
   a mini shop, a bank, a booking app, and one vacant icon that
   is very much for sale. Buttons are canvas-drawn; invisible
   DOM hotspots track them (same trick as the CRT).
   ============================================================ */
const PH_W = 512, PH_H = 1080, PH_R = 46;

const phoneState = {
  app: 'home', wakeAt: 0, awake: false,
  cart: 0, added: {}, checkoutAt: 0,
  balance: 1984000, lastNow: 0, wireAt: 0, wirePaid: false, wireChimed: false,
  booked: -1, notifOn: false, notifKind: 1, notifShownAt: 0, notifUsed1: false, notifUsed2: false,
  battery: 84, boltAt: 0,
  // the app builder — the client's own app, made before their eyes
  bizName: '', vibe: -1, genAt: 0, genDone: false, appBuilt: false, builtAt: 0, splashAt: 0,
  ordersStart: 0, orderSeq: 0, lastOrderAt: 0, orders: [], revenue: 0, revShown: 0,
  slideP: 0, slideDraw: 0, slideActive: false, ordered: false, orderedAt: 0,
  // feel: lock screen, screen transitions, tap feedback, coach mark, arcade
  lockState: 'locked', scanAt: 0, unlockAt: 0,
  trans: null, fx: [], flash: null, everTapped: false,
  game: null, gameBest: 0,
  // realistic apps: checkout sheet, food delivery, booking calendar
  pay: { open: false, method: 0, adding: false, num: '', payAt: 0, done: '' },
  eats: { counts: [0, 0, 0], phase: 'menu', orderAt: 0 },
  meet: { day: -1, slot: -1, sent: false },
  bizType: -1,
};

/* the phone speaks the "new" voice: bubbly, no edges */
const BUBBLE = '"Baloo 2", "Baloo Bhaijaan 2", "Arial Rounded MT Bold", sans-serif';
const MEET_SLOTS = ['10:00', '13:00', '16:00'];
const EATS_MENU = [
  { key: 'phone.eats.i1', price: 9 },
  { key: 'phone.eats.i2', price: 7 },
  { key: 'phone.eats.i3', price: 12 },
];
const TYPE_FEED = [
  ['phone.my.r1', 'phone.my.r2', 'phone.my.r3', 'phone.my.r4'],
  ['phone.my.s1', 'phone.my.s2', 'phone.my.s3', 'phone.my.s4'],
  ['phone.my.c1', 'phone.my.c2', 'phone.my.c3', 'phone.my.c4'],
  ['phone.my.o1', 'phone.my.o2', 'phone.my.o3', 'phone.my.o4'],
];

/* pointer position (−1..1) — tilts the handset and parallaxes the wallpaper */
const phPointer = { x: 0, y: 0 };
const phTilt = { x: 0, y: 0 };   // eased copy, applied per frame
window.addEventListener('pointermove', (e) => {
  phPointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  phPointer.y = (e.clientY / window.innerHeight) * 2 - 1;
}, { passive: true });

/* offscreen buffers for iOS-style screen-to-screen transitions */
let phBufA = null, phBufACtx = null, phBufB = null, phBufBCtx = null;
function ensurePhoneBufs() {
  if (phBufA) return;
  [phBufA, phBufACtx] = makeCanvas(512, 1080);
  [phBufB, phBufBCtx] = makeCanvas(512, 1080);
}

const PH_TRANS_MS = 360;
/* navigate between screens with a slide; dir 1 = forward, −1 = back */
function phoneGo(to, dir = 1) {
  const ph = phoneState;
  if (RM) { ph.app = to; ph.trans = null; return; }
  if (ph.trans) ph.app = ph.trans.to;          // settle any in-flight transition
  ph.trans = { from: ph.app, to, at: performance.now(), dir };
}

/* brand vibes the client picks from */
const VIBES = [
  { g0: '#2fbf71', g1: '#0e8f6f' },   // fresh
  { g0: '#4a79ab', g1: '#2b4d84' },   // corporate
  { g0: '#d9a441', g1: '#8a6420' },   // luxury
];
const vibeOf = () => VIBES[Math.max(0, phoneState.vibe)];
const bizInitial = () => (phoneState.bizName.trim()[0] || 'B').toUpperCase();

/* canvas rects that real DOM controls must sit on */
const PH_NAME_FIELD = { x: 48, y: 330, w: 416, h: 96 };
const PH_SLIDE_RECT = { x: 48, y: 880, w: 416, h: 84 };

function phoneWaLink() {
  const n = phoneState.bizName.trim();
  const msg = n
    ? `Hello BENZERSIZ — I want an app for "${n}".`
    : 'Hello BENZERSIZ — I want an app like this.';
  return 'https://wa.me/905343388448?text=' + encodeURIComponent(msg);
}

function roundedPath(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

/* dark glass, asleep */
function drawPhoneOff() {
  const c = phoneCtx;
  c.fillStyle = '#050607';
  c.fillRect(0, 0, PH_W, PH_H);
  const sheen = c.createLinearGradient(0, 0, PH_W, PH_H);
  sheen.addColorStop(0, 'rgba(255,255,255,0.045)');
  sheen.addColorStop(0.45, 'rgba(255,255,255,0)');
  sheen.addColorStop(1, 'rgba(140,180,220,0.03)');
  c.fillStyle = sheen;
  c.fillRect(0, 0, PH_W, PH_H);
  phoneTex.needsUpdate = true;
}

/* retro BIOS gag, then the launcher */
function drawPhoneBoot(c, bootT, ar) {
  c.fillStyle = '#03130a';
  c.fillRect(0, 0, PH_W, PH_H);
  const lines = [i18n.t('phone.boot1'), i18n.t('phone.boot2')];
  c.fillStyle = '#58ff8a';
  const chars = Math.floor(bootT * 64);
  let used = 0;
  c.textAlign = ar ? 'right' : 'left';
  const tx = ar ? PH_W - 40 : 40;
  c.font = ar ? `600 24px ${AR_BODY}` : `500 21px ${MONO}`;
  lines.forEach((l, i) => {
    if (used >= chars) return;
    const take = Math.min(l.length, chars - used);
    c.fillText(l.slice(0, take), tx, 140 + i * 44);
    used += l.length;
  });
  if (Math.floor(bootT * 8) % 2 === 0) c.fillRect(tx - (ar ? 0 : 0), 176 + 44, 12, 20);
  const lo = smooth(0.55, 1, bootT);
  if (lo > 0) {
    c.globalAlpha = lo;
    c.fillStyle = '#eafff0';
    c.textAlign = 'center';
    c.font = `400 40px ${BUBBLE}`;
    c.fillText('BENZERSIZ', PH_W / 2, PH_H / 2 + 10);
    c.font = ar ? `600 22px ${AR_BODY}` : `500 17px ${MONO}`;
    c.fillStyle = '#8fb5e3';
    c.fillText(i18n.t('phone.os'), PH_W / 2, PH_H / 2 + 52);
    c.globalAlpha = 1;
  }
  c.textAlign = 'left';
}

function phoneStatusBar(c, now, ar) {
  const ph = phoneState;
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, '0'), mm = String(d.getMinutes()).padStart(2, '0');
  c.fillStyle = '#dfe9f5';
  c.font = `700 24px ${MONO}`;
  c.textAlign = 'left';
  c.fillText(`${hh}:${mm}`, 34, 46);
  c.textAlign = 'right';
  c.font = ar ? `700 19px ${AR_BODY}` : `600 17px ${MONO}`;
  c.fillStyle = '#8fb5e3';
  c.fillText(i18n.t('phone.carrier'), 384, 44);
  // battery
  const bw = 58, bx = 402, by = 24, bh = 26;
  roundedPath(c, bx, by, bw, bh, 7);
  c.strokeStyle = 'rgba(223,233,245,0.6)'; c.lineWidth = 2.5; c.stroke();
  c.fillStyle = '#2b3442'; c.fillRect(bx + 62, by + 7, 5, 12);
  c.fillStyle = ph.battery > 20 ? '#58ff8a' : '#ff6b5e';
  const fw = (bw - 8) * ph.battery / 100;
  roundedPath(c, bx + 4, by + 4, Math.max(6, fw), bh - 8, 4); c.fill();
  if (now - ph.boltAt < 1100) {
    c.fillStyle = '#0b0f14';
    c.font = `700 17px ${MONO}`;
    c.textAlign = 'center';
    c.fillText('⚡', bx + bw / 2, by + 19);
  }
  c.textAlign = 'left';
}

/* home-screen icon painters — flat vector glyphs, no emoji */
function phoneIconTile(c, cx, cy, g0, g1) {
  const s = 118;
  const grad = c.createLinearGradient(cx - s / 2, cy - s / 2, cx + s / 2, cy + s / 2);
  grad.addColorStop(0, g0); grad.addColorStop(1, g1);
  roundedPath(c, cx - s / 2, cy - s / 2, s, s, 30);
  c.fillStyle = grad; c.fill();
}
function phoneIcons(c, ar, now) {
  const ph = phoneState;
  const spots = [
    { act: 'shop', cx: 168, cy: 330, key: 'phone.app.shop' },
    { act: 'bank', cx: 344, cy: 330, key: 'phone.app.bank' },
    { act: 'book', cx: 168, cy: 545, key: 'phone.app.book' },
    { act: 'yours', cx: 344, cy: 545, key: 'phone.app.yours' },
  ];
  for (const s of spots) {
    if (s.act === 'shop') {
      phoneIconTile(c, s.cx, s.cy, '#2fbf71', '#0e8f6f');
      c.strokeStyle = '#eafff0'; c.lineWidth = 6; c.lineJoin = 'round';
      c.strokeRect(s.cx - 26, s.cy - 10, 52, 34);
      c.beginPath(); c.arc(s.cx, s.cy - 14, 16, Math.PI, 0); c.stroke();
      if (ph.cart > 0) {
        c.fillStyle = '#ff5e4d'; c.beginPath(); c.arc(s.cx + 46, s.cy - 46, 18, 0, Math.PI * 2); c.fill();
        c.fillStyle = '#fff'; c.font = `700 20px ${MONO}`; c.textAlign = 'center';
        c.fillText(String(ph.cart), s.cx + 46, s.cy - 39);
      }
    } else if (s.act === 'bank') {
      phoneIconTile(c, s.cx, s.cy, '#e0663c', '#a93b1e');
      c.save(); c.translate(s.cx, s.cy); c.scale(0.72, 0.72); c.translate(-s.cx, -s.cy);
      eatsGlyph(c, 0, s.cx, s.cy);
      c.restore();
    } else if (s.act === 'book') {
      phoneIconTile(c, s.cx, s.cy, '#d9a441', '#a9722a');
      c.fillStyle = '#fff7e8';
      roundedPath(c, s.cx - 28, s.cy - 22, 56, 48, 8); c.fill();
      c.fillStyle = '#a9722a'; c.fillRect(s.cx - 28, s.cy - 22, 56, 14);
      c.fillStyle = '#a9722a';
      for (let r = 0; r < 2; r++) for (let q = 0; q < 3; q++)
        c.fillRect(s.cx - 20 + q * 17, s.cy + 2 + r * 13, 9, 8);
    } else if (ph.appBuilt) {
      // the client's own app now lives in the once-vacant slot
      const v = vibeOf();
      const g = c.createLinearGradient(s.cx - 59, s.cy - 59, s.cx + 59, s.cy + 59);
      g.addColorStop(0, v.g0); g.addColorStop(1, v.g1);
      roundedPath(c, s.cx - 59, s.cy - 59, 118, 118, 30);
      c.fillStyle = g; c.fill();
      c.fillStyle = '#ffffff';
      c.font = `400 58px ${BUBBLE}`; c.textAlign = 'center';
      c.fillText(bizInitial(), s.cx, s.cy + 20);
      // a "1" badge — their first customer is already waiting
      if (!ph.ordered) {
        c.fillStyle = '#ff5e4d'; c.beginPath(); c.arc(s.cx + 46, s.cy - 46, 18, 0, Math.PI * 2); c.fill();
        c.fillStyle = '#fff'; c.font = `700 20px ${MONO}`;
        c.fillText('1', s.cx + 46, s.cy - 39);
      }
    } else {
      // the vacant slot — dashed, waiting for the client's logo
      c.save();
      c.setLineDash([10, 8]);
      c.strokeStyle = 'rgba(246,241,230,0.65)'; c.lineWidth = 4;
      roundedPath(c, s.cx - 59, s.cy - 59, 118, 118, 30); c.stroke();
      c.restore();
      const pulse = 0.55 + 0.35 * Math.sin(now / 400);
      c.fillStyle = `rgba(255,215,94,${pulse.toFixed(2)})`;
      c.font = `400 54px ${BUBBLE}`; c.textAlign = 'center';
      c.fillText('+', s.cx, s.cy + 18);
    }
    c.fillStyle = '#dfe9f5';
    const lbl = s.act === 'yours' && ph.appBuilt ? ph.bizName.trim() : i18n.t(s.key);
    fitFont(c, lbl, 150, ar ? 22 : 19, ar ? 700 : 600, ar ? AR_BODY : MONO, 12);
    c.textAlign = 'center';
    c.fillText(lbl, s.cx, s.cy + 96);
  }
  c.textAlign = 'left';
  return spots.map((s) => ({
    x: s.cx - 70, y: s.cy - 70, w: 140, h: 176, act: s.act,
    label: s.act === 'yours' && ph.appBuilt ? ph.bizName.trim() : i18n.t(s.key),
  }));
}

function phoneAppHeader(c, titleKey, ar) {
  const title = i18n.t(titleKey);
  c.fillStyle = 'rgba(255,255,255,0.06)';
  const bx = ar ? PH_W - 92 : 32;
  roundedPath(c, bx, 78, 60, 60, 30); c.fill();
  c.strokeStyle = '#8fb5e3'; c.lineWidth = 5; c.lineJoin = 'round'; c.lineCap = 'round';
  c.beginPath();
  if (ar) { c.moveTo(bx + 26, 94); c.lineTo(bx + 40, 108); c.lineTo(bx + 26, 122); }
  else { c.moveTo(bx + 36, 94); c.lineTo(bx + 22, 108); c.lineTo(bx + 36, 122); }
  c.stroke();
  c.fillStyle = '#eafff0';
  c.font = ar ? `800 34px ${AR_DISPLAY}` : `400 30px ${BUBBLE}`;
  c.textAlign = 'center';
  c.fillText(title, PH_W / 2, 120);
  c.textAlign = 'left';
  return { x: bx - 8, y: 70, w: 76, h: 76, act: 'back', label: 'Back' };
}

function phoneShop(c, now, ar) {
  const ph = phoneState;
  const hots = [phoneAppHeader(c, 'phone.shop.title', ar)];
  if (ph.checkoutAt) {
    // order confirmed — confetti in triplicate
    const age = now - ph.checkoutAt;
    const s = smooth(0, 1, clamp01(age / 480));
    for (let i = 0; i < 34; i++) {
      const fy = ((age * (0.14 + (i % 5) * 0.05)) + i * 173) % (PH_H + 60) - 30;
      const fx = (i * 149.3) % (PH_W - 40) + 20;
      c.fillStyle = ['#58ff8a', '#ffd75e', '#8fb5e3', '#ff8f6b'][i % 4];
      c.save(); c.translate(fx, fy); c.rotate(i + age / 300); c.fillRect(-7, -4, 14, 8); c.restore();
    }
    c.beginPath(); c.arc(PH_W / 2, 420, 86 * s, 0, Math.PI * 2);
    c.fillStyle = '#2fbf71'; c.fill();
    c.strokeStyle = '#eafff0'; c.lineWidth = 12; c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(PH_W / 2 - 34 * s, 420); c.lineTo(PH_W / 2 - 8 * s, 452 * 1); c.lineTo(PH_W / 2 + 40 * s, 388);
    c.stroke();
    c.fillStyle = '#eafff0'; c.textAlign = 'center';
    c.font = ar ? `800 34px ${AR_DISPLAY}` : `400 28px ${BUBBLE}`;
    c.fillText(i18n.t('phone.shop.done1'), PH_W / 2, 590);
    c.font = ar ? `600 26px ${AR_BODY}` : `700 26px ${BUBBLE}`;
    c.fillStyle = 'rgba(234,255,240,0.75)';
    c.fillText(i18n.t('phone.shop.done2'), PH_W / 2, 640);
    if (ph.pay.done) {
      c.fillStyle = '#8fb5e3';
      c.font = ar ? `600 20px ${AR_BODY}` : `600 17px ${MONO}`;
      c.fillText(`${i18n.t('phone.pay.paidwith')} ${ph.pay.done}`, PH_W / 2, 690);
    }
    roundedPath(c, 146, 760, 220, 74, 37);
    c.fillStyle = 'rgba(88,255,138,0.16)'; c.fill();
    c.strokeStyle = '#58ff8a'; c.lineWidth = 3; c.stroke();
    c.fillStyle = '#baffd0';
    c.font = ar ? `700 26px ${AR_BODY}` : `600 22px ${MONO}`;
    c.fillText(i18n.t('phone.shop.back'), PH_W / 2, 806);
    c.textAlign = 'left';
    hots.length = 0;
    hots.push({ x: 146, y: 748, w: 220, h: 98, act: 'back', label: i18n.t('phone.shop.back') });
    return hots;
  }
  const items = [
    { key: 'phone.shop.item1', badge: 'phone.shop.badge1', price: '$1,499', y: 180, draw: (cx, cy) => {
      roundedPath(c, cx - 44, cy - 44, 88, 88, 10); c.fillStyle = '#d4a017'; c.fill();
      c.fillStyle = '#c9c9c9'; c.fillRect(cx - 20, cy - 40, 40, 30);
      c.fillStyle = '#17130e'; c.fillRect(cx - 6, cy - 36, 12, 22);
      c.fillStyle = '#f3ead8'; c.fillRect(cx - 32, cy + 4, 64, 34);
    } },
    { key: 'phone.shop.item2', badge: 'phone.shop.badge2', price: '$89', y: 470, draw: (cx, cy) => {
      roundedPath(c, cx - 46, cy - 20, 92, 58, 10); c.fillStyle = '#d6c9ae'; c.fill();
      c.fillStyle = '#17130e'; c.fillRect(cx - 32, cy - 12, 64, 7);
      roundedPath(c, cx - 46, cy - 40, 30, 16, 6); c.fillStyle = '#17130e'; c.fill();
    } },
  ];
  items.forEach((it, i) => {
    const added = !!ph.added[i];
    roundedPath(c, 32, it.y, PH_W - 64, 250, 24);
    c.fillStyle = 'rgba(255,255,255,0.055)'; c.fill();
    c.strokeStyle = added ? '#58ff8a' : 'rgba(143,181,227,0.35)';
    c.lineWidth = added ? 4 : 2; c.stroke();
    const px = ar ? PH_W - 110 : 110;
    it.draw(px, it.y + 100);
    const tx = ar ? PH_W - 196 : 196;
    c.textAlign = ar ? 'right' : 'left';
    c.fillStyle = '#eafff0';
    c.font = ar ? `800 30px ${AR_DISPLAY}` : `400 27px ${BUBBLE}`;
    c.fillText(i18n.t(it.key), tx, it.y + 78);
    c.fillStyle = '#ffd75e';
    c.font = `700 15px ${MONO}`;
    c.fillText(i18n.t(it.badge), tx, it.y + 110);
    c.fillStyle = '#58ff8a';
    c.font = `700 34px ${MONO}`;
    c.fillText(it.price, tx, it.y + 158);
    c.fillStyle = added ? '#58ff8a' : 'rgba(234,255,240,0.6)';
    c.font = ar ? `700 22px ${AR_BODY}` : `600 18px ${MONO}`;
    c.fillText(i18n.t(added ? 'phone.shop.added' : 'phone.shop.add'), tx, it.y + 216);
    c.textAlign = 'left';
    hots.push({ x: 32, y: it.y, w: PH_W - 64, h: 250, act: 'buy' + i, label: i18n.t(it.key) });
  });
  // checkout bar
  const on = ph.cart > 0;
  roundedPath(c, 40, 880, PH_W - 80, 82, 41);
  c.fillStyle = on ? '#2fbf71' : 'rgba(255,255,255,0.07)'; c.fill();
  c.fillStyle = on ? '#06130b' : 'rgba(234,255,240,0.4)';
  c.font = ar ? `800 26px ${AR_BODY}` : `700 24px ${MONO}`;
  c.textAlign = 'center';
  c.fillText(on ? `${i18n.t('phone.shop.checkout')} (${ph.cart})` : i18n.t('phone.shop.empty'), PH_W / 2, 932);
  c.textAlign = 'left';
  if (on && !ph.pay.open) hots.push({ x: 40, y: 868, w: PH_W - 80, h: 106, act: 'checkout', label: i18n.t('phone.shop.checkout') });
  // the payment sheet — feels like real money changing hands
  if (ph.pay.open) return phonePaySheet(c, now, ar);
  return hots;
}

const PH_CARD_FIELD = { x: 40, y: 800, w: 432, h: 78 };
const shopTotal = () => (phoneState.added[0] ? 1499 : 0) + (phoneState.added[1] ? 89 : 0);
const cardBrand = (num) => (num[0] === '4' ? 'VISA' : num[0] === '5' ? 'MASTERCARD' : num[0] ? 'CARD' : '');

function phonePaySheet(c, now, ar) {
  const ph = phoneState, pay = ph.pay;
  c.fillStyle = 'rgba(0,0,0,0.6)';
  c.fillRect(0, 0, PH_W, PH_H);
  const top = 400;
  roundedPath(c, 14, top, PH_W - 28, PH_H - top - 8, 36);
  c.fillStyle = '#121a24'; c.fill();
  c.strokeStyle = 'rgba(143,181,227,0.3)'; c.lineWidth = 2; c.stroke();
  const hots = [];
  // grab handle + title + close
  roundedPath(c, PH_W / 2 - 34, top + 14, 68, 7, 4);
  c.fillStyle = 'rgba(246,241,230,0.25)'; c.fill();
  c.textAlign = 'center';
  c.fillStyle = '#eafff0';
  c.font = ar ? `800 32px ${AR_DISPLAY}` : `700 28px ${BUBBLE}`;
  c.fillText(i18n.t('phone.pay.title'), PH_W / 2, top + 68);
  c.strokeStyle = '#8fb5e3'; c.lineWidth = 4; c.lineCap = 'round';
  const cx0 = ar ? 48 : PH_W - 78;
  c.beginPath();
  c.moveTo(cx0, top + 40); c.lineTo(cx0 + 24, top + 64);
  c.moveTo(cx0 + 24, top + 40); c.lineTo(cx0, top + 64);
  c.stroke();
  hots.push({ x: cx0 - 18, y: top + 24, w: 62, h: 62, act: 'pclose', label: 'Close' });
  const processing = pay.payAt && now - pay.payAt < 1400;
  // total
  c.textAlign = ar ? 'right' : 'left';
  c.fillStyle = '#8fb5e3';
  c.font = ar ? `700 22px ${AR_BODY}` : `600 18px ${MONO}`;
  c.fillText(i18n.t('phone.pay.total'), ar ? PH_W - 48 : 48, top + 132);
  c.textAlign = ar ? 'left' : 'right';
  c.fillStyle = '#58ff8a';
  c.font = `700 42px ${BUBBLE}`;
  c.fillText('$' + shopTotal().toLocaleString('en-US'), ar ? 48 : PH_W - 48, top + 140);
  // methods
  c.textAlign = ar ? 'right' : 'left';
  c.fillStyle = '#8fb5e3';
  c.font = ar ? `700 20px ${AR_BODY}` : `600 16px ${MONO}`;
  c.fillText(i18n.t('phone.pay.method'), ar ? PH_W - 48 : 48, top + 190);
  [{ key: 'phone.pay.card', m: 0 }, { key: 'phone.pay.paypal', m: 1 }].forEach((r, i) => {
    const y = top + 208 + i * 88;
    const sel = pay.method === r.m && !pay.adding;
    roundedPath(c, 40, y, PH_W - 80, 74, 20);
    c.fillStyle = sel ? 'rgba(88,255,138,0.12)' : 'rgba(255,255,255,0.05)'; c.fill();
    c.strokeStyle = sel ? '#58ff8a' : 'rgba(143,181,227,0.3)';
    c.lineWidth = sel ? 3 : 2; c.stroke();
    const rx = ar ? PH_W - 78 : 78;
    c.beginPath(); c.arc(rx, y + 37, 13, 0, Math.PI * 2);
    c.strokeStyle = sel ? '#58ff8a' : 'rgba(246,241,230,0.4)'; c.lineWidth = 2.5; c.stroke();
    if (sel) { c.beginPath(); c.arc(rx, y + 37, 7, 0, Math.PI * 2); c.fillStyle = '#58ff8a'; c.fill(); }
    c.fillStyle = '#eafff0';
    c.font = ar ? `700 23px ${AR_BODY}` : `600 21px ${MONO}`;
    c.textAlign = ar ? 'right' : 'left';
    c.fillText(i18n.t(r.key), ar ? rx - 34 : rx + 34, y + 46);
    hots.push({ x: 40, y, w: PH_W - 80, h: 74, act: 'method' + r.m, label: i18n.t(r.key) });
  });
  // add-a-card — a real keyboard sits on this field while typing
  const fy = PH_CARD_FIELD.y;
  if (pay.adding) {
    roundedPath(c, PH_CARD_FIELD.x, fy, PH_CARD_FIELD.w, PH_CARD_FIELD.h, 20);
    c.fillStyle = 'rgba(255,255,255,0.07)'; c.fill();
    c.strokeStyle = Math.floor(now / 480) % 2 ? '#58ff8a' : 'rgba(88,255,138,0.4)';
    c.lineWidth = 3; c.stroke();
    const groups = pay.num.replace(/(.{4})/g, '$1 ').trim();
    try { c.direction = 'ltr'; } catch {}
    c.textAlign = 'left';
    if (groups) {
      c.fillStyle = '#eafff0';
      c.font = `600 30px ${MONO}`;
      c.fillText(groups + (Math.floor(now / 420) % 2 ? '▮' : ''), 64, fy + 50);
    } else {
      c.fillStyle = 'rgba(143,181,227,0.55)';
      c.font = `500 20px ${MONO}`;
      c.fillText(i18n.t('phone.pay.cardnum'), 64, fy + 48);
    }
    try { c.direction = ar ? 'rtl' : 'ltr'; } catch {}
    const brand = cardBrand(pay.num);
    if (brand) {
      c.textAlign = 'right';
      c.fillStyle = '#ffd75e';
      c.font = `700 19px ${MONO}`;
      c.fillText(brand, PH_W - 60, fy + 48);
    }
    c.textAlign = 'center';
    c.fillStyle = 'rgba(234,255,240,0.5)';
    c.font = ar ? `600 18px ${AR_BODY}` : `500 14px ${MONO}`;
    c.fillText(i18n.t('phone.pay.trust'), PH_W / 2, fy + 106);
  } else {
    c.save(); c.setLineDash([10, 8]);
    roundedPath(c, 40, fy, PH_W - 80, 64, 20);
    c.strokeStyle = 'rgba(255,215,94,0.7)'; c.lineWidth = 2.5; c.stroke();
    c.restore();
    c.textAlign = 'center';
    c.fillStyle = '#ffd75e';
    c.font = ar ? `700 22px ${AR_BODY}` : `600 19px ${MONO}`;
    c.fillText(i18n.t('phone.pay.add'), PH_W / 2, fy + 41);
    hots.push({ x: 40, y: fy, w: PH_W - 80, h: 64, act: 'addcard', label: i18n.t('phone.pay.add') });
  }
  // PAY
  const canPay = !processing && (!pay.adding || pay.num.length >= 12);
  roundedPath(c, 40, 930, PH_W - 80, 84, 42);
  c.fillStyle = processing ? 'rgba(255,255,255,0.08)' : canPay ? '#2fbf71' : 'rgba(255,255,255,0.07)';
  c.fill();
  c.textAlign = 'center';
  if (processing) {
    c.strokeStyle = '#8fb5e3'; c.lineWidth = 5;
    c.beginPath(); c.arc(PH_W / 2 - 150, 972, 15, now / 140, now / 140 + 4.4); c.stroke();
    c.fillStyle = '#8fb5e3';
    c.font = ar ? `700 23px ${AR_BODY}` : `600 20px ${MONO}`;
    c.fillText(i18n.t('phone.pay.processing'), PH_W / 2 + 20, 982);
  } else {
    c.fillStyle = canPay ? '#06130b' : 'rgba(234,255,240,0.35)';
    c.font = ar ? `800 27px ${AR_BODY}` : `700 25px ${BUBBLE}`;
    c.fillText(`${i18n.t('phone.pay.pay')} $${shopTotal().toLocaleString('en-US')}`, PH_W / 2, 984);
    if (canPay) hots.push({ x: 40, y: 918, w: PH_W - 80, h: 108, act: 'dopay', label: i18n.t('phone.pay.pay') });
  }
  c.fillStyle = 'rgba(143,181,227,0.55)';
  c.font = ar ? `600 17px ${AR_BODY}` : `500 13px ${MONO}`;
  c.fillText(i18n.t('phone.pay.secure'), PH_W / 2, 1032);
  c.textAlign = 'left';
  // the bank replies
  if (pay.payAt && now - pay.payAt >= 1400) {
    pay.done = pay.adding && pay.num
      ? `${cardBrand(pay.num)} •••• ${pay.num.slice(-4)}`
      : pay.method === 1 ? 'PayPal' : i18n.t('phone.pay.card');
    pay.open = false;
    pay.payAt = 0;
    pay.adding = false;
    ph.checkoutAt = now;
    sound.chime();
  }
  return hots;
}

/* ---- BENZ EATS: order food, watch the courier ride ---- */
function eatsGlyph(c, i, x, y) {
  if (i === 0) {          // burger
    c.fillStyle = '#e8b25a';
    c.beginPath(); c.arc(x, y - 6, 34, Math.PI, 0); c.fill();
    c.fillStyle = '#7a4a24'; roundedPath(c, x - 34, y - 2, 68, 12, 6); c.fill();
    c.fillStyle = '#8fce5a'; roundedPath(c, x - 38, y + 12, 76, 7, 4); c.fill();
    c.fillStyle = '#e8b25a'; roundedPath(c, x - 34, y + 21, 68, 14, 7); c.fill();
  } else if (i === 1) {   // fries
    c.fillStyle = '#f3d06a';
    for (let f = 0; f < 4; f++) c.fillRect(x - 22 + f * 12, y - 34, 8, 34);
    c.fillStyle = '#d0492f';
    roundedPath(c, x - 30, y - 6, 60, 40, 8); c.fill();
  } else {                 // pizza slice
    c.fillStyle = '#f3d06a';
    c.beginPath(); c.moveTo(x - 32, y - 26); c.lineTo(x + 32, y - 26); c.lineTo(x, y + 34); c.closePath(); c.fill();
    c.fillStyle = '#d0492f';
    for (const [px2, py2] of [[-12, -12], [10, -14], [0, 6]]) {
      c.beginPath(); c.arc(x + px2, y + py2, 6, 0, Math.PI * 2); c.fill();
    }
  }
}

function phoneEats(c, now, ar) {
  const ph = phoneState, e = ph.eats;
  const hots = [phoneAppHeader(c, 'phone.eats.title', ar)];
  if (e.phase === 'track') {
    const el = now - e.orderAt;
    const T = 14000;
    const pr = clamp01(el / T);
    c.textAlign = 'center';
    c.fillStyle = '#8fb5e3';
    c.font = ar ? `700 22px ${AR_BODY}` : `600 18px ${MONO}`;
    c.fillText(i18n.t('phone.eats.track'), PH_W / 2, 210);
    // step timeline
    const steps = ['phone.eats.s1', 'phone.eats.s2', 'phone.eats.s3'];
    const active = pr >= 1 ? 2 : el > 5500 ? 1 : 0;
    steps.forEach((k, i) => {
      const y = 290 + i * 110;
      const on = i <= active;
      const lx = ar ? PH_W - 96 : 96;
      if (i < 2) {
        c.strokeStyle = i < active ? '#58ff8a' : 'rgba(246,241,230,0.2)';
        c.lineWidth = 4;
        c.beginPath(); c.moveTo(lx, y + 20); c.lineTo(lx, y + 92); c.stroke();
      }
      c.beginPath(); c.arc(lx, y, 16, 0, Math.PI * 2);
      c.fillStyle = on ? '#58ff8a' : 'rgba(246,241,230,0.15)'; c.fill();
      if (i === active && pr < 1 && !RM) {
        c.strokeStyle = 'rgba(88,255,138,0.5)'; c.lineWidth = 3;
        c.beginPath(); c.arc(lx, y, 24 + Math.sin(now / 200) * 4, 0, Math.PI * 2); c.stroke();
      }
      c.textAlign = ar ? 'right' : 'left';
      c.fillStyle = on ? '#eafff0' : 'rgba(234,255,240,0.4)';
      c.font = ar ? `700 26px ${AR_BODY}` : `600 22px ${MONO}`;
      c.fillText(i18n.t(k), ar ? lx - 44 : lx + 44, y + 9);
    });
    // the courier's journey
    const rx0 = 90, rx1 = 422, ry0 = 700, ry1 = 790;
    c.save();
    c.setLineDash([10, 10]);
    c.strokeStyle = 'rgba(143,181,227,0.5)'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(rx0, ry0); c.quadraticCurveTo(PH_W / 2, ry1 + 60, rx1, ry1 - 40); c.stroke();
    c.restore();
    // home flag at the end
    c.fillStyle = '#8fb5e3';
    c.fillRect(rx1 - 2, ry1 - 90, 4, 40);
    c.fillStyle = '#58ff8a';
    c.beginPath(); c.moveTo(rx1 + 2, ry1 - 90); c.lineTo(rx1 + 30, ry1 - 80); c.lineTo(rx1 + 2, ry1 - 70); c.closePath(); c.fill();
    const tq = pr, mt = 1 - tq;
    const cxq = mt * mt * rx0 + 2 * mt * tq * (PH_W / 2) + tq * tq * rx1;
    const cyq = mt * mt * ry0 + 2 * mt * tq * (ry1 + 60) + tq * tq * (ry1 - 40);
    c.beginPath(); c.arc(cxq, cyq, 15, 0, Math.PI * 2);
    c.fillStyle = '#ffd75e'; c.fill();
    c.fillStyle = '#17130e';
    c.font = `700 16px ${MONO}`;
    c.textAlign = 'center';
    c.fillText('≡', cxq, cyq + 6);
    // ETA / delivered
    if (pr >= 1) {
      c.fillStyle = '#58ff8a';
      c.font = ar ? `800 30px ${AR_DISPLAY}` : `700 27px ${BUBBLE}`;
      c.fillText(i18n.t('phone.eats.s3'), PH_W / 2, 880);
      c.fillStyle = 'rgba(234,255,240,0.65)';
      c.font = ar ? `600 20px ${AR_BODY}` : `500 16px ${MONO}`;
      c.fillText(i18n.t('phone.eats.done'), PH_W / 2, 922);
      roundedPath(c, 136, 950, PH_W - 272, 64, 32);
      c.strokeStyle = '#58ff8a'; c.lineWidth = 3; c.stroke();
      c.fillStyle = '#baffd0';
      c.font = ar ? `700 22px ${AR_BODY}` : `600 18px ${MONO}`;
      c.fillText(i18n.t('phone.game.again'), PH_W / 2, 991);
      hots.push({ x: 136, y: 938, w: PH_W - 272, h: 88, act: 'eagain', label: i18n.t('phone.game.again') });
    } else {
      c.fillStyle = '#ffd75e';
      c.font = `700 34px ${BUBBLE}`;
      c.fillText(`${i18n.t('phone.eats.eta')} ${Math.ceil((T - el) / 1000)}s`, PH_W / 2, 890);
    }
    c.textAlign = 'left';
    return hots;
  }
  // menu
  let total = 0, count = 0;
  EATS_MENU.forEach((it, i) => { total += it.price * e.counts[i]; count += e.counts[i]; });
  EATS_MENU.forEach((it, i) => {
    const y = 180 + i * 158;
    roundedPath(c, 32, y, PH_W - 64, 138, 24);
    c.fillStyle = 'rgba(255,255,255,0.055)'; c.fill();
    c.strokeStyle = e.counts[i] ? '#58ff8a' : 'rgba(143,181,227,0.35)';
    c.lineWidth = e.counts[i] ? 3 : 2; c.stroke();
    eatsGlyph(c, i, ar ? PH_W - 96 : 96, y + 68);
    const tx = ar ? PH_W - 168 : 168;
    c.textAlign = ar ? 'right' : 'left';
    c.fillStyle = '#eafff0';
    c.font = ar ? `800 27px ${AR_DISPLAY}` : `700 24px ${BUBBLE}`;
    c.fillText(i18n.t(it.key), tx, y + 62);
    c.fillStyle = '#58ff8a';
    c.font = `700 26px ${MONO}`;
    c.fillText('$' + it.price, tx, y + 102);
    // add chip
    const chx = ar ? 46 : PH_W - 46 - 92;
    roundedPath(c, chx, y + 40, 92, 56, 28);
    c.fillStyle = e.counts[i] ? '#2fbf71' : 'rgba(88,255,138,0.14)'; c.fill();
    c.strokeStyle = '#58ff8a'; c.lineWidth = 2; c.stroke();
    c.textAlign = 'center';
    c.fillStyle = e.counts[i] ? '#06130b' : '#baffd0';
    c.font = ar ? `700 22px ${AR_BODY}` : `700 19px ${MONO}`;
    c.fillText(e.counts[i] ? '×' + e.counts[i] : i18n.t('phone.eats.add'), chx + 46, y + 76);
    hots.push({ x: 32, y, w: PH_W - 64, h: 138, act: 'eat' + i, label: i18n.t(it.key) });
  });
  // place order
  const on = count > 0;
  roundedPath(c, 40, 880, PH_W - 80, 82, 41);
  c.fillStyle = on ? '#2fbf71' : 'rgba(255,255,255,0.07)'; c.fill();
  c.textAlign = 'center';
  c.fillStyle = on ? '#06130b' : 'rgba(234,255,240,0.4)';
  c.font = ar ? `800 26px ${AR_BODY}` : `700 23px ${BUBBLE}`;
  c.fillText(on ? `${i18n.t('phone.eats.order')} — $${total}` : i18n.t('phone.eats.empty'), PH_W / 2, 932);
  c.textAlign = 'left';
  if (on) hots.push({ x: 40, y: 868, w: PH_W - 80, h: 106, act: 'eorder', label: i18n.t('phone.eats.order') });
  return hots;
}

/* ---- MEET: a real calendar for a real meeting (confirmed on WhatsApp) ---- */
function calLayout() {
  const d = new Date();
  const y = d.getFullYear(), m = d.getMonth();
  const first = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const rows = Math.ceil((first + days) / 7);
  return { y, m, first, days, rows, today: d.getDate() };
}
const PH_CAL = { x: 48, w: 416, top: 292, rh: 56 };
const phCalRect = { x: 0, y: 0, w: 0, h: 0 };   // set while the calendar paints

function pickCalendarDay(fx, fy) {
  const L = calLayout();
  const col = Math.min(6, Math.max(0, Math.floor(fx * 7)));
  const row = Math.min(L.rows - 1, Math.max(0, Math.floor(fy * L.rows)));
  const day = row * 7 + col - L.first + 1;
  if (day >= L.today && day <= L.days) {
    phoneState.meet.day = day;
    phoneState.meet.slot = -1;
    phoneState.meet.sent = false;
    sound.key();
    phoneState.everTapped = true;
  }
}

function phoneBook(c, now, ar) {
  const ph = phoneState, me = ph.meet;
  const hots = [phoneAppHeader(c, 'phone.book.title', ar)];
  const L = calLayout();
  const loc = ar ? 'ar' : 'en-GB';
  // month title
  c.textAlign = 'center';
  c.fillStyle = '#eafff0';
  let month = '';
  try { month = new Date(L.y, L.m, 1).toLocaleDateString(loc, { month: 'long', year: 'numeric' }); } catch {}
  c.font = ar ? `800 30px ${AR_DISPLAY}` : `700 27px ${BUBBLE}`;
  c.fillText(month, PH_W / 2, 200);
  c.fillStyle = '#8fb5e3';
  c.font = ar ? `700 19px ${AR_BODY}` : `600 15px ${MONO}`;
  c.fillText(i18n.t(me.day > 0 ? 'phone.meet.time' : 'phone.meet.pick'), PH_W / 2, 238);
  // weekday letters (Sunday-first)
  const cw = PH_CAL.w / 7;
  c.font = `600 15px ${MONO}`;
  c.fillStyle = 'rgba(143,181,227,0.6)';
  for (let i = 0; i < 7; i++) {
    let wd = '';
    try { wd = new Date(2024, 8, 1 + i).toLocaleDateString(loc, { weekday: 'narrow' }); } catch {}
    c.fillText(wd, PH_CAL.x + cw * i + cw / 2, 272);
  }
  // the grid
  for (let d = 1; d <= L.days; d++) {
    const idx = L.first + d - 1;
    const col = idx % 7, row = Math.floor(idx / 7);
    const cx = PH_CAL.x + cw * col + cw / 2;
    const cy = PH_CAL.top + row * PH_CAL.rh + PH_CAL.rh / 2;
    const past = d < L.today;
    const sel = me.day === d;
    if (sel) {
      c.beginPath(); c.arc(cx, cy, 24, 0, Math.PI * 2);
      c.fillStyle = '#2fbf71'; c.fill();
    } else if (d === L.today) {
      c.beginPath(); c.arc(cx, cy, 24, 0, Math.PI * 2);
      c.strokeStyle = '#ffd75e'; c.lineWidth = 2.5; c.stroke();
    }
    c.fillStyle = sel ? '#06130b' : past ? 'rgba(234,255,240,0.25)' : '#eafff0';
    c.font = `${sel ? 700 : 500} 22px ${MONO}`;
    c.fillText(String(d), cx, cy + 8);
  }
  const gridH = L.rows * PH_CAL.rh;
  phCalRect.x = PH_CAL.x; phCalRect.y = PH_CAL.top;
  phCalRect.w = PH_CAL.w; phCalRect.h = gridH;
  // time slots
  const sy = PH_CAL.top + gridH + 34;
  if (me.day > 0) {
    MEET_SLOTS.forEach((s, i) => {
      const bx = 56 + i * 138;
      const on = me.slot === i;
      roundedPath(c, bx, sy, 122, 64, 32);
      c.fillStyle = on ? '#2fbf71' : 'rgba(255,255,255,0.06)'; c.fill();
      c.strokeStyle = on ? '#58ff8a' : 'rgba(143,181,227,0.35)'; c.lineWidth = 2; c.stroke();
      c.fillStyle = on ? '#06130b' : '#eafff0';
      c.font = `700 24px ${MONO}`;
      c.fillText(s, bx + 61, sy + 41);
      hots.push({ x: bx, y: sy, w: 122, h: 64, act: 'slot' + i, label: s });
    });
  }
  // confirm — a REAL request, lands on WhatsApp in a new tab
  const cy2 = sy + 100;
  if (me.day > 0 && me.slot >= 0) {
    if (me.sent) {
      c.fillStyle = '#58ff8a';
      c.font = ar ? `800 26px ${AR_BODY}` : `700 22px ${BUBBLE}`;
      c.fillText(i18n.t('phone.meet.sent'), PH_W / 2, cy2 + 24);
      // and it becomes a REAL calendar invite — we're on the guest list
      roundedPath(c, 56, cy2 + 56, PH_W - 112, 78, 39);
      c.fillStyle = 'rgba(122,166,214,0.16)'; c.fill();
      c.strokeStyle = '#8fb5e3'; c.lineWidth = 2.5; c.stroke();
      c.fillStyle = '#cfe4fb';
      const acTxt = i18n.t('phone.meet.addcal');
      fitFont(c, acTxt, PH_W - 160, ar ? 24 : 20, ar ? 800 : 700, ar ? AR_BODY : BUBBLE, 13);
      c.fillText(acTxt, PH_W / 2, cy2 + 104);
      c.fillStyle = 'rgba(234,255,240,0.5)';
      c.font = ar ? `600 17px ${AR_BODY}` : `500 13px ${MONO}`;
      c.fillText(i18n.t('phone.meet.calnote'), PH_W / 2, cy2 + 168);
      hots.push({ x: 56, y: cy2 + 44, w: PH_W - 112, h: 102, act: 'cal', label: acTxt, cal: true });
    } else {
      roundedPath(c, 56, cy2, PH_W - 112, 80, 40);
      const g = c.createLinearGradient(56, cy2, PH_W - 56, cy2 + 80);
      g.addColorStop(0, '#37d67a'); g.addColorStop(1, '#1fae5e');
      c.fillStyle = g; c.fill();
      c.fillStyle = '#06130b';
      c.font = ar ? `800 25px ${AR_BODY}` : `700 22px ${BUBBLE}`;
      c.fillText(i18n.t('phone.meet.confirm'), PH_W / 2, cy2 + 50);
      hots.push({ x: 56, y: cy2 - 12, w: PH_W - 112, h: 104, act: 'order', label: i18n.t('phone.meet.confirm'), link: true });
      c.fillStyle = 'rgba(234,255,240,0.5)';
      c.font = ar ? `600 18px ${AR_BODY}` : `500 14px ${MONO}`;
      c.fillText(i18n.t('phone.meet.note'), PH_W / 2, cy2 + 124);
    }
  }
  c.textAlign = 'left';
  return hots;
}

/* ---- STEP 1: name the business (a real keyboard input sits on the field) ---- */
function phoneBuilderName(c, now, ar) {
  const ph = phoneState;
  const hots = [phoneAppHeader(c, 'phone.yours.title', ar)];
  c.textAlign = 'center';
  c.fillStyle = '#8fb5e3';
  c.font = ar ? `700 21px ${AR_BODY}` : `600 17px ${MONO}`;
  c.fillText(i18n.t('phone.b.step1'), PH_W / 2, 212);
  c.fillStyle = '#eafff0';
  c.font = ar ? `800 40px ${AR_DISPLAY}` : `400 36px ${BUBBLE}`;
  c.fillText(i18n.t('phone.b.name'), PH_W / 2, 280);
  // the field
  const f = PH_NAME_FIELD;
  roundedPath(c, f.x, f.y, f.w, f.h, 20);
  c.fillStyle = 'rgba(255,255,255,0.07)'; c.fill();
  c.strokeStyle = Math.floor(now / 500) % 2 ? '#58ff8a' : 'rgba(88,255,138,0.45)';
  c.lineWidth = 3; c.stroke();
  const nm = ph.bizName;
  if (nm) {
    c.fillStyle = '#eafff0';
    fitFont(c, nm, f.w - 60, 40, 700, ar ? AR_DISPLAY : MONO, 20);
    const cur = Math.floor(now / 420) % 2 ? '▮' : '';
    c.fillText(nm + cur, PH_W / 2, f.y + 62);
  } else {
    c.fillStyle = 'rgba(143,181,227,0.55)';
    c.font = ar ? `600 26px ${AR_BODY}` : `500 22px ${MONO}`;
    c.fillText(i18n.t('phone.b.ph') + (Math.floor(now / 420) % 2 ? ' ▮' : ''), PH_W / 2, f.y + 60);
  }
  c.fillStyle = 'rgba(234,255,240,0.45)';
  c.font = ar ? `600 19px ${AR_BODY}` : `500 14px ${MONO}`;
  c.fillText(i18n.t('phone.b.fine'), PH_W / 2, 486);
  // BUILD IT →
  const on = nm.trim().length >= 2;
  roundedPath(c, 96, 560, PH_W - 192, 86, 43);
  c.fillStyle = on ? '#2fbf71' : 'rgba(255,255,255,0.07)'; c.fill();
  c.fillStyle = on ? '#06130b' : 'rgba(234,255,240,0.35)';
  c.font = ar ? `800 28px ${AR_BODY}` : `700 25px ${MONO}`;
  c.fillText(i18n.t('phone.b.next'), PH_W / 2, 614);
  c.textAlign = 'left';
  if (on) hots.push({ x: 96, y: 548, w: PH_W - 192, h: 110, act: 'bnext', label: i18n.t('phone.b.next') });
  return hots;
}

/* ---- STEP 2: pick the vibe ---- */
/* ---- STEP 2: what do they actually do? the app tailors itself ---- */
function phoneBuilderType(c, now, ar) {
  const ph = phoneState;
  const hots = [phoneAppHeader(c, 'phone.yours.title', ar)];
  c.textAlign = 'center';
  c.fillStyle = '#8fb5e3';
  c.font = ar ? `700 21px ${AR_BODY}` : `600 17px ${MONO}`;
  c.fillText(i18n.t('phone.b.stepT'), PH_W / 2, 212);
  c.fillStyle = '#eafff0';
  c.font = ar ? `800 38px ${AR_DISPLAY}` : `700 32px ${BUBBLE}`;
  c.fillText(i18n.t('phone.b.type'), PH_W / 2, 278);
  const glyphs = [
    (x, y) => eatsGlyph(c, 0, x, y),                                     // restaurant
    (x, y) => {                                                          // shop bag
      c.strokeStyle = '#eafff0'; c.lineWidth = 5; c.lineJoin = 'round';
      c.strokeRect(x - 22, y - 8, 44, 30);
      c.beginPath(); c.arc(x, y - 12, 13, Math.PI, 0); c.stroke();
    },
    (x, y) => {                                                          // clinic cross
      c.fillStyle = '#eafff0';
      c.fillRect(x - 6, y - 22, 12, 44); c.fillRect(x - 22, y - 6, 44, 12);
    },
    (x, y) => {                                                          // spark
      c.fillStyle = '#ffd75e';
      c.font = `400 44px ${BUBBLE}`; c.textAlign = 'center';
      c.fillText('✦', x, y + 15);
    },
  ];
  ['phone.b.t0', 'phone.b.t1', 'phone.b.t2', 'phone.b.t3'].forEach((k, i) => {
    const y = 320 + i * 132;
    const sel = ph.bizType === i;
    roundedPath(c, 48, y, PH_W - 96, 112, 26);
    c.fillStyle = sel ? 'rgba(88,255,138,0.13)' : 'rgba(255,255,255,0.055)'; c.fill();
    c.strokeStyle = sel ? '#58ff8a' : 'rgba(143,181,227,0.35)';
    c.lineWidth = sel ? 3 : 2; c.stroke();
    const gx = ar ? PH_W - 106 : 106;
    c.save(); c.translate(0, 0); c.scale(0.8, 0.8);
    glyphs[i](gx / 0.8, (y + 56) / 0.8);
    c.restore();
    c.fillStyle = '#eafff0';
    const lbl = i18n.t(k);
    fitFont(c, lbl, PH_W - 250, ar ? 26 : 21, ar ? 700 : 600, ar ? AR_BODY : MONO, 14);
    c.textAlign = ar ? 'right' : 'left';
    c.fillText(lbl, ar ? gx - 62 : gx + 62, y + 66);
    c.textAlign = 'center';
    hots.push({ x: 48, y, w: PH_W - 96, h: 112, act: 'btype' + i, label: lbl });
  });
  c.textAlign = 'left';
  return hots;
}

function phoneBuilderColor(c, now, ar) {
  const hots = [phoneAppHeader(c, 'phone.yours.title', ar)];
  c.textAlign = 'center';
  c.fillStyle = '#8fb5e3';
  c.font = ar ? `700 21px ${AR_BODY}` : `600 17px ${MONO}`;
  c.fillText(i18n.t('phone.b.step2'), PH_W / 2, 212);
  c.fillStyle = '#eafff0';
  c.font = ar ? `800 40px ${AR_DISPLAY}` : `400 36px ${BUBBLE}`;
  c.fillText(i18n.t('phone.b.color'), PH_W / 2, 280);
  ['phone.b.v1', 'phone.b.v2', 'phone.b.v3'].forEach((k, i) => {
    const y = 330 + i * 172;
    const v = VIBES[i];
    roundedPath(c, 48, y, PH_W - 96, 140, 28);
    const g = c.createLinearGradient(48, y, PH_W - 48, y + 140);
    g.addColorStop(0, v.g0); g.addColorStop(1, v.g1);
    c.fillStyle = g; c.fill();
    // mini preview: their initial on a white tile
    const tx = ar ? PH_W - 118 : 118;
    roundedPath(c, tx - 34, y + 36, 68, 68, 18);
    c.fillStyle = 'rgba(255,255,255,0.92)'; c.fill();
    c.fillStyle = v.g1;
    c.font = `400 40px ${BUBBLE}`;
    c.fillText(bizInitial(), tx, y + 86);
    c.fillStyle = '#ffffff';
    c.font = ar ? `800 30px ${AR_BODY}` : `700 27px ${MONO}`;
    c.fillText(i18n.t(k), ar ? tx - 160 : tx + 160, y + 82);
    hots.push({ x: 48, y, w: PH_W - 96, h: 140, act: 'vibe' + i, label: i18n.t(k) });
  });
  c.textAlign = 'left';
  return hots;
}

/* ---- STEP 3: manufacturing — no way back, the future is being built ---- */
function phoneBuilderGen(c, now, ar) {
  const ph = phoneState;
  const el = now - ph.genAt;
  c.textAlign = 'center';
  c.fillStyle = '#8fb5e3';
  c.font = ar ? `700 21px ${AR_BODY}` : `600 17px ${MONO}`;
  c.fillText(i18n.t('phone.b.step3'), PH_W / 2, 212);
  // spinning assembly ring around their tile
  const v = vibeOf();
  c.strokeStyle = v.g0; c.lineWidth = 8; c.lineCap = 'round';
  c.beginPath(); c.arc(PH_W / 2, 460, 120, now / 300, now / 300 + 4.2); c.stroke();
  c.strokeStyle = 'rgba(255,255,255,0.14)';
  c.beginPath(); c.arc(PH_W / 2, 460, 120, 0, Math.PI * 2); c.stroke();
  roundedPath(c, PH_W / 2 - 60, 400, 120, 120, 30);
  const g = c.createLinearGradient(PH_W / 2 - 60, 400, PH_W / 2 + 60, 520);
  g.addColorStop(0, v.g0); g.addColorStop(1, v.g1);
  c.fillStyle = g; c.fill();
  c.fillStyle = '#ffffff';
  c.font = `400 64px ${BUBBLE}`;
  c.fillText(bizInitial(), PH_W / 2, 484);
  // rotating status lines
  const lines = ['phone.b.gen1', 'phone.b.gen2', 'phone.b.gen3', 'phone.b.gen4'];
  const li = Math.min(lines.length - 1, Math.max(0, Math.floor(el / 660)));
  c.fillStyle = '#58ff8a';
  c.font = ar ? `700 25px ${AR_BODY}` : `600 20px ${MONO}`;
  c.fillText(i18n.t(lines[li]), PH_W / 2, 662);
  // progress
  const pr = clamp01(el / 2600);
  roundedPath(c, 88, 710, PH_W - 176, 16, 8);
  c.fillStyle = 'rgba(255,255,255,0.1)'; c.fill();
  roundedPath(c, 88, 710, Math.max(16, (PH_W - 176) * pr), 16, 8);
  c.fillStyle = v.g0; c.fill();
  c.textAlign = 'left';
  if (el > 2600 && !ph.genDone) {
    ph.genDone = true;
    ph.appBuilt = true;
    ph.builtAt = now;
    ph.splashAt = now;
    ph.app = 'myapp';
    ph.ordersStart = now;
    ph.orders = [];
    ph.orderSeq = 0;
    ph.revenue = 0;
    ph.revShown = 0;
    ph.lastOrderAt = now + 600;
    sound.chime();
  }
  return [];
}

/* ---- THEIR app: splash, live orders, climbing revenue, slide-to-order ---- */
function phoneMyApp(c, now, ar) {
  const ph = phoneState;
  const v = vibeOf();
  const name = ph.bizName.trim() || 'YOUR APP';
  if (now - ph.splashAt < 1400) {
    const g = c.createLinearGradient(0, 0, 0, PH_H);
    g.addColorStop(0, v.g0); g.addColorStop(1, v.g1);
    c.fillStyle = g; c.fillRect(0, 0, PH_W, PH_H);
    const s = smooth(0, 1, clamp01((now - ph.splashAt) / 450));
    roundedPath(c, PH_W / 2 - 75 * s, 380 - 75 * s + 75, 150 * s, 150 * s, 36 * s);
    c.fillStyle = 'rgba(255,255,255,0.95)'; c.fill();
    c.fillStyle = v.g1;
    c.font = `400 ${Math.max(10, 76 * s)}px ${BUBBLE}`;
    c.textAlign = 'center';
    c.fillText(bizInitial(), PH_W / 2, 458);
    c.fillStyle = '#ffffff';
    fitFont(c, name, PH_W - 100, 46, ar ? 800 : 400, ar ? AR_DISPLAY : DISPLAY, 24);
    c.fillText(name, PH_W / 2, 620);
    c.fillStyle = 'rgba(255,255,255,0.75)';
    c.font = ar ? `700 20px ${AR_BODY}` : `600 16px ${MONO}`;
    c.fillText(i18n.t('phone.my.powered'), PH_W / 2, 668);
    c.textAlign = 'left';
    return [];
  }
  const hots = [phoneAppHeader(c, 'phone.yours.title', ar)];
  // header re-brand: their tile + name over the generic title
  c.fillStyle = '#0b1118';
  c.fillRect(PH_W / 2 - 150, 84, 300, 52);
  roundedPath(c, PH_W / 2 - (ar ? -96 : 148), 86, 44, 44, 12);
  const hg = c.createLinearGradient(0, 86, 0, 130);
  hg.addColorStop(0, v.g0); hg.addColorStop(1, v.g1);
  c.fillStyle = hg; c.fill();
  c.fillStyle = '#fff';
  c.font = `400 26px ${BUBBLE}`;
  c.textAlign = 'center';
  c.fillText(bizInitial(), PH_W / 2 - (ar ? -118 : 126), 120);
  c.fillStyle = '#eafff0';
  fitFont(c, name, 230, 30, ar ? 800 : 400, ar ? AR_DISPLAY : DISPLAY, 16);
  c.fillText(name, PH_W / 2 + (ar ? -36 : 36), 120);
  // live orders roll in — in the client's own line of business
  const feed = TYPE_FEED[ph.bizType >= 0 ? ph.bizType : 3];
  if (now - ph.lastOrderAt > 1900 && ph.orderSeq < 60) {
    ph.lastOrderAt = now;
    ph.orderSeq++;
    ph.orders.unshift({ key: feed[(ph.orderSeq - 1) % feed.length], num: 100 + ph.orderSeq, at: now });
    ph.orders = ph.orders.slice(0, 3);
    ph.revenue += 140 + ((ph.orderSeq * 97) % 730);
    sound.key();
  }
  ph.revShown = lerp(ph.revShown, ph.revenue, 0.09);
  // revenue card
  roundedPath(c, 48, 170, PH_W - 96, 150, 24);
  const rg = c.createLinearGradient(48, 170, PH_W - 48, 320);
  rg.addColorStop(0, v.g0); rg.addColorStop(1, v.g1);
  c.fillStyle = rg; c.fill();
  c.textAlign = 'center';
  c.fillStyle = 'rgba(255,255,255,0.8)';
  c.font = ar ? `700 21px ${AR_BODY}` : `600 17px ${MONO}`;
  c.fillText(i18n.t('phone.my.rev'), PH_W / 2, 216);
  c.fillStyle = '#ffffff';
  c.font = `400 54px ${BUBBLE}`;
  c.fillText('$' + Math.floor(ph.revShown).toLocaleString('en-US'), PH_W / 2, 288);
  // a status line in their trade
  c.fillStyle = '#ffd75e';
  const xline = i18n.t('phone.my.x' + (ph.bizType >= 0 ? ph.bizType : 3));
  fitFont(c, xline, PH_W - 80, ar ? 21 : 16, ar ? 700 : 600, ar ? AR_BODY : MONO, 11);
  c.fillText(xline, PH_W / 2, 356);
  // feed
  c.fillStyle = '#8fb5e3';
  c.font = ar ? `700 21px ${AR_BODY}` : `600 17px ${MONO}`;
  c.fillText(i18n.t('phone.my.orders') + '  ●', PH_W / 2, 404);
  ph.orders.forEach((o, i) => {
    const age = now - o.at;
    const slide = smooth(0, 1, clamp01(age / 380));
    const y = 428 + i * 100 + (1 - slide) * -26;
    c.globalAlpha = slide;
    roundedPath(c, 48, y, PH_W - 96, 84, 20);
    c.fillStyle = 'rgba(255,255,255,0.06)'; c.fill();
    c.strokeStyle = 'rgba(143,181,227,0.3)'; c.lineWidth = 2; c.stroke();
    const nx = ar ? PH_W - 76 : 76;
    c.textAlign = ar ? 'right' : 'left';
    c.fillStyle = '#ffd75e';
    c.font = `700 22px ${MONO}`;
    c.fillText('#' + o.num, nx, y + 52);
    c.fillStyle = '#eafff0';
    const line = i18n.t(o.key);
    fitFont(c, line, PH_W - 260, ar ? 24 : 20, ar ? 700 : 600, ar ? AR_BODY : MONO, 13);
    c.fillText(line, ar ? nx - 100 : nx + 100, y + 52);
    c.globalAlpha = 1;
  });
  // slide-to-order
  const s = PH_SLIDE_RECT;
  ph.slideDraw = ph.slideActive ? ph.slideP : lerp(ph.slideDraw, ph.slideP, 0.25);
  roundedPath(c, s.x, s.y, s.w, s.h, s.h / 2);
  c.fillStyle = ph.ordered ? '#2fbf71' : 'rgba(255,255,255,0.08)'; c.fill();
  if (!ph.ordered && ph.slideDraw > 0.02) {
    c.save();
    roundedPath(c, s.x, s.y, s.w, s.h, s.h / 2); c.clip();
    const fw = s.w * ph.slideDraw;
    c.fillStyle = 'rgba(88,255,138,0.25)';
    c.fillRect(ar ? s.x + s.w - fw : s.x, s.y, fw, s.h);
    c.restore();
  }
  c.textAlign = 'center';
  if (ph.ordered) {
    c.fillStyle = '#06130b';
    fitFont(c, i18n.t('phone.my.slid'), s.w - 60, ar ? 24 : 19, ar ? 800 : 700, ar ? AR_BODY : MONO, 12);
    c.fillText(i18n.t('phone.my.slid'), s.x + s.w / 2, s.y + 52);
    // celebration
    const age = now - ph.orderedAt;
    if (age < 2600) {
      for (let i = 0; i < 30; i++) {
        const fy = s.y - ((age * (0.1 + (i % 5) * 0.045)) + i * 61) % 700;
        const fx = (i * 167.7) % (PH_W - 40) + 20;
        c.fillStyle = ['#58ff8a', '#ffd75e', '#8fb5e3', '#ffffff'][i % 4];
        c.save(); c.translate(fx, fy); c.rotate(i + age / 260); c.fillRect(-6, -4, 12, 8); c.restore();
      }
    }
  } else {
    const tw = 1 - clamp01(ph.slideDraw * 1.6);
    c.globalAlpha = 0.4 + 0.35 * Math.sin(now / 350);
    c.fillStyle = '#eafff0';
    fitFont(c, i18n.t('phone.my.slide'), s.w - 130, ar ? 23 : 18, ar ? 700 : 600, ar ? AR_BODY : MONO, 12);
    c.globalAlpha = tw * (0.55 + 0.3 * Math.sin(now / 350));
    c.fillText(i18n.t('phone.my.slide'), s.x + s.w / 2 + (ar ? -26 : 26), s.y + 52);
    c.globalAlpha = 1;
    // thumb
    const pad = 6, tr = (s.h - pad * 2) / 2;
    const x0 = s.x + pad + tr, x1 = s.x + s.w - pad - tr;
    const tx = ar ? lerp(x1, x0, ph.slideDraw) : lerp(x0, x1, ph.slideDraw);
    c.beginPath(); c.arc(tx, s.y + s.h / 2, tr, 0, Math.PI * 2);
    const tg = c.createLinearGradient(tx - tr, 0, tx + tr, 0);
    tg.addColorStop(0, v.g0); tg.addColorStop(1, v.g1);
    c.fillStyle = tg; c.fill();
    c.fillStyle = '#ffffff';
    c.font = `700 30px ${MONO}`;
    c.fillText(ar ? '←' : '→', tx, s.y + 54);
  }
  c.textAlign = 'left';
  return hots;
}

function phoneHome(c, now, ar) {
  const ph = phoneState;
  c.textAlign = 'center';
  c.fillStyle = '#8fb5e3';
  c.font = ar ? `700 21px ${AR_BODY}` : `600 17px ${MONO}`;
  c.fillText(i18n.t('phone.os'), PH_W / 2, 140);
  c.fillStyle = '#eafff0';
  c.font = ar ? `800 36px ${AR_DISPLAY}` : `400 30px ${BUBBLE}`;
  c.fillText(i18n.t('phone.hello'), PH_W / 2, 192);
  c.textAlign = 'left';
  const hots = phoneIcons(c, ar, now);
  // BENZ ARCADE — marching-ants banner card
  const ay = 662;
  roundedPath(c, 40, ay, PH_W - 80, 96, 24);
  c.fillStyle = 'rgba(255,215,94,0.09)'; c.fill();
  c.save();
  c.setLineDash([12, 8]);
  c.lineDashOffset = RM ? 0 : -now / 40;
  c.strokeStyle = '#ffd75e'; c.lineWidth = 2.5;
  roundedPath(c, 40, ay, PH_W - 80, 96, 24); c.stroke();
  c.restore();
  const jx = ar ? PH_W - 92 : 92;
  c.fillStyle = '#ffd75e';
  roundedPath(c, jx - 22, ay + 60, 44, 12, 6); c.fill();
  c.fillRect(jx - 4, ay + 36, 8, 26);
  c.beginPath(); c.arc(jx, ay + 32, 11, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#ffe9b0';
  const gcTxt = i18n.t('phone.game.card');
  fitFont(c, gcTxt, PH_W - 200, ar ? 22 : 17, ar ? 700 : 600, ar ? AR_BODY : MONO, 11);
  c.textAlign = 'center';
  c.fillText(gcTxt, PH_W / 2 + (ar ? -32 : 32), ay + 56);
  hots.push({ x: 40, y: ay, w: PH_W - 80, h: 96, act: 'game', label: i18n.t('phone.game.title') });
  // demo caption — coaches first, then celebrates THEIR app
  const coach = !ph.everTapped && ph.unlockAt > 0 && now - ph.unlockAt > 4500;
  if (coach && !RM) {
    // pulsing ring around the first icon: "this is tappable"
    const pr = 66 + Math.sin(now / 260) * 8;
    c.strokeStyle = `rgba(88,255,138,${(0.5 + 0.3 * Math.sin(now / 260)).toFixed(2)})`;
    c.lineWidth = 4;
    c.beginPath(); c.arc(168, 330, pr, 0, Math.PI * 2); c.stroke();
  }
  c.fillStyle = coach ? '#58ff8a' : ph.appBuilt ? '#58ff8a' : 'rgba(143,181,227,0.85)';
  const cap = coach
    ? i18n.t('phone.coach')
    : ph.appBuilt
      ? `${ph.bizName.trim()} ${i18n.t('phone.hint.built')}`
      : i18n.t('phone.demo');
  fitFont(c, cap, PH_W - 60, ar ? 21 : 17, ar ? 700 : 600, ar ? AR_BODY : MONO, 12);
  c.textAlign = 'center';
  c.fillText(cap, PH_W / 2, 830);
  // dock — the standing offer
  roundedPath(c, 40, 880, PH_W - 80, 82, 41);
  const dg = c.createLinearGradient(40, 880, 40, 962);
  dg.addColorStop(0, '#37d67a'); dg.addColorStop(1, '#1fae5e');
  c.fillStyle = dg; c.fill();
  c.fillStyle = '#06130b';
  c.font = ar ? `800 26px ${AR_BODY}` : `700 23px ${MONO}`;
  c.fillText(i18n.t('phone.order'), PH_W / 2, 932);
  c.textAlign = 'left';
  hots.push({ x: 40, y: 868, w: PH_W - 80, h: 106, act: 'order', label: i18n.t('phone.order'), link: true });
  // the passive-aggressive memos: first the competitor, later THEIR first customer
  if (!ph.notifOn) {
    if (ph.appBuilt && !ph.notifUsed2 && now - ph.builtAt > 2500) {
      ph.notifOn = true; ph.notifKind = 2; ph.notifShownAt = now; sound.beep();
    } else if (!ph.appBuilt && !ph.notifUsed1 && ph.wakeAt && now - ph.wakeAt > 6000) {
      ph.notifOn = true; ph.notifKind = 1; ph.notifShownAt = now; sound.beep();
    }
  }
  if (ph.notifOn && now - ph.notifShownAt > 7000) {
    ph.notifOn = false;
    if (ph.notifKind === 2) ph.notifUsed2 = true; else ph.notifUsed1 = true;
  }
  if (ph.notifOn) {
    const slide = smooth(0, 1, clamp01((now - ph.notifShownAt) / 380));
    const ny = -110 + slide * 194;
    roundedPath(c, 24, ny, PH_W - 48, 104, 24);
    c.fillStyle = 'rgba(23,26,32,0.97)'; c.fill();
    c.strokeStyle = ph.notifKind === 2 ? '#58ff8a' : '#ffd75e'; c.lineWidth = 2.5; c.stroke();
    c.fillStyle = ph.notifKind === 2 ? '#58ff8a' : '#ffd75e';
    c.font = `700 30px ${MONO}`;
    const ix = ar ? PH_W - 62 : 62;
    c.textAlign = 'center';
    c.fillText(ph.notifKind === 2 ? '●' : '⚠', ix, ny + 64);
    c.textAlign = ar ? 'right' : 'left';
    c.fillStyle = '#f6f1e6';
    const nt = ph.notifKind === 2
      ? `${ph.bizName.trim()}: ${i18n.t('phone.notif2')}`
      : i18n.t('phone.notif');
    fitFont(c, nt, PH_W - 160, ar ? 23 : 19, ar ? 700 : 600, ar ? AR_BODY : MONO, 13);
    const tx0 = ar ? PH_W - 100 : 100;
    c.fillText(nt, tx0, ny + 62);
    c.textAlign = 'left';
    hots.push({ x: 24, y: Math.max(70, ny), w: PH_W - 48, h: 104, act: 'notif', label: nt });
  }
  return hots;
}

/* ---- lock screen with the Face-ID-for-seriousness gag ---- */
function phoneLock(c, now, ar) {
  const ph = phoneState;
  const bg = c.createLinearGradient(0, 0, 0, PH_H);
  bg.addColorStop(0, '#121a26'); bg.addColorStop(0.55, '#0b1118'); bg.addColorStop(1, '#151d29');
  c.fillStyle = bg; c.fillRect(0, 0, PH_W, PH_H);
  c.fillStyle = 'rgba(122,166,214,0.05)';
  c.font = `400 430px ${BUBBLE}`;
  c.textAlign = 'center';
  c.fillText('b', PH_W / 2, 780);
  const d = new Date();
  if (ph.lockState === 'scan') {
    // scanning ring: rotating arc + dots + verdict
    const el = now - ph.scanAt;
    const ok = el > 700;
    c.strokeStyle = ok ? '#58ff8a' : '#8fb5e3';
    c.lineWidth = 7; c.lineCap = 'round';
    c.beginPath();
    if (ok) c.arc(PH_W / 2, 440, 96, 0, Math.PI * 2);
    else c.arc(PH_W / 2, 440, 96, now / 180, now / 180 + 4.2);
    c.stroke();
    if (ok) {
      c.beginPath();
      c.moveTo(PH_W / 2 - 40, 440); c.lineTo(PH_W / 2 - 10, 474); c.lineTo(PH_W / 2 + 46, 404);
      c.lineWidth = 11; c.stroke();
    } else {
      for (let i = 0; i < 5; i++) {
        c.fillStyle = `rgba(143,181,227,${(0.25 + 0.7 * Math.abs(Math.sin(now / 200 + i))).toFixed(2)})`;
        c.beginPath(); c.arc(PH_W / 2 - 44 + i * 22, 440, 5, 0, Math.PI * 2); c.fill();
      }
    }
    c.fillStyle = ok ? '#58ff8a' : '#8fb5e3';
    c.font = ar ? `700 25px ${AR_BODY}` : `600 20px ${MONO}`;
    c.fillText(i18n.t(ok ? 'phone.lock.ok' : 'phone.lock.scan'), PH_W / 2, 616);
    c.textAlign = 'left';
    if (el > 1250) {
      ph.lockState = 'open';
      ph.unlockAt = now;
      sound.chime();
    }
    return [];
  }
  // big clock + date
  const hh = String(d.getHours()).padStart(2, '0'), mm = String(d.getMinutes()).padStart(2, '0');
  c.fillStyle = '#eef4fb';
  c.font = `400 110px ${BUBBLE}`;
  c.fillText(`${hh}:${mm}`, PH_W / 2, 330);
  c.fillStyle = '#8fb5e3';
  let dateLine = '';
  try { dateLine = d.toLocaleDateString(ar ? 'ar' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' }); } catch {}
  c.font = ar ? `700 26px ${AR_BODY}` : `600 20px ${MONO}`;
  c.fillText(dateLine, PH_W / 2, 386);
  // one teasing notification card
  roundedPath(c, 40, 470, PH_W - 80, 96, 24);
  c.fillStyle = 'rgba(255,255,255,0.07)'; c.fill();
  c.strokeStyle = 'rgba(143,181,227,0.35)'; c.lineWidth = 2; c.stroke();
  c.fillStyle = '#ffd75e';
  c.font = `700 28px ${MONO}`;
  c.fillText('●', ar ? PH_W - 76 : 76, 528);
  c.fillStyle = '#f6f1e6';
  const nsub = i18n.t('phone.lock.sub');
  fitFont(c, nsub, PH_W - 190, ar ? 22 : 17, ar ? 700 : 600, ar ? AR_BODY : MONO, 12);
  c.textAlign = ar ? 'right' : 'left';
  c.fillText(nsub, ar ? PH_W - 108 : 108, 526);
  // pulsing unlock hint
  c.textAlign = 'center';
  c.globalAlpha = 0.55 + 0.4 * Math.sin(now / 320);
  c.fillStyle = '#58ff8a';
  c.font = ar ? `800 27px ${AR_BODY}` : `700 23px ${MONO}`;
  c.fillText(i18n.t('phone.lock.unlock'), PH_W / 2, 870);
  c.globalAlpha = 1;
  c.fillText('▲', PH_W / 2, 920);
  c.textAlign = 'left';
  return [{ x: 20, y: 80, w: PH_W - 40, h: 940, act: 'unlock', label: i18n.t('phone.lock.unlock') }];
}

/* ---- BENZ ARCADE: catch the golden floppies ---- */
const GAME_MS = 20000;
function phoneGame(c, now, ar) {
  const ph = phoneState;
  if (!ph.game) ph.game = { t0: now + 500, score: 0, items: [], nextAt: now + 900, over: false, seed: (now | 0) % 2147483 + 7 };
  const g = ph.game;
  const hots = [phoneAppHeader(c, 'phone.game.title', ar)];
  const played = now - g.t0;
  const left = Math.max(0, GAME_MS - played);
  if (g.over) {
    c.textAlign = 'center';
    c.fillStyle = '#8fb5e3';
    c.font = ar ? `700 24px ${AR_BODY}` : `600 19px ${MONO}`;
    c.fillText(i18n.t('phone.game.over'), PH_W / 2, 250);
    c.fillStyle = '#ffd75e';
    c.font = `400 96px ${BUBBLE}`;
    c.fillText(String(g.score), PH_W / 2, 380);
    c.fillStyle = '#eafff0';
    c.font = ar ? `700 26px ${AR_BODY}` : `600 20px ${MONO}`;
    c.fillText(i18n.t('phone.game.grade'), PH_W / 2, 450);
    c.fillStyle = 'rgba(234,255,240,0.6)';
    c.font = ar ? `600 22px ${AR_BODY}` : `500 17px ${MONO}`;
    c.fillText(`${i18n.t('phone.game.best')}: ${ph.gameBest}`, PH_W / 2, 500);
    // claim prize (real WhatsApp link) + play again
    roundedPath(c, 72, 590, PH_W - 144, 84, 42);
    const gg = c.createLinearGradient(72, 590, PH_W - 72, 674);
    gg.addColorStop(0, '#ffd75e'); gg.addColorStop(1, '#d9a441');
    c.fillStyle = gg; c.fill();
    c.fillStyle = '#241c10';
    c.font = ar ? `800 27px ${AR_BODY}` : `700 24px ${MONO}`;
    c.fillText(i18n.t('phone.game.claim'), PH_W / 2, 644);
    roundedPath(c, 132, 716, PH_W - 264, 72, 36);
    c.strokeStyle = '#58ff8a'; c.lineWidth = 3; c.stroke();
    c.fillStyle = '#baffd0';
    c.font = ar ? `700 24px ${AR_BODY}` : `600 20px ${MONO}`;
    c.fillText(i18n.t('phone.game.again'), PH_W / 2, 762);
    c.textAlign = 'left';
    hots.push({ x: 72, y: 578, w: PH_W - 144, h: 108, act: 'order', label: i18n.t('phone.game.claim'), link: true });
    hots.push({ x: 132, y: 704, w: PH_W - 264, h: 96, act: 'again', label: i18n.t('phone.game.again') });
    return hots;
  }
  // HUD
  c.textAlign = ar ? 'right' : 'left';
  c.fillStyle = '#8fb5e3';
  c.font = ar ? `700 21px ${AR_BODY}` : `600 17px ${MONO}`;
  c.fillText(i18n.t('phone.game.score'), ar ? PH_W - 48 : 48, 188);
  c.fillStyle = '#ffd75e';
  c.font = `700 40px ${MONO}`;
  c.fillText(String(g.score), ar ? PH_W - 48 : 48, 234);
  c.textAlign = ar ? 'left' : 'right';
  c.fillStyle = '#8fb5e3';
  c.font = ar ? `700 21px ${AR_BODY}` : `600 17px ${MONO}`;
  c.fillText(i18n.t('phone.game.time'), ar ? 48 : PH_W - 48, 188);
  c.fillStyle = '#eafff0';
  c.font = `700 40px ${MONO}`;
  c.fillText((left / 1000).toFixed(1), ar ? 48 : PH_W - 48, 234);
  c.textAlign = 'left';
  roundedPath(c, 48, 252, PH_W - 96, 10, 5);
  c.fillStyle = 'rgba(255,255,255,0.1)'; c.fill();
  roundedPath(c, 48, 252, Math.max(10, (PH_W - 96) * (left / GAME_MS)), 10, 5);
  c.fillStyle = left < 5000 ? '#ff6b5e' : '#58ff8a'; c.fill();
  if (played < 0) {
    c.textAlign = 'center';
    c.fillStyle = '#ffd75e';
    c.font = ar ? `800 34px ${AR_DISPLAY}` : `400 30px ${BUBBLE}`;
    c.fillText(i18n.t('phone.game.go'), PH_W / 2, 540);
    c.textAlign = 'left';
    return hots;
  }
  // spawn + fall
  const ramp = 1 + (played / GAME_MS) * 1.5;
  if (now >= g.nextAt && g.items.filter((i) => !i.hit).length < 3) {
    g.seed = (g.seed * 16807) % 2147483647;
    g.items.push({
      id: g.seed, x: 96 + (g.seed % 320), y: 300,
      v: (0.14 + ((g.seed >> 4) % 10) * 0.014) * ramp,
      rot: (g.seed % 628) / 100, hit: false,
    });
    g.nextAt = now + Math.max(380, 860 - played * 0.02);
  }
  const dt = Math.min(60, ph.lastNow ? now - ph.lastNow : 16);
  for (const it of g.items) if (!it.hit) { it.y += it.v * dt; it.rot += dt * 0.001; }
  g.items = g.items.filter((it) => !it.hit && it.y < 1000);
  for (const it of g.items) {
    c.save();
    c.translate(it.x, it.y);
    c.rotate(RM ? 0 : Math.sin(it.rot) * 0.3);
    roundedPath(c, -44, -44, 88, 88, 10);
    c.fillStyle = '#d4a017'; c.fill();
    c.fillStyle = '#c9c9c9'; c.fillRect(-20, -40, 40, 30);
    c.fillStyle = '#17130e'; c.fillRect(-6, -36, 12, 22);
    c.fillStyle = '#f3ead8'; c.fillRect(-32, 4, 64, 34);
    c.restore();
    hots.push({ x: it.x - 58, y: it.y - 58, w: 116, h: 116, act: 'fc' + it.id, label: 'floppy' });
  }
  if (left <= 0) {
    g.over = true;
    g.items = [];
    ph.gameBest = Math.max(ph.gameBest, g.score);
    sound.chime();
  }
  return hots;
}

/* screen router — lets transitions render any two screens into buffers */
function phoneScreenPaint(name, c, now, ar) {
  if (name === 'home') return phoneHome(c, now, ar);
  if (name === 'shop') return phoneShop(c, now, ar);
  if (name === 'bank') return phoneEats(c, now, ar);
  if (name === 'book') return phoneBook(c, now, ar);
  if (name === 'b-name') return phoneBuilderName(c, now, ar);
  if (name === 'b-type') return phoneBuilderType(c, now, ar);
  if (name === 'b-color') return phoneBuilderColor(c, now, ar);
  if (name === 'b-gen') return phoneBuilderGen(c, now, ar);
  if (name === 'myapp') return phoneMyApp(c, now, ar);
  if (name === 'game') return phoneGame(c, now, ar);
  return [];
}

function drawPhoneUI(t, now) {
  const c = phoneCtx, ar = i18n.lang === 'ar';
  const ph = phoneState;
  try { c.direction = ar ? 'rtl' : 'ltr'; } catch {}
  c.fillStyle = '#050607';
  c.fillRect(0, 0, PH_W, PH_H);
  c.save();
  roundedPath(c, 8, 8, PH_W - 16, PH_H - 16, PH_R);
  c.clip();
  const boot = ph.wakeAt ? clamp01((now - ph.wakeAt) / 1150) : 0;
  let hots = [];
  if (boot < 1) {
    drawPhoneBoot(c, boot, ar);
  } else if (ph.lockState !== 'open') {
    hots = phoneLock(c, now, ar);
  } else {
    // wallpaper — parallaxes gently with the handset tilt
    const bg = c.createLinearGradient(0, 0, 0, PH_H);
    bg.addColorStop(0, '#111823'); bg.addColorStop(0.5, '#0b1118'); bg.addColorStop(1, '#141b26');
    c.fillStyle = bg; c.fillRect(0, 0, PH_W, PH_H);
    c.fillStyle = 'rgba(122,166,214,0.05)';
    c.font = `400 430px ${BUBBLE}`;
    c.textAlign = 'center';
    c.fillText('b', PH_W / 2 - phTilt.x * 22, 760 - phTilt.y * 16);
    c.textAlign = 'left';
    if (ph.trans) {
      // iOS-style push: old screen eases out 30% and dims, new one slides in
      const e = smooth(0, 1, clamp01((now - ph.trans.at) / PH_TRANS_MS));
      ensurePhoneBufs();
      phBufACtx.clearRect(0, 0, PH_W, PH_H);
      phBufBCtx.clearRect(0, 0, PH_W, PH_H);
      try { phBufACtx.direction = c.direction; phBufBCtx.direction = c.direction; } catch {}
      phoneScreenPaint(ph.trans.from, phBufACtx, now, ar);
      phoneScreenPaint(ph.trans.to, phBufBCtx, now, ar);
      const d = (ar ? -1 : 1) * (ph.trans.dir < 0 ? -1 : 1);
      c.save();
      c.translate(-d * e * PH_W * 0.3, 0);
      c.drawImage(phBufA, 0, 0);
      c.restore();
      c.fillStyle = `rgba(0,0,0,${(0.4 * e).toFixed(2)})`;
      c.fillRect(0, 0, PH_W, PH_H);
      c.save();
      c.translate(d * (1 - e) * PH_W, 0);
      c.drawImage(phBufB, 0, 0);
      c.restore();
      if (now - ph.trans.at >= PH_TRANS_MS) { ph.app = ph.trans.to; ph.trans = null; }
    } else {
      hots = phoneScreenPaint(ph.app, c, now, ar);
    }
    // the unlock reveal: the lock screen lifts away like a curtain
    if (ph.unlockAt && now - ph.unlockAt < 420 && !RM) {
      const e = smooth(0, 1, (now - ph.unlockAt) / 420);
      ensurePhoneBufs();
      phBufACtx.clearRect(0, 0, PH_W, PH_H);
      const saved = ph.lockState;
      ph.lockState = 'locked';
      phoneLock(phBufACtx, now, ar);
      ph.lockState = saved;
      c.drawImage(phBufA, 0, -e * PH_H);
      hots = [];
    }
    phoneStatusBar(c, now, ar);
    // home indicator
    roundedPath(c, PH_W / 2 - 80, 1040, 160, 8, 4);
    c.fillStyle = 'rgba(246,241,230,0.28)'; c.fill();
  }
  // tap feedback: ripples, control flash, floppy bursts
  if (ph.fx.length || ph.flash) {
    ph.fx = ph.fx.filter((f) => now - f.at < 520);
    for (const f of ph.fx) {
      const a = (now - f.at) / (f.type === 'burst' ? 520 : 420);
      if (a >= 1) continue;
      if (f.type === 'burst') {
        for (let i = 0; i < 8; i++) {
          const ang = (i / 8) * Math.PI * 2;
          const r = 14 + a * 120;
          c.fillStyle = i % 2 ? `rgba(255,215,94,${(1 - a).toFixed(2)})` : `rgba(244,241,234,${(1 - a).toFixed(2)})`;
          c.fillRect(f.x + Math.cos(ang) * r - 5, f.y + Math.sin(ang) * r - 5, 10, 10);
        }
      } else {
        c.strokeStyle = `rgba(255,255,255,${(0.4 * (1 - a)).toFixed(2)})`;
        c.lineWidth = 3;
        c.beginPath(); c.arc(f.x, f.y, 22 + a * 130, 0, Math.PI * 2); c.stroke();
      }
    }
    if (ph.flash) {
      const a = (now - ph.flash.at) / 240;
      if (a >= 1) ph.flash = null;
      else {
        roundedPath(c, ph.flash.x, ph.flash.y, ph.flash.w, ph.flash.h, 20);
        c.fillStyle = `rgba(255,255,255,${(0.22 * (1 - a)).toFixed(2)})`;
        c.fill();
      }
    }
  }
  // punch-hole camera + glass sheen (sheen follows the tilt)
  c.beginPath(); c.arc(PH_W / 2, 40, 11, 0, Math.PI * 2);
  c.fillStyle = '#020304'; c.fill();
  c.strokeStyle = 'rgba(255,255,255,0.14)'; c.lineWidth = 2; c.stroke();
  const shx = phTilt.x * 160;
  const sheen = c.createLinearGradient(shx, 0, PH_W + shx, PH_H * 0.7);
  sheen.addColorStop(0, 'rgba(255,255,255,0.045)');
  sheen.addColorStop(0.4, 'rgba(255,255,255,0)');
  c.fillStyle = sheen;
  c.fillRect(0, 0, PH_W, PH_H);
  c.restore();
  ph.lastNow = now;
  phoneTex.needsUpdate = true;
  return hots;
}

/* ---- DOM hotspots that track the canvas-drawn buttons ---- */
const PH_POOL = [];
const phoneOrderEl = document.getElementById('phone-order');
const phoneCalEl = document.getElementById('phone-cal');
let phInput = null, phSlide = null, phGrid = null;

/* a REAL Google Calendar invite: we're on the guest list, so saving the
   event emails the invitation straight to the bureau */
function meetCalUrl() {
  const ph = phoneState;
  if (ph.meet.day <= 0 || ph.meet.slot < 0) return '#';
  const d = new Date();
  const [hh, mm] = MEET_SLOTS[ph.meet.slot].split(':').map(Number);
  const start = new Date(d.getFullYear(), d.getMonth(), ph.meet.day, hh, mm);
  const end = new Date(start.getTime() + 30 * 60000);
  const fmt = (t) => t.toISOString().replace(/[-:]|\.\d{3}/g, '');
  return 'https://calendar.google.com/calendar/render?action=TEMPLATE'
    + '&text=' + encodeURIComponent('BENZERSIZ® — Intro Meeting')
    + '&dates=' + fmt(start) + '/' + fmt(end)
    + '&add=' + encodeURIComponent('deals@benzersizz.com')
    + '&details=' + encodeURIComponent('Booked on benzersizz.com · WhatsApp +90 534 338 84 48');
}

/* the CTA link speaks for whatever the visitor is doing right now */
function phoneCtaLink() {
  const ph = phoneState;
  if (ph.app === 'book' && ph.meet.day > 0 && ph.meet.slot >= 0) {
    const d = new Date();
    const when = `${ph.meet.day}/${d.getMonth() + 1}/${d.getFullYear()} at ${MEET_SLOTS[ph.meet.slot]}`;
    return 'https://wa.me/905343388448?text=' + encodeURIComponent(`Hello BENZERSIZ — I'd like to book a meeting on ${when}.`);
  }
  if (ph.app === 'game' && ph.game && ph.game.over) {
    return 'https://wa.me/905343388448?text=' + encodeURIComponent(`Hello BENZERSIZ — I scored ${ph.game.score} in Floppy Catch. I believe I am owed an app.`);
  }
  return phoneWaLink();
}
if (phoneOrderEl) {
  phoneOrderEl.addEventListener('click', () => {
    const ph = phoneState;
    if (ph.app === 'book' && ph.meet.day > 0 && ph.meet.slot >= 0) {
      ph.meet.sent = true;
      sound.chime();
    }
  });
}

function ensurePhoneHots() {
  if (PH_POOL.length) return;
  for (let i = 0; i < 6; i++) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'ph-hot';
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      phoneTap(b.dataset.act || '', {
        x: +b.dataset.rx || 0, y: +b.dataset.ry || 0,
        w: +b.dataset.rw || 0, h: +b.dataset.rh || 0,
      });
    });
    document.body.appendChild(b);
    PH_POOL.push(b);
  }
}

/* the two REAL controls: a keyboard input on the name field,
   and a drag zone for slide-to-order */
function updateSlideP(e) {
  const r = phSlide.getBoundingClientRect();
  if (!r.width) return;
  let p = (e.clientX - r.left) / r.width;
  if (i18n.lang === 'ar') p = 1 - p;
  phoneState.slideP = clamp01(p);
}

function ensurePhoneExtras() {
  if (phInput) return;
  phInput = document.createElement('input');
  phInput.id = 'ph-input';
  phInput.type = 'text';
  phInput.maxLength = 18;
  phInput.autocomplete = 'off';
  phInput.autocapitalize = 'characters';
  phInput.setAttribute('aria-label', 'Business name');
  phInput.className = 'ph-hot';
  // invisible glass over the drawn field — 16px stops iOS zoom-on-focus
  phInput.style.cssText = 'opacity:0.02;font-size:16px;color:transparent;caret-color:transparent;background:transparent;border:0;outline:none;';
  phInput.dataset.mode = 'name';
  phInput.addEventListener('input', () => {
    if (phInput.dataset.mode === 'card') {
      const digits = phInput.value.replace(/\D/g, '').slice(0, 16);
      phInput.value = digits;
      phoneState.pay.num = digits;
    } else {
      phoneState.bizName = phInput.value.toUpperCase().slice(0, 18);
    }
    sound.key();
  });
  phInput.addEventListener('keydown', (e) => {
    e.stopPropagation();
    if (e.key === 'Enter') phoneTap(phInput.dataset.mode === 'card' ? 'dopay' : 'bnext');
  });
  document.body.appendChild(phInput);

  // the calendar grid — one glass pane, taps resolved to day cells
  phGrid = document.createElement('div');
  phGrid.id = 'ph-grid';
  phGrid.className = 'ph-hot';
  phGrid.setAttribute('role', 'grid');
  phGrid.setAttribute('aria-label', 'Calendar');
  phGrid.addEventListener('click', (e) => {
    e.stopPropagation();
    const r = phGrid.getBoundingClientRect();
    if (!r.width || !r.height) return;
    pickCalendarDay((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
  });
  document.body.appendChild(phGrid);

  phSlide = document.createElement('div');
  phSlide.id = 'ph-slide';
  phSlide.className = 'ph-hot';
  phSlide.style.touchAction = 'none';
  phSlide.setAttribute('role', 'button');
  phSlide.setAttribute('aria-label', 'Slide to order your app');
  phSlide.addEventListener('pointerdown', (e) => {
    if (phoneState.ordered) return;
    phoneState.slideActive = true;
    try { phSlide.setPointerCapture(e.pointerId); } catch {}
    if (lenis) lenis.stop();
    sound.unlock();
    updateSlideP(e);
    e.preventDefault();
  });
  phSlide.addEventListener('pointermove', (e) => {
    if (!phoneState.slideActive) return;
    updateSlideP(e);
    e.preventDefault();
  });
  const endSlide = () => {
    const ph = phoneState;
    if (!ph.slideActive) return;
    ph.slideActive = false;
    if (lenis) lenis.start();
    if (ph.slideP > 0.85) {
      ph.ordered = true;
      ph.orderedAt = performance.now();
      ph.slideP = 1;
      sound.chime();
      openWa(phoneWaLink());   // new tab — their built app stays on screen
    } else {
      ph.slideP = 0;   // spring home
    }
  };
  phSlide.addEventListener('pointerup', endSlide);
  phSlide.addEventListener('pointercancel', endSlide);
  document.body.appendChild(phSlide);
}

function phoneTap(act, rect) {
  const ph = phoneState;
  sound.unlock();
  ph.battery = Math.min(100, ph.battery + 1);
  ph.boltAt = performance.now();
  if (act !== 'unlock') ph.everTapped = true;
  // instant feedback: ripple from the tapped spot + a quick flash on the control
  if (rect && !RM) {
    ph.fx.push({ type: 'ripple', x: rect.x + rect.w / 2, y: rect.y + rect.h / 2, at: performance.now() });
    ph.flash = { ...rect, at: performance.now() };
  }
  if (act.startsWith('fc') && ph.game && !ph.game.over) {
    const id = +act.slice(2);
    const it = ph.game.items.find((i) => i.id === id && !i.hit);
    if (it) {
      it.hit = true;
      ph.game.score += 100;
      ph.fx.push({ type: 'burst', x: it.x, y: it.y, at: performance.now() });
      if (ph.game.score % 500 === 0) sound.chime(); else sound.key();
    }
    return;
  }
  switch (act) {
    case 'unlock':
      if (ph.lockState === 'locked') { ph.lockState = 'scan'; ph.scanAt = performance.now(); sound.key(); }
      break;
    case 'shop': case 'bank': case 'book':
      phoneGo(act); sound.flip(); break;
    case 'game':
      ph.game = null; phoneGo('game'); sound.flip(); break;
    case 'again':
      ph.game = null; sound.flip(); break;
    case 'yours':
      // the vacant icon starts the builder; once built it opens THEIR app
      if (ph.appBuilt) { phoneGo('myapp'); }
      else { phoneGo('b-name'); ensurePhoneExtras(); if (phInput) phInput.focus(); }
      sound.flip();
      break;
    case 'bnext':
      if (ph.bizName.trim().length >= 2) {
        phoneGo('b-type'); sound.flip();
        if (phInput) phInput.blur();
      }
      break;
    case 'btype0': case 'btype1': case 'btype2': case 'btype3':
      ph.bizType = +act[5];
      phoneGo('b-color'); sound.flip();
      break;
    case 'vibe0': case 'vibe1': case 'vibe2':
      ph.vibe = +act[4];
      ph.genAt = performance.now() + PH_TRANS_MS; ph.genDone = false;
      phoneGo('b-gen');
      sound.flip();
      break;
    case 'back':
      if (ph.checkoutAt) { ph.cart = 0; ph.added = {}; }
      ph.checkoutAt = 0;
      ph.pay.open = false; ph.pay.payAt = 0; ph.pay.adding = false;
      phoneGo('home', -1); sound.flip();
      if (phInput) phInput.blur();
      break;
    case 'notif':
      if (ph.notifKind === 2) { phoneGo('myapp'); ph.notifUsed2 = true; }
      else {
        ph.notifUsed1 = true;
        if (ph.appBuilt) phoneGo('myapp');
        else { phoneGo('b-name'); ensurePhoneExtras(); if (phInput) phInput.focus(); }
      }
      ph.notifOn = false; sound.flip();
      break;
    case 'buy0': case 'buy1': {
      const i = +act[3];
      if (!ph.added[i]) { ph.added[i] = true; ph.cart++; sound.key(); }
      break;
    }
    case 'checkout':
      if (ph.cart > 0 && !ph.checkoutAt) {
        ph.pay = { open: true, method: 0, adding: false, num: '', payAt: 0, done: '' };
        sound.flip();
      }
      break;
    case 'pclose':
      ph.pay.open = false; ph.pay.adding = false;
      if (phInput) phInput.blur();
      sound.flip();
      break;
    case 'method0': case 'method1':
      ph.pay.method = +act[6]; ph.pay.adding = false;
      if (phInput) phInput.blur();
      sound.key();
      break;
    case 'addcard':
      ph.pay.adding = true; ph.pay.num = '';
      ensurePhoneExtras();
      if (phInput) { phInput.dataset.mode = 'card'; phInput.value = ''; phInput.focus(); }
      sound.key();
      break;
    case 'dopay':
      if (!ph.pay.payAt && (!ph.pay.adding || ph.pay.num.length >= 12)) {
        ph.pay.payAt = performance.now();
        if (phInput) phInput.blur();
        sound.key();
      }
      break;
    case 'eat0': case 'eat1': case 'eat2': {
      const i = +act[3];
      ph.eats.counts[i] = Math.min(9, ph.eats.counts[i] + 1);
      sound.key();
      break;
    }
    case 'eorder':
      ph.eats.phase = 'track'; ph.eats.orderAt = performance.now(); sound.chime(); break;
    case 'eagain':
      ph.eats = { counts: [0, 0, 0], phase: 'menu', orderAt: 0 }; sound.flip(); break;
    case 'slot0': case 'slot1': case 'slot2':
      ph.meet.slot = +act[4]; ph.meet.sent = false; sound.chime(); break;
  }
}

const v3pa = new THREE.Vector3(), v3pb = new THREE.Vector3();
function placePhoneRect(el, bx, by, bw, bh) {
  const toWorld = (cx, cy, out) => {
    out.set((cx / PH_W - 0.5) * 0.5, (0.5 - cy / PH_H) * 1.055, 0.02);
    phoneScreen.localToWorld(out);
    out.project(camera);
  };
  toWorld(bx, by, v3pa);
  toWorld(bx + bw, by + bh, v3pb);
  const x1 = (v3pa.x * 0.5 + 0.5) * window.innerWidth, y1 = (-v3pa.y * 0.5 + 0.5) * window.innerHeight;
  const x2 = (v3pb.x * 0.5 + 0.5) * window.innerWidth, y2 = (-v3pb.y * 0.5 + 0.5) * window.innerHeight;
  el.style.display = 'block';
  el.style.left = `${(Math.min(x1, x2) - 6).toFixed(0)}px`;      // padded hit area
  el.style.top = `${(Math.min(y1, y2) - 6).toFixed(0)}px`;
  el.style.width = `${(Math.abs(x2 - x1) + 12).toFixed(0)}px`;
  el.style.height = `${(Math.abs(y2 - y1) + 12).toFixed(0)}px`;
}

function hidePhoneHots() {
  for (const b of PH_POOL) if (b.style.display !== 'none') b.style.display = 'none';
  if (phoneOrderEl && phoneOrderEl.style.display !== 'none') phoneOrderEl.style.display = 'none';
  if (phoneCalEl && phoneCalEl.style.display !== 'none') phoneCalEl.style.display = 'none';
  if (phInput && phInput.style.display !== 'none') {
    if (document.activeElement === phInput) phInput.blur();
    phInput.style.display = 'none';
  }
  if (phSlide && !phoneState.slideActive && phSlide.style.display !== 'none') phSlide.style.display = 'none';
  if (phGrid && phGrid.style.display !== 'none') phGrid.style.display = 'none';
}

/* ---- the DOM overlay for this section (driven manually — the
   legacy overlay engine is frozen during the plateau) ---- */
const ovPhone = document.getElementById('ov-phone');
function updatePhoneOverlay(pt) {
  if (!ovPhone) return;
  const o = smooth(0.04, 0.13, pt) * (1 - smooth(0.28, 0.4, pt));
  if (o <= 0.01) {
    if (ovPhone.style.visibility !== 'hidden') {
      ovPhone.style.visibility = 'hidden';
      ovPhone.style.opacity = '0';
      ovPhone.classList.remove('on');
    }
    return;
  }
  ovPhone.style.visibility = 'visible';
  ovPhone.style.opacity = o.toFixed(3);
  ovPhone.style.transform = `translateY(${((0.3 - pt) * 40).toFixed(1)}px)`;
  ovPhone.classList.toggle('on', o > 0.5);
}

/* camera weight for the phone detour */
const phoneCamW = (pt) => smooth(0.03, 0.17, pt) * (1 - smooth(0.9, 0.995, pt));

const v3pc = new THREE.Vector3(), v3pd = new THREE.Vector3();
function applyPhoneCamera(w, pt, t) {
  const portrait = camera.aspect < 0.8;
  const dz = portrait ? 2.15 : 1.72;
  const drift = RM ? 0 : Math.sin(t * 0.4) * 0.03;
  v3pc.set(
    PHONE_POS.x + 0.05 + drift,
    PHONE_HOVER_Y + 0.02 + (RM ? 0 : Math.sin(t * 0.55) * 0.012),
    PHONE_POS.z + 0.028 + dz - pt * 0.12
  );
  camera.position.lerp(v3pc, w);
  v3pd.set(PHONE_POS.x, PHONE_HOVER_Y + 0.01, PHONE_POS.z + 0.028);
  target.lerp(v3pd, w);
  camera.lookAt(target);
  camLight.position.set(camera.position.x + 0.5, camera.position.y + 1.4, camera.position.z - 1.0);
}

/* per-frame phone-scene update; returns true while the scene owns the stage */
function updatePhoneScene(pt, t, now) {
  if (!phoneGroup) return false;
  const on = pt > 0.005 && pt < 0.998;
  updatePhoneOverlay(pt);
  if (!on) {
    hidePhoneHots();
    if (phonePadLight) phonePadLight.intensity = 0;
    if (phoneGlow) phoneGlow.intensity = 0;
    if (phoneState.awake) { phoneState.awake = false; phoneState.wakeAt = 0; drawPhoneOff(); }
    return false;
  }
  const ph = phoneState;
  // lift off the pad, spin once, face the visitor
  const lift = smooth(0.045, 0.2, pt) * (1 - smooth(0.86, 0.975, pt));
  const bob = RM ? 0 : Math.sin(t * 1.3) * 0.008 * lift;
  const sway = RM ? 0 : Math.sin(t * 0.6) * 0.009 * lift;
  // the handset leans toward the cursor — it feels touchable before you touch it
  phTilt.x = lerp(phTilt.x, RM ? 0 : phPointer.x, 0.06);
  phTilt.y = lerp(phTilt.y, RM ? 0 : phPointer.y, 0.06);
  phoneGroup.position.y = lerp(PHONE_LIE_Y, PHONE_HOVER_Y, lift) + bob;
  phoneGroup.rotation.x = lerp(Math.PI / 2, 0, lift) - phTilt.y * 0.045 * lift;
  phoneGroup.rotation.y = (RM ? 0 : lerp(-Math.PI * 2, 0, lift)) + sway + phTilt.x * 0.085 * lift;
  // lights breathe with the levitation
  phonePadLight.intensity = lift * 5 + (RM ? 0 : Math.sin(t * 2.2) * 0.4 * lift);
  phonePadRing.material.opacity = 0.22 + lift * 0.3 + (RM ? 0 : Math.sin(t * 2.2) * 0.08 * lift);
  phoneGlow.intensity = lift * 2.4;
  // wake / sleep
  const shouldWake = pt > 0.15 && pt < 0.94;
  if (shouldWake && !ph.awake) { ph.awake = true; ph.wakeAt = now; sound.beep(); }
  if (!shouldWake && ph.awake) { ph.awake = false; ph.wakeAt = 0; drawPhoneOff(); }
  let hots = [];
  if (ph.awake) hots = drawPhoneUI(t, now);
  // interactive only while the camera is parked on it
  const w = phoneCamW(pt);
  if (ph.awake && w > 0.92 && started) {
    phoneScreen.updateWorldMatrix(true, false);
    ensurePhoneHots();
    ensurePhoneExtras();
    let bi = 0, linkRect = null, calRect = null;
    for (const h of hots) {
      if (h.link) { linkRect = h; continue; }
      if (h.cal) { calRect = h; continue; }
      const b = PH_POOL[bi++];
      if (!b) continue;
      b.dataset.act = h.act;
      b.dataset.rx = h.x; b.dataset.ry = h.y; b.dataset.rw = h.w; b.dataset.rh = h.h;
      b.setAttribute('aria-label', h.label || h.act);
      placePhoneRect(b, h.x, h.y, h.w, h.h);
    }
    for (; bi < PH_POOL.length; bi++) {
      if (PH_POOL[bi].style.display !== 'none') PH_POOL[bi].style.display = 'none';
    }
    if (linkRect && phoneOrderEl) placePhoneRect(phoneOrderEl, linkRect.x, linkRect.y, linkRect.w, linkRect.h);
    else if (phoneOrderEl && phoneOrderEl.style.display !== 'none') phoneOrderEl.style.display = 'none';
    if (calRect && phoneCalEl) {
      phoneCalEl.href = meetCalUrl();
      placePhoneRect(phoneCalEl, calRect.x, calRect.y, calRect.w, calRect.h);
    } else if (phoneCalEl && phoneCalEl.style.display !== 'none') phoneCalEl.style.display = 'none';
    // the REAL controls: keyboard input (name or card), calendar grid, slide zone
    const wantCard = ph.app === 'shop' && ph.pay.open && ph.pay.adding;
    const wantName = ph.app === 'b-name';
    if (wantCard || wantName) {
      const mode = wantCard ? 'card' : 'name';
      if (phInput.dataset.mode !== mode) {
        phInput.dataset.mode = mode;
        phInput.value = wantCard ? phoneState.pay.num : phoneState.bizName;
        phInput.setAttribute('inputmode', wantCard ? 'numeric' : 'text');
      }
      const f = wantCard ? PH_CARD_FIELD : PH_NAME_FIELD;
      placePhoneRect(phInput, f.x, f.y, f.w, f.h);
    } else if (phInput.style.display !== 'none') {
      if (document.activeElement === phInput) phInput.blur();
      phInput.style.display = 'none';
    }
    if (ph.app === 'book' && !ph.trans && phCalRect.w) {
      placePhoneRect(phGrid, phCalRect.x, phCalRect.y, phCalRect.w, phCalRect.h);
    } else if (phGrid.style.display !== 'none') {
      phGrid.style.display = 'none';
    }
    const sliderLive = ph.app === 'myapp' && !ph.ordered && now - ph.splashAt >= 1400;
    if (sliderLive) {
      placePhoneRect(phSlide, PH_SLIDE_RECT.x, PH_SLIDE_RECT.y, PH_SLIDE_RECT.w, PH_SLIDE_RECT.h);
    } else if (!ph.slideActive && phSlide.style.display !== 'none') {
      phSlide.style.display = 'none';
    }
    if (phoneOrderEl) phoneOrderEl.href = phoneCtaLink();
  } else {
    hidePhoneHots();
  }
  return pt > 0.06 && pt < 0.94;
}

/* ------------------------------------------------------------
   Camera choreography
   Path A: dolly toward the CRT, PIN there while PORTFOLIO.EXE
   scrolls inside the screen, then pull back and glitch out.
   Path B: the vertical descent down the corporate tower.
   ------------------------------------------------------------ */
const CAM_X = [[P_TELE, 69.65], [1.0, 69.65]];
const CAM_Y = [
  [P_TELE, 0.5], [0.60, 0.3],
  [0.655, -8.0], [0.715, -8.05],
  [0.748, -16.6], [0.80, -16.7],
  [0.828, -25.1], [0.885, -25.15],
  [0.925, -33.85], [1.0, -33.9],
];
const CAM_Z = [
  [P_TELE, 5.4], [0.655, 5.8], [0.73, 5.4],
  [0.755, 5.5], [0.80, 5.3], [0.845, 5.7], [0.915, 5.2], [1.0, 4.7],
];
const LOOK_Y = [
  [P_TELE, 0.4], [0.61, -6.0], [0.655, -8.3], [0.705, -8.3],
  [0.725, -13.5], [0.752, -16.7], [0.795, -16.6],
  [0.81, -22.0], [0.835, -25.1], [0.878, -25.2],
  [0.90, -31.0], [0.935, -34.0], [1.0, -34.05],
];

const target = new THREE.Vector3();

function updateCamera(p, t) {
  if (p < P_TELE) {
    // path A: dolly in, then hold pinned at the tube while the portfolio plays
    // (portrait phones pull back so the whole desk fits, not just the monitor)
    const zbA = camera.aspect < 0.8 ? 1.32 : 1.0;
    let z = kf(p, [
      [0, 7.2], [0.067, 3.6], [P_GLITCH_IN, 3.0], [P_PORT_A, 2.86],
      [P_PORT_B, 2.82], [0.566, 3.5], [P_TELE, 5.2],
    ]) * zbA;
    if (camera.aspect < 0.8) {
      // portrait: during the portfolio, sit at the distance where the tube fills
      // the phone HEIGHT — you are inside the screen (content lives in the column)
      const fillZ = 0.862 + 0.67 / Math.tan((camera.fov * Math.PI / 180) / 2);
      const inWin = smooth(0.05, P_GLITCH_IN, p) * (1 - smooth(P_PORT_B + 0.004, P_TELE, p));
      z = lerp(z, fillZ, inWin);
    }
    const y = kf(p, [[0, 1.0], [0.081, 0.6], [P_GLITCH_IN, 0.556], [P_TELE, 0.55]]);
    const ty = kf(p, [[0, 1.42], [0.081, 0.64], [P_GLITCH_IN, 0.556], [P_TELE, 0.55]]);
    // imperfect movement: the pin is never perfectly still
    const pinned = p > P_PORT_A && p < P_PORT_B ? 1 : 0;
    camera.position.set(
      Math.sin(t * 0.3) * 0.02 + pinned * Math.sin(t * 0.73) * 0.014,
      y + Math.sin(t * 0.5) * 0.012 + pinned * Math.sin(t * 1.1) * 0.006,
      z
    );
    target.set(pinned * Math.sin(t * 0.5) * 0.008, ty, 0.86);
  } else {
    // path B: the descent
    const zBoost = camera.aspect < 0.8 ? 1.5 : 1.0;
    const x = kf(p, CAM_X);
    const y = kf(p, CAM_Y);
    const z = kf(p, CAM_Z) * zBoost;
    camera.position.set(x, y + (RM ? 0 : Math.sin(t * 0.45) * 0.015), z);
    target.set(x + 1.35, kf(p, LOOK_Y), 0);
  }
  camera.lookAt(target);
  camLight.position.set(camera.position.x + 0.5, camera.position.y + 1.4, camera.position.z - 1.0);
}

/* post-processing presets over scroll */
const POST = {
  sepia: [[0, 0.16], [0.145, 0.26], [0.60, 0.34], [0.735, 0.44], [0.81, 0.2], [0.87, 0.1], [0.91, 0.2], [1, 0.22]],
  vig:   [[0, 0.34], [0.145, 0.4], [0.735, 0.5], [0.87, 0.46], [1, 0.38]],
  ca:    [[0, 1.3], [0.145, 0.8], [0.68, 1.0], [0.76, 1.5], [0.87, 1.7], [0.94, 0.9], [1, 0.9]],
  grain: [[0, 0.09], [0.145, 0.07], [0.745, 0.11], [0.87, 0.09], [1, 0.075]],
  scan:  [[0, 0.22], [0.14, 0.12], [0.68, 0.09], [0.87, 0.07], [0.95, 0.14], [1, 0.16]],
  bloom: [[0, 0.28], [0.145, 0.22], [0.68, 0.2], [0.80, 0.32], [0.855, 0.42], [0.93, 0.3], [1, 0.32]],
};

/* group visibility windows (perf: skip everything off-screen) */
const VIS = [
  ['hero', -0.01, 0.585],
  ['fax', 0.555, 0.755],
  ['shred', 0.66, 0.83],
  ['floppy', 0.755, 0.92],
  ['contact', 0.86, 1.01],
];

/* ------------------------------------------------------------
   Main loop
   ------------------------------------------------------------ */
let smoothP = 0, smoothPT = 0;
let snapLastY = 0, snapIdleAt = 0, snapDone = false;

function frame(now) {
  requestAnimationFrame(frame);
  const t = now * 0.001;
  if (lenis) lenis.raf(now);

  const p = scrollP();
  smoothP = RM ? p : lerp(smoothP, p, 0.12);
  const sp = Math.abs(smoothP - p) < 0.0004 ? p : smoothP;

  const ptRaw = phoneRaw();
  smoothPT = RM ? ptRaw : lerp(smoothPT, ptRaw, 0.12);
  const pt = Math.abs(smoothPT - ptRaw) < 0.0004 ? ptRaw : smoothPT;

  // record snapping — an idle scroll settles onto the nearest record,
  // so the VIEW LIVE button is always exactly where you left it
  if (lenis && !RM && started) {
    if (p > P_PORT_A + 0.004 && p < P_PORT_B - 0.004) {
      const y = window.scrollY;
      if (Math.abs(y - snapLastY) > 0.6) { snapLastY = y; snapIdleAt = now; snapDone = false; }
      else if (!snapDone && now - snapIdleAt > 330) {
        snapDone = true;
        const n = PROJECTS.length;
        const slide = Math.round(((p - P_PORT_A) / (P_PORT_B - P_PORT_A)) * n);
        const targetY = rawOf(P_PORT_A + (slide / n) * (P_PORT_B - P_PORT_A)) * maxScroll();
        if (Math.abs(targetY - y) > 6) lenis.scrollTo(targetY, { duration: 0.75, easing: (q) => 1 - Math.pow(1 - q, 3) });
      }
    } else {
      snapLastY = window.scrollY;
      snapIdleAt = now;
      snapDone = false;
    }
  }

  updateOverlays(sp);
  updateHUD(scrollRaw(), sp, pt > 0.06 && pt < 0.94);

  if (!renderer) return;

  // visibility windows
  for (const [name, a, b] of VIS) {
    const g = groups[name];
    if (g) g.visible = sp >= a && sp <= b;
  }

  updateCamera(sp, t);
  const camW = phoneCamW(pt);
  if (camW > 0.001) applyPhoneCamera(camW, pt, t);
  const phoneStage = updatePhoneScene(pt, t, now);

  // the CRT: terminal at rest, PORTFOLIO.EXE while pinned
  if (groups.hero.visible) {
    const portMode = sp >= P_GLITCH_IN && sp <= P_TELE && !phoneStage;
    if (portMode) {
      // the terminal-to-portfolio glitch and the exit glitch, confined to the tube
      const gIn = smooth(P_GLITCH_IN, P_PORT_A - 0.012, sp) * (1 - smooth(P_PORT_A - 0.010, P_PORT_A + 0.006, sp));
      const gOut = smooth(P_PORT_B + 0.002, P_TELE - 0.004, sp);
      let g = Math.max(gIn, gOut);
      // unstable signal: the intensity stutters and spikes rather than ramping smoothly
      if (g > 0.04 && !RM) g = clamp01(g * (0.7 + Math.random() * 0.55) + (Math.random() < 0.12 ? 0.3 : 0));
      drawPortfolio(t, sp, camera.aspect < 0.8, g);   // every frame — liquid scroll
      if (heroScreenGlow) heroScreenGlow.intensity = 7 + (RM ? 0 : Math.sin(t * 8) * 0.8);
    } else {
      if (screenLive) screenLive.style.display = 'none';
      if (screenSkip) screenSkip.style.display = 'none';
      if (heroScreenGlow) heroScreenGlow.intensity = 4;
      if (!phoneStage && now - lastTermDraw > 90) { lastTermDraw = now; drawTerminal(t); }
    }
  } else {
    if (screenLive && screenLive.style.display !== 'none') screenLive.style.display = 'none';
    if (screenSkip && screenSkip.style.display !== 'none') screenSkip.style.display = 'none';
  }

  // bureau backdrop: the fax prints its memo as you read
  if (groups.fax.visible) {
    const fp = smooth(0.577, 0.73, sp);
    faxPaper.scale.y = 0.06 + fp * 0.94;
    faxLed.scale.setScalar(1 + (RM ? 0 : Math.sin(t * 7) * 0.3));
    groups.fax.position.y = RM || fp <= 0.02 || fp >= 0.98 ? 0 : Math.sin(t * 26) * 0.0045;
  }
  if (dust && !RM) dust.rotation.y = Math.sin(t * 0.05) * 0.01;

  // shredder
  let shredNow = lastShred;
  if (groups.shred.visible) {
    const shred = smooth(0.742, 0.80, sp);
    shredNow = shred;
    const yc = SLOT_Y + 1.0 - shred * 2.1;
    sheetMesh.position.y = yc;
    sheetMesh.visible = yc + 1.0 > SLOT_Y;
    for (const s of stripMeshes) {
      const i = s.userData.i;
      s.position.y = yc;
      const fall = clamp01(shred * 1.6);
      s.rotation.z = RM ? 0 : Math.sin(t * 2.2 + i * 1.3) * 0.085 * fall;
      s.rotation.x = RM ? 0 : Math.sin(t * 1.7 + i * 2.1) * 0.06 * fall;
      s.position.x = SHRED_X - 0.75 + (i + 0.5) * (1.5 / 16) + Math.sin(i * 7.3) * 0.05 * fall;
      s.material.opacity = 1 - smooth(0.8, 1.0, shred);
    }
  }

  // floppy
  if (floppyGroup.visible) {
    const lp = smooth(0.795, 0.85, sp);
    floppyGroup.rotation.y = RM ? 0.4 : t * 0.55;
    floppyGroup.rotation.x = RM ? 0 : Math.sin(t * 0.7) * 0.1;
    floppyGroup.position.y = FLOPPY_Y + (RM ? 0 : Math.sin(t * 1.1) * 0.05);
    floppyGroup.scale.setScalar(0.6 + lp * 0.4);
    if (sparkles && !RM) sparkles.rotation.y = -t * 0.18;
    floppyLight.intensity = 2.5 + lp * 5 + (RM ? 0 : Math.sin(t * 3) * 0.8);
    sound.floppy(lp > 0.5);
  } else {
    sound.floppy(false);
  }

  // rotary dial: ambient dialing when idle, real dialing when the user grabs it
  let dialTick = false;
  if (groups.contact.visible) {
    // portrait phones: slide the whole basement left so the dial stays in frame
    groups.contact.position.x = (CENTER_X - CONTACT_X) + (camera.aspect < 0.8 ? -1.7 : 0);
    const userBusy = dialDrag.active || now < dialSeq.holdKicksUntil;
    if (!userBusy && t - lastDialKick > 3.4) {
      lastDialKick = t;
      dialTarget = (Math.random() * 1.6 - 0.3) * Math.PI;
    }
    if (!dialDrag.active) {
      const springK = 0.016, damp = 0.88;
      dialVel = (dialVel + (dialTarget - dialDisc.rotation.z) * springK) * damp;
      dialDisc.rotation.z += RM ? 0 : dialVel;
      dialAccum += Math.abs(dialVel);
      if (dialAccum > 0.4) { dialAccum = 0; dialTick = true; }
    }
    // the phone is grabbable: hotspot + readout
    if (dialHot) placeDialHot();
    if (now - lastReadDraw > 280) { lastReadDraw = now; drawDialReadout(t); }
  } else if (dialHot && dialHot.style.display !== 'none') {
    dialHot.style.display = 'none';
  }

  // post uniforms
  const u = grainPass.uniforms;
  u.uTime.value = t;
  u.uSepia.value = kf(sp, POST.sepia);
  u.uVig.value = kf(sp, POST.vig);
  u.uCA.value = kf(sp, POST.ca);
  u.uGrain.value = kf(sp, POST.grain) * (RM ? 0.4 : 1);
  u.uScan.value = kf(sp, POST.scan);
  bloomPass.strength = kf(sp, POST.bloom);

  // the glitch lives ON THE TUBE (drawn into the screen canvas, not the viewport);
  // the teleport is masked by a quick power-cut dip to black
  u.uStatic.value = 0;
  u.uFlash.value = Math.max(0, 1 - Math.abs(sp - P_TELE) * 90);

  // sound department
  sound.frame({
    statik: u.uStatic.value,
    shred: Math.abs(shredNow - lastShred) * 60,
    contact: sp > 0.91,
    dialTick,
  });
  lastShred = shredNow;

  composer.render();
}

function onResize() {
  const w = window.innerWidth, h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  composer.setSize(w, h);
  grainPass.uniforms.uRes.value.set(w, h);
}

/* ------------------------------------------------------------
   Bootstrap
   ------------------------------------------------------------ */
(async function bootstrap() {
  try {
    // canvas typography needs the real serif — wait for fonts (3s cap)
    await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 3000))]);
    await initGL();
    requestAnimationFrame(frame);
  } catch (err) {
    console.error('BENZERSIZ: WebGL init failed, falling back to document mode.', err);
    document.body.classList.add('no-webgl', 'live');
    assetsReady = true;
    bootDone = true;
    started = true;
    bootEl.classList.add('off');
    requestAnimationFrame(function fallbackLoop(now) {
      requestAnimationFrame(fallbackLoop);
      if (lenis) lenis.raf(now);
    });
  }
})();

/* test hook: deterministic scroll for screenshots */
window.__bz = {
  setP(p) {
    const y = rawOf(p) * maxScroll();
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
    window.scrollTo(0, y);
    smoothP = p;
    smoothPT = phoneRaw();
  },
  setPhone(pt) {
    const y = rawOfPhone(pt) * maxScroll();
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
    window.scrollTo(0, y);
    smoothP = P_PIN;
    smoothPT = pt;
  },
  tap: (act) => phoneTap(act),
  ph: phoneState,
  start,
};
