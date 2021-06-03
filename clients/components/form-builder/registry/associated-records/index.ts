import AssociatedRecords from './associated-records';
import configSchema from './config-schema';
import { defaultConfig, toSchema, toConfig, AssociatedRecordsConfig } from './convertor';
import LinkedTable from './linked-table';
import AssociatedTableColumnsPicker from './associated-table-columns-picker';
import FilterConfigBtn from './filter-config-btn';

const AssociatedRecordsField: Omit<FormBuilder.SourceElement<AssociatedRecordsConfig>, 'displayOrder'> = {
  configSchema,
  displayName: '关联记录',
  icon: 'list',
  defaultConfig,
  toSchema,
  toConfig,
  component: AssociatedRecords,
  category: 'advance',
  componentName: 'AssociatedRecords',
  configDependencies: { LinkedTable, AssociatedTableColumnsPicker, FilterConfigBtn },
};

export default AssociatedRecordsField;
