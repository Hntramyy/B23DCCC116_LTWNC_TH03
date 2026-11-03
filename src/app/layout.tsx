import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/app/providers";
import "./globals.css";

const interfaceFont = Inter({
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-interface",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Deadline Hub — Theo dõi deadline lớp học",
    template: "%s | Deadline Hub",
  },
  description: "Cổng deadline lớp học — lịch nộp bài minh bạch, dễ theo dõi và không bỏ lỡ.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={interfaceFont.variable} lang="vi">
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
