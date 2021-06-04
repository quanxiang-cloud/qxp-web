import { JSXElementConstructor } from 'react';
import { ISchemaFieldComponentProps } from '@formily/antd';
import {
  Input as input,
  Select as select,
  Switch,
  ArrayTable,
  NumberPicker,
  DatePicker,
} from '@formily/antd-components';

import { INTERNAL_FIELD_NAMES } from '@c/form-builder/store';
import SubTableSchema from './fields/sub-table-schema';
import columns from './fields/columns';
import subordination from './fields/subordination';
import LinkedTable from './fields/linked-table';
import sInput from './sub-table-schema-config/config-field/input';
import sTextarea from './sub-table-schema-config/config-field/textarea';
import sNumber from './sub-table-schema-config/config-field/number';
import sDatePicker from './sub-table-schema-config/config-field/datetime';
import sSelect from './sub-table-schema-config/config-field/select';
import sMultipleSelect from './sub-table-schema-config/config-field/multiple-select';
import { addOperate } from './fields/operates';
import DefaultValueLinkageConfigBtn
  from '../../../form-settings-panel/form-field-config/default-value-linkage-config-btn';

import * as inputConverter from './sub-table-schema-config/config-field/input/convertor';
import * as textareaConverter from './sub-table-schema-config/config-field/textarea/convertor';
import * as numberConverter from './sub-table-schema-config/config-field/number/convertor';
import * as datetimeConverter from './sub-table-schema-config/config-field/datetime/convertor';
import * as selectorConvertor from './sub-table-schema-config/config-field/select/convertor';
import * as multipleSelectorConvertor
  from './sub-table-schema-config/config-field/multiple-select/convertor';

export const COMPONENTS: Record<string, JSXElementConstructor<ISchemaFieldComponentProps>> = {
  textarea: input.TextArea,
  subordination,
  input,
  select,
  subtableschema: SubTableSchema,
  linkedtable: LinkedTable,
  switch: Switch,
  arraytable: ArrayTable,
  addoperate: addOperate,
  columns,
  numberpicker: NumberPicker,
  datepicker: DatePicker,
  defaultvaluelinkageconfigbtn: DefaultValueLinkageConfigBtn,
};

export const CONFIG_COMPONENTS: Record<
    string, Omit<FormBuilder.SourceElement<any>, 'displayOrder'>
  > = {
    ...COMPONENTS,
    input: sInput,
    textarea: sTextarea,
    numberpicker: sNumber,
    datepicker: sDatePicker,
    select: sSelect,
    multipleselect: sMultipleSelect,
  };

export const SUPPORTED_COMPONENTS_NAMES = [
  'input', 'textarea', 'numberpicker', 'datepicker', 'select',
];

export const BLOCKED_FIELD_NAMES = INTERNAL_FIELD_NAMES;

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
  数字: numberConverter.toSchema(numberConverter.defaultConfig),
  日期时间: datetimeConverter.toSchema(datetimeConverter.defaultConfig),
  下拉单选框: selectorConvertor.toSchema(selectorConvertor.defaultConfig),
  下拉复选框: multipleSelectorConvertor.toSchema(multipleSelectorConvertor.defaultConfig),
};

export const SUB_TABLE_LABELS = [
  '单行文本', '多行文本', '数字', '日期时间', '下拉单选框', '下拉复选框',
];
