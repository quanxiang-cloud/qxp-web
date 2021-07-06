import { get } from 'lodash';

const excludeComps = ['SubTable'];

type Options = {
  noSystem?: boolean;
}

export const getSchemaFields = (schema: ISchema | undefined, options: Options = {}) => {
  return Object.entries(schema?.properties || {})
    .filter(([, field]) => {
      const compName = field['x-component'];
      const isSystem = !!get(field, 'x-internal.isSystem');
      if (options.noSystem && isSystem) {
        return false;
      }
      return compName && !excludeComps.includes(compName);
    })
    .map(([key, fieldSchema]) => {
      return { label: fieldSchema.title as string, value: key };
    });
};
