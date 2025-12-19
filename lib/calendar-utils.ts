/**
 * Utility functions for generating calendar links
 */

/**
 * Format a Date object to a readable string format
 * @param date - Date object
 * @returns Formatted date string (e.g., "November 22, 2025")
 */
export function formatDateForCalendar(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Convert a date string to ISO format for calendar integration
 * @param dateString - Date string in format "Month Day, Year" (e.g., "November 22, 2025")
 * @param timeString - Time string in format "H:MM AM/PM" (e.g., "6:00 PM")
 * @param timezone - Optional timezone (defaults to Sri Lanka)
 * @returns Formatted date string for calendar
 */
export function convertToCalendarFormat(dateString: string, timeString: string, timezone: string = 'Asia/Colombo'): string {
  // Validate inputs
  if (!dateString || !timeString) {
    throw new Error('Date and time strings are required');
  }

  // Parse the date string (e.g., "November 22, 2025")
  const parts = dateString.split(' ');
  if (parts.length < 3) {
    throw new Error(`Invalid date format: ${dateString}. Expected format: "Month Day, Year"`);
  }
  
  const [monthName, day, year] = parts;
  const cleanDay = day?.replace(',', '') || '';
  const cleanYear = year || '';
  
  // Create a date object
  const date = new Date(`${monthName} ${cleanDay}, ${cleanYear} ${timeString}`);
  
  // Validate the date
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${dateString} ${timeString}`);
  }
  
  // Format for calendar (YYYYMMDDTHHMMSS)
  const yearStr = date.getFullYear();
  const monthStr = (date.getMonth() + 1).toString().padStart(2, '0');
  const dayStr = date.getDate().toString().padStart(2, '0');
  const hoursStr = date.getHours().toString().padStart(2, '0');
  const minutesStr = date.getMinutes().toString().padStart(2, '0');
  const secondsStr = date.getSeconds().toString().padStart(2, '0');
  
  return `${yearStr}${monthStr}${dayStr}T${hoursStr}${minutesStr}${secondsStr}`;
}

/**
 * Generate Google Calendar link
 * @param title - Event title
 * @param date - Event date
 * @param time - Event time
 * @param location - Event location
 * @param description - Event description
 * @returns Google Calendar URL
 */
export function generateGoogleCalendarLink(
  title: string,
  date: string,
  time: string,
  location: string,
  description: string
): string {
  const formattedDate = convertToCalendarFormat(date, time);
  const formattedTitle = encodeURIComponent(title);
  const formattedLocation = encodeURIComponent(location);
  const formattedDescription = encodeURIComponent(description);
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${formattedTitle}&dates=${formattedDate}/${formattedDate}&location=${formattedLocation}&details=${formattedDescription}`;
}

/**
 * Generate iCal download link
 * @param title - Event title
 * @param date - Event date
 * @param time - Event time
 * @param location - Event location
 * @param description - Event description
 * @returns iCal data URI
 */
export function generateICalLink(
  title: string,
  date: string,
  time: string,
  location: string,
  description: string
): string {
  const formattedDate = convertToCalendarFormat(date, time);
  const formattedTitle = title.replace(/,/g, '\\,').replace(/;/g, '\\;');
  const formattedLocation = location.replace(/,/g, '\\,').replace(/;/g, '\\;');
  const formattedDescription = description.replace(/,/g, '\\,').replace(/;/g, '\\;');
  
  const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@ojasenhealingarts.com`,
    `DTSTAMP:${new Date().toISOString().replace(/-/g, '').replace(/:/g, '').split('.')[0]}`,
    `DTSTART:${formattedDate}`,
    `DTEND:${formattedDate}`,
    `SUMMARY:${formattedTitle}`,
    `LOCATION:${formattedLocation}`,
    `DESCRIPTION:${formattedDescription}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\n');
  
  return `data:text/calendar;charset=utf8,${encodeURIComponent(icsData)}`;
}

/**
 * Generate Outlook Calendar link
 * @param title - Event title
 * @param date - Event date
 * @param time - Event time
 * @param location - Event location
 * @param description - Event description
 * @returns Outlook Calendar URL
 */
export function generateOutlookCalendarLink(
  title: string,
  date: string,
  time: string,
  location: string,
  description: string
): string {
  const formattedDate = convertToCalendarFormat(date, time);
  const formattedTitle = encodeURIComponent(title);
  const formattedLocation = encodeURIComponent(location);
  const formattedDescription = encodeURIComponent(description);
  
  return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${formattedTitle}&startdt=${formattedDate}&enddt=${formattedDate}&location=${formattedLocation}&body=${formattedDescription}`;
}

/**
 * Generate Yahoo Calendar link
 * @param title - Event title
 * @param date - Event date
 * @param time - Event time
 * @param location - Event location
 * @param description - Event description
 * @returns Yahoo Calendar URL
 */
export function generateYahooCalendarLink(
  title: string,
  date: string,
  time: string,
  location: string,
  description: string
): string {
  const formattedDate = convertToCalendarFormat(date, time);
  const formattedTitle = encodeURIComponent(title);
  const formattedLocation = encodeURIComponent(location);
  const formattedDescription = encodeURIComponent(description);
  
  return `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${formattedTitle}&st=${formattedDate}&et=${formattedDate}&desc=${formattedDescription}&in_loc=${formattedLocation}`;
}