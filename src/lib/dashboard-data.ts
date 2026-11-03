import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { can } from "@/lib/authorization";
import { getDeadlines, getSubjects } from "@/lib/data";

export async function getDashboardData() {
  const session = await auth();
  if (!session?.user || !can(session.user.role, "access_dashboard")) {
    redirect("/login?callbackUrl=%2Fdashboard");
  }

  const [deadlines, subjects] = await Promise.all([getDeadlines(), getSubjects()]);
  const orderedDeadlines = [...deadlines].sort(
    (a, b) => Date.parse(a.dueDate) - Date.parse(b.dueDate),
  );
  const completed = orderedDeadlines.filter((deadline) =>
    deadline.completedBy.includes(session.user.id),
  );
  const toDo = orderedDeadlines.filter(
    (deadline) => !deadline.completedBy.includes(session.user.id),
  );

  return { user: session.user, deadlines: orderedDeadlines, subjects, completed, toDo };
}
