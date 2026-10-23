# NewPortfolio

A single-page portfolio creation service website built with React, TypeScript, and Vite. The application form uses Netlify Forms; no custom backend or browser email credentials are required.

The opening price is displayed as `$99`. Update `priceDisplay` in `src/App.tsx` if the price changes.

## Run locally

```sh
npm install
npm run dev
```

The form can be viewed locally, but submissions are only processed by Netlify after deployment.

## Configure form notifications

1. Deploy the site to Netlify. The static form in `index.html` lets Netlify detect `portfolio-note` during the build; the visible React form posts to `/`.
2. In the Netlify site dashboard, open **Forms** and confirm `portfolio-note` is listed.
3. In the site's form notification settings, add an email notification for new submissions.
4. Submit a test inquiry on the deployed site and confirm the submission appears in Netlify and the notification arrives in your inbox.

If submission fails, the form keeps the entered details and provides a `mailto:` fallback. The form includes a hidden honeypot field for basic spam deterrence.

## Build

```sh
npm run build
npm run preview
```

The brand name, SEO metadata, structured data, and visual theme can be updated in `src/App.tsx`, `index.html`, and `src/styles.css`. The canonical URL and sitemap use `https://newportfolio.ca/`; update them if the production domain changes.
