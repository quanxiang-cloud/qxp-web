import { Input } from '@formily/antd-components';

import { validateRegistryElement } from '@c/form-builder/utils';

import Prefix from './prefix';
import configSchema from './config-schema';
import { defaultConfig, toSchema, toConfig } from './convertor';
import effects from './effects';

const SerialField: Omit<FormBuilder.SourceElement<typeof defaultConfig>, 'displayOrder'> = {
  configSchema,
  toConfig,
  displayName: '流水号',
  icon: 'check_box',
  defaultConfig,
  toSchema,
  component: Input,
  category: 'advance',
  componentName: 'Serial',
  configDependencies: { Prefix },
  effects,
  validate: validateRegistryElement(configSchema),
};

export default SerialField;
