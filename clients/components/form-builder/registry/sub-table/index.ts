import { defaultConfig, toSchema, toConfig, SubTableConfig } from './convertor';
import SubTable from './preview';
import configForm from './config/config-form';

const SubTableField: Omit<FormBuilder.SourceElement<SubTableConfig>, 'displayOrder'> = {
  configForm,
  displayName: '子表单',
  icon: 'list',
  defaultConfig,
  toSchema,
  toConfig,
  component: SubTable,
  category: 'advance',
  componentName: 'SubTable',
};

export default SubTableField;
