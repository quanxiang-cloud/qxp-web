import { useEffect, CSSProperties } from 'react';
import { pickBy } from 'ramda';

const noIndexKey = (_: unknown, key: string | number | null): boolean => {
  return !/\d+/.test(`${key}`);
};

export function useStyle(selector: string, style: CSSProperties): void {
  useEffect(() => {
    const element = document.querySelector(selector) as HTMLElement;
    const originStyle = { ...element.style };
    Object.assign(element.style, style);
    return () => {
      const pickByNoIndexKey = pickBy(noIndexKey);
      const newStyle = pickByNoIndexKey(originStyle);
      Object.assign(element.style, newStyle);
    };
  }, [selector, style]);
}

