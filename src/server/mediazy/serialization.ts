export function serializeBigInt(value: bigint | number | null | undefined) {
  if (value === null || value === undefined) return 0;
  return Number(value);
}

export function jsonReady<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_key, current) => (typeof current === "bigint" ? Number(current) : current))
  ) as T;
}

export function addDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

export function createToken(prefix = "") {
  const token = crypto.randomUUID().replaceAll("-", "").slice(0, 18);
  return `${prefix}${token}`;
}
