# Sổ tay Sudoku

Trang web hướng dẫn giải Sudoku bằng tiếng Việt, xếp các kỹ thuật theo độ sâu suy luận:

- **Suy luận 1 bước** — nhìn là điền được: ô trống cuối cùng, số duy nhất trong khối/hàng/cột, ô chỉ còn một số.
- **Suy luận 2 bước** — loại trước, điền sau: khoá ứng viên (chỉ hướng, chiếm khối), cặp lộ, cặp ẩn, bộ ba lộ, bộ ba ẩn.
- **Suy luận N bước** — chuỗi lập luận: X-Wing, Swordfish, toà nhà chọc trời, cánh diều hai dây, XY-Wing, XYZ-Wing, W-Wing, tô màu đơn, hình chữ nhật duy nhất, BUG+1, chuỗi XY.

Mỗi kỹ thuật có một ví dụ lấy từ đề thật, đi qua từng bước: số gây chặn được khoanh tròn, tia chặn có mũi tên, ô bị chặn đánh dấu ×, đường chấm nối ô bị loại với các ô mẫu hình mà nó nhìn thấy, liên kết mạnh/yếu, dải số 1–9 cho các kỹ thuật đếm số. Cuối mỗi trang kỹ thuật có mục nguồn tham khảo (HoDoKu, SudokuWiki; danh sách trong `content/sources.ts`). Ngoài ra có trang cơ bản, giải mẫu trọn vẹn một đề, bảng tóm tắt in được, thuật ngữ, tìm kiếm không dấu (phím `/` hoặc `Ctrl/⌘ K`), nền tối, và đánh dấu tiến độ học (lưu trong trình duyệt, không có máy chủ hay CSDL).

## Chạy

```bash
npm install
npm run dev
```

## Deploy lên GitHub Pages

Site được xuất tĩnh (`output: "export"`) ra thư mục `out/`. Workflow [.github/workflows/deploy.yml](.github/workflows/deploy.yml) tự build và deploy mỗi khi push lên `main` (hoặc chạy tay ở tab Actions).

Thiết lập một lần: vào **Settings → Pages → Build and deployment → Source**, chọn **GitHub Actions**.

Site chạy ở gốc tên miền riêng `sudoku.nguyentuan.dev` (cấu hình trong Settings → Pages → Custom domain), nên workflow build với `PAGES_BASE_PATH` rỗng. Nếu bỏ tên miền riêng và quay lại `chidokun.github.io/sudoku-handbook`, đổi `PAGES_BASE_PATH` trong workflow thành `/sudoku-handbook`.

Xem thử bản build ở máy: `npm run build` rồi `npm start`.

## Dữ liệu ví dụ

Ví dụ không viết tay mà được sinh bởi bộ giải trong `lib/sudoku/`:

1. `scripts/build-examples.ts` tạo 40.000 đề ngẫu nhiên có lời giải duy nhất, giải từng đề theo thứ tự kỹ thuật từ dễ đến khó, và chọn thế cờ minh hoạ rõ nhất cho mỗi kỹ thuật (ưu tiên thế cờ mà phép loại mở ra ngay một bước điền số).
2. Mọi phép điền và phép loại trong ví dụ được đối chiếu với lời giải duy nhất trước khi ghi ra `data/examples.json` và `data/walkthrough.json`.

```bash
npm run examples       # sinh lại data/*.json (~2 phút)
npm run check:solver   # kiểm tra mọi kỹ thuật trên 5.000 đề ngẫu nhiên
```

Script chạy trực tiếp bằng Node ≥ 23 (hỗ trợ TypeScript sẵn), không cần công cụ build.

## Cấu trúc

- `app/` — các trang (Next.js App Router, toàn bộ sinh tĩnh)
- `components/Board.tsx` — bàn cờ SVG dùng cho mọi hình minh hoạ
- `content/` — nội dung tiếng Việt: kỹ thuật, tầng suy luận, thuật ngữ
- `lib/sudoku/` — lõi Sudoku, bộ tìm kỹ thuật, bộ sinh đề
- `scripts/` — sinh và kiểm chứng ví dụ
