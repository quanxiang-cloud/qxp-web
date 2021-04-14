import { Input } from '@formily/antd-components';

import configSchema from './config-schema';
import toSchema, { defaultConfig, TextareaConfig } from './to-schema';

const TextArea: Omit<FormItem<TextareaConfig>, 'displayOrder'> = {
  configSchema,
  toSchema,
  itemName: '多行文本',
  icon: 'notes',
  defaultConfig: defaultConfig,
  component: Input.TextArea,
  category: 'basic',
  type: 'textarea',
};

export default TextArea;
