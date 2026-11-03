import Link from "next/link";
import { DashboardDeadlineList } from "@/app/(app)/dashboard/deadline-list";
import { getDashboardData } from "@/lib/dashboard-data";

export const metadata = { title: "Không gian của tôi", robots: { index: false, follow: false } };

export default async function DashboardPage() {
  const { user, subjects, completed, toDo } = await getDashboardData();

  return (
    <>
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">TIẾN ĐỘ CÁ NHÂN</span>
          <h1>Chào {user.name}!</h1>
          <p>Đây là tiến độ deadline của riêng bạn.</p>
        </div>
      </div>
      <div className="dashboard-stats">
        <Link className="dashboard-stat dashboard-stat-link" href="/dashboard/completed">
          <small>Đã hoàn thành</small><strong>{completed.length}</strong>
        </Link>
        <Link className="dashboard-stat dashboard-stat-link" href="/dashboard/to-do">
          <small>Cần hoàn thành</small><strong>{toDo.length}</strong>
        </Link>
        <div className="dashboard-stat"><small>Môn học trong kỳ</small><strong>{subjects.length}</strong></div>
      </div>
      <section className="dashboard-card">
        <div className="dashboard-card-head">
          <div>
            <h2>Ưu tiên sắp tới</h2>
            <p>{toDo.length ? `Hiển thị ${Math.min(toDo.length, 4)} deadline gần nhất bạn chưa hoàn thành` : "Không còn deadline cần xử lý"}</p>
          </div>
          <Link className="dashboard-filter-link" href="/dashboard/to-do">Xem tất cả <span aria-hidden="true">↗</span></Link>
        </div>
        <DashboardDeadlineList deadlines={toDo.slice(0, 4)} subjects={subjects} completed={false} />
      </section>
      <div className="dashboard-class-link">
        <span>Xem lịch deadline chung của lớp và sử dụng bộ lọc theo môn, trạng thái.</span>
        <Link className="button button-outline button-small" href="/deadlines">Mở lịch lớp <span aria-hidden="true">↗</span></Link>
      </div>
    </>
  );
}
