export const inBrowser = typeof window !== 'undefined';

export function isDef<T>(val?: T): val is NonNullable<T> {
  return val !== undefined && val !== null;
}

export function isFunction(val: unknown): boolean {
  return typeof val === 'function';
}

export function isNumeric(val?: string): boolean {
  return isDef(val) ? /^\d+(\.\d+)?$/.test(val) : false;
}

export function isNaN(val?: number): val is typeof NaN {
  if (!isDef(val)) return false;
  if (Number.isNaN) {
    return Number.isNaN(val);
  }

  return val !== val;
}

export function isWindow(val: unknown): val is Window {
  return val === window;
}

export function isObject(val: unknown): val is Record<any, any> {
  return val !== null && typeof val === 'object';
}

export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return isObject(val) && isFunction(val?.then) && isFunction(val?.catch);
}

export function isAndroid(): boolean {
  return inBrowser ? /android/.test(navigator.userAgent.toLowerCase()) : false;
}

export function isIOS(): boolean {
  return inBrowser ? /ios|iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()) : false;
}

export function bound(position: number, min: number | undefined, max: number | undefined): number {
  let ret = position;
  if (min !== undefined) {
    ret = Math.max(position, min);
  }
  if (max !== undefined) {
    ret = Math.min(ret, max);
  }
  return ret;
}
