"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { WorkspaceNav } from "@/components/workspace-nav";
import { DeadlineNotifications } from "@/components/deadline-notifications";
import type { Deadline } from "@/lib/types";

export function SiteHeader({ notifications = [] }: { notifications?: Pick<Deadline, "id" | "title" | "dueDate">[] }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const roleLabel = session?.user.role === "admin" ? "Admin" : "Sinh viên";
  const isWorkspace = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  const avatarInitial = session?.user.name?.trim().split(/\s+/).at(-1)?.[0]?.toLocaleUpperCase("vi-VN") ?? "U";

  return (
    <header className="site-header">
      <div className={`header-inner${isWorkspace ? " header-inner-workspace" : ""}`}>
        <Link className="brand" href="/" aria-label="Deadline Hub - Trang chủ">
          <span className="brand-mark">D</span>
          <span>deadline<span className="brand-accent">hub</span></span>
        </Link>
        {session ? (
          <WorkspaceNav isAdmin={session.user.role === "admin"} />
        ) : (
          <nav className="main-nav" aria-label="Điều hướng chính">
            <Link aria-current={pathname.startsWith("/deadlines") ? "page" : undefined} href="/deadlines">Deadline lớp</Link>
            <Link aria-current={pathname.startsWith("/subjects") ? "page" : undefined} href="/subjects">Môn học</Link>
          </nav>
        )}
        <div className="header-account">
          {status === "loading" ? (
            <span className="account-loading" aria-label="Đang tải tài khoản" />
          ) : session ? (
            <>
              <DeadlineNotifications deadlines={notifications} />
              <Link aria-label={`Tài khoản ${session.user.name}`} className="account-avatar" href="/dashboard">
                {avatarInitial}
              </Link>
              <span className="account-copy">
                <strong>{session.user.name}</strong>
                <small>{roleLabel}</small>
              </span>
              <button
                className="button button-outline button-small"
                onClick={() => signOut({ callbackUrl: "/" })}
                type="button"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <Link className="button button-dark button-small" href="/login">
              Đăng nhập <span aria-hidden="true">↗</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
