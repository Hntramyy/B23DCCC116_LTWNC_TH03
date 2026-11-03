"use client";

export default function PublicError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container error-card" role="alert">
      <span className="eyebrow">ĐÃ CÓ LỖI XẢY RA</span>
      <h1>Chưa tải được nội dung</h1>
      <p>Hãy kiểm tra kết nối và thử tải lại trang.</p>
      <button className="button button-dark" onClick={reset} type="button">Thử lại</button>
    </div>
  );
}
