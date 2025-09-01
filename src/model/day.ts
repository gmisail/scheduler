export const DAYS = ["M", "T", "W", "R", "F"];
export const DAY_LABEL = new Map([
  ["M", "Mon."],
  ["T", "Tue."],
  ["W", "Wed."],
  ["R", "Thu."],
  ["F", "Fri."],
]);

export function formatTime(dateTime: string): string {
  const [hours, minutes] = dateTime.split(":");
  const hourNum = parseInt(hours);
  const period = hourNum >= 12 ? "PM" : "AM";
  const hour12 = hourNum % 12 || 12;
  return `${hour12}:${minutes} ${period}`;
}
