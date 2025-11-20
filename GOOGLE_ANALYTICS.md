# Google Analytics Implementation

This document explains how Google Analytics has been implemented in the Ojasen Healing Arts website.

## Setup Instructions

1. Create a Google Analytics 4 property at https://analytics.google.com/
2. Get your Measurement ID (it looks like `G-XXXXXXXXXX`)
3. Add the following environment variable to your `.env.local` file:

```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Implementation Details

### Core Components

1. **Google Analytics Component** (`components/google-analytics.tsx`)

   - Handles loading the Google Analytics script
   - Only loads in production environment
   - Uses `next/script` for optimal loading

2. **Analytics Utility** (`lib/analytics.ts`)

   - Provides functions for tracking page views, events, and authentication
   - Includes custom tracking functions for specific use cases

3. **Root Layout Integration** (`app/layout.tsx`)
   - Includes the Google Analytics component in the root layout
   - Ensures tracking on all pages

### Tracking Features

1. **Page Views**

   - Automatic tracking of all page views using `usePathname` hook
   - Tracks page title and location

2. **Authentication Events**

   - Tracks sign-in and sign-up success events
   - Categorizes events under "Authentication"

3. **Booking Events**

   - Tracks event selection
   - Tracks booking completion
   - Tracks general inquiries
   - Categorizes events under "Booking"

4. **Navigation Events**
   - Tracks all navigation link clicks
   - Tracks header authentication links
   - Tracks mobile menu navigation
   - Categorizes events under "Navigation"

### Data Privacy

- Google Analytics is only loaded in production environment
- No tracking occurs in development environment
- All tracking respects user privacy settings

## Custom Tracking

To add custom tracking events, import the tracking functions from `lib/analytics.ts`:

```typescript
import { trackEvent } from "@/lib/analytics";

// Track a custom event
trackEvent("button_click", "UI", "Book Now Button");
```

Available tracking functions:

- `trackEvent(action, category, label, value?)` - Generic event tracking
- `trackAuthEvent(action, method)` - Authentication events
- `trackBookingEvent(action, service)` - Booking related events
- `trackNavigation(page)` - Navigation events

## Verification

To verify that Google Analytics is working:

1. Check that the environment variable is set correctly
2. Deploy to production environment
3. Use Google Analytics Realtime reports to see live data
4. Check that events appear in the correct categories

## Troubleshooting

If tracking is not working:

1. Verify the Measurement ID is correct
2. Check that you're in production environment
3. Ensure there are no ad blockers interfering
4. Check the browser console for errors
