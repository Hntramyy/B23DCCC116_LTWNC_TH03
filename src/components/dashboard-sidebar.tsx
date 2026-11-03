"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sections = [
  { href: "/dashboard", label: "Tổng quan" },
  { href: "/dashboard/to-do", label: "Cần hoàn thành" },
  { href: "/dashboard/completed", label: "Đã hoàn thành" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside aria-label="Điều hướng không gian cá nhân" className="dashboard-sidebar">
      <span className="dashboard-sidebar-label">TIẾN ĐỘ CÁ NHÂN</span>
      <nav>
        {sections.map((section) => (
          <Link
            aria-current={pathname === section.href ? "page" : undefined}
            className="dashboard-sidebar-link"
            href={section.href}
            key={section.href}
          >
            {section.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
