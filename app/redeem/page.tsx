import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { hasCourseAccess } from "@/lib/access";
import RedeemForm from "@/components/RedeemForm";

export default async function RedeemPage() {
  const user = await currentUser();
  if (hasCourseAccess(user)) redirect("/");
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">יש לך קוד גישה?</h1>
        <p className="auth-sub">הזנת הקוד פותחת את הקורס והכלים לחשבון הזה</p>
        <RedeemForm />
        <p className="auth-consent">
          אין לך קוד? הקורס נפתח בקרוב לרכישה. בינתיים אפשר לכתוב לי:{" "}
          <a href="mailto:Hanita@octaloom.com">Hanita@octaloom.com</a>
        </p>
      </div>
    </div>
  );
}
