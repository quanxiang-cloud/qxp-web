export const inBrowser = typeof window !== 'undefined';

export function isDef<T>(val: T): val is NonNullable<T> {
  return val !== undefined && val !== null;
}

export function isFunction(val: unknown): boolean {
  return typeof val === 'function';
}

export function isNumeric(val: string): boolean {
  return /^\d+(\.\d+)?$/.test(val);
}

export function isNaN(val: number): val is typeof NaN {
  if (Number.isNaN) {
    return Number.isNaN(val);
  }

  return val !== val;
}
