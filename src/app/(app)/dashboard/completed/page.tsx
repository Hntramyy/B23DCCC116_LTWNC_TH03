import { DashboardDeadlineList } from "@/app/(app)/dashboard/deadline-list";
import { getDashboardData } from "@/lib/dashboard-data";

export const metadata = { title: "Đã hoàn thành", robots: { index: false, follow: false } };

export default async function CompletedPage() {
  const { completed, subjects } = await getDashboardData();

  return (
    <>
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">TIẾN ĐỘ CÁ NHÂN</span>
          <h1>Đã hoàn thành</h1>
          <p>{completed.length} deadline bạn đã đánh dấu xong.</p>
        </div>
      </div>
      <section aria-label="Deadline đã hoàn thành" className="dashboard-card">
        <div className="dashboard-card-head">
          <div><h2>Việc đã xong</h2><p>Tiến độ được lưu riêng cho tài khoản của bạn</p></div>
        </div>
        <DashboardDeadlineList deadlines={completed} subjects={subjects} completed />
      </section>
    </>
  );
}
