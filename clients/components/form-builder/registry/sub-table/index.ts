import { omit, isEmpty } from 'lodash';
import { pipe, values, every } from 'lodash/fp';

import toast from '@lib/toast';
import { validateRegistryElement } from '@c/form-builder/utils';
import { CONFIG_COMPONENTS, KeyOfConfigComponent } from './config/constants';

import { defaultConfig, toSchema, toConfig, SubTableConfig } from './convertor';
import SubTable from './preview';
import configForm from './config/config-form';
import configSchema from './config/config-schema';
import Placeholder from './placeholder';

function registryValidator(schema: ISchema): boolean {
  const componentName = schema['x-component']?.toLowerCase() as KeyOfConfigComponent;
  const registry = CONFIG_COMPONENTS[componentName];
  if (!componentName || !configSchema || !registry.validate) {
    return true;
  }
  return registry.validate(registry.toConfig(schema) as any, schema);
}

function validate(configValue: SubTableConfig): boolean {
  const { subTableSchema, subTableColumns, required } = configValue;
  const columns = subTableColumns?.filter((column) => column !== '_id');
  const schema = omit(subTableSchema?.properties, '_id') || {};
  let isColumnValid = true;
  if (required && !columns?.length && isEmpty(schema)) {
    toast.error('请添加子表单字段项');
    isColumnValid = false;
  }
  const itemsValidator = pipe(values, every(registryValidator));
  return isColumnValid && validateRegistryElement(configSchema, configValue) && itemsValidator(schema);
}

const SubTableField: Omit<FormBuilder.SourceElement<SubTableConfig>, 'displayOrder'> = {
  configForm,
  displayName: '子表单',
  icon: 'table_view',
  defaultConfig,
  toSchema,
  toConfig,
  component: SubTable,
  placeholderComponent: Placeholder,
  category: 'advance',
  componentName: 'SubTable',
  validate,
};

export default SubTableField;
