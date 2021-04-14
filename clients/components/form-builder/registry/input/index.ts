import { Input } from '@formily/antd-components';

import configSchema from './config-schema';
import { defaultConfig, toSchema, toConfig, InputConfig } from './convertor';

const InputField: Omit<SourceElement<InputConfig>, 'displayOrder'> = {
  configSchema,
  itemName: '单行文本',
  icon: 'text_fields',
  defaultConfig: defaultConfig,
  toSchema,
  toConfig,
  component: Input,
  category: 'basic',
  type: 'Input',
};

export default InputField;
