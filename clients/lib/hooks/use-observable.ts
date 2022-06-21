import { useState, useEffect } from 'react';
import { Observable } from 'rxjs6';

export default function useObservable<T = Record<string, any>>(
  obs$: Observable<T> | void, defaultValue?: T,
): T {
  const [value, setValue] = useState<T>(defaultValue ?? {} as T);
  useEffect(() => {
    if (obs$) {
      const subscription = obs$.subscribe(setValue);
      const cleanup = (): void => {
        setValue({} as T);
        subscription.unsubscribe();
      };
      return cleanup;
    }
  }, [obs$]);

  return value as T;
}
