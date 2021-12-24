import React, { useEffect } from 'react';
import { inBrowser } from '..';

type EffectReturn = void | (() => void);

export default function useVisibilityChange(
  target: React.MutableRefObject<Element | null>,
  onChange: (visible: boolean) => void,
): void {
  useEffect((): EffectReturn => {
    // compatibility: https://caniuse.com/#feat=intersectionobserver
    if (!inBrowser || !window.IntersectionObserver) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        // visibility changed
        onChange(entries[0].intersectionRatio > 0);
      },
      { root: document.body },
    );

    const observe = (): void => {
      if (target.current) {
        observer.observe(target.current);
      }
    };

    const unobserve = (): void => {
      if (target.current) {
        observer.unobserve(target.current);
      }
    };

    observe();
    return unobserve;
  }, [target.current]);
}
