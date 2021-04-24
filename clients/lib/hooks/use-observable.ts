import { useState, useEffect } from 'react';
import { Observable } from 'rxjs';

export default function useObservable<T>(obs$: Observable<any> | null) {
  const [value, setValue] = useState<T | null>(null);
  useEffect(() => {
    if (obs$) {
      const subscription = obs$.subscribe(setValue);
      const cleanup = () => {
        setValue(null);
        subscription.unsubscribe();
      };
      return cleanup;
    }
  }, [obs$]);

  return value;
}
