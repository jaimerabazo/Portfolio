/** @type {import('next').NextConfig} */
// GitHub Pages: set NEXT_PUBLIC_BASE_PATH to "/<repo-name>" when deploying
// to https://<user>.github.io/<repo-name>. Leave empty for user-site repos
// (e.g. username.github.io) or for Vercel/Netlify.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
