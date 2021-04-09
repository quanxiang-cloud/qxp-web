import { Input } from '@formily/antd-components';

import configSchema from './config-schema';
import valueToSchema, { defaultConfig } from './config-to-schema';

const InputField: Omit<FormItem<typeof defaultConfig>, 'displayOrder'> = {
  configSchema,
  itemName: '单行文本',
  icon: 'text_fields',
  defaultConfig: defaultConfig,
  configToSchema: valueToSchema,
  component: Input,
  category: 'basic',
  type: 'Input',
};

export default InputField;
