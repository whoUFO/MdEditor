import { session } from 'electron';

export function setupCSP(): void {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; " +
          "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdnjs.cloudflare.com; " +
          "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; " +
          "img-src 'self' data: https:; " +
          "font-src 'self' data: https://cdnjs.cloudflare.com; " +
          "connect-src 'self' ws://localhost:* http://localhost:*; "
        ],
      },
    });
  });
}
