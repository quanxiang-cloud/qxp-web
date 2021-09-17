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

import input from '../../../registry/input';
import textarea from '../../../registry/textarea';
import radiogroup from '../../../registry/radio-group';
import checkboxgroup from '../../../registry/checkbox-group';
import numberpicker from '../../../registry/number-picker';
import datepicker from '../../../registry/date-picker';
import select from '../../../registry/select';
import multipleselect from '../../../registry/multiple-select';
import userpicker from '../../../registry/user-picker';
import organizationpicker from '../../../registry/organization-select';
import fileupload from '../../../registry/file-upload';
import imageupload from '../../../registry/image-upload';
import cascadeselector from '../../../registry/cascade-selector';
import associateddata from '../../../registry/associated-data';
import SubTableSchema from './fields/sub-table-schema';
import SubTableColumns from './fields/sub-table-columns';
import Subordination from './fields/subordination';
import LinkedTable from './fields/linked-table';
import { AddOperate } from './fields/operates';
import CustomizedDatasetBtn from '../../cascade-selector/customized-dataset-btn';
import DataSetSelector from '../../cascade-selector/dataset-selector';
import DefaultValueLinkageConfigBtn from
  '@c/form-builder/form-settings-panel/form-field-config/default-value-linkage-config-btn';
import InputForLabels from '@c/form-builder/form-settings-panel/form-field-config/input-for-labels';
import DatasetConfig from '@c/form-builder/form-settings-panel/form-field-config/dataset-config';

import * as inputConverter from '../../../registry/input/convertor';
import * as textareaConverter from '../../../registry/textarea/convertor';
import * as numberConverter from '../../../registry/number-picker/convertor';
import * as datetimeConverter from '../../../registry/date-picker/convertor';
import * as selectorConvertor from '../../../registry/select/convertor';
import * as radioConvertor from '../../../registry/radio-group/convertor';
import * as checkboxConvertor from '../../../registry/checkbox-group/convertor';
import * as userPickerConverter from '../../../registry/user-picker/convertor';
import * as organizationPickerConverter from '../../../registry/organization-select/convertor';
import * as fileUploadConverter from '../../../registry/file-upload/convertor';
import * as imageUploadConverter from '../../../registry/image-upload/convertor';
import * as cascadeSelectorConverter from '../../../registry/cascade-selector/convertor';
import * as associatedDataConverter from '../../../registry/associated-data/convertor';
import * as multipleSelectorConvertor
  from '../../../registry/multiple-select/convertor';

export const COMPONENTS: Record<string, JSXElementConstructor<ISchemaFieldComponentProps>> = {
  textarea: Input.TextArea,
  subordination: Subordination,
  input: Input,
  select: Select,
  subtableschema: SubTableSchema,
  subtablecolumns: SubTableColumns,
  linkedtable: LinkedTable,
  switch: Switch,
  // todo delete this
  arraytable: ArrayTable,
  inputforlabels: InputForLabels,
  addoperate: AddOperate,
  numberpicker: NumberPicker,
  datepicker: DatePicker,
  defaultvaluelinkageconfigbtn: DefaultValueLinkageConfigBtn,
  radiogroup: Radio.Group,
  customizeddatasetbtn: CustomizedDatasetBtn,
  datasetselector: DataSetSelector,
  datasetconfig: DatasetConfig,
};

export type KeyOfConfigComponent = keyof typeof CONFIG_COMPONENTS;

export const CONFIG_COMPONENTS = {
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
  associateddata,
};

export const SUPPORTED_COMPONENTS_NAMES = [
  'input', 'textarea',
  'radiogroup', 'checkboxgroup',
  'numberpicker', 'datepicker',
  'select', 'multipleselect',
  'userpicker', 'organizationpicker',
  'fileupload', 'imageupload',
  'cascadeselector', 'associateddata',
];

export const LINKED_TABLE = { appID: '', tableID: '', tableName: '' };

export const SUB_TABLE_TYPES_SCHEMA_MAP: Record<string, ISchema> = {
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
  input: inputConverter.toSchema(inputConverter.defaultConfig),
  textarea: textareaConverter.toSchema(textareaConverter.defaultConfig),
  radiogroup: radioConvertor.toSchema(radioConvertor.defaultConfig),
  checkboxgroup: checkboxConvertor.toSchema(checkboxConvertor.defaultConfig),
  numberpicker: numberConverter.toSchema(numberConverter.defaultConfig),
  datepicker: datetimeConverter.toSchema(datetimeConverter.defaultConfig),
  select: selectorConvertor.toSchema(selectorConvertor.defaultConfig),
  multipleselect: multipleSelectorConvertor.toSchema(multipleSelectorConvertor.defaultConfig),
  userpicker: userPickerConverter.toSchema(userPickerConverter.defaultConfig),
  organizationpicker: organizationPickerConverter.toSchema(organizationPickerConverter.defaultConfig),
  fileupload: fileUploadConverter.toSchema(fileUploadConverter.defaultConfig),
  imageupload: imageUploadConverter.toSchema(imageUploadConverter.defaultConfig),
  cascadeselector: cascadeSelectorConverter.toSchema(cascadeSelectorConverter.defaultConfig),
  associateddata: associatedDataConverter.toSchema(associatedDataConverter.defaultConfig),
};

export const SUB_TABLE_TYPES = [
  { label: '单行文本', value: 'input' },
  { label: '多行文本', value: 'textarea' },
  { label: '单选框', value: 'radiogroup' },
  { label: '复选框', value: 'checkboxgroup' },
  { label: '数字', value: 'numberpicker' },
  { label: '日期时间', value: 'datepicker' },
  { label: '下拉单选框', value: 'select' },
  { label: '下拉复选框', value: 'multipleselect' },
  { label: '人员选择', value: 'userpicker' },
  { label: '部门选择', value: 'organizationpicker' },
  { label: '附件', value: 'fileupload' },
  { label: '图片', value: 'imageupload' },
  { label: '级联选择', value: 'cascadeselector' },
  { label: '关联数据', value: 'associateddata' },
];
