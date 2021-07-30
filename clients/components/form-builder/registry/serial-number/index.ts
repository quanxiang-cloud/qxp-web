import SerialNumber from './serial';
import PrefixSuffix from './prefix-suffix';
import configSchema from './config-schema';
import { defaultConfig, toSchema, toConfig } from './convertor';

const SerialField: Omit<FormBuilder.SourceElement<typeof defaultConfig>, 'displayOrder'> = {
  configSchema,
  toConfig,
  displayName: '流水号',
  icon: 'check_box',
  defaultConfig,
  toSchema,
  component: SerialNumber,
  category: 'advance',
  componentName: 'Serial',
  configDependencies: { PrefixSuffix },
};

export default SerialField;
