import type { ReactNode } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { getUpcomingDeadlineNotifications } from "@/lib/data";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const notifications = await getUpcomingDeadlineNotifications();

  return (
    <>
      <SiteHeader notifications={notifications} />
      <main className="page-shell">{children}</main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <span>© 2026 Deadline Hub · Lớp học tập tốt, không trễ deadline.</span>
          <div className="footer-links"><Link href="/deadlines">Tất cả deadline</Link><Link href="/login">Tài khoản</Link></div>
        </div>
      </footer>
    </>
  );
}
