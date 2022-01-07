import { useEffect } from 'react';

export default function useDrawerContainerPadding(unit: number, shouldRePadding?: () => boolean): void {
  useEffect(() => {
    const el = document.querySelector('.flow-editor-drawer .drawer-container') as HTMLDivElement | undefined;
    if (!el || (shouldRePadding && !shouldRePadding())) {
      return;
    }
    const oldPaddingBottom = el.style.paddingBottom;
    el.style.paddingBottom = `${unit}px`;
    return () => {
      el.style.paddingBottom = oldPaddingBottom;
    };
  }, [unit, shouldRePadding]);
}
