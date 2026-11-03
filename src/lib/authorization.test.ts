import { describe, expect, it } from "@jest/globals";
import { can } from "./authorization";
import type { Permission, Role } from "./types";

const cases: { role: Role; action: Permission; allowed: boolean }[] = [
  { role: "guest", action: "view_deadlines", allowed: true },
  { role: "guest", action: "complete_deadline", allowed: false },
  { role: "guest", action: "add_deadline", allowed: false },
  { role: "guest", action: "delete_deadline", allowed: false },
  { role: "guest", action: "access_dashboard", allowed: false },
  { role: "guest", action: "access_admin", allowed: false },
  { role: "user", action: "view_deadlines", allowed: true },
  { role: "user", action: "complete_deadline", allowed: true },
  { role: "user", action: "add_deadline", allowed: false },
  { role: "user", action: "delete_deadline", allowed: false },
  { role: "user", action: "access_dashboard", allowed: true },
  { role: "user", action: "access_admin", allowed: false },
  { role: "admin", action: "view_deadlines", allowed: true },
  { role: "admin", action: "complete_deadline", allowed: true },
  { role: "admin", action: "add_deadline", allowed: true },
  { role: "admin", action: "delete_deadline", allowed: true },
  { role: "admin", action: "access_dashboard", allowed: true },
  { role: "admin", action: "access_admin", allowed: true },
];

describe("can", () => {
  it.each(cases)("$role can $action: $allowed", ({ role, action, allowed }) => {
    expect(can(role, action)).toBe(allowed);
  });
});
