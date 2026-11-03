import { DashboardDeadlineList } from "@/app/(app)/dashboard/deadline-list";
import { getDashboardData } from "@/lib/dashboard-data";

export const metadata = { title: "Cần hoàn thành", robots: { index: false, follow: false } };

export default async function ToDoPage() {
  const { toDo, subjects } = await getDashboardData();

  return (
    <>
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">TIẾN ĐỘ CÁ NHÂN</span>
          <h1>Cần hoàn thành</h1>
          <p>{toDo.length} deadline chưa được bạn đánh dấu hoàn thành.</p>
        </div>
      </div>
      <section aria-label="Deadline cần hoàn thành" className="dashboard-card">
        <div className="dashboard-card-head">
          <div><h2>Việc cần làm</h2><p>Sắp xếp theo hạn nộp gần nhất</p></div>
        </div>
        <DashboardDeadlineList deadlines={toDo} subjects={subjects} completed={false} />
      </section>
    </>
  );
}
