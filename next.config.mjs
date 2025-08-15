/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    // Increase the size limit for base64 encoded images
    dangerouslyAllowSVG: true,
    domains: ["localhost"],
    // Allow data URLs for cropped images
    unoptimized: true,
  },
  // Updated config with correct property name
  experimental: {
    // Empty to avoid warnings
  },
  // Proper location for external packages config
  serverExternalPackages: ["sharp"],
};

export default nextConfig;
