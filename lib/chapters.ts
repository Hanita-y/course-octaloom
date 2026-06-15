// Course chapters. vimeoId is filled in once each lesson is uploaded to Vimeo.

export interface Chapter {
  id: string;
  label: string;
  title: string;
  desc: string;
  duration: string;
  vimeoId?: string;
}

export const CHAPTERS: Chapter[] = [
  {
    id: "intro",
    label: "פתיח",
    title: "ברוכים הבאים לקורס",
    desc: "מה נלמד, איך הקורס בנוי, ואיך להפיק ממנו את המקסימום.",
    duration: "~3 דק׳",
  },
  {
    id: "chapter-0",
    label: "פרק 0",
    title: "לינקדאין 101",
    desc: "השפה הבסיסית של הפלטפורמה לפני שנכנסים לאסטרטגיה. מי שכבר פעיל יכול לדלג.",
    duration: "~4 דק׳",
  },
  {
    id: "chapter-1",
    label: "פרק 1",
    title: "למה לינקדאין ב-2026? + האלגוריתם שהשתנה",
    desc: "למה לינקדאין הוא מנוע צמיחה ב-2026, ואיך האלגוריתם החדש עובד.",
    duration: "~12 דק׳",
  },
  {
    id: "chapter-2",
    label: "פרק 2",
    title: "הפרופיל כ-AI Prompt ודף נחיתה",
    desc: "לבנות פרופיל שעובד כמו דף נחיתה: תמונה, באנר, כותרת, ו-About.",
    duration: "~15 דק׳",
  },
  {
    id: "chapter-3",
    label: "פרק 3",
    title: 'תוכן שעובד: "how I" מנצח "how-to"',
    desc: "למה ניסיון חי מנצח מידע יבש, ואיך לכתוב תוכן שבאמת עובד.",
    duration: "~15 דק׳",
  },
  {
    id: "chapter-4",
    label: "פרק 4",
    title: "Lead Magnets + Social Selling",
    desc: "להפוך תוכן לשיחות וללקוחות: lead magnets ו-social selling.",
    duration: "~12 דק׳",
  },
  {
    id: "chapter-5",
    label: "פרק 5",
    title: "תוכנית פעולה ל-30 יום",
    desc: "הזווית הייחודית שלכם, שגרה שבועית, ומה למדוד. סיכום כל הקורס.",
    duration: "~8 דק׳",
  },
];
