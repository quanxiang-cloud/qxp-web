import { useEffect, RefObject } from 'react';

import type { RefProps } from '.';

export function useUpdateVisualScrollList(
  listRef: RefObject<RefProps>, containerRef: RefObject<HTMLElement>,
): void {
  useEffect(() => {
    const list = listRef.current;
    const container = containerRef.current;
    list?.forceUpdate();
    const handleScroll = (): void => list?.forceUpdate();
    container?.addEventListener('scroll', handleScroll);
    return () => {
      container?.removeEventListener('scroll', handleScroll);
    };
  }, []);
}
