import { cloneDeep } from 'lodash';
import { lensPath, over } from 'ramda';

import createNamespaceSchema from './create-namespace';

const editNamespaceSchema = cloneDeep(createNamespaceSchema);

export default over(
  lensPath(['properties', 'Fields', 'properties']),
  (schema: { title: ISchema, name: ISchema, desc: ISchema }) => {
    const { name } = schema;
    Object.assign(name, {
      'x-props': {
        ...name['x-props'],
        disabled: true,
      },
      'x-component-props': {
        ...name['x-component-props'],
        desc: null,
      },
    });
    return schema;
  },
  editNamespaceSchema,
);
