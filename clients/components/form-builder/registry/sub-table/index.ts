import { omit, isEmpty } from 'lodash';

import toast from '@lib/toast';
import { validateRegistryElement } from '@c/form-builder/utils';

import { defaultConfig, toSchema, toConfig, SubTableConfig } from './convertor';
import SubTable from './preview';
import configForm from './config/config-form';
import configSchema from './config/config-schema';
import Placeholder from './placeholder';

function validate(configValue: SubTableConfig): boolean {
  const { subTableSchema, subTableColumns, required } = configValue;
  const columns = subTableColumns?.filter((column) => column !== '_id');
  const schema = omit(subTableSchema?.properties, '_id') || {};
  let isColumnValid = true;
  if (required && !columns?.length && isEmpty(schema)) {
    toast.error('请添加子表单字段项');
    isColumnValid = false;
  }
  return isColumnValid && validateRegistryElement(configSchema, configValue);
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
