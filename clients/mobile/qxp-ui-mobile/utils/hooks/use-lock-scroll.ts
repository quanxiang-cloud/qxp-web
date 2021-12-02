import { VoidCallback } from '@m/qxp-ui-mobile';

let count = 0;

const CLASSNAME = 'overflow-hidden';

export interface Action {
  lock: () => void;
  unlock: () => void;
}

function useLockScroll(shouldLock: () => boolean): [lock: VoidCallback, unlock: VoidCallback] {
  const lock = (): void => {
    if (shouldLock()) {
      if (!count) {
        document.body.classList.add(CLASSNAME);
      }
      count += 1;
    }
  };

  const unlock = (): void => {
    if (shouldLock() && count) {
      count -= 1;
      if (!count) {
        document.body.classList.remove(CLASSNAME);
      }
    }
  };

  return [lock, unlock];
}

export default useLockScroll;
