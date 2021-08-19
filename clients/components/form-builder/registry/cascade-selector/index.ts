import { validateRegistryElement } from '@c/form-builder/utils';

import configSchema from './config-schema';
import { defaultConfig, toSchema, toConfig, CascadeConfig } from './convertor';
import CustomizedDatasetBtn from './customized-dataset-btn';
import CascadeSelector from './cascade-selector-wrap';
import DatasetSelector from './dataset-selector';

const InputField: Omit<FormBuilder.SourceElement<CascadeConfig>, 'displayOrder'> = {
  configSchema,
  displayName: '级联选择',
  icon: 'ballot',
  defaultConfig: defaultConfig,
  toSchema,
  toConfig,
  component: CascadeSelector,
  category: 'advance',
  componentName: 'CascadeSelector',
  configDependencies: { CustomizedDatasetBtn, DatasetSelector },
  compareOperators: ['==', '!='],
  validate: validateRegistryElement(configSchema),
};

export default InputField;
