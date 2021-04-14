import { Input } from '@formily/antd-components';

import configSchema from './config-schema';
import toSchema, { defaultConfig } from './convertor';

const InputField: Omit<FormItem<typeof defaultConfig>, 'displayOrder'> = {
  configSchema,
  itemName: '单行文本',
  icon: 'text_fields',
  defaultConfig: defaultConfig,
  toSchema,
  component: Input,
  category: 'basic',
  type: 'Input',
};

export default InputField;
