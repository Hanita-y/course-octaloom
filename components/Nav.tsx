"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "הקורס" },
  { href: "/tools", label: "כלי עזר" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="nav">
      {LINKS.map((l) => {
        const active =
          l.href === "/"
            ? pathname === "/" || pathname.startsWith("/course")
            : pathname.startsWith(l.href);
        return (
          <Link key={l.href} href={l.href} className={`navlink${active ? " active" : ""}`}>
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
