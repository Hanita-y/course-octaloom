"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { syncTool } from "@/lib/progress-sync";

// Logs a tool "open" once per navigation into an internal tool page
// (/tools/<id>). The /tools index itself is skipped.
export default function ToolTracker() {
  const pathname = usePathname();
  useEffect(() => {
    const m = pathname?.match(/^\/tools\/([^/]+)/);
    if (m) syncTool(m[1]);
  }, [pathname]);
  return null;
}
