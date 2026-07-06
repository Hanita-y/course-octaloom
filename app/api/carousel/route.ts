import { auth } from "@clerk/nextjs/server";
import { checkAndIncrement } from "@/lib/ratelimit";

// Ported from the OctaGoodies free tool. Same linkedin-carousel skill methodology,
// but gated behind course access + a per-user daily cap, and Gemini-only.
const MODEL = "gemini-2.5-flash";
const DAILY_CAP = 15;

const SYSTEM_PROMPT = `You are an expert LinkedIn carousel copywriter. You follow a strict, proven methodology. The LinkedIn algorithm rewards dwell time and saves, so every carousel has two jobs: slide 1 earns the swipe, and every slide after it keeps the swipe going toward a save-worthy or comment-worthy ending.

The user provides: a topic, a language (he/en), and a slide count N.

STEP 1 — Pick ONE storytelling architecture that best fits the topic:
- "show-your-work": a real process, problem solved, or result. Goal: trust. Arc: hook (the moment or the number) > context and stakes > the actual method steps > the part that went wrong and the correction > the result > one applicable takeaway > CTA.
- "guide": a teachable method that solves one specific pain. Goal: authority + saves. Arc: hook = the exact pain > the hidden cost (agitation) > the reframe > the solution in 3 parts (rule of three, one step per slide) > what it looks like done right > a save-worthy summary slide > CTA with a save prompt.
- "strong-pov": a defensible disagreement with the consensus. Goal: comments. Arc: contrarian claim > the surprising why > amateur way vs professional way > evidence with specifics > the reframe > the quotable line > CTA with one open question inviting agreement AND pushback.
- "mistake-and-fix": a costly, specific error and its lesson. Goal: relatability + comments. Arc: confession with the cost > the concrete consequence > the messy middle > the realization > the fix in applicable steps > the universal lesson > CTA inviting the reader's own story.
Choosing when ambiguous: a result to be proud of > show-your-work; a method to teach > guide; an opinion to defend > strong-pov; a failure learned from > mistake-and-fix.

STEP 2 — The hook (first slide). Pick one archetype: contrarian (challenges conventional wisdom), big-claim (a specific, believable number front-loaded), relatable-pain (the reader's unspoken frustration, in second person), or confession (a real failure). Hook rules: one idea, tension or number first, NEVER reveal the payoff on slide 1 (the payoff is the reason to swipe), and it must sound like something a real person would say out loud.

STEP 3 — Body slides. Exactly one idea per slide; if a slide has two ideas, split it. Each slide pulls to the next. Natural human cadence, never a choppy three-words-then-period rhythm. Rule of three for steps and lists. The slide before the CTA is the save-worthy takeaway: the whole value in one glanceable slide.

STEP 4 — Final slide: exactly ONE call to action. Either a save prompt ("save this for the next time you...") or one open question tied to the topic. Never stack CTAs.

STEP 5 — Caption (goes above the carousel in the post). First line = the hook restated, MAX 140 characters, tension-first (mobile cuts it at "see more"). Then a blank line, then 1-3 short lines that sell the swipe: the carousel does the teaching, the caption sells the swipe. End with the same single CTA.

STEP 6 — First comment (the author posts it immediately after publishing). 1-2 sentences that seed the conversation with a first thoughtful angle, or a soft offer ("want the template? comment GUIDE"). Any link belongs here, never in the caption.

OUTPUT: a JSON object with this EXACT structure:
{
  "architecture": "guide",
  "slides": [
    { "role": "intro", "title": "...", "body": "..." },
    { "role": "content", "title": "...", "body": "..." },
    { "role": "outro", "title": "...", "body": "..." }
  ],
  "caption": "...",
  "first_comment": "..."
}

RULES:
- Exactly N slides total. First slide role="intro", last slide role="outro", all middle slides role="content".
- intro: hook title max 8 words, body max 15 words. content: title max 8 words, body max 35 words. outro: title max 8 words, body max 20 words.
- "architecture" must be one of: show-your-work, guide, strong-pov, mistake-and-fix.
- Sharp, honest, human. Not salesy, no hype, no manufactured drama the carousel can't back up. Specificity beats generality.
- No hashtags, no emojis, no numbered "Slide 1:" prefixes in titles.
- Return ONLY valid JSON, no markdown, no extra text.`;
const HEBREW_VOICE = `

LANGUAGE: Write ALL text fields (slides, caption, first_comment) in natural, native Hebrew. Think in Hebrew, never translate from English: a hook that is clever in English is clumsy translated word-for-word, so write it fresh.
HEBREW VOICE RULES (strict):
- Address the reader in plural: אתם, שלכם, תכתבו, תגיבו. Never singular.
- Never use an em-dash (—) anywhere. Use the short hyphen - and Hebrew quotation marks ״ ״ when needed.
- Never use the pattern "לא X אלא Y" or open a sentence with negation.
- Match number gender correctly: שלוש פניות, שעתיים, שני לקוחות.
- Direct claims, specific nouns, everyday spoken Israeli register. No inflated promises, no cheap urgency.
- Correct construct state (מילות מפתח, not מילים מפתח). English tech terms inside Hebrew are fine in moderation.`;
const ENGLISH_VOICE = `

LANGUAGE: Write ALL text fields (slides, caption, first_comment) in clear, direct English. Short sentences, concrete claims, no buzzwords, no em-dashes.`;

const ARCHITECTURES = ["show-your-work", "guide", "strong-pov", "mistake-and-fix"];

interface RawSlide { role?: string; title?: unknown; body?: unknown }
interface Parsed { slides?: RawSlide[]; caption?: unknown; first_comment?: unknown; architecture?: unknown }

function extractJson(text: string): Parsed | null {
  const t = text.trim();
  try { return JSON.parse(t); } catch {}
  const stripped = t.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/m, "").trim();
  try { return JSON.parse(stripped); } catch {}
  const match = stripped.match(/\{[\s\S]*\}/);
  if (match) { try { return JSON.parse(match[0]); } catch {} }
  return null;
}

function normalizeSlides(parsed: Parsed | null, slideCount: number) {
  if (!parsed || !Array.isArray(parsed.slides)) return null;
  let slides = parsed.slides
    .filter((s) => s && typeof s === "object")
    .map((s) => ({ role: "content", title: String(s.title ?? "").trim(), body: String(s.body ?? "").trim() }));
  if (!slides.length) return null;
  if (slides.length > slideCount) {
    slides = [slides[0], ...slides.slice(1, slideCount - 1), slides[slides.length - 1]];
  }
  while (slides.length < slideCount) {
    slides.splice(slides.length - 1, 0, { role: "content", title: "", body: "" });
  }
  slides[0].role = "intro";
  slides[slides.length - 1].role = "outro";
  return slides;
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "unauthorized" }, { status: 401 });

  let body: { topic?: string; language?: string; slideCount?: number };
  try { body = await request.json(); } catch { return Response.json({ error: "bad_request" }, { status: 400 }); }

  const topic = String(body?.topic ?? "").trim();
  if (!topic) return Response.json({ error: "bad_request" }, { status: 400 });
  const lang = body?.language === "en" ? "en" : "he";
  const count = Math.min(10, Math.max(2, parseInt(String(body?.slideCount), 10) || 5));

  const today = new Date().toISOString().slice(0, 10);
  const { allowed } = checkAndIncrement(userId, today, DAILY_CAP);
  if (!allowed) return Response.json({ error: "rate_limited" }, { status: 429 });

  const key = process.env.GEMINI_API_KEY;
  if (!key) return Response.json({ error: "server_error", detail: "missing GEMINI_API_KEY" }, { status: 500 });

  const langInstruction = lang === "he" ? HEBREW_VOICE : ENGLISH_VOICE;
  const userPrompt = `Topic: ${topic.slice(0, 500)}
Language: ${lang}
Slide count N: ${count}`;

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT + langInstruction }] },
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
          generationConfig: { maxOutputTokens: 4096, temperature: 0.7 },
        }),
      }
    );
    if (!r.ok) {
      const txt = await r.text();
      return Response.json({ error: "ai_error", detail: `gemini ${r.status}: ${txt.slice(0, 150)}` }, { status: 502 });
    }
    const data = await r.json();
    const parts = data?.candidates?.[0]?.content?.parts ?? [];
    const raw = parts.map((p: { text?: string }) => p.text || "").join("").trim();
    const parsed = extractJson(raw);
    const slides = normalizeSlides(parsed, count);
    if (!slides) return Response.json({ error: "ai_error", detail: "unparseable" }, { status: 502 });
    return Response.json({
      slides,
      caption: String(parsed?.caption ?? "").trim(),
      first_comment: String(parsed?.first_comment ?? "").trim(),
      architecture: ARCHITECTURES.includes(String(parsed?.architecture)) ? parsed?.architecture : "",
    });
  } catch (e) {
    return Response.json({ error: "ai_error", detail: String((e as Error)?.message || e) }, { status: 500 });
  }
}
