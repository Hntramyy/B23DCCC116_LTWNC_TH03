import type { Permission, Role } from "@/lib/types";

const permissions: Record<Role, readonly Permission[]> = {
  guest: ["view_deadlines"],
  user: ["view_deadlines", "complete_deadline", "access_dashboard"],
  admin: [
    "view_deadlines",
    "complete_deadline",
    "add_deadline",
    "delete_deadline",
    "access_dashboard",
    "access_admin",
  ],
};

export function can(role: Role, action: Permission): boolean {
  return permissions[role].includes(action);
}
