import { validateRegistryElement } from '@c/form-builder/utils';
import { defaultConfig, toSchema, toConfig, AssociatedTableConfig } from './convertor';
import config from './config';
import Placeholder from './placeholder';
import AssociatedTable from './associated-table';
import configSchema from './config-schema';

const AssociatedTableField: Omit<FormBuilder.SourceElement<AssociatedTableConfig>, 'displayOrder'> = {
  configForm: config,
  displayName: '关联列表',
  icon: 'file_present',
  defaultConfig,
  toSchema,
  toConfig,
  component: AssociatedTable,
  placeholderComponent: Placeholder,
  category: 'advance',
  componentName: 'AssociatedTable',
  validate: validateRegistryElement(configSchema),
};

export default AssociatedTableField;
