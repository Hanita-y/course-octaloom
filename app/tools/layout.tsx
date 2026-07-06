import { requireCourseAccess } from "@/lib/access";
import ToolTracker from "@/components/ToolTracker";

export default async function ToolsLayout({ children }: { children: React.ReactNode }) {
  await requireCourseAccess();
  return (
    <>
      <ToolTracker />
      {children}
    </>
  );
}
