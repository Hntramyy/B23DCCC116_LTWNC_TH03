"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Deadline } from "@/lib/types";

type NotificationDeadline = Pick<Deadline, "id" | "title" | "dueDate">;

export function DeadlineNotifications({ deadlines }: { deadlines: NotificationDeadline[] }) {
  const menuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target)) {
        if (menuRef.current) menuRef.current.open = false;
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menuRef.current) {
        menuRef.current.open = false;
      }
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <details className="notification-menu" ref={menuRef}>
      <summary aria-label={`Thông báo deadline (${deadlines.length})`} title="Thông báo deadline">
        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
          <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
        </svg>
        {deadlines.length > 0 && <span className="notification-count">{deadlines.length}</span>}
      </summary>
      <div className="notification-popover">
        <div className="notification-heading">
          <strong>Thông báo</strong>
          <span>Deadline sắp tới</span>
        </div>
        {deadlines.length ? (
          <div className="notification-list">
            {deadlines.map((deadline) => (
              <Link className="notification-item" href={`/deadlines/${deadline.id}`} key={deadline.id}>
                <span className="notification-dot" aria-hidden="true" />
                <span><strong>{deadline.title}</strong><small>Hạn nộp {new Date(deadline.dueDate).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })}</small></span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="notification-empty">Chưa có deadline sắp tới.</p>
        )}
        <Link className="notification-all" href="/deadlines">Xem tất cả deadline <span aria-hidden="true">↗</span></Link>
      </div>
    </details>
  );
}
