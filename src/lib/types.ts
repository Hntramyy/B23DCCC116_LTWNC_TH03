export type Role = "guest" | "user" | "admin";

export type Permission =
  | "view_deadlines"
  | "complete_deadline"
  | "add_deadline"
  | "delete_deadline"
  | "access_dashboard"
  | "access_admin";

export type Subject = {
  slug: string;
  name: string;
  code: string;
  accent: string;
  description: string;
};

export type Deadline = {
  id: string;
  title: string;
  description: string;
  subjectSlug: string;
  dueDate: string;
  type: string;
  completedBy: string[];
};

export type DeadlineStore = {
  subjects: Subject[];
  deadlines: Deadline[];
};
