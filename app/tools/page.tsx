import Link from "next/link";
import { TOOLS } from "@/lib/tools";
import LinkedInIcon from "@/components/LinkedInIcon";

const BADGE_LABEL: Record<string, string> = {
  ai: "AI",
  static: "מוכן",
  gem: "Gem",
};

export default function ToolsPage() {
  return (
    <div className="wrap">
      <div className="hero">
        <span className="eyebrow">
          <LinkedInIcon />
          OctaLoom · קורס לינקדאין
        </span>
        <h1>
          כל הכלים של הקורס, <span className="accent">במקום אחד</span>
        </h1>
        <p className="sub">בחרו כלי כדי להתחיל. כל כלי בנוי לפי החומר של הקורס.</p>
      </div>

      <div className="grid">
        {TOOLS.map((tool) => {
          const soon = tool.status === "soon";
          const badgeClass = soon ? "soon" : tool.type;
          const badgeText = soon ? "בקרוב" : BADGE_LABEL[tool.type];
          // Hide the "מוכן" badge on live static tools; keep AI / Gem / בקרוב.
          const showBadge = soon || tool.type === "ai" || tool.type === "gem";
          const inner = (
            <>
              {showBadge && <span className={`badge ${badgeClass}`}>{badgeText}</span>}
              <h3>{tool.title}</h3>
              <p>{tool.desc}</p>
              {!soon && <span className="arrow">←</span>}
            </>
          );
          if (soon || !tool.href) {
            return (
              <div className="toolcard soon" key={tool.id}>
                {inner}
              </div>
            );
          }
          if (tool.external) {
            return (
              <a
                className="toolcard"
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
            <Link className="toolcard" href={tool.href} key={tool.id}>
              {inner}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
