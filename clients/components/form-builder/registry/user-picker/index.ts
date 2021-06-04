
import { DefaultConfig, defaultConfig, toSchema, toConfig } from './convertor'
import Component from './user-picker'
import { Select } from '@formily/antd-components';
import UserPickerConfigForm from './config'


const UserPicker: Omit<FormBuilder.SourceElement<DefaultConfig>, 'displayOrder'> = {
    displayName: '人员选择',
    icon: 'text_fields',
    category: 'advance',
    componentName: 'UserPicker',
    toSchema,
    toConfig,
    configForm: UserPickerConfigForm,
    component: Component,
    defaultConfig,
}


export default UserPicker;
