import { Input } from '@formily/antd-components';

import { validateRegistryElement } from '@c/form-builder/utils';

import configSchema from './config-schema';
import { defaultConfig, toSchema, toConfig, InputConfig } from './convertor';

const InputField: Omit<FormBuilder.SourceElement<InputConfig>, 'displayOrder'> = {
  configSchema,
  displayName: '单行文本',
  icon: 'text_fields',
  defaultConfig: defaultConfig,
  toSchema,
  toConfig,
  component: Input,
  category: 'basic',
  componentName: 'Input',
  compareOperators: ['==', '!='],
  validate: validateRegistryElement(configSchema),
};

export default InputField;
