import { Input } from '@formily/antd-components';

import configSchema from './config-schema';
import { defaultConfig, TextareaConfig, toConfig, toSchema } from './convertor';

const TextArea: Omit<FormBuilder.SourceElement<TextareaConfig>, 'displayOrder'> = {
  configSchema,
  toSchema,
  toConfig,
  displayName: '多行文本',
  icon: 'notes',
  defaultConfig: defaultConfig,
  component: Input.TextArea,
  category: 'basic',
  componentName: 'textarea',
};

export default TextArea;
