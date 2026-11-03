import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dashboard-layout">
      <DashboardSidebar />
      <section className="dashboard-content">{children}</section>
    </div>
  );
}
