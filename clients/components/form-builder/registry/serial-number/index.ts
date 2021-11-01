import { validateRegistryElement } from '@c/form-builder/utils';

import Prefix from './prefix';
import configSchema from './config-schema';
import { defaultConfig, toSchema, toConfig } from './convertor';
import Serial from './serial';
import SerialConfigForm from './config';

const SerialField: Omit<FormBuilder.SourceElement<typeof defaultConfig>, 'displayOrder'> = {
  configForm: SerialConfigForm,
  toConfig,
  displayName: '流水号',
  icon: 'check_box',
  defaultConfig,
  toSchema,
  component: Serial,
  category: 'advance',
  componentName: 'Serial',
  configDependencies: { Prefix },
  validate: validateRegistryElement(configSchema),
};

export default SerialField;
