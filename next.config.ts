import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

const nextConfig: NextConfig = {
    output: "standalone",
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "randomuser.me",
            },
        ],
    },
};

export default withSentryConfig(nextConfig, {
    org: "i-don-have-a-business",
    project: "owncardly",

    // Uploads source maps when SENTRY_AUTH_TOKEN is set (CI / Vercel).
    authToken: process.env.SENTRY_AUTH_TOKEN,
    widenClientFileUpload: true,

    // Only print source map upload logs in CI.
    silent: !process.env.CI,
});
