import config from './config';
import AssociatedData from './associated-data';
import { defaultConfig, toSchema, toConfig, AssociatedDataConfig } from './convertor';

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
};

export default AssociatedRecordsField;
