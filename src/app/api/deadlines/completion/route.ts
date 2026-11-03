import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { can } from "@/lib/authorization";
import { getDeadlines } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user || !can(session.user.role, "view_deadlines")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const completedIds = (await getDeadlines())
    .filter((deadline) => deadline.completedBy.includes(session.user.id))
    .map((deadline) => deadline.id);

  return NextResponse.json(
    { completedIds },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
