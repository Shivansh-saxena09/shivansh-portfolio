import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Default is 1MB, too small for real case-study creative uploads
      // (GalleryManager) which are ordinary phone/camera photos —
      // several MB is normal. Set with headroom above the 8MB limit
      // actually enforced in the upload action + client-side check, so
      // a file that passes that check never hits this ceiling and
      // triggers Next's raw "Body exceeded" crash screen.
      bodySizeLimit: "10mb",
    },
  },
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
