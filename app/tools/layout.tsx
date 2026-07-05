import { requireCourseAccess } from "@/lib/access";

export default async function ToolsLayout({ children }: { children: React.ReactNode }) {
  await requireCourseAccess();
  return children;
}
