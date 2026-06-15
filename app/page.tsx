import LinkedInIcon from "@/components/LinkedInIcon";
import ChapterList from "@/components/ChapterList";

export default function CoursePage() {
  return (
    <div className="wrap">
      <div className="hero">
        <span className="eyebrow">
          <LinkedInIcon />
          OctaLoom · קורס לינקדאין
        </span>
        <h1>
          קורס הלינקדאין שלכם, <span className="accent">צעד אחר צעד</span>
        </h1>
        <p className="sub">פתיח, פרק היכרות, ו-5 פרקים. בחרו פרק כדי לצפות.</p>
      </div>

      <ChapterList />
    </div>
  );
}
