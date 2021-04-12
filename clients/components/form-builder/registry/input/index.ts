import { Input } from '@formily/antd-components';

import configuration from './configuration';
import toSchema, { defaultConfig } from './to-schema';

const InputField: Omit<FormItem<typeof defaultConfig>, 'displayOrder'> = {
  configuration,
  itemName: '单行文本',
  icon: 'text_fields',
  defaultConfig: defaultConfig,
  toSchema,
  component: Input,
  category: 'basic',
  type: 'Input',
};

export default InputField;
