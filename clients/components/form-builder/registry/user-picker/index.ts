import { DefaultConfig, defaultConfig, toSchema, toConfig } from './convertor';
import Component from './user-picker-wrap';
import UserPickerConfigForm from './config';

import Placeholder from './placeholder';

const UserPicker: Omit<FormBuilder.SourceElement<DefaultConfig>, 'displayOrder'> = {
  displayName: '人员选择',
  icon: 'person_add_alt',
  category: 'advance',
  componentName: 'UserPicker',
  placeholderComponent: Placeholder,
  toSchema,
  toConfig,
  configForm: UserPickerConfigForm,
  component: Component,
  defaultConfig,
};

export default UserPicker;
