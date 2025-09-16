export const DAYS = ["M", "T", "W", "R", "F"];
export const DAY_LABEL = new Map([
  ["M", "Mon."],
  ["T", "Tue."],
  ["W", "Wed."],
  ["R", "Thu."],
  ["F", "Fri."],
]);

export function formatTime(minutes: number): string {
  console.log("minutes: ", minutes);

  const hourNum = Math.floor(minutes / 60);

  const minNum = minutes % 60;
  const minPadding = minNum < 10 ? "0" : "";

  const period = hourNum >= 12 ? "PM" : "AM";
  const hour12 = hourNum % 12 || 12;
  return `${hour12}:${minPadding}${minNum} ${period}`;
}
