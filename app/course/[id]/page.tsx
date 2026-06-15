import Link from "next/link";
import { notFound } from "next/navigation";
import { CHAPTERS } from "@/lib/chapters";
import ChapterPlayer from "@/components/ChapterPlayer";

export default async function ChapterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idx = CHAPTERS.findIndex((c) => c.id === id);
  if (idx === -1) notFound();
  const ch = CHAPTERS[idx];
  const prev = CHAPTERS[idx - 1];
  const next = CHAPTERS[idx + 1];

  return (
    <div className="wrap">
      <Link href="/" className="backlink">→ חזרה לקורס</Link>

      <div className="lesson-head">
        <span className="lesson-label">{ch.label}</span>
        <h1 style={{ fontSize: 26, flex: 1 }}>{ch.title}</h1>
        <span className="dur">{ch.duration}</span>
      </div>
      <p className="sub" style={{ marginBottom: 18 }}>{ch.desc}</p>

      <ChapterPlayer chapter={ch} />

      <div className="chapter-nav">
        {prev ? (
          <Link href={`/course/${prev.id}`} className="cn-link">
            {prev.label} · הקודם →
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/course/${next.id}`} className="cn-link next">
            ← הבא · {next.label}
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
