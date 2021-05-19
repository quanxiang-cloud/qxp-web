import { useEffect } from 'react';

import { identity } from '@lib/utils';

export default function useDoubleClick(
  ref: any,
  onDoubleClick: Function = identity,
  latency = 300
) {
  useEffect(() => {
    if (!ref?.current || !onDoubleClick) {
      return;
    }

    const clickRef = (ref as any).current as HTMLElement;
    const tid = -1;

    let clickCount = 0;
    const handleClick = (e: MouseEvent) => {
      clickCount += 1;
      setTimeout(() => {
        if (clickCount === 2) onDoubleClick(e);
        clickCount = 0;
      }, latency);
    };

    clickRef.addEventListener('click', handleClick);

    return () => {
      clickRef.removeEventListener('click', handleClick);
      clearTimeout(tid);
    };
  }, [ref, onDoubleClick, latency]);
}
