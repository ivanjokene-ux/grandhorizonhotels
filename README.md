# Grand Horizon Hotels

Cloudflare Pages-ready static website.

## Structure

- `index.html` — application shell and page markup
- `assets/css/styles.css` — site styles
- `assets/js/app.js` — browser-side application logic
- `404.html` — Cloudflare Pages fallback page
- `_headers` — Pages response-header configuration
- `_redirects` — Pages redirect rules

## Cloudflare Pages

This is a static HTML project. Deploy the repository root as the Pages build output directory. No framework build step is required.

## Important

The current demo stores account, wallet and transaction state in browser `localStorage`. Real authentication, payments, withdrawals and persistent user data require a secure server-side backend and payment provider.
