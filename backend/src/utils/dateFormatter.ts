/**
 * Formats a Date object to DD MMM format (e.g., "14 Jul") for enquiry date
 * @param date - The Date object to format
 * @returns Formatted date string
 */
export function formatEnquiryDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short'
  });
}

/**
 * Formats a Date object to DD MMMM format (e.g., "14 July") for status history date
 * @param date - The Date object to format
 * @returns Formatted date string
 */
export function formatHistoryDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long'
  });
}

/**
 * Formats a Date object to HH:MMAMPM format (e.g., "10:00AM") for status history time
 * @param date - The Date object to format
 * @returns Formatted time string
 */
export function formatHistoryTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).replace(/\s/g, ''); // Remove space to get "10:00AM" instead of "10:00 AM"
}