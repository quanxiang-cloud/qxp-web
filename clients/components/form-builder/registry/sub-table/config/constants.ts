import { JSXElementConstructor } from 'react';
import { ISchemaFieldComponentProps } from '@formily/antd';
import {
  Input,
  Select,
  Switch,
  ArrayTable,
  NumberPicker,
  DatePicker,
  Radio,
} from '@formily/antd-components';

import input from './sub-table-schema-config/config-field/input';
import textarea from './sub-table-schema-config/config-field/textarea';
import radiogroup from './sub-table-schema-config/config-field/radio-group';
import checkboxgroup from './sub-table-schema-config/config-field/checkbox-group';
import numberpicker from './sub-table-schema-config/config-field/number';
import datepicker from './sub-table-schema-config/config-field/datetime';
import select from './sub-table-schema-config/config-field/select';
import multipleselect from './sub-table-schema-config/config-field/multiple-select';
import userpicker from '../../../registry/user-picker';
import organizationpicker from '../../../registry/organization-select';
import fileupload from '../../../registry/file-upload';
import imageupload from '../../../registry/image-upload';
import cascadeselector from '../../../registry/cascade-selector';
import SubTableSchema from './fields/sub-table-schema';
import SubTableColumns from './fields/sub-table-columns';
import Subordination from './fields/subordination';
import LinkedTable from './fields/linked-table';
import { AddOperate } from './fields/operates';
import CustomizedDatasetBtn from '../../cascade-selector/customized-dataset-btn';
import DataSetSelector from '../../cascade-selector/dataset-selector';
import DefaultValueLinkageConfigBtn
  from '../../../form-settings-panel/form-field-config/default-value-linkage-config-btn';

import * as inputConverter from './sub-table-schema-config/config-field/input/convertor';
import * as textareaConverter from './sub-table-schema-config/config-field/textarea/convertor';
import * as numberConverter from './sub-table-schema-config/config-field/number/convertor';
import * as datetimeConverter from './sub-table-schema-config/config-field/datetime/convertor';
import * as selectorConvertor from './sub-table-schema-config/config-field/select/convertor';
import * as radioConvertor from './sub-table-schema-config/config-field/radio-group/convertor';
import * as checkboxConvertor from './sub-table-schema-config/config-field/checkbox-group/convertor';
import * as userPickerConverter from '../../../registry/user-picker/convertor';
import * as organizationPickerConverter from '../../../registry/organization-select/convertor';
import * as fileUploadConverter from '../../../registry/file-upload/convertor';
import * as imageUploadConverter from '../../../registry/image-upload/convertor';
import * as cascadeSelectorConverter from '../../../registry/cascade-selector/convertor';
import * as multipleSelectorConvertor
  from './sub-table-schema-config/config-field/multiple-select/convertor';

export const COMPONENTS: Record<string, JSXElementConstructor<ISchemaFieldComponentProps>> = {
  textarea: Input.TextArea,
  subordination: Subordination,
  input: Input,
  select: Select,
  subtableschema: SubTableSchema,
  subtablecolumns: SubTableColumns,
  linkedtable: LinkedTable,
  switch: Switch,
  arraytable: ArrayTable,
  addoperate: AddOperate,
  numberpicker: NumberPicker,
  datepicker: DatePicker,
  defaultvaluelinkageconfigbtn: DefaultValueLinkageConfigBtn,
  radiogroup: Radio.Group,
  customizeddatasetbtn: CustomizedDatasetBtn,
  datasetselector: DataSetSelector,
};

export const CONFIG_COMPONENTS: Record<
    string, Omit<FormBuilder.SourceElement<any>, 'displayOrder'>
  > = {
    ...COMPONENTS,
    input,
    textarea,
    radiogroup,
    checkboxgroup,
    numberpicker,
    datepicker,
    select,
    multipleselect,
    userpicker,
    organizationpicker,
    fileupload,
    imageupload,
    cascadeselector,
  };

export const SUPPORTED_COMPONENTS_NAMES = [
  'input', 'textarea',
  'radiogroup', 'checkboxgroup',
  'numberpicker', 'datepicker',
  'select', 'multipleselect',
  'userpicker', 'organizationpicker',
  'fileupload', 'imageupload',
  'cascadeselector',
];

export const LINKED_TABLE = { appID: '', tableID: '', tableName: '' };

export const LABEL_TO_SCHEMA_MAP: Record<string, ISchema> = {
  id: {
    display: false,
    readOnly: false,
    title: 'id',
    type: 'string',
    'x-component': 'Input',
    'x-component-props': {},
    'x-index': -1,
    'x-internal': { isSystem: true, permission: 3 },
    'x-mega-props': { labelCol: 4 },
  },
  单行文本: inputConverter.toSchema(inputConverter.defaultConfig),
  多行文本: textareaConverter.toSchema(textareaConverter.defaultConfig),
  单选框: radioConvertor.toSchema(radioConvertor.defaultConfig),
  复选框: checkboxConvertor.toSchema(checkboxConvertor.defaultConfig),
  数字: numberConverter.toSchema(numberConverter.defaultConfig),
  日期时间: datetimeConverter.toSchema(datetimeConverter.defaultConfig),
  下拉单选框: selectorConvertor.toSchema(selectorConvertor.defaultConfig),
  下拉复选框: multipleSelectorConvertor.toSchema(multipleSelectorConvertor.defaultConfig),
  人员选择: userPickerConverter.toSchema(userPickerConverter.defaultConfig),
  部门选择: organizationPickerConverter.toSchema(organizationPickerConverter.defaultConfig),
  附件: fileUploadConverter.toSchema(fileUploadConverter.defaultConfig),
  图片: imageUploadConverter.toSchema(imageUploadConverter.defaultConfig),
  级联选择: cascadeSelectorConverter.toSchema(cascadeSelectorConverter.defaultConfig),
};

export const SUB_TABLE_LABELS = [
  '单行文本', '多行文本', '单选框', '复选框', '数字', '日期时间', '下拉单选框', '下拉复选框', '人员选择',
  '部门选择', '附件', '图片', '级联选择',
];
