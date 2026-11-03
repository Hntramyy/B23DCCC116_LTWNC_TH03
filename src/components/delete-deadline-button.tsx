"use client";

import { useActionState } from "react";
import { deleteDeadline } from "@/lib/actions";

export function DeleteDeadlineButton({ id }: { id: string }) {
  const [state, action, pending] = useActionState(deleteDeadline, { error: "", success: "" });

  return (
    <form action={action} className="delete-form">
      <input name="deadlineId" type="hidden" value={id} />
      <button className="button button-danger button-small" disabled={pending} type="submit">
        {pending ? "Đang xóa…" : "Xóa"}
      </button>
      {state.error && <span className="form-error" role="alert">{state.error}</span>}
    </form>
  );
}
