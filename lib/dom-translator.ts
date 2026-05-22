const CACHE_KEY = "axismed_translations";
const CONCURRENT = 6; // parallel requests to MyMemory

type Cache = Record<string, Record<string, string>>;

const nodeOriginals = new Map<Text, string>();

function loadCache(): Cache {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) ?? "{}"); }
  catch { return {}; }
}
function saveCache(cache: Cache) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch {}
}

const SKIP_TAGS = new Set([
  "SCRIPT", "STYLE", "CODE", "PRE", "INPUT", "TEXTAREA",
  "SELECT", "SVG", "CANVAS", "NOSCRIPT",
]);

function collectTextNodes(root: Element): Text[] {
  const result: Text[] = [];
  function walk(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = (node.textContent ?? "").trim();
      if (
        text.length >= 2 &&
        !/^[\d\s+\-.,%$€#@/:()[\]|•·*]+$/.test(text) &&
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

// MyMemory lang codes differ slightly from ISO
const LANG_CODE_MAP: Record<string, string> = {
  zh: "zh-CN",
  fa: "fa",
};
function toMyMemoryCode(lang: string) {
  return LANG_CODE_MAP[lang] ?? lang;
}

async function translateOne(text: string, targetLang: string): Promise<string> {
  const code = toMyMemoryCode(targetLang);
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${code}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      // MyMemory sometimes returns HTML entities like &amp; — decode them
      const txt = data.responseData.translatedText as string;
      return txt.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    }
  } catch {}
  return text;
}

async function translateBatch(
  texts: string[],
  targetLang: string,
  onProgress?: (n: number) => void
): Promise<string[]> {
  const results: string[] = [...texts];
  for (let i = 0; i < texts.length; i += CONCURRENT) {
    const slice = texts.slice(i, i + CONCURRENT);
    const settled = await Promise.allSettled(slice.map((t) => translateOne(t, targetLang)));
    settled.forEach((r, j) => {
      if (r.status === "fulfilled") results[i + j] = r.value;
    });
    onProgress?.(Math.round(((i + slice.length) / texts.length) * 90));
  }
  return results;
}

export async function translatePage(
  targetLang: string,
  _targetLangName: string,
  onProgress?: (pct: number) => void
): Promise<void> {
  const nodes = collectTextNodes(document.body);
  if (!nodes.length) return;

  // Store originals
  for (const node of nodes) {
    if (!nodeOriginals.has(node)) {
      nodeOriginals.set(node, node.textContent ?? "");
    }
  }

  // Find uncached unique strings
  const cache = loadCache();
  const langCache = cache[targetLang] ?? {};
  const uniqueSet = new Set<string>();
  for (const node of nodes) {
    const orig = (nodeOriginals.get(node) ?? "").trim();
    if (orig.length >= 2 && !langCache[orig]) uniqueSet.add(orig);
  }

  const toTranslate = Array.from(uniqueSet);
  if (toTranslate.length > 0) {
    const translated = await translateBatch(toTranslate, targetLang, onProgress);
    toTranslate.forEach((orig, i) => { langCache[orig] = translated[i] ?? orig; });
    cache[targetLang] = langCache;
    saveCache(cache);
  }

  // Apply to DOM
  for (const node of nodes) {
    const full = nodeOriginals.get(node) ?? "";
    const trimmed = full.trim();
    const translation = langCache[trimmed];
    if (translation && translation !== trimmed) {
      const leading  = full.match(/^\s*/)?.[0] ?? "";
      const trailing = full.match(/\s*$/)?.[0] ?? "";
      node.textContent = leading + translation + trailing;
    }
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
