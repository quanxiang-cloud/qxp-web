import { useEffect, useRef } from 'react';

export function useDidUpdate<T>(callback: Function, deps: T[]) {
  const hasMount = useRef(false);

  useEffect(() => {
    if (hasMount.current) {
      callback();
    } else {
      hasMount.current = true;
    }
  }, deps);
}
