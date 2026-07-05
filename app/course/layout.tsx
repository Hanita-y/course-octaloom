import { requireCourseAccess } from "@/lib/access";

export default async function CourseLayout({ children }: { children: React.ReactNode }) {
  await requireCourseAccess();
  return children;
}
