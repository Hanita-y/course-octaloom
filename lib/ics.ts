/**
 * Minimal iCalendar (.ics) writer. A downloaded .ics opens in Apple Calendar and
 * Outlook on double-click, and Google Calendar imports it from Settings > Import.
 * Chosen over per-event "Add to Google Calendar" links, which only carry one event.
 *
 * Times are written as floating local time (no TZ, no Z suffix): the user sees 09:00
 * on their own clock wherever they are, which is what a habit plan wants.
 */

export type IcsEvent = {
  uid: string;
  title: string;
  description?: string;
  url?: string;
  /** Local start, as produced by localStamp(). */
  start: Date;
  minutes: number;
  /** Repeat for N occurrences (inclusive of the first). Omit for a one-off. */
  repeatDays?: number;
  /** Limit the repeat to these weekdays, e.g. ["SU","MO","TU","WE","TH"] to skip the weekend. */
  byDays?: string[];
  /** Minutes before start to pop a reminder. */
  alarmMinutes?: number;
};

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** YYYYMMDDTHHMMSS in the user's local clock, no timezone marker. */
function stamp(d: Date): string {
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `T${pad(d.getHours())}${pad(d.getMinutes())}00`
  );
}

/** Escape per RFC 5545: backslash, semicolon, comma, newline. */
function esc(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** Fold long lines at 75 octets, as required by RFC 5545. Outlook is strict about this. */
function fold(line: string): string {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const out: string[] = [];
  let chunk = "";
  let size = 0;
  for (const ch of line) {
    const w = new TextEncoder().encode(ch).length;
    if (size + w > 73) {
      out.push(chunk);
      chunk = ch;
      size = w;
    } else {
      chunk += ch;
      size += w;
    }
  }
  if (chunk) out.push(chunk);
  return out.join("\r\n ");
}

export function buildIcs(events: IcsEvent[], calendarName: string): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//OctaLoom//LinkedIn Course//HE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${esc(calendarName)}`,
  ];

  events.forEach((ev) => {
    const end = new Date(ev.start.getTime() + ev.minutes * 60_000);
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${ev.uid}`);
    lines.push(`DTSTAMP:${stamp(new Date())}Z`);
    lines.push(`DTSTART:${stamp(ev.start)}`);
    lines.push(`DTEND:${stamp(end)}`);
    lines.push(`SUMMARY:${esc(ev.title)}`);
    if (ev.description) lines.push(`DESCRIPTION:${esc(ev.description)}`);
    if (ev.url) lines.push(`URL:${ev.url}`);
    if (ev.repeatDays && ev.repeatDays > 1) {
      const byDay = ev.byDays?.length ? `;BYDAY=${ev.byDays.join(",")}` : "";
      lines.push(`RRULE:FREQ=DAILY${byDay};COUNT=${ev.repeatDays}`);
    }
    if (ev.alarmMinutes) {
      lines.push("BEGIN:VALARM");
      lines.push("ACTION:DISPLAY");
      lines.push(`TRIGGER:-PT${ev.alarmMinutes}M`);
      lines.push(`DESCRIPTION:${esc(ev.title)}`);
      lines.push("END:VALARM");
    }
    lines.push("END:VEVENT");
  });

  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n");
}

export function downloadIcs(ics: string, fileName: string): void {
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName.endsWith(".ics") ? fileName : `${fileName}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
