/** Mars opens 14:00 and closes at midnight, every day, Asia/Baghdad time (UTC+3, no DST). */
export const OPEN_HOUR = 14;
export function baghdadHour(now: Date): number {
  const h = new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: "Asia/Baghdad" }).format(now);
  return Number(h) % 24;
}
export function isOpenNow(now: Date = new Date()): boolean {
  return baghdadHour(now) >= OPEN_HOUR;
}
