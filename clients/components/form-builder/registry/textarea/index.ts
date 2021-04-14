import { Input } from '@formily/antd-components';

import configSchema from './config-schema';
import { defaultConfig, TextareaConfig, toConfig, toSchema } from './convertor';

const TextArea: Omit<FormItem<TextareaConfig>, 'displayOrder'> = {
  configSchema,
  toSchema,
  toConfig,
  itemName: '多行文本',
  icon: 'notes',
  defaultConfig: defaultConfig,
  component: Input.TextArea,
  category: 'basic',
  type: 'textarea',
};

export default TextArea;
