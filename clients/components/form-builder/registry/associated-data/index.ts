import { validateRegistryElement } from '@c/form-builder/utils';

import config from './config';
import AssociatedData from './associated-data';
import { defaultConfig, toSchema, toConfig, AssociatedDataConfig } from './convertor';
import configSchema from './config-schema';

const AssociatedRecordsField: Omit<FormBuilder.SourceElement<AssociatedDataConfig>, 'displayOrder'> = {
  configForm: config,
  toSchema,
  toConfig,
  displayName: '关联数据',
  icon: 'file_present',
  defaultConfig,
  component: AssociatedData,
  category: 'advance',
  componentName: 'AssociatedData',
  validate: validateRegistryElement(configSchema),
};

export default AssociatedRecordsField;
