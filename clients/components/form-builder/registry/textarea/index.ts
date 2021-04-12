import { Input } from '@formily/antd-components';

import configuration from './configuration';
import toSchema, { defaultConfig } from './to-schema';

const TextArea: Omit<FormItem<typeof defaultConfig>, 'displayOrder'> = {
  configuration,
  itemName: '多行文本',
  icon: 'notes',
  defaultConfig: defaultConfig,
  toSchema,
  component: Input.TextArea,
  category: 'basic',
  type: 'TextArea',
};

export default TextArea;
