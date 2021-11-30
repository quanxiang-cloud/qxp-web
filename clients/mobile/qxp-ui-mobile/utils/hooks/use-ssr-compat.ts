import { useCallback, useEffect, useState } from 'react';

type Callback = (render: () => JSX.Element) => JSX.Element;

export default function useSsrCompat(): readonly [callback: Callback, rendered: boolean] {
  const [mounted, setMounted] = useState(false);
  const [rendered, setRendered] = useState(mounted);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setRendered(true);
    }
  }, [mounted]);

  return [
    useCallback((render: () => JSX.Element) => (mounted ? render() : null), [mounted]) as Callback,
    rendered,
  ] as const;
}
