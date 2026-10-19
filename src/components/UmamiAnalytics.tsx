'use client';

import Script from 'next/script';

// Only loaded when a website ID is configured.
const UMAMI_SCRIPT_URL = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL || 'https://analytics.umami.is/script.js';
const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
// Optional comma-separated hostnames to limit tracking to (e.g. the production domain).
const UMAMI_DOMAINS = process.env.NEXT_PUBLIC_UMAMI_DOMAINS;

export default function UmamiAnalytics() {
  if (!UMAMI_WEBSITE_ID) {
    return null;
  }

  return (
    <Script
      src={UMAMI_SCRIPT_URL}
      data-website-id={UMAMI_WEBSITE_ID}
      strategy="afterInteractive"
      data-domains={UMAMI_DOMAINS}
    />
  );
}
