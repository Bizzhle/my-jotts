export function addHoursToDate(hours: number): Date {
  const newDate = new Date();
  newDate.setHours(newDate.getHours() + hours);
  return newDate;
}

export function createDateFromUnixTime(timestamp: number): Date {
  return new Date(timestamp * 1000);
}

export function getTimestampInSeconds(timestamp?: number | Date): number {
  if (!timestamp) {
    timestamp = Date.now();
  }
  return Math.ceil(+timestamp / 1000);
}
