import AssociatedRecords from './associated-records';
import config from './config';
import { defaultConfig, toSchema, toConfig, AssociatedRecordsConfig } from './convertor';

const AssociatedRecordsField: Omit<FormBuilder.SourceElement<AssociatedRecordsConfig>, 'displayOrder'> = {
  configForm: config,
  displayName: '关联记录',
  icon: 'file_present',
  defaultConfig,
  toSchema,
  toConfig,
  component: AssociatedRecords,
  category: 'advance',
  componentName: 'AssociatedRecords',
};

export default AssociatedRecordsField;
