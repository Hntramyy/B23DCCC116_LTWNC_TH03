import type { CSSProperties } from "react";
import type { Subject } from "@/lib/types";

const symbols: Record<string, string> = {
  "lap-trinh-web": "</>",
  "co-so-du-lieu": "▤",
  "mang-may-tinh": "⌁",
  "phan-tich-thiet-ke": "◇",
};

export function SubjectCover({ subject, large = false }: { subject: Subject; large?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`subject-cover${large ? " subject-cover-large" : ""}`}
      style={{ "--cover-accent": subject.accent } as CSSProperties}
    >
      <span className="subject-cover-code">{subject.code}</span>
      <span className="subject-cover-symbol">{symbols[subject.slug] ?? "✳"}</span>
      <span className="subject-cover-caption">CLASS · COURSEWORK</span>
    </div>
  );
}
