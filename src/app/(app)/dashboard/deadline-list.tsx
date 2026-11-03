import Link from "next/link";
import { Countdown } from "@/components/countdown";
import type { Deadline, Subject } from "@/lib/types";

export function DashboardDeadlineList({
  deadlines,
  subjects,
  completed,
}: {
  deadlines: Deadline[];
  subjects: Subject[];
  completed: boolean;
}) {
  if (!deadlines.length) {
    return (
      <div className="dashboard-empty">
        {completed
          ? "Các deadline bạn đánh dấu hoàn thành sẽ xuất hiện ở đây."
          : "Bạn đã hoàn thành tất cả deadline hiện có. Tuyệt vời!"}
      </div>
    );
  }

  return (
    <>
      {deadlines.map((deadline) => {
        const subject = subjects.find((item) => item.slug === deadline.subjectSlug);
        return (
          <Link
            className="dashboard-deadline dashboard-deadline-link"
            href={`/deadlines/${deadline.id}`}
            key={deadline.id}
          >
            <div>
              <small>
                {subject?.code} · {new Date(deadline.dueDate).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "short",
                })}
              </small>
              <strong>{deadline.title}</strong>
            </div>
            {completed
              ? <span className="dashboard-completion">Đã xong</span>
              : <Countdown dueDate={deadline.dueDate} />}
          </Link>
        );
      })}
    </>
  );
}
