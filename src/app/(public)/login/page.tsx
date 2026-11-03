import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Đăng nhập",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl?.startsWith("/") && !params.callbackUrl.startsWith("//")
    ? params.callbackUrl
    : "/deadlines";

  return (
    <section className="login-area">
      <div className="login-card">
        <Link aria-label="Deadline Hub" className="brand" href="/">
          <span className="brand-mark">D</span><span>deadline<span className="brand-accent">hub</span></span>
        </Link>
        <h1>Chào mừng trở lại</h1>
        <p>Đăng nhập để theo dõi tiến độ deadline của bạn.</p>
        <LoginForm
          callbackUrl={callbackUrl}
          failed={Boolean(params.error)}
          githubEnabled={Boolean(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET)}
        />
      </div>
    </section>
  );
}
