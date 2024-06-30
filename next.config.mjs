/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fdhollsltcvmcaicpajz.supabase.co",
        port: "",
      },
    ],
  },
};

export default nextConfig;
