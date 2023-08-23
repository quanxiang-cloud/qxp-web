import { validateRegistryElement } from '@c/form-builder/utils';
import { defaultConfig, toSchema, toConfig, TableDataCreateConfig } from './convertor';
import config from './config';
import Placeholder from './placeholder';
import configSchema from './config-schema';
import TableDataCreate from './table-data-create';

const TableDataCreateField: Omit<FormBuilder.SourceElement<TableDataCreateConfig>, 'displayOrder'> = {
  configForm: config,
  displayName: '数据新增',
  icon: 'file_present',
  defaultConfig,
  toSchema,
  toConfig,
  component: TableDataCreate,
  placeholderComponent: Placeholder,
  category: 'advance',
  componentName: 'TableDataCreate',
  validate: validateRegistryElement(configSchema),
};

export default TableDataCreateField;
