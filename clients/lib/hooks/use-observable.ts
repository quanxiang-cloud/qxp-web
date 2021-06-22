import { useState, useEffect } from 'react';
import { Observable } from 'rxjs';

export default function useObservable<T>(obs$: Observable<T> | void): T & Record<string, unknown> {
  const [value, setValue] = useState<T | Record<string, unknown>>({});
  useEffect(() => {
    if (obs$) {
      const subscription = obs$.subscribe(setValue);
      const cleanup = (): void => {
        setValue({});
        subscription.unsubscribe();
      };
      return cleanup;
    }
  }, [obs$]);

  return value as T & Record<string, unknown>;
}
