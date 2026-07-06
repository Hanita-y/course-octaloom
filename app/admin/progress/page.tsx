import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/admin";
import { listAllProgress } from "@/lib/progress-server";
import { CHAPTERS } from "@/lib/chapters";
import { TOOLS } from "@/lib/tools";

export const dynamic = "force-dynamic";

const TOOL_TITLE: Record<string, string> = Object.fromEntries(TOOLS.map((t) => [t.id, t.title]));

function pctClass(p: number): string {
  if (p >= 95) return "pc-done";
  if (p > 0) return "pc-part";
  return "pc-none";
}

export default async function AdminProgressPage() {
  if (!isAdmin(await currentUser())) redirect("/");
  const rows = await listAllProgress();

  return (
    <div className="wrap">
      <h1 className="admin-title">התקדמות בקורס</h1>
      <p className="admin-sub">
        <Link href="/admin/codes">← לקודי גישה</Link>
      </p>

      {rows.length === 0 ? (
        <p className="admin-empty">עדיין אין פעילות מתועדת. ברגע שמישהו יצפה בפרק או ייכנס לכלי, זה יופיע כאן.</p>
      ) : (
        <div className="admin-scroll">
          <table className="admin-table progress-table">
            <thead>
              <tr>
                <th className="sticky-col">משתמש</th>
                <th>סה״כ</th>
                {CHAPTERS.map((c) => (
                  <th key={c.id} title={c.title}>{c.label}</th>
                ))}
                <th>כלים שנפתחו</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const overall = Math.round(
                  CHAPTERS.reduce((a, c) => a + Math.min(100, r.videos[c.id] || 0), 0) / CHAPTERS.length
                );
                const usedTools = Object.entries(r.tools).sort((a, b) => b[1].count - a[1].count);
                return (
                  <tr key={r.userId}>
                    <td className="sticky-col" dir="ltr">{r.email || r.userId}</td>
                    <td className={pctClass(overall)}>{overall}%</td>
                    {CHAPTERS.map((c) => {
                      const p = Math.round(r.videos[c.id] || 0);
                      return <td key={c.id} className={pctClass(p)}>{p ? `${p}%` : "—"}</td>;
                    })}
                    <td className="tools-cell">
                      {usedTools.length === 0
                        ? "—"
                        : usedTools.map(([id, use]) => (
                            <span key={id} className="tool-chip">
                              {TOOL_TITLE[id] || id}
                              {use.count > 1 ? ` ×${use.count}` : ""}
                            </span>
                          ))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
