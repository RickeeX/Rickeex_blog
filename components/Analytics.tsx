'use client'

import Script from 'next/script'
import siteMetadata from '@/data/siteMetadata'

export default function Analytics() {
  // Umami Analytics
  if (siteMetadata.analytics?.umamiAnalytics?.umamiWebsiteId) {
    return (
      <Script
        async
        defer
        data-website-id={siteMetadata.analytics.umamiAnalytics.umamiWebsiteId}
        src={siteMetadata.analytics.umamiAnalytics.src || 'https://analytics.umami.is/script.js'}
      />
    )
  }

  // Google Analytics
  if (siteMetadata.analytics?.googleAnalytics?.googleAnalyticsId) {
    return (
      <>
        <Script
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=${siteMetadata.analytics.googleAnalytics.googleAnalyticsId}`}
        />
        <Script strategy="lazyOnload" id="ga-script">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${siteMetadata.analytics.googleAnalytics.googleAnalyticsId}');
          `}
        </Script>
      </>
    )
  }

  // Plausible Analytics
  if (siteMetadata.analytics?.plausibleAnalytics?.plausibleDataDomain) {
    return (
      <Script
        strategy="lazyOnload"
        data-domain={siteMetadata.analytics.plausibleAnalytics.plausibleDataDomain}
        src={
          siteMetadata.analytics.plausibleAnalytics.src || 'https://plausible.io/js/plausible.js'
        }
      />
    )
  }

  return null
}
