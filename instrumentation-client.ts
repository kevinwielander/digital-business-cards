import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,

    // Tracing: 100% in development, 10% in production.
    tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,

    integrations: [
        Sentry.replayIntegration(),
        Sentry.feedbackIntegration({ colorScheme: "system" }),
    ],

    // Session Replay: 10% of sessions, 100% of sessions with an error.
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
