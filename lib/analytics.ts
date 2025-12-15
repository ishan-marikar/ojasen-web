// lib/analytics.ts
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Extend window interface for Google Analytics
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Initialize Google Analytics
export const initGoogleAnalytics = () => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: any[]) {
      window.dataLayer.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Track page views
export const usePageView = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      initGoogleAnalytics();
    }
  }, []);

  useEffect(() => {
    if (pathname && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        page_path: pathname,
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }, [pathname]);
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track authentication events
export const trackAuthEvent = (action: string, method: string) => {
  trackEvent(action, 'Authentication', method);
};

// Track booking events
export const trackBookingEvent = (action: string, service: string) => {
  trackEvent(action, 'Booking', service);
};

// Track navigation events
export const trackNavigation = (page: string) => {
  trackEvent('page_view', 'Navigation', page);
};

// Track CTA clicks
export const trackCTA = (action: string, location: string, label?: string) => {
  trackEvent(action, 'CTA', label || location);
};