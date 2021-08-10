import CustomSelect from './custom-select';

import configSchema from './config-schema';
import { defaultConfig, toSchema, toConfig, SelectConfig } from './convertor';

const SelectField: Omit<FormBuilder.SourceElement<SelectConfig>, 'displayOrder'> = {
  configSchema,
  toConfig,
  displayName: '下拉单选框',
  icon: 'arrow_drop_down_circle',
  defaultConfig: defaultConfig,
  toSchema,
  component: CustomSelect,
  category: 'basic',
  componentName: 'Select',
  compareOperators: ['==', '!=', '∈', '∉'],
};

export default SelectField;
