import Link from "next/link";

export default function NotFound() {
  return (
    <div className="access-page">
      <div className="access-card">
        <span className="access-code">404 · KHÔNG TÌM THẤY</span>
        <h1>Trang này không tồn tại.</h1>
        <p>Liên kết có thể đã thay đổi hoặc không còn khả dụng.</p>
        <Link className="button button-dark" href="/">Về trang chủ</Link>
      </div>
    </div>
  );
}
