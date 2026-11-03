import Image from "next/image";
import Link from "next/link";
import { SubjectCover } from "@/components/subject-cover";
import { getDeadlines, getSubjects } from "@/lib/data";

export default async function HomePage() {
  const [subjects, deadlines] = await Promise.all([getSubjects(), getDeadlines()]);
  const upcoming = [...deadlines]
    .sort((a, b) => Date.parse(a.dueDate) - Date.parse(b.dueDate))
    .slice(0, 4);

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="hero-kicker"><span /> KHÔNG CÒN NƯỚC ĐẾN CHÂN MỚI NHẢY</span>
            <h1>Deadline rõ ràng.<br /><em>Học nhẹ nhàng.</em></h1>
            <p>Mọi hạn nộp của lớp, gói gọn trong một nơi. Theo dõi tiến độ, sắp xếp thời gian và tự tin hoàn thành đúng hạn.</p>
            <div className="hero-actions">
              <Link className="button button-dark" href="/deadlines">Khám phá deadline <span aria-hidden="true">↗</span></Link>
              <Link className="text-link" href="/subjects">Xem các môn học <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
          <div className="hero-visual">
            <Image alt="Minh họa bảng lịch deadline và danh sách bài tập" height={420} priority src="/study.svg" width={520} />
            <div className="hero-note"><small>HÔM NAY, 03 THÁNG 11</small><strong>12 deadline · 4 môn học</strong></div>
          </div>
        </div>
      </section>
      <section className="section container" id="subjects">
        <div className="section-heading">
          <div><span className="eyebrow">MÔN HỌC CỦA LỚP</span><h2>Chọn môn, xem việc cần làm.</h2></div>
          <Link className="text-link" href="/subjects">Xem tất cả môn học <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="subject-grid">
          {subjects.map((subject) => (
            <Link className="subject-card" href={`/subjects/${subject.slug}`} key={subject.slug}>
              <SubjectCover subject={subject} />
              <h3>{subject.name}</h3>
              <span className="subject-card-footer">
                <span>{deadlines.filter((item) => item.subjectSlug === subject.slug).length} deadline</span>
                <span>Xem môn học <span aria-hidden="true">↗</span></span>
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="upcoming-section">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow">LỊCH NỘP BÀI</span><h2>Đừng để sát hạn mới nhớ.</h2></div>
            <Link className="text-link" href="/deadlines">Xem toàn bộ deadline <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="deadline-preview">
            {upcoming.map((deadline) => {
              const subject = subjects.find((item) => item.slug === deadline.subjectSlug);
              const dueDate = new Date(deadline.dueDate);
              return (
                <Link className="preview-card" href={`/deadlines/${deadline.id}`} key={deadline.id}>
                  <time className="preview-date" dateTime={deadline.dueDate}>
                    <strong>{dueDate.toLocaleDateString("vi-VN", { day: "2-digit" })}</strong>
                    <small>THG {dueDate.toLocaleDateString("vi-VN", { month: "2-digit" })}</small>
                  </time>
                  <span className="preview-copy"><small>{subject?.code} · {deadline.type}</small><strong>{deadline.title}</strong></span>
                  <span className="row-arrow" aria-hidden="true">↗</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
