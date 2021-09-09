import { useMemo } from 'react';
import { values } from 'lodash';

export default function useFields(schema: ISchema): boolean {
  return useMemo(() => {
    const schemaProperties = values(schema?.properties);

    return schemaProperties?.length > 0;
  }, [schema]);
}
