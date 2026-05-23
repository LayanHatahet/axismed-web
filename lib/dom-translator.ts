const CACHE_KEY = "axismed_translations";
const CONCURRENT = 20;

// ─── Language code map ───────────────────────────────────────────
const GTRANS_CODE: Record<string, string> = { zh: "zh-CN" };
const gtCode = (lang: string) => GTRANS_CODE[lang] ?? lang;

// ─── UI override dictionaries (instant, no API needed) ──────────
const UI_OVERRIDES: Record<string, Record<string, string>> = {
  ar: {
    "Home":"الرئيسية","About":"من نحن","Courses":"الدورات","Events":"الفعاليات",
    "Media":"الإعلام","Partners":"الشركاء","Contact":"اتصل بنا",
    "Contact Us":"تواصل معنا","Search":"بحث","Menu":"القائمة",
    "Register":"سجّل","Login":"تسجيل الدخول","Featured":"مميز",
    "View Course":"عرض الدورة","View All Courses":"عرض جميع الدورات",
    "Find Your Pathway":"ابحث عن مسارك","Read More":"اقرأ المزيد",
    "Learn More":"اعرف المزيد","Get Started":"ابدأ الآن","Submit":"إرسال",
    "Back":"رجوع","Next":"التالي","Previous":"السابق","Close":"إغلاق",
    "Loading":"جاري التحميل","seats left":"مقاعد متبقية","total":"الإجمالي",
    "Become a Sponsor":"كن راعياً","View Our Partners":"عرض شركاؤنا",
    "Featured Programs":"البرامج المميزة","Upcoming":"القادمة",
    "Frequently Asked Questions":"الأسئلة الشائعة",
    "AxisMed in Numbers":"أكسيس ميد بالأرقام","Measured in Impact":"يُقاس بالتأثير",
    "Partner With AxisMed":"شراكة مع أكسيس ميد",
    "Reach the":"الوصول إلى","Courses & Events":"الدورات والفعاليات",
    "Why Choose AxisMed":"لماذا تختار أكسيس ميد",
  },
  fr: {
    "Home":"Accueil","About":"À propos","Courses":"Formations","Events":"Événements",
    "Media":"Médias","Partners":"Partenaires","Contact":"Contact",
    "Contact Us":"Contactez-nous","Search":"Rechercher","Register":"S'inscrire",
    "Login":"Connexion","Featured":"À la une","View Course":"Voir la formation",
    "View All Courses":"Voir toutes les formations",
    "Find Your Pathway":"Trouvez votre parcours","Read More":"Lire la suite",
    "Learn More":"En savoir plus","Get Started":"Commencer","Submit":"Envoyer",
    "Back":"Retour","Next":"Suivant","seats left":"places restantes","total":"total",
    "Become a Sponsor":"Devenir sponsor","Featured Programs":"Programmes vedettes",
    "Measured in Impact":"Mesuré en impact","AxisMed in Numbers":"AxisMed en chiffres",
  },
  es: {
    "Home":"Inicio","About":"Quiénes somos","Courses":"Cursos","Events":"Eventos",
    "Media":"Medios","Partners":"Socios","Contact":"Contacto",
    "Contact Us":"Contáctenos","Search":"Buscar","Register":"Registrarse",
    "Login":"Iniciar sesión","Featured":"Destacado","View Course":"Ver curso",
    "View All Courses":"Ver todos los cursos",
    "Find Your Pathway":"Encuentra tu camino","Read More":"Leer más",
    "Learn More":"Saber más","Get Started":"Comenzar","Submit":"Enviar",
    "Back":"Atrás","Next":"Siguiente","seats left":"plazas restantes","total":"total",
    "Become a Sponsor":"Ser patrocinador",
  },
  de: {
    "Home":"Startseite","About":"Über uns","Courses":"Kurse","Events":"Veranstaltungen",
    "Media":"Medien","Partners":"Partner","Contact":"Kontakt",
    "Contact Us":"Kontaktieren Sie uns","Search":"Suchen","Register":"Registrieren",
    "Login":"Anmelden","Featured":"Empfohlen","View Course":"Kurs ansehen",
    "View All Courses":"Alle Kurse ansehen",
    "Find Your Pathway":"Finden Sie Ihren Weg","Read More":"Mehr lesen",
    "Learn More":"Mehr erfahren","Get Started":"Loslegen","Submit":"Absenden",
    "Back":"Zurück","Next":"Weiter","seats left":"Plätze verfügbar","total":"gesamt",
    "Become a Sponsor":"Sponsor werden",
  },
  tr: {
    "Home":"Ana Sayfa","About":"Hakkımızda","Courses":"Kurslar","Events":"Etkinlikler",
    "Media":"Medya","Partners":"Ortaklar","Contact":"İletişim",
    "Contact Us":"Bize Ulaşın","Search":"Ara","Register":"Kayıt Ol",
    "Login":"Giriş Yap","Featured":"Öne Çıkan","View Course":"Kursu Görüntüle",
    "View All Courses":"Tüm Kursları Gör",
    "Find Your Pathway":"Yolunuzu Bulun","Read More":"Devamını Oku",
    "Learn More":"Daha Fazla Bilgi","Get Started":"Başlayın","Submit":"Gönder",
    "Back":"Geri","Next":"İleri","seats left":"kalan kontenjan","total":"toplam",
    "Become a Sponsor":"Sponsor Olun",
  },
  fa: {
    "Home":"صفحه اصلی","About":"درباره ما","Courses":"دوره‌ها","Events":"رویدادها",
    "Media":"رسانه","Partners":"شرکا","Contact":"تماس",
    "Contact Us":"تماس با ما","Search":"جستجو","Register":"ثبت‌نام",
    "Login":"ورود","Featured":"ویژه","View Course":"مشاهده دوره",
    "View All Courses":"مشاهده همه دوره‌ها",
    "Find Your Pathway":"مسیر خود را بیابید","Read More":"بیشتر بخوانید",
    "Learn More":"بیشتر بدانید","Get Started":"شروع کنید","Submit":"ارسال",
    "Back":"بازگشت","Next":"بعدی","seats left":"صندلی باقی‌مانده","total":"مجموع",
    "Become a Sponsor":"حامی شوید",
  },
  ru: {
    "Home":"Главная","About":"О нас","Courses":"Курсы","Events":"Мероприятия",
    "Media":"Медиа","Partners":"Партнёры","Contact":"Контакты",
    "Contact Us":"Связаться с нами","Search":"Поиск","Register":"Регистрация",
    "Login":"Войти","Featured":"Избранное","View Course":"Посмотреть курс",
    "View All Courses":"Все курсы",
    "Find Your Pathway":"Найдите свой путь","Read More":"Читать далее",
    "Learn More":"Узнать больше","Get Started":"Начать","Submit":"Отправить",
    "Back":"Назад","Next":"Далее","seats left":"мест осталось","total":"всего",
    "Become a Sponsor":"Стать спонсором",
  },
  zh: {
    "Home":"首页","About":"关于我们","Courses":"课程","Events":"活动",
    "Media":"媒体","Partners":"合作伙伴","Contact":"联系",
    "Contact Us":"联系我们","Search":"搜索","Register":"注册",
    "Login":"登录","Featured":"精选","View Course":"查看课程",
    "View All Courses":"查看所有课程",
    "Find Your Pathway":"找到您的学习路径","Read More":"阅读更多",
    "Learn More":"了解更多","Get Started":"立即开始","Submit":"提交",
    "Back":"返回","Next":"下一步","seats left":"剩余名额","total":"总计",
    "Become a Sponsor":"成为赞助商","Featured Programs":"精选项目",
    "Upcoming Courses & Events":"即将举办的课程与活动",
    "AxisMed in Numbers":"AxisMed数据","Measured in Impact":"以影响力衡量",
  },
  hi: {
    "Home":"मुख्य पृष्ठ","About":"हमारे बारे में","Courses":"पाठ्यक्रम",
    "Events":"कार्यक्रम","Media":"मीडिया","Partners":"भागीदार",
    "Contact":"संपर्क","Contact Us":"हमसे संपर्क करें","Search":"खोजें",
    "Register":"पंजीकरण","Login":"लॉग इन","Featured":"विशेष",
    "View Course":"पाठ्यक्रम देखें","View All Courses":"सभी पाठ्यक्रम देखें",
    "Find Your Pathway":"अपना रास्ता खोजें","Read More":"और पढ़ें",
    "Learn More":"अधिक जानें","Get Started":"शुरू करें","Submit":"जमा करें",
    "Back":"वापस","Next":"अगला","seats left":"सीटें शेष","total":"कुल",
    "Become a Sponsor":"प्रायोजक बनें",
  },
};

// ─── Types & state ───────────────────────────────────────────────
type Cache = Record<string, Record<string, string>>;

let activeLang = "en";
const nodeOriginals = new Map<Text, string>();
let mutationObserver: MutationObserver | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function loadCache(): Cache {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) ?? "{}"); } catch { return {}; }
}
function saveCache(c: Cache) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)); } catch {}
}

const SKIP_TAGS = new Set([
  "SCRIPT","STYLE","CODE","PRE","INPUT","TEXTAREA","SELECT","SVG","CANVAS","NOSCRIPT",
]);

function isTranslatable(text: string): boolean {
  const t = text.trim();
  return (
    t.length >= 2 &&
    !/^[\d\s+\-.,%$€#@/:()[\]|•·*→←↑↓⌘]+$/.test(t) &&
    !/^https?:\/\//.test(t) &&
    !/^[+\d\s\-()]{4,}$/.test(t)
  );
}

function collectTextNodes(root: Node): Text[] {
  const result: Text[] = [];
  function walk(n: Node) {
    if (n.nodeType === Node.TEXT_NODE) {
      if (isTranslatable(n.textContent ?? "")) result.push(n as Text);
    } else if (n.nodeType === Node.ELEMENT_NODE) {
      if (!SKIP_TAGS.has((n as Element).tagName)) {
        n.childNodes.forEach(walk);
      }
    }
  }
  walk(root);
  return result;
}

async function translateOne(text: string, lang: string): Promise<string> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${gtCode(lang)}&dt=t&q=${encodeURIComponent(text)}`;
    const r = await fetch(url);
    const d = await r.json();
    const out = d?.[0]?.map((c: [string]) => c?.[0] ?? "").join("") ?? text;
    return out || text;
  } catch { return text; }
}

function applyCache(nodes: Text[], langCache: Record<string, string>) {
  for (const node of nodes) {
    if (!node.isConnected) continue;
    const full = nodeOriginals.get(node) ?? node.textContent ?? "";
    const trimmed = full.trim();
    const trans = langCache[trimmed];
    if (trans && trans !== trimmed) {
      const lead = full.match(/^\s*/)?.[0] ?? "";
      const tail = full.match(/\s*$/)?.[0] ?? "";
      node.textContent = lead + trans + tail;
    }
  }
}

async function translateNodes(nodes: Text[], lang: string, onProgress?: (n: number) => void) {
  if (!nodes.length || lang === "en") return;

  // Store originals
  for (const node of nodes) {
    if (!nodeOriginals.has(node)) nodeOriginals.set(node, node.textContent ?? "");
  }

  const cache = loadCache();
  const langCache = cache[lang] ?? {};

  // Inject overrides
  const overrides = UI_OVERRIDES[lang] ?? {};
  for (const [k, v] of Object.entries(overrides)) {
    if (!langCache[k]) langCache[k] = v;
  }

  // Apply anything already cached/overridden immediately
  applyCache(nodes, langCache);

  // Collect what still needs translating
  const needed = new Set<string>();
  for (const node of nodes) {
    const orig = (nodeOriginals.get(node) ?? "").trim();
    if (orig.length >= 2 && !langCache[orig]) needed.add(orig);
  }

  if (needed.size > 0) {
    const list = Array.from(needed);
    let done = 0;
    for (let i = 0; i < list.length; i += CONCURRENT) {
      const batch = list.slice(i, i + CONCURRENT);
      const settled = await Promise.allSettled(batch.map(t => translateOne(t, lang)));
      settled.forEach((r, j) => {
        langCache[batch[j]] = r.status === "fulfilled" ? r.value : batch[j];
      });
      done += batch.length;
      onProgress?.(Math.round((done / list.length) * 95));
      applyCache(nodes, langCache); // apply each batch immediately
    }
    cache[lang] = langCache;
    saveCache(cache);
  }

  onProgress?.(100);
}

// ─── MutationObserver — watches for new/changed DOM content ──────
function startObserver() {
  if (mutationObserver) return;
  mutationObserver = new MutationObserver((mutations) => {
    if (activeLang === "en") return;

    const newNodes: Text[] = [];
    for (const m of mutations) {
      m.addedNodes.forEach((added) => {
        collectTextNodes(added).forEach((n) => {
          if (!nodeOriginals.has(n)) newNodes.push(n);
        });
      });
    }

    if (!newNodes.length) return;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => translateNodes(newNodes, activeLang), 200);
  });
  mutationObserver.observe(document.body, { childList: true, subtree: true });
}

function stopObserver() {
  mutationObserver?.disconnect();
  mutationObserver = null;
}

// ─── Public API ───────────────────────────────────────────────────
export async function translatePage(
  lang: string,
  langName: string,
  onProgress?: (pct: number) => void
): Promise<void> {
  activeLang = lang;
  const nodes = collectTextNodes(document.body);
  await translateNodes(nodes, lang, onProgress);
  startObserver(); // keep watching for new content
}

export function resetPage(): void {
  stopObserver();
  activeLang = "en";
  for (const [node, orig] of nodeOriginals) {
    if (node.isConnected) node.textContent = orig;
  }
  nodeOriginals.clear();
  document.documentElement.removeAttribute("dir");
  document.documentElement.setAttribute("lang", "en");
}

export function applyRTL(lang: string) {
  const rtl = new Set(["ar", "fa", "he", "ur"]);
  document.documentElement.setAttribute("lang", lang);
  if (rtl.has(lang)) {
    document.documentElement.setAttribute("dir", "rtl");
  } else {
    document.documentElement.removeAttribute("dir");
  }
}
