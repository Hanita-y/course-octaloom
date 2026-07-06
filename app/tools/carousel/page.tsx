import Link from "next/link";

// Gated by app/tools/layout.tsx (requireCourseAccess). The tool itself is a
// self-contained static app served from /public/tools/carousel and isolated in
// an iframe so its global CSS/JS never collides with the course app. The AI
// generation it calls (/api/carousel) enforces course access again server-side.
export const metadata = {
  title: "מחולל קרוסלות ללינקדאין",
};

export default function CarouselToolPage() {
  return (
    <div className="carousel-tool-page">
      <Link href="/tools" className="backlink carousel-back">
        → חזרה לכלים
      </Link>
      <iframe
        src="/tools/carousel/index.html"
        title="מחולל קרוסלות ללינקדאין"
        className="carousel-frame"
      />
      <style>{`
        .carousel-tool-page { display: flex; flex-direction: column; height: 100vh; }
        .carousel-back { padding: 14px 20px; flex: 0 0 auto; }
        .carousel-frame { flex: 1 1 auto; width: 100%; border: 0; display: block; }
      `}</style>
    </div>
  );
}
