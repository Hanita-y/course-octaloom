import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import ClickReactions from "@/components/ClickReactions";
import "./globals.css";

const discovery = localFont({
  src: [
    { path: "./fonts/Discovery_Fs-Light.ttf", weight: "300", style: "normal" },
    { path: "./fonts/Discovery_Fs-Medium.ttf", weight: "500", style: "normal" },
  ],
  variable: "--font-discovery",
  display: "swap",
});

const aeonik = localFont({
  src: [
    { path: "./fonts/Aeonik-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Aeonik-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-aeonik",
  display: "swap",
});

export const metadata: Metadata = {
  title: "כלי עזר לקורס לינקדאין · OctaLoom",
  description: "ארגז הכלים של קורס הלינקדאין לנשות AI מבית OctaLoom",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl" className={`${discovery.variable} ${aeonik.variable}`}>
      <body>
        <ClerkProvider
          appearance={{
            variables: { colorPrimary: "#712EAC", borderRadius: "0.75rem" },
          }}
        >
          <header className="appbar">
            <Link href="/" className="logo">
              <Image src="/brand/nav-logo.png" alt="OctaLoom" width={122} height={30} priority />
            </Link>
            <Show when="signed-in">
              <Nav />
            </Show>
            <div className="right">
              <Show when="signed-out">
                <SignInButton>
                  <button className="auth-btn signin">התחברות</button>
                </SignInButton>
                <SignUpButton>
                  <button className="auth-btn signup">הרשמה</button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <span className="ctx">כלי עזר לקורס לינקדאין</span>
                <UserButton />
              </Show>
            </div>
          </header>
          {children}
          <Footer />
          <Show when="signed-in">
            <ClickReactions />
          </Show>
        </ClerkProvider>
      </body>
    </html>
  );
}
