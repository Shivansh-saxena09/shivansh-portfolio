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
    ],
  },
};

export default nextConfig;
