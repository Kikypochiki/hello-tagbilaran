import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "stratcom.tagbilaran.gov.ph",
        pathname: "/images/tourism/**",
      },
    ],
  },
};

export default nextConfig;
