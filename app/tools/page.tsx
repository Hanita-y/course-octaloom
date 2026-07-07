import Link from "next/link";
import { TOOLS } from "@/lib/tools";
import LinkedInIcon from "@/components/LinkedInIcon";
import ToolIcon from "@/components/ToolIcon";

const BADGE_LABEL: Record<string, string> = {
  ai: "AI",
  static: "מוכן",
  gem: "Gem",
};

export default function ToolsPage() {
  return (
    <>
      <section className="course-hero compact">
        <div className="ch-inner">
          <span className="eyebrow">
            <LinkedInIcon />
            OctaLoom · קורס לינקדאין
          </span>
          <h1>
            כל הכלים של הקורס, <span className="accent">במקום אחד</span>
          </h1>
          <p className="sub">בחרו כלי כדי להתחיל. כל כלי בנוי לפי החומר של הקורס.</p>
        </div>
      </section>

      <div className="wrap">
      <div className="grid">
        {TOOLS.map((tool) => {
          const soon = tool.status === "soon";
          const badgeClass = soon ? "soon" : tool.type;
          const badgeText = soon ? "בקרוב" : BADGE_LABEL[tool.type];
          // Hide the "מוכן" badge on live static tools; keep AI / Gem / בקרוב.
          const showBadge = soon || tool.type === "ai" || tool.type === "gem";
          const cardClass = `toolcard t-${tool.type}${soon ? " soon" : ""}`;
          const inner = (
            <>
              <div className="tc-head">
                <span className="tc-icon"><ToolIcon id={tool.id} /></span>
                {showBadge && <span className={`badge ${badgeClass}`}>{badgeText}</span>}
              </div>
              <h3>{tool.title}</h3>
              <p>{tool.desc}</p>
              {!soon && <span className="arrow">←</span>}
            </>
          );
          if (soon || !tool.href) {
            return (
              <div className={cardClass} key={tool.id}>
                {inner}
              </div>
            );
          }
          if (tool.external) {
            return (
              <a
                className={cardClass}
                href={tool.href}
                target="_blank"
                rel="noopener noreferrer"
                key={tool.id}
              >
                {inner}
              </a>
            );
          }
          return (
            <Link className={cardClass} href={tool.href} key={tool.id}>
              {inner}
            </Link>
          );
        })}
      </div>
      </div>
    </>
  );
}
