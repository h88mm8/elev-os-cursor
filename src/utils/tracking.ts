// Google Tag Manager integration
export function initializeGTM(gtmId: string) {
  if (!gtmId) return

  // Script GTM
  const script1 = document.createElement('script')
  script1.innerHTML = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gtmId}');
  `
  document.head.appendChild(script1)

  // Noscript GTM
  const noscript = document.createElement('noscript')
  noscript.innerHTML = `
    <iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe>
  `
  document.body.insertBefore(noscript, document.body.firstChild)
}

// Push event to GTM
export function pushTrackingEvent(event: string, data?: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event,
      ...data,
    })
  }
}

// Track page view
export function trackPageView(url: string, title?: string) {
  pushTrackingEvent('page_view', {
    page_url: url,
    page_title: title || document.title,
  })
}

// Track CTA click
export function trackCTAClick(ctaId: string, ctaText: string) {
  pushTrackingEvent('cta_click', {
    cta_id: ctaId,
    cta_text: ctaText,
  })
}

// Track scroll
export function trackScroll(percentage: number) {
  pushTrackingEvent('scroll', {
    scroll_percentage: percentage,
  })
}

// Track custom event
export function trackEvent(eventName: string, data?: Record<string, any>) {
  pushTrackingEvent(eventName, data)
}

declare global {
  interface Window {
    dataLayer?: any[]
  }
}

