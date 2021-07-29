import configSchema from './config-schema';
import { defaultConfig, toSchema, toConfig, AggregationRecordsConfig } from './convertor';
import LinkedTable from './linked-table';
import AggregationRecords from './aggregation-records';

const AggregationRecordsField: Omit<FormBuilder.SourceElement<AggregationRecordsConfig>, 'displayOrder'> = {
  configSchema,
  displayName: '统计',
  icon: 'text_fields',
  defaultConfig: defaultConfig,
  toSchema,
  toConfig,
  component: AggregationRecords,
  category: 'advance',
  componentName: 'AggregationRecords',
  configDependencies: { LinkedTable },
};

export default AggregationRecordsField;
