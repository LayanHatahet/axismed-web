const CACHE_KEY = "axismed_translations";
const CONCURRENT = 20;

// Google Translate lang code overrides (their codes differ from ISO in some cases)
const GTRANS_CODE: Record<string, string> = {
  zh: "zh-CN",
  fa: "fa",
};
function gtCode(lang: string) { return GTRANS_CODE[lang] ?? lang; }

// UI context overrides — terms that APIs mistranslate without context
const UI_OVERRIDES: Record<string, Record<string, string>> = {
  ar: {
    "Home": "الرئيسية", "About": "من نحن", "Courses": "الدورات",
    "Events": "الفعاليات", "Media": "الإعلام", "Partners": "الشركاء",
    "Contact": "اتصل بنا", "Contact Us": "تواصل معنا", "Search": "بحث",
    "Menu": "القائمة", "Register": "سجّل", "Login": "تسجيل الدخول",
    "Featured": "مميز", "View Course": "عرض الدورة",
    "View All Courses": "عرض جميع الدورات",
    "Find Your Pathway": "ابحث عن مسارك", "Read More": "اقرأ المزيد",
    "Learn More": "اعرف المزيد", "Get Started": "ابدأ الآن",
    "Submit": "إرسال", "Back": "رجوع", "Next": "التالي",
    "Previous": "السابق", "Close": "إغلاق", "Loading": "جاري التحميل",
    "seats left": "مقاعد متبقية", "total": "الإجمالي",
    "Become a Sponsor": "كن راعياً", "View Our Partners": "عرض شركاؤنا",
    "Featured Programs": "البرامج المميزة", "Upcoming": "القادمة",
    "Why Choose AxisMed": "لماذا تختار أكسيس ميد",
    "Frequently Asked Questions": "الأسئلة الشائعة",
    "AxisMed in Numbers": "أكسيس ميد بالأرقام",
    "Measured in Impact": "يُقاس بالتأثير",
  },
  fr: {
    "Home": "Accueil", "About": "À propos", "Courses": "Formations",
    "Events": "Événements", "Media": "Médias", "Partners": "Partenaires",
    "Contact": "Contact", "Contact Us": "Contactez-nous", "Search": "Rechercher",
    "Register": "S'inscrire", "Login": "Connexion", "Featured": "À la une",
    "View Course": "Voir la formation", "View All Courses": "Voir toutes les formations",
    "Find Your Pathway": "Trouvez votre parcours", "Read More": "Lire la suite",
    "Learn More": "En savoir plus", "Get Started": "Commencer",
    "Submit": "Envoyer", "Back": "Retour", "Next": "Suivant",
    "seats left": "places restantes", "total": "total",
    "Become a Sponsor": "Devenir sponsor", "Featured Programs": "Programmes vedettes",
  },
  es: {
    "Home": "Inicio", "About": "Quiénes somos", "Courses": "Cursos",
    "Events": "Eventos", "Media": "Medios", "Partners": "Socios",
    "Contact": "Contacto", "Contact Us": "Contáctenos", "Search": "Buscar",
    "Register": "Registrarse", "Login": "Iniciar sesión", "Featured": "Destacado",
    "View Course": "Ver curso", "View All Courses": "Ver todos los cursos",
    "Find Your Pathway": "Encuentra tu camino", "Read More": "Leer más",
    "Learn More": "Saber más", "Get Started": "Comenzar",
    "Submit": "Enviar", "Back": "Atrás", "Next": "Siguiente",
    "seats left": "plazas restantes", "total": "total",
    "Become a Sponsor": "Ser patrocinador",
  },
  de: {
    "Home": "Startseite", "About": "Über uns", "Courses": "Kurse",
    "Events": "Veranstaltungen", "Media": "Medien", "Partners": "Partner",
    "Contact": "Kontakt", "Contact Us": "Kontaktieren Sie uns", "Search": "Suchen",
    "Register": "Registrieren", "Login": "Anmelden", "Featured": "Empfohlen",
    "View Course": "Kurs ansehen", "View All Courses": "Alle Kurse ansehen",
    "Find Your Pathway": "Finden Sie Ihren Weg", "Read More": "Mehr lesen",
    "Learn More": "Mehr erfahren", "Get Started": "Loslegen",
    "Submit": "Absenden", "Back": "Zurück", "Next": "Weiter",
    "seats left": "Plätze verfügbar", "total": "gesamt",
    "Become a Sponsor": "Sponsor werden",
  },
  tr: {
    "Home": "Ana Sayfa", "About": "Hakkımızda", "Courses": "Kurslar",
    "Events": "Etkinlikler", "Media": "Medya", "Partners": "Ortaklar",
    "Contact": "İletişim", "Contact Us": "Bize Ulaşın", "Search": "Ara",
    "Register": "Kayıt Ol", "Login": "Giriş Yap", "Featured": "Öne Çıkan",
    "View Course": "Kursu Görüntüle", "View All Courses": "Tüm Kursları Gör",
    "Find Your Pathway": "Yolunuzu Bulun", "Read More": "Devamını Oku",
    "Learn More": "Daha Fazla Bilgi", "Get Started": "Başlayın",
    "Submit": "Gönder", "Back": "Geri", "Next": "İleri",
    "seats left": "kalan kontenjan", "total": "toplam",
    "Become a Sponsor": "Sponsor Olun",
  },
  fa: {
    "Home": "صفحه اصلی", "About": "درباره ما", "Courses": "دوره‌ها",
    "Events": "رویدادها", "Media": "رسانه", "Partners": "شرکا",
    "Contact": "تماس", "Contact Us": "تماس با ما", "Search": "جستجو",
    "Register": "ثبت‌نام", "Login": "ورود", "Featured": "ویژه",
    "View Course": "مشاهده دوره", "View All Courses": "مشاهده همه دوره‌ها",
    "Find Your Pathway": "مسیر خود را بیابید", "Read More": "بیشتر بخوانید",
    "Learn More": "بیشتر بدانید", "Get Started": "شروع کنید",
    "Submit": "ارسال", "Back": "بازگشت", "Next": "بعدی",
    "seats left": "صندلی باقی‌مانده", "total": "مجموع",
    "Become a Sponsor": "حامی شوید",
  },
  ru: {
    "Home": "Главная", "About": "О нас", "Courses": "Курсы",
    "Events": "Мероприятия", "Media": "Медиа", "Partners": "Партнёры",
    "Contact": "Контакты", "Contact Us": "Связаться с нами", "Search": "Поиск",
    "Register": "Регистрация", "Login": "Войти", "Featured": "Избранное",
    "View Course": "Посмотреть курс", "View All Courses": "Все курсы",
    "Find Your Pathway": "Найдите свой путь", "Read More": "Читать далее",
    "Learn More": "Узнать больше", "Get Started": "Начать",
    "Submit": "Отправить", "Back": "Назад", "Next": "Далее",
    "seats left": "мест осталось", "total": "всего",
    "Become a Sponsor": "Стать спонсором",
  },
  zh: {
    "Home": "首页", "About": "关于我们", "Courses": "课程",
    "Events": "活动", "Media": "媒体", "Partners": "合作伙伴",
    "Contact": "联系", "Contact Us": "联系我们", "Search": "搜索",
    "Register": "注册", "Login": "登录", "Featured": "精选",
    "View Course": "查看课程", "View All Courses": "查看所有课程",
    "Find Your Pathway": "找到您的学习路径", "Read More": "阅读更多",
    "Learn More": "了解更多", "Get Started": "立即开始",
    "Submit": "提交", "Back": "返回", "Next": "下一步",
    "seats left": "剩余名额", "total": "总计",
    "Become a Sponsor": "成为赞助商", "Featured Programs": "精选项目",
    "Upcoming Courses & Events": "即将举办的课程与活动",
  },
  hi: {
    "Home": "मुख्य पृष्ठ", "About": "हमारे बारे में", "Courses": "पाठ्यक्रम",
    "Events": "कार्यक्रम", "Media": "मीडिया", "Partners": "भागीदार",
    "Contact": "संपर्क", "Contact Us": "हमसे संपर्क करें", "Search": "खोजें",
    "Register": "पंजीकरण", "Login": "लॉग इन", "Featured": "विशेष रुप से प्रदर्शित",
    "View Course": "पाठ्यक्रम देखें", "View All Courses": "सभी पाठ्यक्रम देखें",
    "Find Your Pathway": "अपना रास्ता खोजें", "Read More": "और पढ़ें",
    "Learn More": "अधिक जानें", "Get Started": "शुरू करें",
    "Submit": "जमा करें", "Back": "वापस", "Next": "अगला",
    "seats left": "सीटें शेष", "total": "कुल",
    "Become a Sponsor": "प्रायोजक बनें",
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
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${gtCode(targetLang)}&dt=t&q=${encodeURIComponent(text)}`;
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
