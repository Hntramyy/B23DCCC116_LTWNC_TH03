import Link from "next/link";

export const metadata = { title: "Không có quyền truy cập", robots: { index: false, follow: false } };

export default function ForbiddenPage() {
  return (
    <div className="access-page">
      <div className="access-card">
        <span className="access-code">403 · KHÔNG ĐỦ QUYỀN</span>
        <h1>Khu vực dành cho lớp trưởng.</h1>
        <p>Tài khoản sinh viên không có quyền quản lý deadline của lớp.</p>
        <Link className="button button-dark" href="/dashboard">Về trang cá nhân</Link>
      </div>
    </div>
  );
}
