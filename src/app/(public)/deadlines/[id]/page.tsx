import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CompleteButton } from "@/components/complete-button";
import { Countdown } from "@/components/countdown";
import { getDeadline, getDeadlines, getSubjects } from "@/lib/data";

export const revalidate = 60;

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const deadlines = await getDeadlines();
  return deadlines.map((deadline) => ({ id: deadline.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const [deadline, subjects] = await Promise.all([getDeadline(id), getSubjects()]);
  if (!deadline) return { title: "Không tìm thấy deadline" };

  const subject = subjects.find((item) => item.slug === deadline.subjectSlug);
  const title = deadline.title;
  const description = deadline.description;
  return {
    title,
    description,
    alternates: { canonical: `/deadlines/${deadline.id}` },
    openGraph: {
      type: "article",
      title,
      description,
      images: [{ url: `/api/og/deadlines/${deadline.id}`, width: 1200, height: 630, alt: `${title} — ${subject?.name ?? "Deadline Hub"}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/api/og/deadlines/${deadline.id}`],
    },
  };
}

export default async function DeadlineDetailPage({ params }: Props) {
  const { id } = await params;
  const [deadline, subjects] = await Promise.all([getDeadline(id), getSubjects()]);
  if (!deadline) notFound();

  const subject = subjects.find((item) => item.slug === deadline.subjectSlug);
  if (!subject) notFound();
  const dueDate = new Date(deadline.dueDate);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Deadline", item: `${siteUrl}/deadlines` },
      { "@type": "ListItem", position: 3, name: subject.name, item: `${siteUrl}/subjects/${subject.slug}` },
      { "@type": "ListItem", position: 4, name: deadline.title, item: `${siteUrl}/deadlines/${deadline.id}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }} />
      <div className="container detail-wrap">
        <div className="breadcrumbs"><Link href="/">Trang chủ</Link><span aria-hidden="true">/</span><Link href="/deadlines">Deadline</Link><span aria-hidden="true">/</span><Link href={`/subjects/${subject.slug}`}>{subject.name}</Link></div>
        <div className="detail-layout">
          <article className="detail-main">
            <span className="detail-label">{subject.code} <span aria-hidden="true">·</span> {deadline.type}</span>
            <h1>{deadline.title}</h1>
            <Countdown dueDate={deadline.dueDate} />
            <p className="detail-description">{deadline.description}</p>
            <div className="detail-meta">
              <div className="meta-item"><small>Môn học</small><strong>{subject.name}</strong></div>
              <div className="meta-item"><small>Hạn nộp</small><strong>{dueDate.toLocaleString("vi-VN", { dateStyle: "long", timeStyle: "short" })}</strong></div>
              <div className="meta-item"><small>Mã deadline</small><strong>#{deadline.id}</strong></div>
            </div>
          </article>
          <aside className="detail-panel">
            <h2>Thông tin deadline</h2>
            <div className="panel-item"><small>Ngày đến hạn</small><strong>{dueDate.toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</strong></div>
            <div className="panel-item"><small>Thời gian còn lại</small><Countdown dueDate={deadline.dueDate} /></div>
            <CompleteButton deadlineId={deadline.id} />
            <p>Đăng nhập để lưu tiến độ hoàn thành cho tài khoản của bạn.</p>
          </aside>
        </div>
      </div>
    </>
  );
}
