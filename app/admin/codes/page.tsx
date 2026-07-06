import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/admin";
import AdminCodes from "@/components/AdminCodes";

export default async function AdminCodesPage() {
  if (!isAdmin(await currentUser())) redirect("/");
  return (
    <div className="wrap">
      <h1 className="admin-title">קודי גישה</h1>
      <p className="admin-sub">
        <Link href="/admin/progress">התקדמות בקורס ←</Link>
      </p>
      <AdminCodes />
    </div>
  );
}
