"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toggleCompletion } from "@/lib/actions";

export function CompleteButton({
  deadlineId,
}: {
  deadlineId: string;
}) {
  const { data: session, status } = useSession();
  const [completed, setCompleted] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [state, action, pending] = useActionState(toggleCompletion, { error: "" });

  useEffect(() => {
    if (!session?.user) return;
    let active = true;
    fetch(`/api/deadlines/${deadlineId}/completion`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Không thể tải trạng thái hoàn thành. Vui lòng tải lại trang.");
        return (await response.json()) as { completed: boolean };
      })
      .then((result) => {
        if (active) {
          setCompleted(result.completed);
          setChecking(false);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setLoadError(error instanceof Error ? error.message : "Không thể tải trạng thái deadline.");
          setChecking(false);
        }
      });
    return () => { active = false; };
  }, [deadlineId, session?.user]);

  if (status === "loading") return <p className="countdown">Đang kiểm tra tài khoản…</p>;
  if (!session?.user) {
    return <Link className="button button-dark" href={`/login?callbackUrl=${encodeURIComponent(`/deadlines/${deadlineId}`)}`}>Đăng nhập để đánh dấu</Link>;
  }
  const isCompleted = state.completed ?? completed;
  return (
    <form action={action}>
      <input name="deadlineId" type="hidden" value={deadlineId} />
      <button className={`button ${isCompleted ? "button-success" : "button-dark"}`} disabled={pending || checking || Boolean(loadError)} type="submit">
        {pending ? "Đang lưu…" : checking ? "Đang tải trạng thái…" : isCompleted ? "✓ Đã hoàn thành (bỏ đánh dấu)" : "Đánh dấu hoàn thành"}
      </button>
      {loadError && <p className="form-error" role="alert">{loadError}</p>}
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
    </form>
  );
}
