import Image from "next/image";
import WaitlistForm from "@/components/WaitlistForm";

export default function SignUpPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">לינקדאין 2026: הפרופיל כפרומפט</h1>
        <Image className="auth-logo" src="/brand/nav-logo.png" alt="OctaLoom" width={150} height={37} priority />
        <p className="auth-sub">ההרשמה לקורס נפתחת בקרוב</p>
        <WaitlistForm />
        <p className="auth-consent">
          יש לך קוד גישה? <a href="/join">להרשמה</a> · כבר יש לך חשבון? <a href="/sign-in">התחברות</a>
        </p>
      </div>
    </div>
  );
}
