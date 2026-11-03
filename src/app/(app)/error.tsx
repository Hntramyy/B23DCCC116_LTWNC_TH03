"use client";

export default function AppError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="error-card" role="alert">
      <span className="eyebrow">ĐÃ CÓ LỖI XẢY RA</span>
      <h1>Không thể tải dữ liệu</h1>
      <p>Vui lòng thử lại sau ít phút.</p>
      <button className="button button-dark" onClick={reset} type="button">Thử lại</button>
    </div>
  );
}
