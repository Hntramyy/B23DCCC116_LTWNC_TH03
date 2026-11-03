import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { can } from "@/lib/authorization";
import { getDeadline } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user || !can(session.user.role, "view_deadlines")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const deadline = await getDeadline(id);
  if (!deadline) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(
    { completed: deadline.completedBy.includes(session.user.id) },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
