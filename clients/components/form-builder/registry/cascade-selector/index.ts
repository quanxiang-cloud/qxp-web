import { Cascader } from 'antd';

import configSchema from './config-schema';
import { defaultConfig, toSchema, toConfig, CascadeConfig } from './convertor';
import CustomizedDatasetBtn from './customized-dataset-btn';

const InputField: Omit<FormBuilder.SourceElement<CascadeConfig>, 'displayOrder'> = {
  configSchema,
  displayName: '级联选择',
  icon: 'text_fields',
  defaultConfig: defaultConfig,
  toSchema,
  toConfig,
  // todo this is not a form field
  component: Cascader,
  category: 'advance',
  componentName: 'CascadeSelector',
  configDependencies: { CustomizedDatasetBtn },
};

export default InputField;
