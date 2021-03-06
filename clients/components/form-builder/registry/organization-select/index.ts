import { DefaultConfig, defaultConfig, toSchema, toConfig } from './convertor';
import Component from './organization-select-wrap';
import OrganizationPickerConfigForm from './config';

const UserPicker: Omit<FormBuilder.SourceElement<DefaultConfig>, 'displayOrder'> = {
  displayName: '部门选择',
  icon: 'groups',
  category: 'advance',
  componentName: 'OrganizationPicker',
  toSchema,
  toConfig,
  configForm: OrganizationPickerConfigForm,
  component: Component,
  defaultConfig,
};

export default UserPicker;
