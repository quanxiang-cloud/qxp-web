import { omit, isEmpty } from 'lodash';

import toast from '@lib/toast';

import { defaultConfig, toSchema, toConfig, SubTableConfig } from './convertor';
import SubTable from './preview';
import configForm from './config/config-form';

function validate({ subTableSchema, subTableColumns, required }: SubTableConfig): boolean {
  const columns = subTableColumns?.filter((column)=> column !== '_id');
  const schema = omit(subTableSchema?.properties, '_id') || {};
  if (required && !columns?.length && isEmpty(schema)) {
    toast.error('请添加子表单字段项');
    return false;
  }
  return true;
}

const SubTableField: Omit<FormBuilder.SourceElement<SubTableConfig>, 'displayOrder'> = {
  configForm,
  displayName: '子表单',
  icon: 'table_view',
  defaultConfig,
  toSchema,
  toConfig,
  component: SubTable,
  category: 'advance',
  componentName: 'SubTable',
  validate,
};

export default SubTableField;
