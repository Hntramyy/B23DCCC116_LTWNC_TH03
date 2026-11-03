import Link from "next/link";

export default function PublicNotFound() {
  return (
    <div className="access-page">
      <div className="access-card">
        <span className="access-code">404 · KHÔNG TÌM THẤY</span>
        <h1>Deadline này không tồn tại.</h1>
        <p>Có thể deadline đã bị xóa hoặc đường dẫn chưa chính xác.</p>
        <Link className="button button-dark" href="/deadlines">Quay lại lịch deadline</Link>
      </div>
    </div>
  );
}
