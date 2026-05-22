const CACHE_KEY = "axismed_translations";
const CONCURRENT = 20;

// UI context overrides — single words that APIs mistranslate without context
const UI_OVERRIDES: Record<string, Record<string, string>> = {
  ar: {
    "Home":            "الرئيسية",
    "About":           "من نحن",
    "Courses":         "الدورات",
    "Events":          "الفعاليات",
    "Media":           "الإعلام",
    "Partners":        "الشركاء",
    "Contact":         "اتصل بنا",
    "Contact Us":      "تواصل معنا",
    "Search":          "بحث",
    "Menu":            "القائمة",
    "Register":        "سجّل",
    "Login":           "تسجيل الدخول",
    "Featured":        "مميز",
    "View Course":     "عرض الدورة",
    "View All Courses":"عرض جميع الدورات",
    "Find Your Pathway":"ابحث عن مسارك",
    "Read More":       "اقرأ المزيد",
    "Learn More":      "اعرف المزيد",
    "Get Started":     "ابدأ الآن",
    "Submit":          "إرسال",
    "Back":            "رجوع",
    "Next":            "التالي",
    "Previous":        "السابق",
    "Close":           "إغلاق",
    "Open":            "افتح",
    "Loading":         "جاري التحميل",
    "seats left":      "مقاعد متبقية",
    "total":           "الإجمالي",
  },
  fr: {
    "Home": "Accueil",
    "About": "À propos",
    "Contact Us": "Contactez-nous",
    "View Course": "Voir le cours",
    "Find Your Pathway": "Trouvez votre parcours",
    "Read More": "Lire la suite",
    "Featured": "À la une",
    "seats left": "places restantes",
    "total": "total",
  },
  es: {
    "Home": "Inicio",
    "About": "Acerca de",
    "Contact Us": "Contáctenos",
    "View Course": "Ver curso",
    "Find Your Pathway": "Encuentra tu camino",
    "Read More": "Leer más",
    "Featured": "Destacado",
    "seats left": "plazas restantes",
    "total": "total",
  },
};

type Cache = Record<string, Record<string, string>>;
const nodeOriginals = new Map<Text, string>();

function loadCache(): Cache {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) ?? "{}"); } catch { return {}; }
}
function saveCache(cache: Cache) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch {}
}

const SKIP_TAGS = new Set([
  "SCRIPT","STYLE","CODE","PRE","INPUT","TEXTAREA",
  "SELECT","SVG","CANVAS","NOSCRIPT",
]);

function collectTextNodes(root: Element): Text[] {
  const result: Text[] = [];
  function walk(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = (node.textContent ?? "").trim();
      if (
        text.length >= 2 &&
        !/^[\d\s+\-.,%$€#@/:()[\]|•·*→←↑↓]+$/.test(text) &&
        !/^https?:\/\//.test(text) &&
        !/^[+\d\s\-()]{4,}$/.test(text)
      ) {
        result.push(node as Text);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (!SKIP_TAGS.has((node as Element).tagName)) {
        for (const child of Array.from(node.childNodes)) walk(child);
      }
    }
  }
  walk(root);
  return result;
}

async function translateOne(text: string, targetLang: string): Promise<string> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const data = await res.json();
    // Response: [[[translated, original], ...], null, "en"]
    const translated: string = data?.[0]
      ?.map((chunk: [string]) => chunk?.[0] ?? "")
      .join("") ?? text;
    return translated || text;
  } catch {
    return text;
  }
}

function applyToDOM(nodes: Text[], langCache: Record<string, string>) {
  for (const node of nodes) {
    if (!node.isConnected) continue;
    const full     = nodeOriginals.get(node) ?? "";
    const trimmed  = full.trim();
    const translation = langCache[trimmed];
    if (translation && translation !== trimmed) {
      const leading  = full.match(/^\s*/)?.[0] ?? "";
      const trailing = full.match(/\s*$/)?.[0] ?? "";
      node.textContent = leading + translation + trailing;
    }
  }
}

export async function translatePage(
  targetLang: string,
  _targetLangName: string,
  onProgress?: (pct: number) => void
): Promise<void> {
  const nodes = collectTextNodes(document.body);
  if (!nodes.length) return;

  // Store originals (only on first translation)
  for (const node of nodes) {
    if (!nodeOriginals.has(node)) {
      nodeOriginals.set(node, node.textContent ?? "");
    }
  }

  const cache = loadCache();
  const langCache = cache[targetLang] ?? {};

  // Apply UI overrides first (instant, no API call needed)
  const overrides = UI_OVERRIDES[targetLang] ?? {};
  for (const [orig, translation] of Object.entries(overrides)) {
    if (!langCache[orig]) langCache[orig] = translation;
  }

  // Collect unique strings not yet cached
  const uniqueSet = new Set<string>();
  for (const node of nodes) {
    const orig = (nodeOriginals.get(node) ?? "").trim();
    if (orig.length >= 2 && !langCache[orig]) uniqueSet.add(orig);
  }

  const toTranslate = Array.from(uniqueSet);

  if (toTranslate.length > 0) {
    let done = 0;
    // Process in concurrent batches, apply progressively
    for (let i = 0; i < toTranslate.length; i += CONCURRENT) {
      const batch = toTranslate.slice(i, i + CONCURRENT);
      const settled = await Promise.allSettled(
        batch.map((t) => translateOne(t, targetLang))
      );
      settled.forEach((r, j) => {
        const orig = batch[j];
        langCache[orig] = r.status === "fulfilled" ? r.value : orig;
      });
      done += batch.length;
      onProgress?.(Math.round((done / toTranslate.length) * 95));
      // Apply each batch immediately so the page updates progressively
      applyToDOM(nodes, langCache);
    }
    cache[targetLang] = langCache;
    saveCache(cache);
  } else {
    // All cached — apply instantly
    applyToDOM(nodes, langCache);
  }

  onProgress?.(100);
}

export function resetPage(): void {
  for (const [node, orig] of nodeOriginals) {
    if (node.isConnected) node.textContent = orig;
  }
  nodeOriginals.clear();
  document.documentElement.removeAttribute("dir");
  document.documentElement.setAttribute("lang", "en");
}

export function applyRTL(lang: string) {
  const rtl = new Set(["ar", "fa", "he", "ur"]);
  if (rtl.has(lang)) {
    document.documentElement.setAttribute("dir", "rtl");
  } else {
    document.documentElement.removeAttribute("dir");
  }
  document.documentElement.setAttribute("lang", lang);
}
