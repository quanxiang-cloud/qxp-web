import { validateRegistryElement } from '@c/form-builder/utils';

import AssociatedRecords from './associated-records';
import AssociatedRecordsForCanvas from './associated-records/canvas';
import config from './config';
import { defaultConfig, toSchema, toConfig, AssociatedRecordsConfig } from './convertor';
import configSchema from './config-schema';

const AssociatedRecordsField: Omit<FormBuilder.SourceElement<AssociatedRecordsConfig>, 'displayOrder'> = {
  configForm: config,
  displayName: '关联记录',
  editComponent: AssociatedRecordsForCanvas,
  icon: 'file_present',
  defaultConfig,
  toSchema,
  toConfig,
  component: AssociatedRecords,
  category: 'advance',
  componentName: 'AssociatedRecords',
  validate: validateRegistryElement(configSchema),
};

export default AssociatedRecordsField;
