import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { DeleteDeadlineButton } from "@/components/delete-deadline-button";
import { DeadlineForm } from "@/components/deadline-form";
import { can } from "@/lib/authorization";
import { getDeadlines, getSubjects } from "@/lib/data";

export const metadata = { title: "Quản lý deadline", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=%2Fadmin");
  if (!can(session.user.role, "access_admin")) redirect("/403");

  const [deadlines, subjects] = await Promise.all([getDeadlines(), getSubjects()]);
  const orderedDeadlines = [...deadlines].sort((a, b) => Date.parse(a.dueDate) - Date.parse(b.dueDate));

  return (
    <div className="admin-layout">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">QUẢN TRỊ LỚP HỌC</span>
          <h1>Quản lý deadline</h1>
          <p>Thêm, xóa deadline và theo dõi lịch nộp bài của cả lớp.</p>
        </div>
        <div className="admin-overview" aria-label="Thống kê deadline">
          <span><strong>{deadlines.length}</strong> deadline</span>
          <span><strong>{subjects.length}</strong> môn học</span>
        </div>
      </div>
      <div className="admin-grid">
        <DeadlineForm subjects={subjects} />
        <section aria-labelledby="admin-deadlines-title" className="admin-deadlines-panel">
          <div className="dashboard-card-head">
            <div>
              <h2 id="admin-deadlines-title">Deadline đang công khai</h2>
              <p>Bấm vào tên deadline để xem chi tiết và đánh dấu hoàn thành.</p>
            </div>
          </div>
          <div className="admin-table">
            <div className="admin-table-head"><span>Deadline</span><span>Hạn nộp</span><span>Thao tác</span></div>
            {orderedDeadlines.map((deadline) => {
              const subject = subjects.find((item) => item.slug === deadline.subjectSlug);
              return (
                <div className="admin-table-row" key={deadline.id}>
                  <span>
                    <Link className="admin-deadline-link" href={`/deadlines/${deadline.id}`}><strong>{deadline.title}</strong></Link>
                    <small>{subject?.code} · #{deadline.id}</small>
                  </span>
                  <span>{new Date(deadline.dueDate).toLocaleDateString("vi-VN", { day: "2-digit", month: "short" })}</span>
                  <DeleteDeadlineButton id={deadline.id} />
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
