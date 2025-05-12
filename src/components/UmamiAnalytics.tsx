'use client';

import Script from 'next/script';

// Replace with your actual Umami script URL and website ID
const UMAMI_SCRIPT_URL = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL || 'https://analytics.umami.is/script.js';
const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

export default function UmamiAnalytics() {
  if (!UMAMI_WEBSITE_ID) {
    return null;
  }

  return (
    <Script
      src={UMAMI_SCRIPT_URL}
      data-website-id={UMAMI_WEBSITE_ID}
      strategy="afterInteractive"
      data-domains="yourdomain.com"
    />
  );
}
