// Shared closing note shown at the bottom of every tool page.
export default function ToolNote() {
  return (
    <div className="tool-note">
      <span className="tool-note-icon" aria-hidden>💡</span>
      <p>
        כלי ה-AI מצוינים להשראה ולבניית בסיס ראשוני. אם התוצאה שקיבלת לא מדויקת עבורך, תמיד אפשר
        להריץ אותה שוב עם דגשים חדשים, או פשוט ליישם את העקרונות שלמדנו ולכתוב זאת בעצמך.
      </p>
    </div>
  );
}
