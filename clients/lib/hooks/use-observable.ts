import { useState, useEffect } from 'react';
import { Observable } from 'rxjs';

export default function useObservable(obs$: Observable<any> | null) {
  const [value, setValue] = useState<any>(null);
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
