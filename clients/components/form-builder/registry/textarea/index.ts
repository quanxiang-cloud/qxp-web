import { Input } from '@formily/antd-components';

import configuration from './config-schema';
import toSchema, { defaultConfig } from './to-schema';

const TextArea: Omit<FormItem<typeof defaultConfig>, 'displayOrder'> = {
  configuration,
  toSchema,
  itemName: '多行文本',
  icon: 'notes',
  defaultConfig: defaultConfig,
  component: Input.TextArea,
  category: 'basic',
  type: 'textarea',
};

export default TextArea;
