import { useState, useEffect } from 'react';

type AsyncFunction<T, P> = (...args: P[]) => Promise<T>;

export default function useAsync<T, P = any>(asyncFunction: AsyncFunction<T, P>, dependencies?: P[]): {
  value?: T; isLoading: boolean; error?: Error;
} {
  const [value, setValue] = useState<T>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    setIsLoading(true);
    asyncFunction().then(setValue).catch(setError).finally(() => setIsLoading(false));
  }, dependencies);

  return { value, isLoading, error };
}
