import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="auth-page">
      <div className="auth-frame">
        <div className="auth-card">
          <Image className="auth-logo" src="/brand/nav-logo.png" alt="OctaLoom" width={150} height={37} priority />
          <h1 className="auth-title">קורס הלינקדאין</h1>
          <p className="auth-sub">התחברו כדי להמשיך לקורס ולכלים</p>
          <SignIn />
        </div>
      </div>
    </div>
  );
}
