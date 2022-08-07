import { renderToString } from 'react-dom/server';
import { RemixServer } from '@remix-run/react';
import type { EntryContext } from '@remix-run/node';
import { injectStyles, createStylesServer } from '@mantine/remix';


// Sentry.init({
//   dsn: process.env.SENTRY_DSN,
//   tracesSampleRate: 1,
//   integrations: [new Sentry.Integrations.Prisma({ client: db })],
//   // ...
// });

const server = createStylesServer();

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  let markup = renderToString(<RemixServer context={remixContext} url={request.url} />);
  responseHeaders.set('Content-Type', 'text/html');

  return new Response(`<!DOCTYPE html>${injectStyles(markup, server)}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}