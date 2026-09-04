import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Case-study gallery images live in Supabase Storage's public bucket
    // (see src/lib/data/caseStudies.ts's mediaPublicUrl) — next/image
    // requires every external host serving optimized images to be
    // explicitly allowlisted.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // YouTube video thumbnails, for the lite demo-video embed on
        // project pages (src/components/project/YouTubeEmbed.tsx).
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
};

export default nextConfig;
