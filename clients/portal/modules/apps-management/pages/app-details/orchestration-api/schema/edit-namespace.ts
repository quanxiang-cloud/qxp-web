import { cloneDeep } from 'lodash';
import { lensPath, over, omit } from 'ramda';

import createNamespaceSchema from './create-namespace';

const editNamespaceSchema = cloneDeep(createNamespaceSchema);

export default over(
  lensPath(['properties', 'Fields', 'properties']),
  omit(['name']),
  editNamespaceSchema,
);
