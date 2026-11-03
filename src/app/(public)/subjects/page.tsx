import type { Metadata } from "next";
import Link from "next/link";
import { SubjectCover } from "@/components/subject-cover";
import { getDeadlines, getSubjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Môn học",
  description: "Chọn một môn học để xem bài tập và deadline sắp tới.",
  alternates: { canonical: "/subjects" },
};

export default async function SubjectsPage() {
  const [subjects, deadlines] = await Promise.all([getSubjects(), getDeadlines()]);

  return (
    <>
      <section className="container page-intro">
        <div className="breadcrumbs"><Link href="/">Trang chủ</Link><span aria-hidden="true">/</span><strong>Môn học</strong></div>
        <h1>Môn học của lớp</h1>
        <p>Chọn môn để xem danh sách bài tập, hạn nộp và tiến độ trong một nơi.</p>
      </section>
      <section aria-label="Danh sách môn học" className="container subjects-index">
        <div className="subject-grid">
          {subjects.map((subject) => {
            const subjectDeadlines = deadlines.filter((deadline) => deadline.subjectSlug === subject.slug);
            return (
              <Link className="subject-card" href={`/subjects/${subject.slug}`} key={subject.slug}>
                <SubjectCover subject={subject} />
                <h2>{subject.name}</h2>
                <span className="subject-card-footer">
                  <span>{subjectDeadlines.length} deadline · {subject.code}</span>
                  <span>Xem môn học <span aria-hidden="true">↗</span></span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
