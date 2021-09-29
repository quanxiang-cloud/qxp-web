import { useMemo } from 'react';

export default function useHasFields(schema: ISchema): boolean {
  return useMemo(() => {
    return Object.keys(schema?.properties || {}).length > 0;
  }, [schema]);
}
