import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { getUpcomingDeadlineNotifications } from "@/lib/data";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const notifications = await getUpcomingDeadlineNotifications();

  return (
    <>
      <SiteHeader notifications={notifications} />
      <main className="app-main">{children}</main>
    </>
  );
}
