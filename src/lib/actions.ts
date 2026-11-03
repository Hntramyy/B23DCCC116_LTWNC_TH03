"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { can } from "@/lib/authorization";
import { getStoreSnapshot, saveStore } from "@/lib/data";

type ActionState = { error: string; success?: string };
type CompletionState = { error: string; completed?: boolean };

function readField(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

async function requirePermission(action: Parameters<typeof can>[1]) {
  const session = await auth();
  if (!session?.user || !can(session.user.role, action)) {
    throw new Error("Bạn không có quyền thực hiện thao tác này.");
  }
  return session.user;
}

export async function toggleCompletion(
  _previousState: CompletionState,
  formData: FormData,
): Promise<CompletionState> {
  const user = await requirePermission("complete_deadline");
  const deadlineId = readField(formData, "deadlineId");
  if (!/^[a-zA-Z0-9-]{1,40}$/.test(deadlineId)) {
    return { error: "Mã deadline không hợp lệ." };
  }

  const snapshot = await getStoreSnapshot();
  const store = snapshot.store;
  const deadline = store.deadlines.find((entry) => entry.id === deadlineId);
  if (!deadline) return { error: "Deadline không tồn tại." };

  const wasCompleted = deadline.completedBy.includes(user.id);
  deadline.completedBy = deadline.completedBy.filter((id) => id !== user.id);
  if (!wasCompleted) deadline.completedBy.push(user.id);
  await saveStore(store, snapshot.etag);
  revalidatePath("/dashboard", "layout");
  revalidatePath(`/deadlines/${deadline.id}`);
  return { error: "", completed: !wasCompleted };
}

export async function addDeadline(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requirePermission("add_deadline");
  const title = readField(formData, "title");
  const subjectSlug = readField(formData, "subjectSlug");
  const dueDateValue = readField(formData, "dueDate");
  const type = readField(formData, "type");
  const description = readField(formData, "description");
  const validLocalDate = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dueDateValue);
  const dueDate = new Date(`${dueDateValue}:00+07:00`);

  if (title.length < 3 || title.length > 120) {
    return { error: "Tên deadline phải có từ 3 đến 120 ký tự." };
  }
  if (type.length < 2 || type.length > 40) {
    return { error: "Loại bài phải có từ 2 đến 40 ký tự." };
  }
  if (description.length > 1000) {
    return { error: "Mô tả không được dài quá 1000 ký tự." };
  }
  if (!validLocalDate || !Number.isFinite(dueDate.getTime())) {
    return { error: "Vui lòng nhập hạn nộp hợp lệ." };
  }

  const snapshot = await getStoreSnapshot();
  const store = snapshot.store;
  if (!store.subjects.some((subject) => subject.slug === subjectSlug)) {
    return { error: "Môn học đã chọn không hợp lệ." };
  }

  const newId = String(
    Math.max(0, ...store.deadlines.map((deadline) => Number(deadline.id) || 0)) + 1,
  );
  store.deadlines.push({
    id: newId,
    title,
    description,
    subjectSlug,
    dueDate: dueDate.toISOString(),
    type,
    completedBy: [],
  });
  await saveStore(store, snapshot.etag);
  revalidatePath("/");
  revalidatePath("/deadlines");
  revalidatePath("/subjects/[slug]", "page");
  revalidatePath(`/deadlines/${newId}`);
  revalidatePath("/sitemap.xml");
  return { error: "", success: "Đã thêm deadline thành công." };
}

export async function deleteDeadline(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requirePermission("delete_deadline");
  const deadlineId = readField(formData, "deadlineId");
  if (!/^[a-zA-Z0-9-]{1,40}$/.test(deadlineId)) {
    return { error: "Mã deadline không hợp lệ." };
  }

  const snapshot = await getStoreSnapshot();
  const store = snapshot.store;
  const existing = store.deadlines.find((deadline) => deadline.id === deadlineId);
  if (!existing) return { error: "Deadline không tồn tại." };
  store.deadlines = store.deadlines.filter((deadline) => deadline.id !== deadlineId);
  await saveStore(store, snapshot.etag);
  revalidatePath("/");
  revalidatePath("/deadlines");
  revalidatePath("/subjects/[slug]", "page");
  revalidatePath(`/deadlines/${deadlineId}`);
  revalidatePath("/sitemap.xml");
  return { error: "", success: `Đã xóa “${existing.title}”.` };
}
