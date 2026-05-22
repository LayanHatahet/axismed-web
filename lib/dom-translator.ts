const BATCH_SIZE = 50;
const CACHE_KEY = "axismed_translations";

type Cache = Record<string, Record<string, string>>;

// In-memory store for original text content — survives re-translations
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
  "SELECT", "SVG", "CANVAS", "NOSCRIPT", "BUTTON",
]);

function collectTextNodes(root: Element): Text[] {
  const result: Text[] = [];

  function walk(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = (node.textContent ?? "").trim();
      // Skip empty, pure numbers/symbols, URLs
      if (
        text.length >= 2 &&
        !/^[\d\s+\-.,%$€#@/:()[\]|•·]+$/.test(text) &&
        !/^https?:\/\//.test(text) &&
        !/^[+\d\s\-()]+$/.test(text) // phone numbers
      ) {
        result.push(node as Text);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      if (!SKIP_TAGS.has(el.tagName)) {
        for (const child of Array.from(node.childNodes)) {
          walk(child);
        }
      }
    }
  }

  walk(root);
  return result;
}

async function translateBatch(
  texts: string[],
  targetLang: string,
  targetLangName: string
): Promise<string[]> {
  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts, targetLang, targetLangName }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error ?? `HTTP ${res.status}`);
    }
    const data = await res.json();
    return data.translations ?? texts;
  } catch (err) {
    throw err;
  }
}

export async function translatePage(
  targetLang: string,
  targetLangName: string,
  onProgress?: (pct: number) => void
): Promise<void> {
  const nodes = collectTextNodes(document.body);
  if (!nodes.length) return;

  // Store originals before any translation (or restore from stored)
  for (const node of nodes) {
    if (!nodeOriginals.has(node)) {
      nodeOriginals.set(node, node.textContent ?? "");
    }
  }

  // Collect unique original strings needing translation
  const cache = loadCache();
  const langCache = cache[targetLang] ?? {};

  const uniqueSet = new Set<string>();
  for (const node of nodes) {
    const orig = (nodeOriginals.get(node) ?? "").trim();
    if (orig.length >= 2 && !langCache[orig]) {
      uniqueSet.add(orig);
    }
  }

  const toTranslate = Array.from(uniqueSet);

  // Batch translate
  if (toTranslate.length > 0) {
    const batches: string[][] = [];
    for (let i = 0; i < toTranslate.length; i += BATCH_SIZE) {
      batches.push(toTranslate.slice(i, i + BATCH_SIZE));
    }

    let done = 0;
    for (const batch of batches) {
      const translations = await translateBatch(batch, targetLang, targetLangName);
      batch.forEach((orig, i) => {
        langCache[orig] = translations[i] ?? orig;
      });
      done += batch.length;
      onProgress?.(Math.round((done / toTranslate.length) * 90));
    }

    cache[targetLang] = langCache;
    saveCache(cache);
  }

  // Apply translations to DOM text nodes
  for (const node of nodes) {
    const full = nodeOriginals.get(node) ?? "";
    const trimmed = full.trim();
    const translated = langCache[trimmed];
    if (translated && translated !== trimmed) {
      const leading  = full.match(/^\s*/)?.[0] ?? "";
      const trailing = full.match(/\s*$/)?.[0] ?? "";
      node.textContent = leading + translated + trailing;
    }
  }

  onProgress?.(100);
}

export function resetPage(): void {
  for (const [node, orig] of nodeOriginals) {
    if (node.isConnected) {
      node.textContent = orig;
    }
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
