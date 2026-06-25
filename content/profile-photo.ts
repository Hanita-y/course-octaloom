// Content for the "פרומפטים לתמונה ראשית" tool.
// Explanations are written fresh in Hanita's voice. Prompts are original (not 1:1 with the
// sold product), in English (image models perform better in English), organized as two
// groups (women, men), each with four styles: branding, startup, studio, outdoor. Every
// prompt instructs the model to lean on the user's uploaded reference photo.

export const PROFILE_PHOTO_INTRO =
  "תמונת הפרופיל היא הדבר הראשון שאנשים רואים, והיא קובעת אם נשארים או גוללים הלאה. כאן יש פרומפטים מוכנים שמייצרים תמונה ראשית מקצועית מתוך תמונה רגילה שלכם. מעלים תמונת רפרנס, מדביקים פרומפט, והמודל בונה על הפנים שלכם.";

export const HOW_TO: string[] = [
  "בוחרים מודל תמונות. כרגע שניים עובדים מצוין לזה: מודל התמונות של ChatGPT, ו-Nano Banana (מודל התמונות שבתוך Gemini).",
  "מעלים תמונה אחת שלכם כרפרנס. עדיף תמונה ברורה, אור טוב, פנים גלויות.",
  "בוחרים נשים או גברים, מעתיקים את הפרומפט בסגנון שאהבתם, מדביקים ומריצים.",
  "מקבלים כמה גרסאות, בוחרים את הטובה, ומשייפים אם צריך.",
];

// Short note shown right above the prompts (moved out of the how-to steps).
export const REFERENCE_NOTE =
  "כל הפרומפטים כבר מנחים את המודל להישען על התמונה שהעליתם ולשמור על הפנים שלכם.";

// Screenshot walkthrough: the same 3 steps shown in ChatGPT and in Gemini.
export interface Shot {
  src: string;
  alt: string;
  caption: string;
}
export interface Walkthrough {
  tool: string;
  shots: Shot[];
}

export const WALKTHROUGHS: Walkthrough[] = [
  {
    tool: "ChatGPT",
    shots: [
      {
        src: "/tools/profile-photo/step1-gpt.png",
        alt: "מסך הבית של ChatGPT עם כפתור Create an image מסומן",
        caption: "פותחים שיחה חדשה ב-ChatGPT ולוחצים על Create an image.",
      },
      {
        src: "/tools/profile-photo/step2-gpt.png",
        alt: "תמונת רפרנס שהועלתה והפרומפט מודבק ב-ChatGPT",
        caption: "מעלים את תמונת הרפרנס ומדביקים את הפרומפט (כאן בחרתי בסגנון תדמית).",
      },
      {
        src: "/tools/profile-photo/step3-gpt.png",
        alt: "התמונה שהתקבלה מ-ChatGPT",
        caption: "וזאת התוצאה ש-ChatGPT החזיר.",
      },
    ],
  },
  {
    tool: "Nano Banana · Gemini",
    shots: [
      {
        src: "/tools/profile-photo/step1-gemini.png",
        alt: "תפריט Gemini עם האפשרות Create image מסומנת",
        caption: "ב-Gemini פותחים את התפריט (+) ובוחרים Create image.",
      },
      {
        src: "/tools/profile-photo/step2-gemini.png",
        alt: "תמונת רפרנס שהועלתה והפרומפט מודבק ב-Gemini",
        caption: "מעלים את אותה תמונת רפרנס ומדביקים את אותו פרומפט.",
      },
      {
        src: "/tools/profile-photo/step3-gemini.jpeg",
        alt: "התמונה שהתקבלה מ-Nano Banana ב-Gemini",
        caption: "וזאת התוצאה מ-Nano Banana, מודל התמונות של Gemini.",
      },
    ],
  },
];

export interface ImagePrompt {
  title: string;
  tag: string;
  body: string;
}

export interface PromptGroup {
  id: string;
  label: string;
  prompts: ImagePrompt[];
}

// Shared reference-photo instruction (English, to match the prompt language).
const REF =
  "Use the uploaded photo as the reference and keep the exact same face, features and identity of the person, so it is clearly the same individual. Apply only natural retouching, do not alter facial structure.";

const FRAMING =
  "Head-and-shoulders framing, eyes to camera, sharp focus on the face, natural skin texture, photorealistic, high resolution, vertical crop suitable for a profile picture.";

const FRAMING_BRAND =
  "Upper-body framing with some of the surroundings visible, eyes to camera, sharp focus on the face, natural skin texture, photorealistic, high resolution, vertical crop suitable for a profile picture.";

export const PROMPT_GROUPS: PromptGroup[] = [
  {
    id: "women",
    label: "נשים",
    prompts: [
      {
        title: "תדמית",
        tag: "פורטרט עריכותי שמשדר נוכחות ומיתוג אישי",
        body: `${REF} Create a personal-branding editorial portrait, modern and not a stiff classic corporate headshot: the person confident and at ease in a setting that signals her authority and personality, intentional contemporary styling, premium magazine-quality lighting and composition, a strong yet warm presence. ${FRAMING_BRAND}`,
      },
      {
        title: "סגנון סטארטאפ",
        tag: "אווירת חברה צעירה, אור טבעי וחיוך",
        body: `${REF} Create a professional LinkedIn profile photo in a modern startup style: a bright, airy workspace or minimalist loft softly blurred in the background, relaxed-smart wardrobe such as a fitted blazer over a simple top or a quality knit, natural daylight, a warm and approachable confident smile. ${FRAMING}`,
      },
      {
        title: "סטודיו",
        tag: "רקע נקי ותאורת סטודיו מקצועית",
        body: `${REF} Create a polished studio LinkedIn headshot: a clean solid neutral background (soft gray or off-white), professional softbox lighting with a gentle catchlight in the eyes, a tailored blazer or elegant top, natural makeup, neat hair, a confident composed expression. ${FRAMING}`,
      },
      {
        title: "צילום חוץ",
        tag: "בחוץ, רקע מטושטש בבוקה טבעי",
        body: `${REF} Create an outdoor LinkedIn profile photo: an urban street or green exterior softly blurred with natural bokeh, golden-hour or soft overcast daylight, smart-casual wardrobe, a relaxed confident candid expression. ${FRAMING}`,
      },
    ],
  },
  {
    id: "men",
    label: "גברים",
    prompts: [
      {
        title: "תדמית",
        tag: "פורטרט עריכותי שמשדר נוכחות ומיתוג אישי",
        body: `${REF} Create a personal-branding editorial portrait, modern and not a stiff classic corporate headshot: the person confident and at ease in a setting that signals his authority and personality, intentional contemporary styling, well-groomed, premium magazine-quality lighting and composition, a strong yet warm presence. ${FRAMING_BRAND}`,
      },
      {
        title: "סגנון סטארטאפ",
        tag: "אווירת חברה צעירה, אור טבעי",
        body: `${REF} Create a professional LinkedIn profile photo in a modern startup style: a bright, airy workspace or minimalist loft softly blurred in the background, relaxed-smart wardrobe such as a fitted blazer over a plain t-shirt or a quality shirt without a tie, natural daylight, a warm and approachable confident expression. ${FRAMING}`,
      },
      {
        title: "סטודיו",
        tag: "רקע נקי ותאורת סטודיו מקצועית",
        body: `${REF} Create a polished studio LinkedIn headshot: a clean solid neutral background (soft gray or off-white), professional softbox lighting with a gentle catchlight in the eyes, a tailored blazer or a crisp collared shirt, well-groomed, a confident composed expression. ${FRAMING}`,
      },
      {
        title: "צילום חוץ",
        tag: "בחוץ, רקע מטושטש בבוקה טבעי",
        body: `${REF} Create an outdoor LinkedIn profile photo: an urban street or green exterior softly blurred with natural bokeh, golden-hour or soft overcast daylight, smart-casual wardrobe, well-groomed, a relaxed confident candid expression. ${FRAMING}`,
      },
    ],
  },
];
