import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the Next.js dev-mode indicator (the black circular "N" badge fixed to
  // the bottom-left in development). It is Next's built-in devtools button, not
  // a project element, and never renders in production — disabled so it stops
  // appearing over the design while reviewing.
  devIndicators: false,
  images: {
    remotePatterns: [
      // Sanity-hosted listing/blog media (project 1tsx0da7).
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" },
      // Testimonial placeholder headshots (components/sections/Testimonials.tsx).
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
