import configSchema from './config-schema';
import { defaultConfig, toSchema, toConfig, validate, AggregationRecordsConfig } from './convertor';
import SummaryField from './summary-field';
import AssociateObject from './associate-object';
import StatisticalRangeConfig from './statistical-range-config';
import effects from './effects';

const AggregationRecordsField: Omit<FormBuilder.SourceElement<AggregationRecordsConfig>, 'displayOrder'> = {
  configSchema,
  displayName: '统计',
  icon: 'text_fields',
  defaultConfig: defaultConfig,
  toSchema,
  toConfig,
  component: SummaryField,
  category: 'advance',
  componentName: 'AggregationRecords',
  configDependencies: { AssociateObject, StatisticalRangeConfig },
  effects,
  validate,
};

export default AggregationRecordsField;
