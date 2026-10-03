import type { NextConfig } from "next";

// GitHub Pages phục vụ site dự án dưới /<tên-repo>; workflow truyền đường dẫn này qua PAGES_BASE_PATH.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
