// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

if (process.env.NEXT_PUBLIC_IS_DEBUG_SENTRY !== 'true') {
  Sentry.init({
    dsn: "https://8ef553ecc98187ba3564cbd9dd0f3395@o4506395017216000.ingest.sentry.io/4506511612968960",

    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
  });
}