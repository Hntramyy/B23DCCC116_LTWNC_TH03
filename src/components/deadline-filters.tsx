"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import type { Deadline, Subject } from "@/lib/types";
import { Countdown } from "@/components/countdown";

function getVietnamDayKey(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function DeadlineFilters({
  deadlines,
  subjects,
}: {
  deadlines: Deadline[];
  subjects: Subject[];
}) {
  const [subject, setSubject] = useState("all");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "upcoming" | "today" | "overdue" | "completed">("all");
  const [todayKey, setTodayKey] = useState<string | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [completionError, setCompletionError] = useState("");
  const { data: session } = useSession();

  const loadCompletedIds = useCallback(async () => {
    try {
      const response = await fetch("/api/deadlines/completion", { cache: "no-store" });
      if (!response.ok) throw new Error("Không thể tải trạng thái hoàn thành. Vui lòng thử tải lại trang.");
      const result = (await response.json()) as { completedIds: string[] };
      setCompletedIds(result.completedIds);
      setCompletionError("");
    } catch (error) {
      setCompletionError(error instanceof Error ? error.message : "Không thể tải trạng thái hoàn thành.");
    }
  }, []);

  useEffect(() => {
    const updateToday = () => setTodayKey(getVietnamDayKey(new Date()));
    updateToday();
    const timer = window.setInterval(updateToday, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!session?.user) {
      return;
    }

    const initialLoad = window.setTimeout(() => {
      void loadCompletedIds();
    }, 0);
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") void loadCompletedIds();
    };
    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      window.clearTimeout(initialLoad);
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [loadCompletedIds, session?.user]);

  const categorized = useMemo(() => {
    const getStatus = (dueDate: string) => {
      if (!todayKey) return "upcoming";
      const dueDay = getVietnamDayKey(new Date(dueDate));
      if (dueDay < todayKey) return "overdue";
      if (dueDay === todayKey) return "today";
      return "upcoming";
    };

    return deadlines.map((deadline) => ({ deadline, status: getStatus(deadline.dueDate) }));
  }, [deadlines, todayKey]);
  const matching = useMemo(
    () =>
      categorized.filter(({ deadline }) => {
        const matchesSubject = subject === "all" || deadline.subjectSlug === subject;
        const matchesQuery = deadline.title.toLocaleLowerCase("vi").includes(query.toLocaleLowerCase("vi"));
        return matchesSubject && matchesQuery;
      }),
    [categorized, query, subject],
  );
  const statusFilters = [
    { id: "all", label: "Tất cả", count: matching.length },
    { id: "upcoming", label: "Sắp tới", count: matching.filter((item) => item.status === "upcoming").length },
    { id: "today", label: "Hôm nay", count: matching.filter((item) => item.status === "today").length },
    { id: "overdue", label: "Quá hạn", count: matching.filter((item) => item.status === "overdue").length },
    ...(session?.user && !completionError
      ? [{ id: "completed" as const, label: "Đã hoàn thành", count: matching.filter(({ deadline }) => completedIds.includes(deadline.id)).length }]
      : []),
  ] as const;
  const activeStatus = session?.user || status !== "completed" ? status : "all";
  const filtered = matching
    .filter(({ deadline, status: deadlineStatus }) => {
      if (activeStatus === "completed") return completedIds.includes(deadline.id);
      return activeStatus === "all" || deadlineStatus === activeStatus;
    })
    .map((item) => item.deadline);

  return (
    <>
      <div className="filter-bar">
        <label className="search-field">
          <span className="sr-only">Tìm deadline</span>
          <span aria-hidden="true">⌕</span>
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm bài tập, dự án..."
            type="search"
            value={query}
          />
        </label>
        <label className="select-field">
          <span className="sr-only">Lọc theo môn học</span>
          <select onChange={(event) => setSubject(event.target.value)} value={subject}>
            <option value="all">Tất cả môn học</option>
            {subjects.map((item) => (
              <option key={item.slug} value={item.slug}>{item.name}</option>
            ))}
          </select>
        </label>
      </div>
      <nav aria-label="Lọc theo trạng thái" className="deadline-status-filters">
        {statusFilters.map((filter) => (
          <button
            aria-pressed={activeStatus === filter.id}
            className={`status-filter${activeStatus === filter.id ? " status-filter-active" : ""}${filter.id === "overdue" ? " status-filter-overdue" : ""}`}
            key={filter.id}
            onClick={() => setStatus(filter.id)}
            type="button"
          >
            {filter.label}<span>{filter.count}</span>
          </button>
        ))}
      </nav>
      {completionError && session?.user && <p className="form-error" role="alert">{completionError}</p>}
      {filtered.length ? (
        <div className="deadline-list">
          {filtered.map((deadline) => {
            const subjectInfo = subjects.find((item) => item.slug === deadline.subjectSlug);
            const dueDate = new Date(deadline.dueDate);
            return (
              <Link className="deadline-row" href={`/deadlines/${deadline.id}`} key={deadline.id}>
                <time className="deadline-day" dateTime={deadline.dueDate}>
                  <strong>{dueDate.toLocaleDateString("vi-VN", { day: "2-digit" })}</strong>
                  <small>THG {dueDate.toLocaleDateString("vi-VN", { month: "2-digit" })}</small>
                </time>
                <span className="deadline-row-main">
                  <small>{subjectInfo?.name ?? "Môn học"} <span>·</span> {deadline.type}</small>
                  <strong>{deadline.title}</strong>
                  <Countdown dueDate={deadline.dueDate} />
                </span>
                <span className="row-arrow" aria-hidden="true">↗</span>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="empty-state"><span>⌕</span><strong>Không tìm thấy deadline</strong><p>Thử đổi từ khóa hoặc chọn môn học khác nhé.</p></div>
      )}
    </>
  );
}
