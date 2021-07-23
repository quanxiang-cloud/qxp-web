import configForm from './config';
import { AssociatedDataWrap } from './associated-data';
import { defaultConfig, toSchema, toConfig, AssociatedDataConfig } from './convertor';

const AssociatedRecordsField: Omit<FormBuilder.SourceElement<AssociatedDataConfig>, 'displayOrder'> = {
  configForm,
  toSchema,
  toConfig,
  displayName: '关联数据',
  icon: 'file_present',
  defaultConfig,
  component: AssociatedDataWrap,
  category: 'advance',
  componentName: 'AssociatedData',
};

export default AssociatedRecordsField;
