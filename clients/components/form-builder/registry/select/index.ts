import { Select } from '@formily/antd-components';

import configSchema from './config-schema';
import { defaultConfig, toSchema, toConfig, SelectConfig } from './convertor';

const SelectField: Omit<SourceElement<SelectConfig>, 'displayOrder'> = {
  configSchema,
  toConfig,
  displayName: '下拉单选框',
  icon: 'arrow_drop_down_circle',
  defaultConfig: defaultConfig,
  toSchema,
  component: Select,
  category: 'basic',
  componentName: 'Select',
};

export default SelectField;
