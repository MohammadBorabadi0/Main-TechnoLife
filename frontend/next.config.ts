import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "www.technolife.ir",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "technolife.ir",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "srvksnqjdyrlfxnvguri.supabase.co",
                pathname: "**",
            },
            {
                protocol: "http",
                hostname: "localhost",
                pathname: "**",
            },
        ],
    },
};

export default nextConfig;
