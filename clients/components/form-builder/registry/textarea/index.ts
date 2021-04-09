import { Input } from '@formily/antd-components';

import configSchema from './config-schema';
import valueToSchema, { defaultConfig } from './config-to-schema';

const TextArea: Omit<FormItem<typeof defaultConfig>, 'displayOrder'> = {
  configSchema,
  itemName: '多行文本',
  icon: 'notes',
  defaultConfig: defaultConfig,
  configToSchema: valueToSchema,
  component: Input.TextArea,
  category: 'basic',
  type: 'TextArea',
};

export default TextArea;
