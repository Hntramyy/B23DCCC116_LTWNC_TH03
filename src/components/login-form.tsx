"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export function LoginForm({
  callbackUrl,
  failed,
  githubEnabled,
}: {
  callbackUrl: string;
  failed: boolean;
  githubEnabled: boolean;
}) {
  const [error, setError] = useState(failed ? "Email hoặc mật khẩu chưa chính xác." : "");
  const [pending, setPending] = useState(false);

  async function submit(formData: FormData) {
    setPending(true);
    setError("");
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
      callbackUrl,
    });
    setPending(false);
    if (!result || result.error) {
      setError("Email hoặc mật khẩu chưa chính xác.");
      return;
    }
    window.location.assign(result.url ?? callbackUrl);
  }

  async function signInWithGitHub() {
    setPending(true);
    setError("");
    await signIn("github", { callbackUrl });
  }

  return (
    <form action={submit} className="login-form">
      <label>Email<input autoComplete="email" name="email" placeholder="name@ptit.edu.vn" required type="email" /></label>
      <label>Mật khẩu<input autoComplete="current-password" name="password" placeholder="Nhập mật khẩu" required type="password" /></label>
      {error && <p className="login-error" role="alert">{error}</p>}
      <button className="button button-dark" disabled={pending} type="submit">{pending ? "Đang đăng nhập…" : "Đăng nhập"}</button>
      {githubEnabled && (
        <>
          <div className="login-divider"><span>hoặc</span></div>
          <button className="button button-outline" disabled={pending} onClick={signInWithGitHub} type="button">
            {pending ? "Đang chuyển tới GitHub…" : "Đăng nhập với GitHub"}
          </button>
        </>
      )}
    </form>
  );
}
