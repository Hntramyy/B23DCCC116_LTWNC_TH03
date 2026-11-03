import { ImageResponse } from "next/og";
import { getDeadline, getSubjects } from "@/lib/data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const [deadline, subjects] = await Promise.all([getDeadline(id), getSubjects()]);
  if (!deadline) return new Response("Not found", { status: 404 });

  const subject = subjects.find((item) => item.slug === deadline.subjectSlug);
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 76px", background: "#f5f8f2", color: "#20342c", fontFamily: "sans-serif" }}>
      <span style={{ fontSize: 26, fontWeight: 700 }}>deadline<span style={{ color: "#2f7459" }}>hub</span></span>
      <span style={{ display: "flex", fontSize: 20, color: "#50735d", letterSpacing: 3, textTransform: "uppercase" }}>{subject?.code ?? "DEADLINE LỚP HỌC"} · {deadline.type}</span>
      <span style={{ display: "flex", maxWidth: 1020, fontSize: 55, lineHeight: 1.15, fontWeight: 700 }}>{deadline.title}</span>
      <span style={{ display: "flex", fontSize: 22, color: "#64746d" }}>{subject?.name ?? "Theo dõi deadline lớp"} · {new Date(deadline.dueDate).toLocaleDateString("vi-VN")}</span>
    </div>,
    { width: 1200, height: 630 },
  );
}
