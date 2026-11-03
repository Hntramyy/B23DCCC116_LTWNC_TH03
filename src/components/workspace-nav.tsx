"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/deadlines", label: "Deadline lớp", adminOnly: false },
  { href: "/subjects", label: "Môn học", adminOnly: false },
  { href: "/dashboard", label: "Không gian của tôi", adminOnly: false },
  { href: "/admin", label: "Quản lý deadline", adminOnly: true },
];

export function WorkspaceNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Điều hướng không gian" className="main-nav workspace-nav">
      {items.filter((item) => !item.adminOnly || isAdmin).map((item) => (
        <Link aria-current={pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`)) ? "page" : undefined} href={item.href} key={item.href}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
