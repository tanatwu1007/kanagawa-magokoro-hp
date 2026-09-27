import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 既存の静的HTMLページはpublic/から配信
  // Next.jsのページは/casesと/apiのみ
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "*.fbcdn.net",
      },
    ],
  },
};

export default nextConfig;
