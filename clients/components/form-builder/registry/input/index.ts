import { Input } from '@formily/antd-components';

import configuration from './configuration';
import valueToSchema, { defaultConfig } from './config-to-schema';

const InputField: Omit<FormItem<typeof defaultConfig>, 'displayOrder'> = {
  configuration,
  itemName: '单行文本',
  icon: 'text_fields',
  defaultConfig: defaultConfig,
  configToSchema: valueToSchema,
  component: Input,
  category: 'basic',
  type: 'Input',
};

export default InputField;
