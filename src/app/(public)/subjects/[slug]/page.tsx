import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Countdown } from "@/components/countdown";
import { SubjectCover } from "@/components/subject-cover";
import { getDeadlines, getSubjects } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const subjects = await getSubjects();
  return subjects.map((subject) => ({ slug: subject.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const subject = (await getSubjects()).find((item) => item.slug === slug);
  return subject
    ? { title: subject.name, description: subject.description, alternates: { canonical: `/subjects/${slug}` } }
    : { title: "Không tìm thấy môn học" };
}

export default async function SubjectPage({ params }: Props) {
  const { slug } = await params;
  const [subjects, deadlines] = await Promise.all([getSubjects(), getDeadlines()]);
  const subject = subjects.find((item) => item.slug === slug);
  if (!subject) notFound();

  const subjectDeadlines = deadlines
    .filter((deadline) => deadline.subjectSlug === slug)
    .sort((a, b) => Date.parse(a.dueDate) - Date.parse(b.dueDate));

  return (
    <>
      <section className="container subject-page-intro">
        <div className="breadcrumbs"><Link href="/">Trang chủ</Link><span aria-hidden="true">/</span><span>Môn học</span><span aria-hidden="true">/</span><strong>{subject.name}</strong></div>
        <div className="subject-hero-card">
          <div className="subject-hero-copy">
            <span className="eyebrow">{subject.code} · MÔN HỌC</span>
            <h1>{subject.name}</h1>
            <p>{subject.description}</p>
            <span className="subject-hero-count">{subjectDeadlines.length} deadline trong môn học</span>
          </div>
          <SubjectCover large subject={subject} />
        </div>
      </section>
      <section className="container subject-deadlines">
        <div className="subject-deadline-heading">
          <div><span className="eyebrow">KẾ HOẠCH HỌC TẬP</span><h2>Bài tập và hạn nộp</h2></div>
          <span>{subjectDeadlines.length} đầu việc</span>
        </div>
        <div className="deadline-list">
          {subjectDeadlines.map((deadline) => (
            <Link className="deadline-row" href={`/deadlines/${deadline.id}`} key={deadline.id}>
              <span className="deadline-day">{new Date(deadline.dueDate).toLocaleDateString("vi-VN", { day: "2-digit" })}</span>
              <span className="deadline-row-main"><small>{deadline.type}</small><strong>{deadline.title}</strong><Countdown dueDate={deadline.dueDate} /></span>
              <time className="deadline-date" dateTime={deadline.dueDate}>{new Date(deadline.dueDate).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })}</time>
              <span className="row-arrow" aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
        {!subjectDeadlines.length && <div className="empty-state"><strong>Chưa có deadline cho môn học này</strong><p>Deadline mới sẽ xuất hiện tại đây.</p></div>}
      </section>
    </>
  );
}
