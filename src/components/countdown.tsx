"use client";

import { useSyncExternalStore } from "react";

function daysFromNow(date: string): number {
  const due = new Date(date).getTime();
  return Math.ceil((due - Date.now()) / 86_400_000);
}

export function Countdown({ dueDate }: { dueDate: string }) {
  const days = useSyncExternalStore(
    (notify) => {
      const timer = window.setInterval(notify, 60_000);
      return () => window.clearInterval(timer);
    },
    () => daysFromNow(dueDate),
    () => null,
  );

  if (days === null) return <span className="countdown">Đang tính hạn nộp…</span>;
  if (days < 0) {
    return <span className="countdown countdown-late">Quá hạn {Math.abs(days)} ngày</span>;
  }
  if (days === 0) return <span className="countdown countdown-today">Hạn nộp hôm nay</span>;
  return <span className="countdown">Còn {days} ngày</span>;
}
