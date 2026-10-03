import type { NextConfig } from "next";

// GitHub Pages phục vụ site dự án dưới /<tên-repo>; workflow truyền đường dẫn này qua PAGES_BASE_PATH.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  // Có hai root layout (en ở gốc, vi ở /vi) nên trang 404 dùng app/global-not-found.tsx.
  experimental: { globalNotFound: true },
};

export default nextConfig;
