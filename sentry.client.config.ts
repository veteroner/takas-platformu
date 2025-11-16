import * as Sentry from '@sentry/nextjs'

// Client-side Sentry Initialization
// Runs on the browser and inside the WebView (Capacitor)
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN || undefined,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
  // Adjust in production; 1.0 = capture all (start with low values in prod)
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  replaysSessionSampleRate: 0.0,
  replaysOnErrorSampleRate: 0.5,
  // Route tunnel to avoid adblockers if you later proxy it on your domain
  tunnel: '/monitoring',
  integrations: [
    Sentry.browserTracingIntegration(),
    // Disable replay by default; can enable later
  ],
  // Only enable if DSN present
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN),
})
