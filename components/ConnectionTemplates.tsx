import CopyLine from "@/components/CopyLine";
import {
  REQUEST_CATEGORIES,
  MESSAGE_CATEGORIES,
  type MessageCategory,
} from "@/content/connections";

function CategoryCard({ cat, num }: { cat: MessageCategory; num: number }) {
  return (
    <div className="card prompt-card cat-card">
      <div className="cat-head">
        <span className="cat-num">{num}</span>
        <div>
          <h3 className="prompt-title">{cat.title}</h3>
          <p className="cat-when">
            <span className="when-label">מתי</span>
            {cat.when}
          </p>
        </div>
      </div>
      <CopyLine text={cat.template} />
      {cat.variations.length > 0 && (
        <>
          <p className="var-label">וריאציות</p>
          {cat.variations.map((v, i) => (
            <CopyLine key={i} text={v} />
          ))}
        </>
      )}
    </div>
  );
}

export default function ConnectionTemplates() {
  return (
    <div>
      <div className="section-head">
        <h2>בקשות חיבור</h2>
      </div>
      {REQUEST_CATEGORIES.map((cat, i) => (
        <CategoryCard key={`req-${i}`} cat={cat} num={i + 1} />
      ))}

      <div className="section-head">
        <h2>הודעות אחרי שמתחברים</h2>
      </div>
      {MESSAGE_CATEGORIES.map((cat, i) => (
        <CategoryCard key={`msg-${i}`} cat={cat} num={REQUEST_CATEGORIES.length + i + 1} />
      ))}
    </div>
  );
}
