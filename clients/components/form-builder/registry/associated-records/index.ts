import { validateRegistryElement } from '@c/form-builder/utils';

import AssociatedRecords from './associated-records';
import config from './config';
import { defaultConfig, toSchema, toConfig, AssociatedRecordsConfig } from './convertor';
import configSchema from './config-schema';
import Placeholder from './placeholder';

const AssociatedRecordsField: Omit<FormBuilder.SourceElement<AssociatedRecordsConfig>, 'displayOrder'> = {
  configForm: config,
  displayName: '关联记录',
  icon: 'file_present',
  defaultConfig,
  toSchema,
  toConfig,
  component: AssociatedRecords,
  placeholderComponent: Placeholder,
  category: 'advance',
  componentName: 'AssociatedRecords',
  validate: validateRegistryElement(configSchema),
};

export default AssociatedRecordsField;
