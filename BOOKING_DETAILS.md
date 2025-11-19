# Booking Details Feature

## Overview

This feature allows customers to view detailed information about their bookings directly from their dashboard. Users can click on any booking in their "Upcoming Bookings" or "Booking History" tables to see comprehensive details about that specific booking.

## How to Access Booking Details

1. **Navigate to the Customer Dashboard**

   - Log in to your account
   - Access the dashboard at `/dashboard`

2. **View Booking Lists**

   - The dashboard displays two tables:
     - **Upcoming Bookings**: Shows future bookings
     - **Booking History**: Shows past bookings

3. **Access Booking Details**
   - Click on any booking name (in the "Event" column) in either table
   - This will take you to the booking details page at `/bookings/[bookingId]`

## Booking Details Page Features

The booking details page displays:

- **Event Information**:

  - Event name and booking ID
  - Date and time of the event
  - Location
  - Price
  - Event description

- **Booking Information**:
  - Customer name
  - Email address
  - Phone number
  - Number of participants
  - Booking status
  - Total price
  - Special requests (if any)

## Technical Implementation

### File Structure

```
app/
  bookings/
    [bookingId]/
      page.tsx          # Booking details page
```

### Key Components

- **Dynamic Route**: Uses Next.js dynamic routes to display booking details based on booking ID
- **Authentication Protection**: Ensures only the booking owner can view the details
- **Data Fetching**: Retrieves booking data from the database using the BookingService
- **Event Data Integration**: Pulls additional event information from EVENTS_DATA
- **Responsive Design**: Works on all device sizes

### Security Features

- Users can only view bookings associated with their account
- Access is verified by checking both user ID and customer email
- Unauthorized access attempts are redirected to the dashboard

## Testing

To test this feature:

1. Create a test booking using the script:

   ```bash
   npm run create-test-booking
   ```

2. Access the booking details at:

   ```
   http://localhost:3000/bookings/booking_test_001
   ```

3. Or navigate through the dashboard by clicking on booking names
