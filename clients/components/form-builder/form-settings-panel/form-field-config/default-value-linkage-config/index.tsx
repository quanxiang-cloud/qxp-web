import React, { useContext, useEffect, useState } from 'react';
import { toJS } from 'mobx';
import {
  SchemaForm,
  FormButtonGroup,
  FormEffectHooks,
  createAsyncFormActions,
} from '@formily/antd';
import {
  Input,
  Select as AntdSelect,
  DatePicker,
  NumberPicker,
  Switch,
  Radio,
} from '@formily/antd-components';
import { FormPath } from '@formily/shared';

import Modal from '@c/modal';
import Button from '@c/button';

import { StoreContext } from '@c/form-builder/context';
import { getTableSchema } from '@lib/http-client';
import { JoinOperatorSelect, RulesList } from '@c/form-builder/customized-fields';

import { INTERNAL_FIELD_NAMES } from '../../../store';
import { operatorOption } from '../../utils';
import { getLinkageTables } from './get-tables';
import SCHEMA from './schema';

const { onFieldValueChange$ } = FormEffectHooks;
const COMPONENTS = {
  RulesList,
  Input,
  AntdSelect,
  DatePicker,
  NumberPicker,
  Switch,
  RadioGroup: Radio.Group,
  JoinOperatorSelect,
};
const WHITE_LIST_FIELDS = [
  'Input',
  'DatePicker',
  'NumberPicker',
  'RadioGroup',
  'MultipleSelect',
  'CheckboxGroup',
  'Select',
];

const DEFAULT_VALUE_LINKAGE: FormBuilder.DefaultValueLinkage = {
  linkedAppID: '',
  linkedTable: { id: '', name: '' },
  linkedTableSortRules: [],
  linkedField: '',
  targetField: '',
  ruleJoinOperator: 'every',
  rules: [{
    fieldName: '',
    compareOperator: '==',
    compareTo: 'currentFormValue',
    compareValue: '',
  }],
};

function convertFormValues(
  values: any,
  appID: string,
  linkageTables: Array<Option>,
): FormBuilder.DefaultValueLinkage {
  return {
    linkedAppID: appID,
    linkedTable: {
      id: values.linkedTableID,
      name: linkageTables.find((option) => option.value === values.linkedTableID)?.label || '',
    },
    linkedTableSortRules: [`${values.sortOrder || '+'}${values.sortBy}`],
    linkedField: values.linkedField,
    targetField: '',
    ruleJoinOperator: values.ruleJoinOperator,
    rules: values.rules,
  };
}

function convertLinkageToFormValue(linkage: FormBuilder.DefaultValueLinkage) {
  const sortRule = `${linkage.linkedTableSortRules[0] || ''}`;
  const sortOrder = sortRule.startsWith('-') ? '-' : '+';
  const sortBy = /[^+-].*/.exec(sortRule)?.[0] || '';
  return {
    linkedTableID: linkage.linkedTable?.id,
    sortBy: sortBy,
    sortOrder: sortOrder,
    ruleJoinOperator: linkage.ruleJoinOperator,
    rules: linkage.rules || [],
    linkedField: linkage.linkedField,
  };
}

type Option = {
  label: string;
  value: string;
}

type LinkedTableFieldOptions = Option & {
  fieldEnum: Array<Option>;
  'x-component': string;
}

type Props = {
  onClose: () => void;
  onSubmit: (linkage: FormBuilder.DefaultValueLinkage) => void;
}

function LinkageConfig({ onClose, onSubmit }: Props): JSX.Element {
  const actions = createAsyncFormActions();
  const { setFieldState, getFieldValue, setFieldValue } = actions;
  const [linkageTables, setLinkageTables] = useState<Array<Option>>([]);
  const [linkedTableFields, setLinkedTableFields] = useState<LinkedTableFieldOptions[]>([]);
  const store = useContext(StoreContext);
  const defaultValue: FormBuilder.DefaultValueLinkage =
    toJS(store.activeField?.configValue.defaultValueLinkage || DEFAULT_VALUE_LINKAGE);

  useEffect(() => {
    if (defaultValue.linkedTable.id) {
      fetchLinkedTableFields(defaultValue.linkedTable.id);
    }

    // find all available linkage tables
    getLinkageTables(store.appID).then((options) => {
      const filteredOptions = options.filter(({ value }) => value !== store.pageID);
      setLinkageTables(filteredOptions);
      setFieldState('linkedTableID', (state) => {
        state.props.enum = filteredOptions;
      });

      if (!defaultValue.linkedTable.id) {
        setFieldValue('linkedTableID', filteredOptions[0]?.value);
      }
    });
  }, []);

  const fieldSchema = toJS(store.schema.properties || {});

  const currentFormFields = Object.keys(fieldSchema)
    .filter((key) => !INTERNAL_FIELD_NAMES.includes(key))
    .reduce<Array<Option>>((acc, key) => {
      acc.push({ label: fieldSchema[key].title as string, value: key });
      return acc;
    }, []);

  function fetchLinkedTableFields(tableID: string) {
    // todo find why this function called and tableID is empty on form submit
    if (!tableID) {
      return;
    }
    // todo handle case of page has no schema at all
    getTableSchema(store.appID, tableID).then(({ schema }) => {
      const fields = Object.entries(schema?.properties || {}).filter(([key, fieldSchema]) => {
        if (INTERNAL_FIELD_NAMES.includes(key)) {
          return false;
        }

        return WHITE_LIST_FIELDS.includes(fieldSchema['x-component'] || '');
      }).map(([key, fieldSchema]) => {
        return {
          value: key,
          label: (fieldSchema.title || key) as string,
          fieldEnum: (fieldSchema.enum || []) as Array<Option>,
          'x-component': fieldSchema['x-component'] || 'AntdSelect',
        };
      });

      const options = fields.map(({ label, value }) => ({ label, value }));

      setFieldState('rules.*.fieldName', (state) => state.props.enum = options);
      setFieldState('linkedField', (state) => state.props.enum = options);
      setFieldState('sortBy', (state) => state.props.enum = options);

      setLinkedTableFields(fields);
    });
  }

  function formEffect() {
    onFieldValueChange$('linkedTableID').subscribe(({ value }) => {
      fetchLinkedTableFields(value);
    });

    onFieldValueChange$('rules.*.fieldName').subscribe(({ name, value }) => {
      // todo remove name?
      if (!value || !name) {
        return;
      }

      const xComponent = linkedTableFields.find((field) => field.value === value)?.['x-component'];
      setFieldState(
        FormPath.transform(name, /\d/, ($1) => `rules.${$1}.compareOperator`),
        (state) => {
          const operators = operatorOption(xComponent);
          state.props.enum = operators;
          state.value = operators[0].value;
        }
      );
      setFieldState(
        FormPath.transform(name, /\d/, ($1) => `rules.${$1}.compareTo`),
        (state) => state.value = 'currentFormValue',
      );
      setFieldState(
        FormPath.transform(name, /\d/, ($1) => `rules.${$1}.compareValue`),
        (state) => {
          state.props['x-component'] = 'AntdSelect';
          state.props['x-component-props'] = { placeholder: '当前表单字段值' };
          state.props.enum = currentFormFields;
          state.value = undefined;
        },
      );
    });

    onFieldValueChange$('rules.*.compareTo').subscribe(({ name, value }) => {
      if (!value || !name) {
        return;
      }

      setFieldState(
        FormPath.transform(name, /\d/, ($1) => `rules.${$1}.compareValue`),
        (state) => {
          let options = currentFormFields;
          let componentType = 'AntdSelect';
          let tips = '当前表单字段值';

          if (value === 'fixedValue') {
            getFieldValue(FormPath.transform(name, /\d/, ($1) => {
              return `rules.${$1}.formField`;
            })).then((fixFieldKey) => {
              const linkTableField = linkedTableFields.find((field) => field.value === fixFieldKey);
              options = linkTableField?.fieldEnum ?? [];
              if (options.length === 0) {
                componentType = linkTableField?.['x-component'] || 'Input';
              }
              tips = '请输入固定值';
            });
          }

          state.props['x-component'] = componentType;
          state.props['x-component-props'] = { placeholder: tips };
          state.props.enum = options.length === 0 ? undefined : options;
          state.value = undefined;
        },
      );
    });
  }

  return (
    <Modal title="设置数据联动" className="setting-data-linkage" onClose={onClose}>
      <SchemaForm
        actions={actions}
        schema={SCHEMA}
        components={COMPONENTS}
        defaultValue={convertLinkageToFormValue(defaultValue)}
        effects={formEffect}
        onSubmit={(values) => onSubmit(convertFormValues(values, store.appID, linkageTables))}
      >
        <FormButtonGroup offset={4}>
          <Button type="submit" modifier="primary">保存</Button>
          <Button type="submit" onClick={onClose}>关闭</Button>
        </FormButtonGroup>
      </SchemaForm>
    </Modal>
  );
}

export default LinkageConfig;
