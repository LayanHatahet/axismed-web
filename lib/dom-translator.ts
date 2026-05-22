const BATCH_SIZE = 50;
const CACHE_KEY = "axismed_translations";
const ORIG_ATTR = "data-orig";

type Cache = Record<string, Record<string, string>>; // lang -> { original -> translated }

function loadCache(): Cache {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function saveCache(cache: Cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

function getTextNodes(root: Element = document.body): Text[] {
  const nodes: Text[] = [];
  const skip = new Set(["SCRIPT", "STYLE", "CODE", "PRE", "INPUT", "TEXTAREA", "SELECT", "SVG", "CANVAS"]);

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (skip.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
      // Walk up to check ancestors
      let el: Element | null = parent;
      while (el) {
        if (skip.has(el.tagName)) return NodeFilter.FILTER_REJECT;
        el = el.parentElement;
      }
      const text = node.textContent?.trim() ?? "";
      if (text.length < 2) return NodeFilter.FILTER_SKIP;
      // Skip pure numbers / symbols / URLs
      if (/^[\d\s\+\-\.\,\%\$\€\#\@\/\:\(\)\[\]]+$/.test(text)) return NodeFilter.FILTER_SKIP;
      if (/^https?:\/\//.test(text)) return NodeFilter.FILTER_SKIP;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  let node: Node | null;
  while ((node = walker.nextNode())) nodes.push(node as Text);
  return nodes;
}

async function translateBatch(texts: string[], targetLang: string, targetLangName: string): Promise<string[]> {
  const res = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texts, targetLang, targetLangName }),
  });
  if (!res.ok) return texts;
  const data = await res.json();
  return data.translations ?? texts;
}

export async function translatePage(
  targetLang: string,
  targetLangName: string,
  onProgress?: (pct: number) => void
): Promise<void> {
  const nodes = getTextNodes();
  if (!nodes.length) return;

  const cache = loadCache();
  const langCache = cache[targetLang] ?? {};

  // Collect unique texts needing translation
  const uniqueUntranslated: string[] = [];
  const seen = new Set<string>();
  for (const node of nodes) {
    // Store original if not already stored
    if (!node.parentElement?.hasAttribute(ORIG_ATTR)) {
      node.parentElement?.setAttribute(ORIG_ATTR, node.textContent ?? "");
    }
    const orig = node.parentElement?.getAttribute(ORIG_ATTR) ?? node.textContent ?? "";
    if (!langCache[orig] && !seen.has(orig)) {
      uniqueUntranslated.push(orig);
      seen.add(orig);
    }
  }

  // Translate in batches
  if (uniqueUntranslated.length > 0) {
    const batches: string[][] = [];
    for (let i = 0; i < uniqueUntranslated.length; i += BATCH_SIZE) {
      batches.push(uniqueUntranslated.slice(i, i + BATCH_SIZE));
    }

    let done = 0;
    for (const batch of batches) {
      const translations = await translateBatch(batch, targetLang, targetLangName);
      batch.forEach((orig, i) => {
        langCache[orig] = translations[i] ?? orig;
      });
      done += batch.length;
      onProgress?.(Math.round((done / uniqueUntranslated.length) * 90));
    }

    cache[targetLang] = langCache;
    saveCache(cache);
  }

  // Apply translations to DOM
  for (const node of nodes) {
    const orig = node.parentElement?.getAttribute(ORIG_ATTR) ?? node.textContent ?? "";
    const translated = langCache[orig];
    if (translated && translated !== orig) {
      node.textContent = translated;
    }
  }

  onProgress?.(100);
}

export function resetPage(): void {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const el = node as Element;
    if (el.hasAttribute(ORIG_ATTR)) {
      // Find the text node child and restore
      for (const child of el.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
          child.textContent = el.getAttribute(ORIG_ATTR);
          break;
        }
      }
      el.removeAttribute(ORIG_ATTR);
    }
  }
  // Reset RTL
  document.documentElement.removeAttribute("dir");
  document.documentElement.removeAttribute("lang");
}

export function applyRTL(lang: string) {
  const rtlLangs = new Set(["ar", "fa", "he", "ur"]);
  if (rtlLangs.has(lang)) {
    document.documentElement.setAttribute("dir", "rtl");
    document.documentElement.setAttribute("lang", lang);
  } else {
    document.documentElement.removeAttribute("dir");
    document.documentElement.setAttribute("lang", lang);
  }
}
