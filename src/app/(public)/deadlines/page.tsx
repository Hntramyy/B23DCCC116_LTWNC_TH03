import type { Metadata } from "next";
import { DeadlineFilters } from "@/components/deadline-filters";
import { getDeadlines, getSubjects } from "@/lib/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Tất cả deadline",
  description: "Xem và lọc lịch nộp bài của tất cả môn học trong lớp.",
  alternates: { canonical: "/deadlines" },
};

export default async function DeadlinesPage() {
  const [deadlines, subjects] = await Promise.all([getDeadlines(), getSubjects()]);
  const sorted = [...deadlines].sort((a, b) => Date.parse(a.dueDate) - Date.parse(b.dueDate));

  return (
    <>
      <section className="container page-intro">
        <h1>Lịch deadline</h1>
      </section>
      <section className="container deadline-index"><DeadlineFilters deadlines={sorted} subjects={subjects} /></section>
    </>
  );
}
