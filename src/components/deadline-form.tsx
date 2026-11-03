"use client";

import { useActionState } from "react";
import { addDeadline } from "@/lib/actions";
import type { Subject } from "@/lib/types";

export function DeadlineForm({ subjects }: { subjects: Subject[] }) {
  const [state, action, pending] = useActionState(addDeadline, { error: "", success: "" });

  return (
    <form action={action} className="admin-form" id="add-deadline">
      <div className="form-heading">
        <span className="eyebrow">QUẢN LÝ LỊCH HỌC</span>
        <h2>Thêm deadline mới</h2>
        <p>Chia sẻ lịch nộp bài để cả lớp cùng theo dõi.</p>
      </div>
      <label>Tên deadline<input maxLength={120} name="title" placeholder="Ví dụ: Bài tập lớn — Giai đoạn 1" required /></label>
      <label>Môn học
        <select name="subjectSlug" required>
          {subjects.map((subject) => <option key={subject.slug} value={subject.slug}>{subject.name}</option>)}
        </select>
      </label>
      <div className="form-grid">
        <label>Hạn nộp<input name="dueDate" required type="datetime-local" /></label>
        <label>Loại bài<input maxLength={40} name="type" placeholder="Bài tập lớn" required /></label>
      </div>
      <label>Mô tả<textarea maxLength={1000} name="description" placeholder="Thông tin cần biết..." rows={3} /></label>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      {state.success && <p className="form-success" role="status">{state.success}</p>}
      <button className="button button-dark" disabled={pending} type="submit">{pending ? "Đang thêm…" : "＋ Thêm deadline"}</button>
    </form>
  );
}
