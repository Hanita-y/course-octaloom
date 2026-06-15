// Registry of course helper tools shown on the dashboard.
// The headline generator is live; the rest are placeholders for upcoming phases.

export type ToolType = "ai" | "static" | "gem";
export type ToolStatus = "live" | "soon";

export interface Tool {
  id: string;
  title: string;
  desc: string;
  href?: string;
  type: ToolType;
  status: ToolStatus;
}

export const TOOLS: Tool[] = [
  {
    id: "headline",
    title: "מחולל כותרות",
    desc: "כותרת פרופיל לפי 3 הנוסחאות מפרק 2. ממלאים שאלון, מקבלים 5 וריאציות.",
    href: "/tools/headline",
    type: "ai",
    status: "live",
  },
  {
    id: "about",
    title: "פרומפטים ל-About",
    desc: "פרומפטים מוכנים לכתיבת חלק ה-About: בעיה, גן עדן, קריאה לפעולה.",
    type: "static",
    status: "soon",
  },
  {
    id: "profile-photo",
    title: "פרומפטים לתמונת פרופיל",
    desc: "פרומפטים ליצירת תמונת headshot מקצועית ולעריכת תמונה קיימת.",
    type: "static",
    status: "soon",
  },
  {
    id: "cover-text",
    title: "טקסט לבאנר",
    desc: "פרומפטים לטקסט אסטרטגי לבאנר הפרופיל.",
    type: "static",
    status: "soon",
  },
  {
    id: "connections",
    title: "תבניות הודעות חיבור",
    desc: "תבניות מוכנות להעתקה להודעות בקשת חיבור, לפי סוג הקשר.",
    type: "static",
    status: "soon",
  },
  {
    id: "posts",
    title: "תבניות פוסטים",
    desc: "תבניות פוסט מוכנות עם מקומות למילוי, לפי מטרת התוכן.",
    type: "static",
    status: "soon",
  },
  {
    id: "b2b-outreach",
    title: "B2B Outreach",
    desc: "מחרוזות חיפוש ותבניות פנייה ל-outreach ממוקד.",
    type: "static",
    status: "soon",
  },
  {
    id: "meeting-links",
    title: "לינק לפגישה",
    desc: "3 מדריכים: Calendly, Notion Calendar, Google Appointments.",
    type: "static",
    status: "soon",
  },
  {
    id: "content-partner",
    title: "שותף תוכן AI",
    desc: "Gem ייעודי שעוזר לבנות voice, לוח תוכן 30 יום, ופוסטים.",
    type: "gem",
    status: "soon",
  },
];
