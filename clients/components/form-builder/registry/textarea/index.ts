import { Input } from '@formily/antd-components';

import { validateRegistryElement } from '@c/form-builder/utils';

import Placeholder from './placeholder';
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
  placeholderComponent: Placeholder,
  category: 'basic',
  componentName: 'textarea',
  compareOperators: ['~'],
  validate: validateRegistryElement(configSchema),
};

export default TextArea;
