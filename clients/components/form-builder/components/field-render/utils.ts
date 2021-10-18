import { get, isEmpty } from 'lodash';

export function getSortedFields(fields: ISchema[]): ISchema[] {
  if (isEmpty(fields)) return [];

  return fields.sort((a, b) => {
    return (get(a, 'x-index') || 0) - (get(b, 'x-index') || 0);
  });
}
