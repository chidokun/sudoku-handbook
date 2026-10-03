import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[680px] px-4 py-24 text-center sm:px-6">
      <p className="font-hand text-7xl text-pen">?</p>
      <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight">Không tìm thấy trang này</h1>
      <p className="mt-3 text-ink-2">Đường dẫn có thể đã đổi. Hãy về danh sách kỹ thuật hoặc dùng ô tìm kiếm ở đầu trang.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/ky-thuat" className="inline-flex h-11 items-center rounded-xl bg-ink px-5 font-semibold text-paper no-underline">
          Xem các kỹ thuật
        </Link>
        <Link href="/" className="inline-flex h-11 items-center rounded-xl border border-rule px-5 font-semibold no-underline">
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
