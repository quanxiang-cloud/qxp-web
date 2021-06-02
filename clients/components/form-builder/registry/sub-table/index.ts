import { Input } from '@formily/antd-components';

import { defaultConfig, toSchema, toConfig, SubTableConfig } from './convertor';
import SubTable from './sub-table';
import Switcher from './switcher';
import Subordination from './subordination';
import configForm from './config-form';

const InputField: Omit<FormBuilder.SourceElement<SubTableConfig>, 'displayOrder'> = {
  configForm,
  displayName: '子表单',
  icon: 'list',
  defaultConfig,
  toSchema,
  toConfig,
  component: SubTable,
  category: 'advance',
  componentName: 'SubTable',
  configDependencies: { Switcher, Textarea: Input.TextArea, Subordination },
};

export default InputField;
