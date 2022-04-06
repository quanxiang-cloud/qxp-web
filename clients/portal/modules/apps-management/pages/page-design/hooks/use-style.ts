import { useEffect, CSSProperties } from 'react';

export function useStyle(selector: string, style: CSSProperties): void {
  useEffect(() => {
    const element = document.querySelector(selector) as HTMLElement;
    const originStyle = { ...element.style };
    Object.assign(element.style, style);
    return () => {
      Object.assign(element.style, originStyle);
    };
  }, [selector, style]);
}

