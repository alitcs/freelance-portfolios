# NewPortfolio

A single-page portfolio creation service website built with React, TypeScript, and Vite. The short application form sends inquiries directly to a configured Formspree endpoint; there is no custom backend.

The opening price is displayed as `$99`. Update `priceDisplay` in `src/App.tsx` if the price changes.

## Run locally

```sh
npm install
cp .env.example .env.local
npm run dev
```

On Windows PowerShell, copy the example file with `Copy-Item .env.example .env.local`.

## Configure application delivery

1. Create a form at [Formspree](https://formspree.io/) and configure its notification email address.
2. Copy the form's endpoint URL (for example, `https://formspree.io/f/xxxxxxxx`).
3. Set `VITE_FORMSPREE_ENDPOINT` to that URL in `.env.local` for local development, or in the hosting provider's environment settings for deployment.
4. Restart the dev server after changing environment variables. Submit a test inquiry and confirm that the notification arrives in the configured inbox.

The form reports success only when the endpoint responds successfully. If no endpoint is configured, it shows an explicit setup error instead. Do not put private API keys or email credentials in frontend environment variables; Vite variables are included in the public client bundle. Formspree's public form endpoint is intended for browser submissions.

The form includes a hidden honeypot field for basic spam deterrence. For persistent spam, enable Formspree's available spam filtering or CAPTCHA options.

## Build

```sh
npm run build
npm run preview
```

The brand name, SEO metadata, structured data, and visual theme can be updated in `src/App.tsx`, `index.html`, and `src/styles.css`. The canonical URL and sitemap use `https://newportfolio.ca/`; update them if the production domain changes.
