// @framerSupportedLayoutWidth any
// @framerSupportedLayoutHeight any

import * as React from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"

const { useState, useEffect, useRef, useCallback } = React

// ─── Tokens ──────────────────────────────────────────────────────────────────
const CREAM = "#ece9e7"
const DEEP_PURPLE = "#201e4b"
const NAVY = "#201b4e"
const LIME = "#c6e1a5"
const PURPLE = "#712eac"
const BORDER = "#e5e7eb"
const MUTED = "#6b7280"
const LI_BLUE = "#0A66C2"
const FONT = "'Discovery Fs', 'Noto Sans Hebrew', sans-serif"
const SHADOW_LG = "0 20px 60px rgba(0,0,0,.13)"
const SHADOW_PURPLE = "0 8px 32px rgba(113,46,172,.25)"

function getLangToggleUrl(isHE: boolean): string {
  if (typeof window === "undefined") return isHE ? "https://www.octaloom.com/linkedin-growth-engine" : "https://www.octaloom.com/linkedin-growth-engine-he"
  const path = window.location.pathname
  if (isHE) {
    const enPath = path.replace(/-he$/, "") || "/"
    return "https://www.octaloom.com" + enPath
  } else {
    if (path === "/" || path === "") return "https://www.octaloom.com/"
    return "https://www.octaloom.com" + path.replace(/\/$/, "") + "-he"
  }
}

const langToggleStyle: React.CSSProperties = {
  fontSize: 12, fontWeight: 600, color: "#201e4b",
  background: "transparent", border: "1px solid rgba(32,30,75,0.22)",
  borderRadius: 100, padding: "5px 13px", cursor: "pointer",
  fontFamily: "'Discovery Fs', 'Noto Sans Hebrew', sans-serif", transition: "border-color 0.2s, color 0.2s", letterSpacing: "0.03em",
}

// ─── Global styles (Discovery Fs + keyframes, injected once) ─────────────────
function useGlobalStyles() {
  useEffect(() => {
    if (document.getElementById("lg-he-styles")) return
    const s = document.createElement("style")
    s.id = "lg-he-styles"
    s.textContent = `
      @font-face{font-family:'Discovery Fs';src:url('https://raw.githubusercontent.com/Hanita-y/octaloom-fonts/main/DiscoveryFs-Light.ttf') format('truetype');font-weight:300;font-style:normal;font-display:swap}
      @font-face{font-family:'Discovery Fs';src:url('https://raw.githubusercontent.com/Hanita-y/octaloom-fonts/main/DiscoveryFs-Medium.ttf') format('truetype');font-weight:500 600 700;font-style:normal;font-display:swap}
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Hebrew:wght@300;400;500;600;700&display=swap');
      @keyframes lg-he-grad{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
      @keyframes lg-he-float{0%,100%{transform:translateY(0) rotate(.5deg)}50%{transform:translateY(-14px) rotate(-.5deg)}}
      @keyframes lg-he-chart{to{stroke-dashoffset:0}}
      @keyframes lg-he-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}
      .lg-he-grad-border{background:linear-gradient(135deg,#712eac,#c6e1a5,#4e1c80);background-size:300% 300%;animation:lg-he-grad 5s ease infinite;padding:1.5px;border-radius:20px;height:100%}
      .lg-he-float{animation:lg-he-float 4.5s ease-in-out infinite}
      .lg-he-chart-line{stroke-dasharray:600;stroke-dashoffset:600;animation:lg-he-chart 2.2s .5s ease-out forwards}
      .lg-he-pulse-dot{width:7px;height:7px;background:#22c55e;border-radius:50%;animation:lg-he-pulse 2s ease-in-out infinite;display:inline-block}
      *,*::before,*::after{box-sizing:border-box}
      html{scroll-behavior:smooth}
      a{text-decoration:none;color:inherit}
      button{border:none;background:none;cursor:pointer;font:inherit}
      img{display:block;max-width:100%}
    `
    document.head.appendChild(s)
  }, [])
}

// ─── Hooks ───────────────────────────────────────────────────────────────────
function useWindowWidth() {
  const [w, setW] = useState(() => typeof window !== "undefined" ? window.innerWidth : 1440)
  useEffect(() => {
    const fn = () => setW(window.innerWidth)
    window.addEventListener("resize", fn, { passive: true })
    return () => window.removeEventListener("resize", fn)
  }, [])
  return w
}

// ─── Content (all Hebrew as Unicode escapes for Framer editor safety) ─────────

// הפכו את לינקדאין = הפכו את לינקדאין
// למנוע הצמיחה = למנוע הצמיחה
// של העסק שלכם = של העסק שלכם

const hero = {
  label: "מנוע צמיחה בלינקדאין",
  h1a: "הפכו את לינקדאין",
  h1b: "למנוע הצמיחה #1",
  h1c: "של העסק שלכם.",
  sub: "רוב בעלי העסקים והמייסדים בישראל יודעים שלינקדאין חשוב, הם פשוט לא יודעים מה לעשות עם זה. הפרופיל עומד, ומדי פעם אתם מפרסמים איזה פוסט שבמקרה הטוב מקבל 12 לייקים מכמה קולגות ואז אתם שוב נעלמים מהפיד. בינתיים, המתחרים שלכם מייצרים לידים מהלינקדאין כל שבוע.",
  cta1: "בואו נדבר",
  cta2: "מצאו את התוכנית שלכם",
  availability: "זמינות מוגבלת החודש",
  trusted: "Trusted by founders & executives across industries",
  analyticsTitle: "ביצועי תוכן",
  analyticsNum: "1,515,967",
  analyticsSub: "חשיפות",
  analyticsGrowth: "▲ 83.5% לעומת 365 הימים הקודמים",
}

const entityText = "כאן OctaLoom נכנסת לתמונה. אני עוזרת למייסדים וארגונים להשתלט על הפיד ולהפוך את לינקדאין לערוץ לידים עקבי. כ-FCMO, אני משלבת אסטרטגיה, תוכן ואוטומציה למערכת שיווק אחת חכמה. השורה התחתונה? אתם מקבלים את כל היכולות של מחלקת שיווק מקצועית, בלי המורכבות של ניהול מחלקה כזו."

const whyLiData = {
  h2: "למה בכלל לינקדאין?",
  p1: "רוב אנשים שומעים ניהול לינקדאין חושבים שמישהו מפרסם בשמם. זה לא זה. ניהול לינקדאין אמיתי היא מערכת שלמה: אסטרטגיית תוכן שמבוססת על מה שקהל היעד שלך באמת מחפש, כתיבה שמשקפת את הקול שלך או של הארגון, מעורבות אקטיבית עם אנשים רלוונטיים, ניתוח נתונים שמראה מה עובד ומה בזבוז זמן, ובנייה של מערכת צמיחה שמייצרת לידים בצורה עקבית.",
  p2: "ניהול לינקדאין אמיתי היא מערכת שלמה: אסטרטגיית תוכן שמבוססת על מה שקהל היעד שלך באמת מחפש, כתיבה שמשקפת את הקול שלך או של הארגון, מעורבות אקטיבית עם אנשים רלוונטיים, ניתוח נתונים שמראה מה עובד ומה בזבוז זמן, ובנייה של מערכת צמיחה שמייצרת לידים בצורה עקבית.",
  pullQuote: "למה דווקא לינקדאין? כי שם נמצאים מקבלי ההחלטות בעולמות ה-B2B. מייסד שמחפש ספק, מנהלת HR שמחפשת פתרון הדרכה, סמנכ״ל טכנולוגיה שקורא על טרנדים חדשים, כולם בלינקדאין. השאלה היא אם הם רואים אותך שם.",
}

const insightsData = [
  {
    num: "5",
    unit: "רכיבים",
    body: "אסטרטגיה, תוכן, מעורבות, ניתוח ומערכת לידים. כולם ביחד. זה ניהול.",
  },
  {
    num: "#1",
    unit: "ל-B2B",
    body: "מייסדים, מנהלי HR, סמנכ״לי טכנולוגיה. כולם שם. השאלה אם הם רואים אותך.",
  },
  {
    num: "∞",
    unit: "מצטבר",
    body: "כל פוסט, חיבור ותגובה בונים נכס. בניגוד לפרסום שנעצר ברגע שנעצרים.",
  },
]

const pathsData = {
  h2: "למי זה מתאים?",
  sub: "שלושה פרופילים. לכל אחד מסלול משלו.",
  cards: [
    {
      title: "ארגונים וחברות",
      tag: "הכי פופולרי",
      desc: "יש לכם פרופיל ארגוני אבל הוא מרגיש קצת כמו בית קברות. כל עובד עם פרופיל לינקדאין חזק הוא שגריר של המותג.\n\nאני עובדת עם ארגונים על הפעלת נוכחות הצוות בלינקדאין: סדנאות, תוכניות שגרירים, הדרכות אישיות ואסטרטגיה שמתחברת ליעדי החברה.",
      cta: "התוכנית לארגונים",
      href: "https://www.octaloom.com/linkedin-for-organizations-he",
    },
    {
      title: "מייסדים ומנכ״לים",
      tag: "",
      desc: "אתם יודעים שאתם צריכים להיות נוכחים בלינקדאין. אבל בין ישיבות דירקטוריון, גיוס, פיתוח מוצר וכיבוי שריפות יומיומיות, לינקדאין תמיד נדחק לשוליים.\n\nאני בונה למייסדים מערכת ניהול לינקדאין שלמה. אתם נותנים 20% (הקול וההכוונה), אני עושה את ה-80% שנשארו.",
      cta: "איך זה עובד למייסדים",
      href: "https://www.octaloom.com/linkedin-for-executives-he",
    },
    {
      title: "עצמאים ויועצים",
      tag: "",
      desc: "הפרופיל שלך נראה כמו קורות חיים מ-2019. לקוחות פוטנציאליים נכנסים, רואים כותרת גנרית ואין פוסט אחד שמראה שאתם יודעים מה אתם עושים, אז הם עוברים הלאה.\n\nאני בונה לעצמאים פרופיל שעובד בשבילם 24/7: כותרת שמדברת לקהל הנכון, תוכן שמשדר סמכות, ומערכת שמייצרת פניות נכנסות.",
      cta: "המסלול לעצמאים",
      href: "https://www.octaloom.com/linkedin-for-solopreneurs-he",
    },
  ],
}

const whyOctaloomData = {
  h2: "למה דווקא OctaLoom?",
  items: [
    {
      title: "One Woman Show",
      desc: "בניגוד לסוכנויות שיווק בוטיקיות אחרות, כשנעבוד יחד, אתם מקבלים אדם אחד. אני זו שמקשיבה, אני זו שעושה, ולרוב מספקת יותר ממה שסיכמנו. הצוות שלי מורכב ממני והסוכנים שבניתי. האסטרטגיה עלי, והביצוע מתחלק ביני לבין הסוכנים.",
    },
    {
      title: "Vibe Marketing: שיווק בעולם החדש",
      desc: "אני עובדת בשיטת וויב מרקטינג. זאת ההבנה של אילו כלים וסוכני AI יש לייצר או להשתמש בקיימים כדי לייעל את העבודה השיווקית, בלי ויתור על חשיבה אסטרטגית. בפועל, זה אומר שאני מספקת את מה שצוות של 5 אנשים היה מספק.",
    },
    {
      title: "LinkedIn-First: הזירה העסקית הכי גדולה ב-B2B",
      desc: "לינקדאין היא לא עוד פלטפורמה שמוסיפים לקמפיין. היא המרכז. פה מקבלי ההחלטות ב-B2B נמצאים, פה עסקאות מתחילות, ופה הנוכחות שלך הכי משנה. כשלינקדאין עובד, כל השיווק עובד טוב יותר.",
    },
  ],
}

const resultsData = {
  h2: "תוצאות אמיתיות שהגענו אליהן:",
  sub: "כל מספר כאן נעשה בצורה אורגנית!",
  items: [
    { num: "770K+", label: "חשיפות אורגניות על פני חשבונות לינקדאין של לקוחות. בלי שהושקע שקל על פרסום." },
    { num: "300%", label: "עלייה של 300% במעורבות בפרופיל האישי של מייסד חברת B2B SaaS ישראלית." },
    { num: "70%", label: "פחות עבודה ידנית אחרי בניית סיסטמים, כלי בינה מלאכותית ואוטומציות בהתאמה." },
    { num: "~5,000", label: "עוקבים עסקיים, צמיחה אורגנית מלאה בעבודה על עמוד מנכ\"ל וארגון יחד." },
  ],
}

const testiData = [
  {
    quote: "במהלך החודשים האחרונים עבדתי ישירות מול חניתה בכל הקשור לייעוץ שיווקי, בדגש על עולם ה-B2B ועל פעילות בפלטפורמת לינקדאין. הליווי המקצועי שהובילה היה יסודי, מעמיק ומובנה, וכלל מחקר מקדים רחב. התוצר השיווקי תרם משמעותית לפעילות הגלובלית של החברה.",
    author: "יורם אביגד",
    role: "מנכ״ל תוצרת הנגב",
    photo: "https://media.licdn.com/dms/image/v2/D4D03AQHezDhkinQQ7w/profile-displayphoto-crop_800_800/B4DZmfi1smJIAI-/0/1759318336588?e=1778716800&v=beta&t=J3V6XKgwzycKBElKvGWreV7CDrxOlrVpUrY6AnodTL0",
    linkedin: "https://www.linkedin.com/in/yoram-avigad/",
  },
  {
    quote: "חניתה היא אחת ממנהלות השיווק הכי טובות שיצא לי לעבוד איתן. היא אלופה במדיה חברתית ולא רק, יודעת להוביל מיתוג מקצה לקצה, ליזום ולהוביל אינסוף פעילויות שיווקיות.",
    author: "אופק רון",
    role: "מנכ״ל Oshi",
    photo: "https://media.licdn.com/dms/image/v2/D4D03AQHwEBxDsl4bYg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1687115988653?e=1778716800&v=beta&t=jr3BDDcDpmEuTA2I7h1UbTTD6HCq1vH6LeGyUfjvWl8",
    linkedin: undefined,
  },
  {
    quote: "מהרגע שחניתה נכנסה, השיווק הפסיק להיות משימה מעיקה והפך למנוע צמיחה. יש אסטרטגיה ברורה, יש אוטומציה שעובדת, ויש תוצאות שאפשר למדוד לאורך זמן.",
    author: "שימי דביר",
    role: "מנכ״ל AcademAi",
    photo: "https://media.licdn.com/dms/image/v2/D4E03AQGG_Gz5id7LSA/profile-displayphoto-shrink_800_800/B4EZc2WTEpHYAo-/0/1748963505021?e=1779926400&v=beta&t=PQUyGTGJMTNiggZzvXD3FZAIIQGyLb-wLL3siZsBVKw",
    linkedin: undefined,
  },
]

const aboutData = {
  h2: "קצת עליי",
  text: [
    "אני חניתה (יודובסקי, אבל כמו מדונה השם הפרטי שלי מספיק \u{1F605}), סמנכ״לית שיווק במיקור חוץ ובגדול, מחלקת שיווק שלמה, רק בלי המחלקה.",
    "כבר 5+ שנים אני בונה מערכות שיווק B2B לחברות ישראליות, ובשלוש השנים האחרונות עמוק בתוך מה ש-AI משנה בשיווק. רוב הלקוחות שלי הם מייסדים שיודעים שהם צריכים שיווק, אבל לא רוצים (או לא יכולים) לגייס צוות שלם.",
    "בנוסף אני מנחה את הפודקאסט ״מה הסיפור עם?״ שבו אני מפרקת את מה שבאמת עובד בשיווק B2B. בלי כל התיאוריות היבשות, רק מה עובד, מה לא, ולמה.",
  ],
  li: "בואו נתחבר בלינקדאין",
  podcast: "לפודקאסט ״מה הסיפור עם?״",
}

const faqItems = [
  {
    q: "מה זה ניהול לינקדאין ולמה עסקים צריכים את זה?",
    a: "ניהול לינקדאין זה הרבה מעבר לפרסום פוסטים. זו מערכת שלמה שכוללת אסטרטגיית תוכן, כתיבה, מעורבות עם קהל יעד, ניתוח ביצועים ובניית מנגנון ליצירת לידים. אם העסק שלך הוא B2B, לינקדאין היא הפלטפורמה האידיאלית עבורך כי מקבלי ההחלטות נמצאים בה.",
  },
  {
    q: "מה ההבדל בין מומחה לינקדאין לסוכנות שיווק דיגיטלי?",
    a: "סוכנויות שיווק דיגיטלי מתייחסות ללינקדאין כעוד פלטפורמה ברשימה. פרילנסרים לעתים מבצעים בלי אסטרטגיה רחבה. מי שמומחה לינקדאין ייעודי מכיר את הייחודיות של הפלטפורמה לעומק ומשלב את זה עם חשיבה שיווקית רחבה. ב-OctaLoom, לינקדאין הוא המרכז, לא תוספת.",
  },
  {
    q: "למי השירות מתאים?",
    a: "שלושה פרופילים עיקריים: מייסדים ומנכ״לים שרוצים לבנות נוכחות ומובילות מחשבתית בלינקדאין, עצמאים ויועצים שצריכים פרופיל שמייצר פניות נכנסות, וארגונים שרוצים להפעיל את הנוכחות של העמוד הארגוני והצוות שלהם.",
  },
  {
    q: "תוך כמה זמן רואים תוצאות?",
    a: "בגדול: אחרי חודש מרגישים את ההבדל במעורבות. אחרי 3 חודשים הלידים מתחילים להגיע. אחרי 6 חודשים אפשר למדוד pipeline אמיתי. לינקדאין הוא מנוע שהולך ומתחזק עם הזמן.",
  },
  {
    q: "אפשר להעביר את הלינקדאין שלי לניהול מלא, או שאני צריך להיות מעורב?",
    a: "מתחילים ביחס של 80-20: אני עושה 80%, והחלק שלך הוא 20% (הקול שלך, אישורים, ורגעים של מעורבות שרק אתה יכול לעשות). עם הזמן, ככל שהמערכת לומדת את הקול שלך, המעורבות שלך יורדת ל-10%, לפעמים אפילו 5%.",
  },
  {
    q: "מה הופך את OctaLoom לשונה מסוכנות שיווק רגילה?",
    a: "מחלקת השיווק שלך, בלי המחלקה. אדם אחד שמספק אסטרטגיה, תוכן, אוטומציה וביצוע בקצב של צוות שלם. בלי מנהלי לקוח, בלי בריפים שלוקחים שלושה שבועות. מי שבונה את האסטרטגיה היא גם מי שכותבת את הפוסט ומנתחת את הנתונים.",
  },
]

const ctaData = {
  h2: "מוכנים להפוך את לינקדאין למנוע צמיחה?",
  sub: "אפשר להמשיך לחשוב על זה, ואפשר פשוט לדבר. שיחת היכרות קצרה, בלי התחייבות. אני עובדת רק עם מי שאני באמת יכולה לעזור להם.",
  cta1: "בואו נדבר",
  cta2: "מצאו את התוכנית",
  note: "עדיין לא בטוחים מה מתאים? חזרו למסלולים למעלה.",
  cmoLink: "צריכים יותר מלינקדאין? שירותי סמנכ״לית שיווק במיקור חוץ",
}

const qzQuestions = [
  {
    q: "מה מתאר אותך באופן הטוב ביותר?",
    opts: ["מייסד / מנכ״ל", "עצמאי / יועץ", "ארגון / צוות"],
  },
  {
    q: "מה המטרה העיקרית שלך בלינקדאין?",
    opts: ["יצירת לידים ולקוחות", "בניית מובילות מחשבתית", "חשיפות ומודעות למותג"],
  },
  {
    q: "כמה אתם פעילים בלינקדאין היום?",
    opts: ["בכלל לא פעילים", "מפרסמים מדי פעם", "פעילים אבל בלי תוצאות"],
  },
]

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const LI_PATH = "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"

function LiIcon({ size = 16, color = LI_BLUE }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d={LI_PATH}/></svg>
}

const ArrowLeft = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M13 8H3M7 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ChevronDown = ({ open }: { open: boolean }) => (
  <svg width={11} height={11} viewBox="0 0 12 12" fill="none"
    style={{ transition: "transform 0.25s", transform: open ? "rotate(180deg)" : "none" }}>
    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// ─── Utility Components ──────────────────────────────────────────────────────

type RevealVariant = "up" | "left" | "right" | "blur" | "scale"

function Reveal({ children, delay = 0, variant = "up", style = {}, className = "" }: {
  children: React.ReactNode; delay?: number; variant?: RevealVariant; style?: React.CSSProperties; className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" })
  const variants: Record<RevealVariant, { hidden: object; visible: object }> = {
    up: { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: 24 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: -24 }, visible: { opacity: 1, x: 0 } },
    blur: { hidden: { opacity: 0, filter: "blur(6px)" }, visible: { opacity: 1, filter: "blur(0px)" } },
    scale: { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1 } },
  }
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? "visible" : "hidden"}
      variants={variants[variant]} transition={{ duration: 0.6, delay: delay / 1000, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={style} className={className}>
      {children}
    </motion.div>
  )
}

function GradientBorderCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="lg-he-grad-border">
      <div style={{ background: "#fff", borderRadius: 19, padding: 26, height: "100%" }}>{children}</div>
    </div>
  )
}

function AnimatedNum({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [display, setDisplay] = useState("0")
  useEffect(() => {
    if (!inView) return
    const num = parseFloat(value.replace(/[^0-9.]/g, "")) || 0
    const hasPlus = value.includes("+"), hasTilde = value.includes("~"),
          hasPercent = value.includes("%"), hasK = /K/i.test(value), hasComma = value.includes(",")
    const dur = 1500, t0 = Date.now()
    const tick = () => {
      const p = Math.min((Date.now() - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3)
      const cur = Math.round(num * e)
      setDisplay((hasTilde ? "~" : "") + (hasComma ? cur.toLocaleString() : String(cur)) + (hasK ? "K" : "") + (hasPercent ? "%" : "") + (hasPlus ? "+" : ""))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView])
  return <span ref={ref}>{display}</span>
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ onQuiz }: { onQuiz: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [linkedinOpen, setLinkedinOpen] = useState(false)
  const [linkedinExpanded, setLinkedinExpanded] = useState(false)
  const w = useWindowWidth()
  const isMobile = w < 768

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = (isMobile && menuOpen) ? "hidden" : ""
    if (!menuOpen) setLinkedinExpanded(false)
    return () => { document.body.style.overflow = "" }
  }, [menuOpen, isMobile])

  const navStyle: React.CSSProperties = {
    position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 1000,
    width: "calc(100% - 48px)", maxWidth: 1152, borderRadius: 100,
    background: scrolled ? "rgba(236,233,231,0.88)" : "rgba(236,233,231,0.6)",
    backdropFilter: "blur(50px)", WebkitBackdropFilter: "blur(50px)",
    border: "1px solid rgba(32,30,75,0.08)", padding: "10px 20px",
    display: "flex", alignItems: "center", justifyContent: "space-between", direction: "rtl",
    flexDirection: isMobile ? "row-reverse" : undefined,
    fontFamily: FONT, transition: "background 0.3s, box-shadow 0.3s",
    boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.08)" : "none",
  }

  const linkStyle: React.CSSProperties = { fontSize: 14, color: "rgba(32,30,75,0.55)", textDecoration: "none", transition: "color 0.25s", fontFamily: FONT }
  const dropBase: React.CSSProperties = { position: "absolute", background: "#fff", borderRadius: 12, padding: "8px 6px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", border: `1px solid ${BORDER}`, minWidth: 170, zIndex: 50, direction: "rtl" }
  const dropItemStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", fontSize: 13, color: DEEP_PURPLE, borderRadius: 8, transition: "background 0.15s", textDecoration: "none" }
  const linkedinSub = [
    { label: "LinkedIn לארגונים", href: "https://www.octaloom.com/linkedin-for-organizations-he" },
    { label: "LinkedIn למייסדים ומנכ״לים", href: "https://www.octaloom.com/linkedin-for-executives-he" },
    { label: "LinkedIn לעצמאים", href: "https://www.octaloom.com/linkedin-for-solopreneurs-he" },
  ]
  const otherSub = [
    { label: "CMO במיקור חוץ", href: "https://www.octaloom.com/fractional-cmo-he" },
    { label: "כלי AI וסוכנים", href: "https://www.octaloom.com/ai-tools-agents-he" },
    { label: "סדנאות", href: "https://www.octaloom.com/workshops-he" },
  ]
  const navLinks = [
    { label: "אודות", href: "https://www.octaloom.com/about-he" },
    { label: "בלוג", href: "https://www.octaloom.com/blog-he" },
    { label: "צרו קשר", href: "https://www.octaloom.com/contact-he" },
    { label: "Goodies", href: "https://octagoodies.com" },
  ]

  return (
    <nav style={navStyle}>
      <a href="https://www.octaloom.com/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
        <img src="https://raw.githubusercontent.com/Hanita-y/Octaloom-images-and-videos/main/logo%20nav%20bar.png"
          alt="OctaLoom" style={{ height: 36, width: "auto", display: "block" }}
          onError={e => { (e.target as HTMLImageElement).style.display = "none" }}/>
      </a>
      {!isMobile && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 28, direction: "rtl" }}>
          {/* Services dropdown */}
          <div style={{ position: "relative" }}
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => { setServicesOpen(false); setLinkedinOpen(false) }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14,
              color: servicesOpen ? DEEP_PURPLE : "rgba(32,30,75,0.55)",
              display: "flex", alignItems: "center", gap: 5, padding: "6px 0", transition: "color 0.25s", fontFamily: FONT }}>
              שירותים<ChevronDown open={servicesOpen}/>
            </button>
            {servicesOpen && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, height: 12, zIndex: 199 }} />
            )}
            <AnimatePresence>
              {servicesOpen && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  style={{ ...dropBase, top: "calc(100% + 10px)", right: 0 }}>
                  {/* LinkedIn with nested sub-menu */}
                  <div style={{ position: "relative" }}
                    onMouseEnter={() => setLinkedinOpen(true)}
                    onMouseLeave={() => setLinkedinOpen(false)}>
                    <a href="https://www.octaloom.com/linkedin-growth-engine-he" style={{ ...dropItemStyle, flexDirection: "row-reverse" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(113,46,172,0.05)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <span>מנוע צמיחה LinkedIn</span>
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.45, transform: "scaleX(-1)" }}>
                        <path d="M4 2l4 4-4 4" stroke={DEEP_PURPLE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                    {linkedinOpen && (
                      <div style={{ position: "absolute", top: 0, bottom: 0, right: "100%", width: 8, zIndex: 199 }} />
                    )}
                    <AnimatePresence>
                      {linkedinOpen && (
                        <motion.div initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }}
                          style={{ ...dropBase, top: 0, right: "calc(100% + 6px)" }}>
                          {linkedinSub.map((sub, i) => (
                            <a key={i} href={sub.href} style={{ ...dropItemStyle }}
                              onMouseEnter={e => (e.currentTarget.style.background = "rgba(113,46,172,0.05)")}
                              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                              {sub.label}
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {otherSub.map((svc, i) => (
                    <a key={i} href={svc.href} style={{ ...dropItemStyle }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(113,46,172,0.05)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      {svc.label}
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {navLinks.map((item, i) => (
            <a key={i} href={item.href} style={linkStyle}
              onMouseEnter={e => (e.currentTarget.style.color = DEEP_PURPLE)}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(32,30,75,0.55)")}>
              {item.label}
            </a>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: 8, alignItems: "center", direction: "ltr" }}>
        {!isMobile && (
          <>
            <a href={getLangToggleUrl(true)} style={langToggleStyle}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#712eac"; (e.currentTarget as HTMLAnchorElement).style.color = "#712eac" }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(32,30,75,0.22)"; (e.currentTarget as HTMLAnchorElement).style.color = "#201e4b" }}>
              EN
            </a>
            <button onClick={() => window.dispatchEvent(new CustomEvent("open-discovery"))}
              style={{ padding: "8px 20px", borderRadius: 100, background: PURPLE, color: "#fff", fontSize: 13, fontWeight: 600, fontFamily: FONT, textDecoration: "none", border: "none", cursor: "pointer" }}>
              בואו נדבר
            </button>
          </>
        )}
        {isMobile && (
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="תפריט"
            style={{ background: "none", border: "none", cursor: "pointer", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ position: "relative", display: "block", width: 28, height: 20 }}>
              {[0, 9, 18].map((top, i) => (
                <span key={i} style={{ position: "absolute", left: 0, width: "100%", height: 2,
                  background: DEEP_PURPLE, borderRadius: 2, top,
                  transform: menuOpen && i===0 ? "rotate(45deg) translateY(9px)" : menuOpen && i===1 ? "scaleX(0)" : menuOpen && i===2 ? "rotate(-45deg) translateY(-9px)" : "none",
                  opacity: menuOpen && i===1 ? 0 : 1, transition: "all 0.3s" }}/>
              ))}
            </span>
          </button>
        )}
      </div>
      {isMobile && menuOpen && (
        <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, left: 0, background: "#fff", borderRadius: 16, padding: "20px 32px 32px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", direction: "rtl", zIndex: 50, maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: PURPLE, margin: "0 0 4px", fontFamily: FONT }}>שירותים</p>
          <button
            onClick={() => setLinkedinExpanded(prev => !prev)}
            style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between",
              fontSize: 20, color: DEEP_PURPLE, padding: "11px 0", fontWeight: 600,
              borderBottom: "1px solid rgba(113,46,172,0.08)", fontFamily: FONT,
              background: "none", border: "none", cursor: "pointer", textAlign: "right" as const }}
          >
            {"מנוע צמיחה LinkedIn"}
            <svg width={11} height={11} viewBox="0 0 12 12" fill="none"
              style={{ transition: "transform 0.25s", transform: linkedinExpanded ? "rotate(180deg)" : "none", flexShrink: 0 }}>
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <AnimatePresence>
            {linkedinExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{ overflow: "hidden" }}
              >
                {linkedinSub.map((sub, i) => (
                  <a key={i} href={sub.href} onClick={() => setMenuOpen(false)}
                    style={{ display: "block", fontSize: 15, color: PURPLE, textDecoration: "none", padding: "7px 0 7px 20px", borderBottom: "1px solid rgba(113,46,172,0.05)", fontFamily: FONT }}>
                    {sub.label}
                  </a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          {otherSub.map((svc, i) => (
            <a key={i} href={svc.href} onClick={() => setMenuOpen(false)}
              style={{ display: "block", fontSize: 20, color: DEEP_PURPLE, textDecoration: "none", padding: "11px 0", fontWeight: 600, borderBottom: `1px solid rgba(113,46,172,0.08)`, fontFamily: FONT }}>
              {svc.label}
            </a>
          ))}
          {navLinks.map((item, i) => (
            <a key={i} href={item.href} onClick={() => setMenuOpen(false)}
              style={{ display: "block", fontSize: 20, color: DEEP_PURPLE, textDecoration: "none", padding: "11px 0", fontWeight: 500, borderBottom: i < navLinks.length - 1 ? `1px solid rgba(113,46,172,0.08)` : "none", fontFamily: FONT }}>
              {item.label}
            </a>
          ))}
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            <button onClick={() => window.dispatchEvent(new CustomEvent("open-discovery"))}
              style={{ display: "block", textAlign: "center", padding: "14px 24px", fontSize: 15, fontWeight: 600, background: PURPLE, color: "#fff", borderRadius: 100, textDecoration: "none", fontFamily: FONT, border: "none", cursor: "pointer", width: "100%" }}>
              בואו נדבר חינם
            </button>
            <a href={getLangToggleUrl(true)}
              style={{ display: "block", textAlign: "center", padding: "11px 24px", fontSize: 13, fontWeight: 600, color: "#201e4b", borderRadius: 100, fontFamily: "'Discovery Fs', 'Noto Sans Hebrew', sans-serif", border: "1px solid rgba(32,30,75,0.2)", textDecoration: "none", width: "100%", boxSizing: "border-box" as const }}>
              Switch to English →
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function HeroSection({ onQuiz }: { onQuiz: () => void }) {
  const w = useWindowWidth()
  const isMobile = w < 768
  const trustFiles = ["avatar1..jpeg", "avatar2.jpeg", "avatar3.jpeg", "avatar4.jpeg", "avatar5.jpeg"]
  const FALLBACK_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 34 34'%3E%3Ccircle cx='17' cy='17' r='17' fill='%23712eac'/%3E%3C/svg%3E"

  return (
    <section id="hero" style={{ background: CREAM, paddingTop: isMobile ? 110 : 136, paddingBottom: isMobile ? 56 : 80, fontFamily: FONT }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 28 : 56, alignItems: "center", direction: "rtl" }}>
          {/* Text column */}
          <div>
            <Reveal>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 600, color: LI_BLUE, marginBottom: 20, padding: "6px 14px", background: "rgba(10,102,194,.08)", borderRadius: 100, border: "1px solid rgba(10,102,194,.14)" }}>
                <LiIcon size={14}/>{hero.label}
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 style={{ fontSize: isMobile ? "clamp(28px,8vw,48px)" : "clamp(30px,4vw,56px)", fontWeight: 700, lineHeight: 1.15, color: DEEP_PURPLE, marginBottom: 22, textAlign: "right" }}>
                {hero.h1a}<br/>{hero.h1b}<br/>{hero.h1c}
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: MUTED, marginBottom: 32, maxWidth: 520, textAlign: "right" }}>{hero.sub}</p>
            </Reveal>
            <Reveal delay={240}>
              <div style={{ display: "flex", gap: 11, flexWrap: "wrap", marginBottom: 18, flexDirection: "row", justifyContent: "flex-start", direction: "rtl" }}>
                <button onClick={() => window.dispatchEvent(new CustomEvent("open-discovery"))}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 26px", borderRadius: 100, background: PURPLE, color: "#fff", fontSize: 15, fontWeight: 600, boxShadow: SHADOW_PURPLE, fontFamily: FONT, border: "none", cursor: "pointer" }}>
                  {hero.cta1}<ArrowLeft size={15}/>
                </button>
                <button onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 26px", borderRadius: 100, background: "transparent", color: DEEP_PURPLE, border: `1.5px solid ${DEEP_PURPLE}`, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>
                  {hero.cta2}
                </button>
              </div>
              <div style={{ marginTop: 12 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, color: MUTED, flexDirection: "row-reverse" }}>
                  {hero.availability}<span className="lg-he-pulse-dot"/>
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 18, flexDirection: "row" }}>
                <div style={{ display: "flex", alignItems: "center", flexDirection: "row-reverse" }}>
                  {trustFiles.map((f, i) => {
                    const alts = [
                      "תמונת לקוח של OctaLoom — מייסד B2B",
                      "תמונת לקוח של OctaLoom — מנכ״ל סטארטאפ",
                      "תמונת לקוחה של OctaLoom — סמנכ״לית שיווק",
                      "תמונת לקוח של OctaLoom — יזם בלינקדאין",
                      "תמונת לקוחה של OctaLoom — מובילת B2B SaaS",
                    ]
                    return (
                      <img key={i} src={`https://raw.githubusercontent.com/Hanita-y/Octaloom-images-and-videos/main/${f}`}
                        alt={alts[i]} loading="lazy" width={34} height={34}
                        style={{ width: 34, height: 34, borderRadius: "50%", border: `2.5px solid ${CREAM}`, marginLeft: i === 0 ? 0 : -10, objectFit: "cover" }}
                        onError={(e) => { (e.target as HTMLImageElement).onerror = null; (e.target as HTMLImageElement).src = FALLBACK_SVG }}/>
                    )
                  })}
                </div>
                <span style={{ fontSize: 13, color: MUTED, maxWidth: 190, lineHeight: 1.4, textAlign: "left" }}>{hero.trusted}</span>
              </div>
            </Reveal>
          </div>
          {/* Visual column */}
          <div style={{ display: "flex", justifyContent: isMobile ? "center" : "flex-start" }}>
            <div className="lg-he-float" style={{ background: "#fff", borderRadius: 16, padding: 18, boxShadow: `${SHADOW_LG}, 0 4px 16px rgba(0,0,0,.05)`, width: "100%", maxWidth: isMobile ? "100%" : 460 }}>
              <svg style={{ width: 22, height: 22, marginBottom: 12 }} viewBox="0 0 24 24"><path d={LI_PATH} fill={LI_BLUE}/></svg>
              <div style={{ background: "#f8f9fa", borderRadius: 10, padding: 14, border: "1px solid #e8ebed", marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: "#58667e", marginBottom: 6, display: "block", direction: "rtl", textAlign: "right" }}>{hero.analyticsTitle}</span>
                <span style={{ fontSize: 28, fontWeight: 700, color: LI_BLUE, lineHeight: 1, marginBottom: 3, direction: "ltr", display: "block" }}>{hero.analyticsNum}</span>
                <span style={{ fontSize: 11, color: "#58667e", marginBottom: 7, display: "block", direction: "rtl", textAlign: "right" }}>{hero.analyticsSub}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#057642", direction: "ltr", display: "block" }}>{hero.analyticsGrowth}</span>
                <div style={{ marginTop: 10 }}>
                  <svg style={{ width: "100%", height: 55, display: "block" }} viewBox="0 0 320 55" fill="none" preserveAspectRatio="none">
                    <path className="lg-he-chart-line" d="M0 45 C40 42,60 35,90 28 C110 23,130 20,160 14 C190 8,210 5,240 4 C270 3,290 6,320 2" stroke={LI_BLUE} strokeWidth="2.2" fill="none" strokeLinecap="round"/>
                    <path d="M0 45 C40 42,60 35,90 28 C110 23,130 20,160 14 C190 8,210 5,240 4 C270 3,290 6,320 2 L320 55 L0 55 Z" fill="rgba(10,102,194,0.07)"/>
                  </svg>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#89a4c7", marginTop: 3 }}>
                    {["Jan","Mar","May","Jul","Sep","Nov"].map(m => <span key={m}>{m}</span>)}
                  </div>
                </div>
              </div>
              {!isMobile && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 7 }}>
                {[{ t: "מעורבות", n: "8.4%", g: "+59%" }, { t: "עוקבים", n: "4,891", g: "+23%" }, { t: "חשיפות", n: "359%", g: "+359%" }].map((c, i) => (
                  <div key={i} style={{ background: "#f8f9fa", borderRadius: 10, padding: 10, border: "1px solid #e8ebed", display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontSize: 10, color: "#58667e", lineHeight: 1.3, textAlign: "right" }}>{c.t}</span>
                    <span style={{ fontSize: 17, fontWeight: 700, color: LI_BLUE, direction: "ltr" }}>{c.n}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: "#057642", direction: "ltr" }}>{c.g}</span>
                  </div>
                ))}
              </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Entity Section ───────────────────────────────────────────────────────────
function EntitySection() {
  return (
    <section style={{ background: CREAM, padding: "40px 32px 56px", fontFamily: FONT }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal variant="blur">
          <p style={{ fontSize: "clamp(17px,2.2vw,22px)", lineHeight: 1.85, color: DEEP_PURPLE, maxWidth: 820, margin: "0 auto", textAlign: "right", fontWeight: 400 }}>{entityText}</p>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Why LinkedIn ─────────────────────────────────────────────────────────────
function WhyLinkedinSection() {
  const w = useWindowWidth()
  const isMobileWL = w < 1024
  const isMobile = w < 768

  const insightIcons = [
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={LIME} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={LIME} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={LIME} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  ]

  return (
    <section id="why-linkedin" style={{ background: CREAM, padding: isMobile ? "40px 18px" : "80px 32px", fontFamily: FONT }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobileWL ? "1fr" : "1.2fr 1fr", gap: isMobileWL ? 40 : 64, alignItems: "start", direction: "rtl" }}>
          {/* Right: text */}
          <div style={{ maxWidth: 700, display: "flex", flexDirection: "column", gap: 22, direction: "rtl" }}>
            <Reveal variant="blur"><h2 style={{ fontSize: "clamp(26px,3.8vw,44px)", fontWeight: 700, lineHeight: 1.12, marginBottom: 0, textAlign: "right", color: DEEP_PURPLE }}>{whyLiData.h2}</h2></Reveal>
            <Reveal delay={80}><p style={{ fontSize: 17, lineHeight: 1.9, color: "#3a3a52", textAlign: "right" }}>{whyLiData.p1}</p></Reveal>
            <Reveal delay={160} variant="right">
              <div style={{ display: "flex", gap: 18, alignItems: "flex-start", margin: "6px 0", flexDirection: "row", direction: "rtl" }}>
                <div style={{ width: 3, minHeight: 44, background: PURPLE, borderRadius: 2, flexShrink: 0, marginTop: 5 }}/>
                <p style={{ fontSize: 20, fontWeight: 600, color: DEEP_PURPLE, lineHeight: 1.6, fontStyle: "normal", textAlign: "right", margin: 0 }}>{whyLiData.pullQuote}</p>
              </div>
            </Reveal>
          </div>
          {/* Left: edge panel */}
          <Reveal delay={200} variant="left" style={{ height: "100%" }}>
            <div style={{ background: DEEP_PURPLE, borderRadius: 20, padding: isMobile ? "18px 14px" : "28px 22px", display: "flex", flexDirection: "column", gap: isMobile ? 10 : 14, position: isMobileWL ? "static" : "sticky", top: 96, boxShadow: "0 24px 60px rgba(32,30,75,0.22)" }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(198,225,165,0.6)", margin: "0 0 6px", direction: "rtl", textAlign: "right" }}>היתרון</p>
              {insightsData.map((item, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "14px 16px", border: "1px solid rgba(198,225,165,0.1)", display: "flex", gap: 14, alignItems: "flex-start", flexDirection: "row", direction: "rtl" }}>
                  <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 8, background: "rgba(198,225,165,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {insightIcons[i]}
                  </div>
                  <div style={{ textAlign: "right", flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginBottom: 4, direction: "rtl", justifyContent: "flex-start" }}>
                      <span style={{ fontSize: 22, fontWeight: 800, color: LIME, lineHeight: 1, direction: "ltr" }}>{item.num}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.07em" }}>{item.unit}</span>
                    </div>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.55, margin: 0 }}>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ─── Paths ────────────────────────────────────────────────────────────────────
function PathsSection() {
  const w = useWindowWidth()
  const isMobile = w < 768
  const isTablet = w >= 768 && w < 1024
  const cols = isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3,1fr)"

  return (
    <section id="services" style={{ background: DEEP_PURPLE, padding: isMobile ? "40px 18px" : "80px 32px", fontFamily: FONT }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal variant="blur"><h2 style={{ fontSize: "clamp(26px,3.8vw,44px)", fontWeight: 700, lineHeight: 1.12, marginBottom: 16, textAlign: "right", color: "#fff" }}>{pathsData.h2}</h2></Reveal>
        <Reveal delay={80}><p style={{ fontSize: 17, lineHeight: 1.65, maxWidth: 640, marginBottom: isMobile ? 28 : 48, textAlign: "right", color: "rgba(255,255,255,.75)" }}>{pathsData.sub}</p></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: cols, gap: isMobile ? 16 : 22 }}>
          {pathsData.cards.map((card, i) => (
            <Reveal key={i} delay={140 + i * 140} style={{ height: "100%" }}>
              <a href={card.href} style={{ display: "flex", flexDirection: "column", background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.14)", borderRadius: 20, padding: "30px 26px", color: "#fff", height: "100%", position: "relative", textDecoration: "none", textAlign: "right", transition: "border-color .25s,background .25s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(198,225,165,.38)"; (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,.1)" }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,.14)"; (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,.07)" }}>
                {card.tag && <span style={{ display: "inline-block", background: LIME, color: DEEP_PURPLE, fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 100, marginBottom: 14, alignSelf: "flex-end" }}>{card.tag}</span>}
                <h3 style={{ fontSize: 21, fontWeight: 700, marginBottom: 11, color: "#fff" }}>{card.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.78, color: "rgba(255,255,255,.72)", flex: 1, marginBottom: 22, whiteSpace: "pre-line" }}>{card.desc}</p>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: LIME, marginTop: "auto", flexDirection: "row-reverse" }}>
                  <ArrowLeft size={13}/>{card.cta}
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Why OctaLoom ─────────────────────────────────────────────────────────────
function WhyOctaloomSection() {
  const w = useWindowWidth()
  const isMobile = w < 768
  const icons = [
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={PURPLE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={PURPLE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.09 6.26L20 9.27l-4.91 3.82L16.18 20 12 16.77 7.82 20l1.09-6.91L4 9.27l5.91-1.01L12 2z"/></svg>,
    <LiIcon size={22}/>,
  ]
  return (
    <section id="why-us" style={{ background: CREAM, padding: isMobile ? "40px 18px" : "80px 32px", fontFamily: FONT }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal><h2 style={{ fontSize: "clamp(26px,3.8vw,44px)", fontWeight: 700, lineHeight: 1.12, marginBottom: isMobile ? 24 : 48, textAlign: "right", color: DEEP_PURPLE }}>{whyOctaloomData.h2}</h2></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)", gap: 22, direction: "rtl" }}>
          {whyOctaloomData.items.map((item, i) => (
            <Reveal key={i} delay={i * 110} variant="right" style={{ height: "100%" }}>
              <GradientBorderCard>
                <div style={{ display: "flex", flexDirection: "column", gap: 11, textAlign: "right" }}>
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 42, height: 42, background: "rgba(113,46,172,.08)", borderRadius: 12, flexShrink: 0, alignSelf: "flex-end" }}>{icons[i]}</span>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: DEEP_PURPLE }}>{item.title}</h3>
                  <p style={{ fontSize: 15, lineHeight: 1.75, color: MUTED }}>{item.desc}</p>
                </div>
              </GradientBorderCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Results ─────────────────────────────────────────────────────────────────
function ResultsSection() {
  const w = useWindowWidth()
  const isMobile = w < 768
  return (
    <section id="results" style={{ background: CREAM, padding: isMobile ? "40px 18px" : "80px 32px", fontFamily: FONT }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal><h2 style={{ fontSize: "clamp(26px,3.8vw,44px)", fontWeight: 700, lineHeight: 1.12, marginBottom: 16, textAlign: "right", color: DEEP_PURPLE }}>{resultsData.h2}</h2></Reveal>
        <Reveal delay={80}><p style={{ fontSize: 17, lineHeight: 1.65, maxWidth: 640, marginBottom: 0, textAlign: "right", color: MUTED }}>{resultsData.sub}</p></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: isMobile ? 10 : 24, marginTop: isMobile ? 28 : 48 }}>
          {resultsData.items.map((item, i) => (
            <Reveal key={i} delay={i * 90} variant="scale">
              <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 6 : 9, padding: isMobile ? "16px 14px" : "24px 20px", background: "#fff", borderRadius: 20, border: `1px solid ${BORDER}`, textAlign: "right", transition: "box-shadow .2s,transform .2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = SHADOW_PURPLE; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)" }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; (e.currentTarget as HTMLDivElement).style.transform = "none" }}>
                <span style={{ fontSize: isMobile ? "clamp(24px,6vw,36px)" : "clamp(30px,3.5vw,46px)", fontWeight: 700, color: PURPLE, lineHeight: 1, direction: "ltr", textAlign: "left" }}><AnimatedNum value={item.num}/></span>
                <span style={{ fontSize: isMobile ? 12 : 13, lineHeight: 1.55, color: MUTED }}>{item.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function TestimonialsSection() {
  const [reactions, setReactions] = useState<Record<number, string>>({})
  const [picker, setPicker] = useState<Record<number, boolean>>({})
  const w = useWindowWidth()
  const isMobile = w < 768
  const isTablet = w >= 768 && w < 1024
  const cols = isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3,1fr)"

  return (
    <section id="testimonials" style={{ background: PURPLE, padding: isMobile ? "40px 18px" : "80px 32px", fontFamily: FONT }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal variant="blur"><h2 style={{ fontSize: "clamp(26px,3.8vw,44px)", fontWeight: 700, lineHeight: 1.12, marginBottom: isMobile ? 24 : 48, textAlign: "right", color: "#fff" }}>מה אומרים הלקוחות</h2></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: cols, gap: isMobile ? 16 : 18 }}>
          {testiData.map((t, i) => (
            <Reveal key={i} delay={i * 130} style={{ height: "100%" }}>
              <div style={{ background: "#fff", borderRadius: 12, display: "flex", flexDirection: "column", boxShadow: "0 2px 12px rgba(0,0,0,.08)", height: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 14px 0", flexDirection: "row-reverse" }}>
                  <img src={t.photo} alt={t.author} loading="lazy" style={{ width: 46, height: 46, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: `2px solid ${BORDER}` }}/>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 1, textAlign: "right" }}>
                    {t.linkedin ? <a href={t.linkedin} target="_blank" rel="noopener noreferrer"><strong style={{ fontSize: 13, fontWeight: 700, color: DEEP_PURPLE, lineHeight: 1.2 }}>{t.author}</strong></a> : <strong style={{ fontSize: 13, fontWeight: 700, color: DEEP_PURPLE, lineHeight: 1.2 }}>{t.author}</strong>}
                    <span style={{ fontSize: 11, color: MUTED }}>{t.role}</span>
                  </div>
                  <LiIcon size={17} color={LI_BLUE}/>
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.78, color: "#333", padding: "12px 14px", flex: 1, textAlign: "right" }}>{t.quote}</p>
                <div style={{ display: "flex", alignItems: "center", borderTop: "1px solid #e0e0e0", padding: "3px 6px", flexDirection: "row-reverse" }}>
                  <div style={{ position: "relative", flex: 1, display: "flex", justifyContent: "center" }}>
                    <AnimatePresence>
                      {picker[i] && (
                        <motion.div initial={{ opacity: 0, scale: 0.8, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 8 }}
                          style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: "#fff", borderRadius: 100, padding: "7px 12px", display: "flex", gap: 2, boxShadow: "0 8px 32px rgba(0,0,0,.15)", border: `1px solid ${BORDER}`, zIndex: 20, whiteSpace: "nowrap" }}>
                          {Object.entries(REACTION_IMG).map(([type, src]) => (
                            <button key={type} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 5px", borderRadius: "50%", lineHeight: 1 }}
                              onClick={() => { setReactions(p => ({ ...p, [i]: type })); setPicker(p => ({ ...p, [i]: false })) }}><img src={src} alt={type} width={32} height={32} style={{ display: "block" }}/></button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <button style={{ display: "flex", alignItems: "center", gap: 4, padding: "7px 8px", borderRadius: 5, fontSize: 12, fontWeight: reactions[i] ? 700 : 500, color: reactions[i] ? PURPLE : "#666", background: "none", border: "none", cursor: "pointer", flex: 1, justifyContent: "center", fontFamily: FONT }}
                      onClick={() => setPicker(p => ({ ...p, [i]: !p[i] }))}
                      onMouseEnter={() => setPicker(p => ({ ...p, [i]: true }))}
                      onMouseLeave={() => setTimeout(() => setPicker(p => ({ ...p, [i]: false })), 700)}>
                      {reactions[i] ? <img src={REACTION_IMG[reactions[i]]} alt={reactions[i]} width={18} height={18} style={{ display: "block" }}/> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"/><path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/></svg>}
                      {!isMobile && <span style={{ fontSize: 12 }}>{reactions[i] ? "אהבתי" : "לייק"}</span>}
                    </button>
                  </div>
                  {["תגובה", "שיתוף"].map((label, j) => (
                    <button key={j} style={{ display: "flex", alignItems: "center", gap: 4, padding: "7px 8px", borderRadius: 5, fontSize: 12, color: "#666", background: "none", border: "none", cursor: "pointer", flex: 1, justifyContent: "center", fontFamily: FONT }}>
                      {j === 0 ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 014-4h14"/></svg>}
                      {!isMobile && label}
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── About ────────────────────────────────────────────────────────────────────
function AboutSection() {
  const w = useWindowWidth()
  const isMobile = w < 768
  return (
    <section id="about" style={{ background: CREAM, padding: isMobile ? "40px 18px" : "80px 32px", fontFamily: FONT }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.55fr 1fr", gap: isMobile ? 20 : 60, alignItems: "start", direction: "rtl" }}>
          <div style={{ paddingTop: isMobile ? 0 : 12, textAlign: "right" }}>
            <Reveal><h2 style={{ fontSize: "clamp(26px,3.8vw,44px)", fontWeight: 700, lineHeight: 1.12, marginBottom: 16, color: DEEP_PURPLE }}>{aboutData.h2}</h2></Reveal>
            {aboutData.text.map((p, i) => (
              <Reveal key={i} delay={90 + i * 90}>
                <p style={{ fontSize: 16, lineHeight: 1.9, color: "#3a3a52", marginBottom: 18 }}>{p}</p>
              </Reveal>
            ))}
            <Reveal delay={360}>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 28, flexDirection: "row-reverse" }}>
                <a href="https://www.linkedin.com/in/hanita-yudovski/" target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "13px 26px", borderRadius: 100, background: "transparent", color: DEEP_PURPLE, border: `1.5px solid ${DEEP_PURPLE}`, fontSize: 15, fontWeight: 600, fontFamily: FONT, direction: "ltr" }}>
                  <LiIcon size={15}/><span>{aboutData.li}</span>
                </a>
                <a href="#" style={{ display: "inline-flex", alignItems: "center", padding: "13px 26px", borderRadius: 100, background: "transparent", color: MUTED, fontSize: 15, fontWeight: 600, fontFamily: FONT }}>{aboutData.podcast}</a>
              </div>
            </Reveal>
          </div>
          <Reveal variant="left" style={{ order: isMobile ? -1 : 0 }}>
            <div style={{ position: isMobile ? "static" : "sticky", top: 96 }}>
              <img src="https://raw.githubusercontent.com/Hanita-y/Octaloom-images-and-videos/main/HAN.png"
                alt="חניתה יודובסקי"
                style={{ borderRadius: "50%", aspectRatio: "1/1", objectFit: "cover", objectPosition: "top center", maxWidth: isMobile ? 180 : 340, margin: "0 auto", display: "block", boxShadow: "0 4px 20px rgba(0,0,0,.09)", width: "100%" }}
                onError={e => { (e.target as HTMLImageElement).style.background = "linear-gradient(135deg,#712eac,#201e4b)"; (e.target as HTMLImageElement).src = "" }}/>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)
  const w = useWindowWidth()
  const isMobile = w < 768
  return (
    <section id="faq" style={{ background: CREAM, padding: isMobile ? "40px 18px" : "80px 32px", fontFamily: FONT }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal><h2 style={{ fontSize: "clamp(26px,3.8vw,44px)", fontWeight: 700, lineHeight: 1.12, marginBottom: 0, textAlign: "right", color: DEEP_PURPLE }}>שאלות נפוצות</h2></Reveal>
        <div style={{ maxWidth: 700, marginTop: isMobile ? 24 : 40, border: `1px solid ${BORDER}`, borderRadius: 20, overflow: "hidden" }}>
          {faqItems.map((item, i) => (
            <Reveal key={i} delay={i * 60} variant="right">
              <div style={{ padding: isMobile ? "14px 16px" : "18px 22px", borderBottom: i < faqItems.length - 1 ? `1px solid ${BORDER}` : "none", cursor: "pointer", transition: "background .18s", background: open === i ? "#f9f8f7" : "transparent" }}
                onClick={() => setOpen(open === i ? null : i)}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14, flexDirection: "row-reverse" }}>
                  <h3 style={{ fontSize: isMobile ? 14 : 15, fontWeight: 600, color: DEEP_PURPLE, lineHeight: 1.4, textAlign: "right" }}>{item.q}</h3>
                  <span style={{ fontSize: 20, fontWeight: 300, color: PURPLE, flexShrink: 0, lineHeight: 1, marginTop: 1, transition: "transform .25s", transform: open === i ? "rotate(45deg)" : "none" }}>+</span>
                </div>
                <AnimatePresence>
                  {open === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.32 }} style={{ overflow: "hidden" }}>
                      <p style={{ fontSize: 14, lineHeight: 1.85, color: MUTED, textAlign: "right", paddingTop: 12 }}>{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Bottom CTA ───────────────────────────────────────────────────────────────
function BottomCTA({ onQuiz }: { onQuiz: () => void }) {
  const w = useWindowWidth()
  const isMobile = w < 768
  return (
    <section id="contact" style={{ background: LIME, padding: isMobile ? "40px 18px" : "80px 32px", fontFamily: FONT }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center", direction: "rtl" }}>
        <Reveal>
          <h2 style={{ fontSize: isMobile ? "clamp(22px,6.5vw,32px)" : "clamp(26px,3.8vw,46px)", fontWeight: 700, color: DEEP_PURPLE, marginBottom: 14 }}>{ctaData.h2}</h2>
          <p style={{ fontSize: isMobile ? 15 : 17, lineHeight: 1.75, color: "rgba(32,30,75,.7)", maxWidth: 540, margin: isMobile ? "0 auto 24px" : "0 auto 32px" }}>{ctaData.sub}</p>
          <div style={{ display: "flex", gap: 12, justifyContent: isMobile ? "stretch" : "center", flexWrap: "wrap", marginBottom: 18, flexDirection: isMobile ? "column" : "row-reverse", alignItems: isMobile ? "stretch" : undefined }}>
            <button onClick={() => window.dispatchEvent(new CustomEvent("open-discovery"))}
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "13px 26px", borderRadius: 100, background: DEEP_PURPLE, color: "#fff", fontSize: 15, fontWeight: 600, fontFamily: FONT, width: isMobile ? "100%" : undefined, border: "none", cursor: "pointer" }}>
              {ctaData.cta1}<ArrowLeft size={15}/>
            </button>
            <button onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "13px 26px", borderRadius: 100, background: "transparent", color: DEEP_PURPLE, border: `1.5px solid ${DEEP_PURPLE}`, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: FONT, width: isMobile ? "100%" : undefined }}>
              {ctaData.cta2}
            </button>
          </div>
          <p style={{ fontSize: 13, color: "rgba(32,30,75,.55)", maxWidth: 420, margin: "0 auto" }}>{ctaData.note}</p>
        </Reveal>
        <div style={{ marginTop: 32, textAlign: "center" }}>
          <a href="https://www.octaloom.com/fractional-cmo-he" style={{ fontSize: 14, color: DEEP_PURPLE, textDecoration: "underline", opacity: 0.7 }}>{ctaData.cmoLink}</a>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const w = useWindowWidth()
  const isMobile = w < 768
  const linkStyle: React.CSSProperties = { fontSize: 14, color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color 0.2s", display: "block", lineHeight: "1.9", fontFamily: FONT }
  const headStyle: React.CSSProperties = { fontSize: 13, fontWeight: 700, color: CREAM, margin: "0 0 14px", fontFamily: FONT }
  const hover = (e: React.MouseEvent<HTMLAnchorElement>, enter: boolean) => { e.currentTarget.style.color = enter ? LIME : "rgba(255,255,255,0.5)" }

  const serviceLinks = [
    { label: "LinkedIn לארגונים", href: "https://www.octaloom.com/linkedin-for-organizations-he" },
    { label: "LinkedIn למייסדים ומנכ״לים", href: "https://www.octaloom.com/linkedin-for-executives-he" },
    { label: "LinkedIn לעצמאים", href: "https://www.octaloom.com/linkedin-for-solopreneurs-he" },
  ]
  const otherLinks = [
    { label: "CMO במיקור חוץ", href: "https://www.octaloom.com/fractional-cmo-he" },
    { label: "כלי AI וסוכנים", href: "https://www.octaloom.com/ai-tools-agents-he" },
    { label: "סדנאות", href: "https://www.octaloom.com/workshops-he" },
  ]
  const pageLinks = [
    { label: "עמוד הבית", href: "https://www.octaloom.com/" },
    { label: "אודות", href: "https://www.octaloom.com/about-he" },
    { label: "בלוג", href: "https://www.octaloom.com/blog-he" },
    { label: "צרו קשר", href: "https://www.octaloom.com/contact-he" },
  ]
  const socialIcons = [
    { href: "https://www.linkedin.com/in/hanita-yudovski/", label: "LinkedIn", icon: <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
    { href: "https://www.instagram.com/hanita_Y", label: "Instagram", icon: <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
    { href: "https://www.facebook.com/octaloom", label: "Facebook", icon: <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
    { href: "https://www.youtube.com/@Hanita_Octaloom", label: "YouTube", icon: <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg> },
    { href: "https://open.spotify.com/show/4XmsthqR7gnj4nf2gL0T7j", label: "Spotify", icon: <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg> },
  ]

  return (
    <footer style={{ padding: isMobile ? "32px 0 0" : "64px 0 0", background: NAVY, color: "rgba(255,255,255,0.7)", direction: "rtl", fontFamily: FONT }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 0.65fr 1fr 0.8fr 0.8fr 0.8fr", gap: isMobile ? "20px" : 24, paddingBottom: isMobile ? 24 : 48 }}>
          <div>
            <img src="https://raw.githubusercontent.com/Hanita-y/Octaloom-images-and-videos/main/Logo%20footer.png"
              alt="OctaLoom" style={{ height: isMobile ? 64 : 100, width: "auto", display: "block" }}
              onError={e => { (e.target as HTMLImageElement).style.display = "none" }}/>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginTop: 14, maxWidth: 240, lineHeight: 1.65, fontFamily: FONT }}>
              {"מחלקת השיווק שלך,"}<br/>{"רק בלי המחלקה."}
            </p>
          </div>
          {!isMobile && <div>
            <h4 style={headStyle}>{"עמודים"}</h4>
            {pageLinks.map((l, i) => (
              <a key={i} href={l.href} style={linkStyle} onMouseEnter={e => hover(e, true)} onMouseLeave={e => hover(e, false)}>{l.label}</a>
            ))}
          </div>}
          {!isMobile && <div>
            <h4 style={headStyle}>{"שירותי LinkedIn"}</h4>
            {serviceLinks.map((l, i) => (
              <a key={i} href={l.href} style={linkStyle} onMouseEnter={e => hover(e, true)} onMouseLeave={e => hover(e, false)}>{l.label}</a>
            ))}
          </div>}
          {!isMobile && <div>
            <h4 style={headStyle}>{"שירותים נוספים"}</h4>
            {otherLinks.map((l, i) => (
              <a key={i} href={l.href} style={linkStyle} onMouseEnter={e => hover(e, true)} onMouseLeave={e => hover(e, false)}>{l.label}</a>
            ))}
          </div>}
          {!isMobile && <div>
            <h4 style={{ ...headStyle, fontWeight: 300, fontSize: 12 }}>
              {"כלי שיווק"}<br/>{"חינמיים ותבניות"}
            </h4>
            <a href="https://octagoodies.com" target="_blank" rel="noopener noreferrer"
              style={{ textDecoration: "none", display: "inline-block" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1" }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.9" }}>
              <img src="https://raw.githubusercontent.com/Hanita-y/Octaloom-images-and-videos/main/OCTAGOODIES%20GREEN.png"
                alt="OctaGoodies" style={{ height: 44, width: "auto", display: "block", opacity: 0.9, transition: "opacity 0.2s" }}/>
            </a>
          </div>}
          <div>
            {!isMobile && <h4 style={headStyle}>{"התחברו"}</h4>}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {socialIcons.map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  style={{ color: "rgba(255,255,255,0.5)", transition: "color 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = LIME }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.5)" }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 0", borderTop: "1px solid rgba(255,255,255,0.1)", fontSize: 12, color: "rgba(255,255,255,.38)", flexWrap: "wrap", gap: 12, fontFamily: FONT }}>
          <span>© 2026 OctaLoom</span>
          <div style={{ display: "flex", gap: 18 }}>
            {[{ label: "פרטיות", href: "https://www.octaloom.com/privacy-policy-he" }, { label: "תנאים", href: "https://www.octaloom.com/terms-of-service-he" }, { label: "נגישות", href: "https://www.octaloom.com/accessibility-he" }].map((l, i) => (
              <a key={i} href={l.href} style={{ color: "rgba(255,255,255,.38)", textDecoration: "none", transition: "color 0.2s", fontFamily: FONT }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = LIME }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,.38)" }}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── Quiz Modal ───────────────────────────────────────────────────────────────
function QuizModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const done = step >= qzQuestions.length

  const choose = (opt: string) => {
    const next = [...answers, opt]
    setAnswers(next)
    setStep(s => s + 1)
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.48)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: 20 }}>
      <motion.div initial={{ opacity: 0, scale: 0.88, y: 22 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 24 }}
        style={{ background: "#fff", borderRadius: 20, padding: 38, maxWidth: 460, width: "100%", position: "relative", direction: "rtl", textAlign: "right", fontFamily: FONT }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, left: 14, width: 30, height: 30, borderRadius: "50%", background: BORDER, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", color: MUTED, cursor: "pointer", border: "none" }}>×</button>
        {!done ? (
          <>
            <div style={{ display: "flex", gap: 7, marginBottom: 28, flexDirection: "row-reverse" }}>
              {qzQuestions.map((_, i) => (
                <div key={i} style={{ height: 3, flex: 1, borderRadius: 2, background: i <= step ? PURPLE : BORDER, transition: "background .3s" }}/>
              ))}
            </div>
            <h3 style={{ fontSize: 21, fontWeight: 700, color: DEEP_PURPLE, marginBottom: 22, lineHeight: 1.3 }}>{qzQuestions[step].q}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {qzQuestions[step].opts.map(opt => (
                <button key={opt} onClick={() => choose(opt)}
                  style={{ padding: "13px 18px", borderRadius: 12, border: `1.5px solid ${BORDER}`, background: "#fff", textAlign: "right", fontSize: 14, fontWeight: 500, color: DEEP_PURPLE, cursor: "pointer", transition: "all .18s", fontFamily: FONT }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = PURPLE; (e.currentTarget as HTMLButtonElement).style.background = "rgba(113,46,172,.04)" }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = BORDER; (e.currentTarget as HTMLButtonElement).style.background = "#fff" }}>
                  {opt}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 52, height: 52, background: "rgba(113,46,172,.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: PURPLE, margin: "0 auto 18px" }}>✓</div>
            <h3 style={{ fontSize: 19, fontWeight: 700, color: DEEP_PURPLE, marginBottom: 11 }}>תודה!</h3>
            <p style={{ fontSize: 14, lineHeight: 1.65, color: MUTED, marginBottom: 22 }}>על בסיס התשובות שלך, בואו נדבר ונבחן יחד איזה מסלול הכי מתאים לך.</p>
            <a href="https://calendar.notion.so/meet/octaloom/lets-talk" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: PURPLE, color: "#fff", padding: "13px 26px", borderRadius: 100, fontSize: 14, fontWeight: 600, textDecoration: "none", fontFamily: FONT }}>
              קבעו שיחת היכרות<ArrowLeft size={14}/>
            </a>
          </div>
        )}
      </motion.div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
// ─── Page Nav (vertical side dots) ───────────────────────────────────────────
function PageNav() {
  const sections = [
    { id: "hero", label: "סקירה" },
    { id: "why-linkedin", label: "למה לינקדאין" },
    { id: "services", label: "למי זה מתאים" },
    { id: "why-us", label: "למה OctaLoom" },
    { id: "results", label: "תוצאות" },
    { id: "testimonials", label: "ממליצים" },
    { id: "about", label: "קצת עליי" },
    { id: "faq", label: "שאלות" },
    { id: "contact", label: "צרו קשר" },
  ]
  const [active, setActive] = useState("hero")
  const [show, setShow] = useState(false)

  useEffect(() => {
    const checkShow = () => setShow(window.scrollY > 80 && window.innerWidth > 1200)
    window.addEventListener("scroll", checkShow, { passive: true })
    window.addEventListener("resize", checkShow, { passive: true })
    checkShow()
    return () => { window.removeEventListener("scroll", checkShow); window.removeEventListener("resize", checkShow) }
  }, [])

  useEffect(() => {
    const observers = sections.map(s => {
      const el = document.getElementById(s.id)
      if (!el) return null
      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) setActive(s.id)
      }, { threshold: 0.3, rootMargin: "-10% 0px -50% 0px" })
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(o => o && o.disconnect())
  }, [])

  const isDark = ["services", "testimonials"].includes(active)
  const dotInactive = isDark ? "rgba(255,255,255,0.35)" : "rgba(32,30,75,0.25)"
  const dotActive   = isDark ? "#ffffff" : PURPLE
  const labelColor  = isDark ? "rgba(255,255,255,0.9)" : DEEP_PURPLE

  if (!show) return null

  return (
    <div style={{ position: "fixed", left: 20, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 6, zIndex: 50 }}>
      {sections.map(s => (
        <a key={s.id} href={`#${s.id}`} title={s.label}
          style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", justifyContent: "flex-start", direction: "rtl" }}>
          <div style={{ width: active === s.id ? 24 : 6, height: active === s.id ? 3 : 6,
            background: active === s.id ? dotActive : dotInactive,
            borderRadius: active === s.id ? 2 : "50%", transition: "all 0.3s ease", flexShrink: 0 }}/>
          {active === s.id && (
            <span style={{ fontSize: 11, color: labelColor, fontWeight: 600, whiteSpace: "nowrap", opacity: 0.85, fontFamily: FONT }}>{s.label}</span>
          )}
        </a>
      ))}
    </div>
  )
}

// ─── Click Reactions (LinkedIn reaction icons on click) ──────────────────────
const REACTION_IMG: Record<string, string> = {
  like: "https://raw.githubusercontent.com/Hanita-y/Octaloom-images-and-videos/main/Linkedin-Like-Icon-Thumbup500.png",
  celebrate: "https://raw.githubusercontent.com/Hanita-y/Octaloom-images-and-videos/main/Linkedin-Celebrate-Icon-ClappingHands500.png",
  support: "https://raw.githubusercontent.com/Hanita-y/Octaloom-images-and-videos/main/Linkedin-Support-Icon-HeartinHand500.png",
  love: "https://raw.githubusercontent.com/Hanita-y/Octaloom-images-and-videos/main/Linkedin-Love-Icon-Heart500.png",
  insightful: "https://raw.githubusercontent.com/Hanita-y/Octaloom-images-and-videos/main/Linkedin-Insightful-Icon-Lamp500.png",
  funny: "https://raw.githubusercontent.com/Hanita-y/Octaloom-images-and-videos/main/linkedin-funny-emoticon-500.png",
}

function ClickReactions() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<any[]>([])
  const raf = useRef<number>(0)
  const imgs = useRef<HTMLImageElement[]>([])

  useEffect(() => {
    Object.values(REACTION_IMG).forEach(src => { const im = new Image(); im.src = src; imgs.current.push(im) })
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener("resize", resize)
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (t.closest("button,a,input")) return
      for (let i = 0; i < 6 + Math.floor(Math.random() * 4); i++) {
        const angle = Math.random() * Math.PI * 0.8 + Math.PI * 0.1
        const spd = 2 + Math.random() * 4
        particles.current.push({ x: e.clientX, y: e.clientY, vx: Math.cos(angle) * spd * (Math.random() > 0.5 ? 1 : -1), vy: -Math.sin(angle) * spd - 1, sz: 18 + Math.random() * 12, op: 1, rot: Math.random() * 360, rotSpd: (Math.random() - 0.5) * 9, img: imgs.current[Math.floor(Math.random() * imgs.current.length)], life: 0, maxLife: 42 + Math.random() * 28 })
      }
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.current = particles.current.filter(p => {
        p.life++; p.x += p.vx; p.y += p.vy; p.vy += 0.09; p.rot += p.rotSpd; p.op = Math.max(0, 1 - p.life / p.maxLife)
        if (p.op <= 0) return false
        ctx.save(); ctx.globalAlpha = p.op; ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180)
        try { ctx.drawImage(p.img, -p.sz / 2, -p.sz / 2, p.sz, p.sz) } catch (e) {} ctx.restore()
        return true
      })
      raf.current = requestAnimationFrame(animate)
    }
    document.addEventListener("click", onClick)
    raf.current = requestAnimationFrame(animate)
    return () => { document.removeEventListener("click", onClick); window.removeEventListener("resize", resize); cancelAnimationFrame(raf.current) }
  }, [])

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999 }}/>
}

export default function LinkedInGrowthEngineHE() {
  useGlobalStyles()
  const [quizOpen, setQuizOpen] = useState(false)

  return (
    <>
      <div style={{ fontFamily: FONT, background: CREAM, color: DEEP_PURPLE, direction: "rtl", WebkitFontSmoothing: "antialiased", overflowX: "hidden", lineHeight: 1.6, width: "100%" }}>
        <Navbar onQuiz={() => setQuizOpen(true)}/>
        <HeroSection onQuiz={() => setQuizOpen(true)}/>
        <EntitySection/>
        <WhyLinkedinSection/>
        <PathsSection/>
        <WhyOctaloomSection/>
        <ResultsSection/>
        <TestimonialsSection/>
        <AboutSection/>
        <FAQSection/>
        <BottomCTA onQuiz={() => setQuizOpen(true)}/>
        <Footer/>
        <AnimatePresence>
          {quizOpen && <QuizModal onClose={() => setQuizOpen(false)}/>}
        </AnimatePresence>
      </div>
      <PageNav/>
      <ClickReactions/>
    </>
  )
}
