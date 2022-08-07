import { RemixBrowser } from '@remix-run/react';
import { hydrate } from 'react-dom';
import { ClientProvider } from '@mantine/remix';

// import { useEffect } from "react";

// Sentry.init({
//   dsn: process.env.SENTRY_DSN,
//   tracesSampleRate: 1,
//   integrations: [
//     new Sentry.BrowserTracing({
//       routingInstrumentation: Sentry.remixRouterInstrumentation(
//         useEffect,
//         useLocation,
//         useMatches,
//       ),
//     }),
//   ],
//   // ...
// });

hydrate(
  <ClientProvider>
    <RemixBrowser />
  </ClientProvider>,
  document
);