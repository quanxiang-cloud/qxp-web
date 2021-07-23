import React, { useContext, useEffect, useRef, useState } from 'react';
import { toJS } from 'mobx';
import { omit } from 'lodash';
import { from } from 'rxjs';
import { switchMap, filter, tap, skip } from 'rxjs/operators';
import {
  SchemaForm,
  FormButtonGroup,
  FormEffectHooks,
  createFormActions,
  IFieldState,
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
import { JoinOperatorSelect, RulesList } from '@c/form-builder/customized-fields';
import { INTERNAL_FIELD_NAMES } from '@c/form-builder/store';
import { getCompareOperatorOptions, getSourceElementOperator } from '@c/form-builder/utils/operator';
import { FieldConfigContext } from '@c/form-builder/form-settings-panel/form-field-config/context';

import { getLinkageTables, fetchLinkedTableFields } from './get-tables';
import SCHEMA from './schema';
import { convertFormValues, convertLinkage } from './convertor';

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

export type LinkedTableFieldOptions = FormBuilder.Option & {
  fieldEnum: Array<FormBuilder.Option>;
  'x-component': string;
}

type Props = {
  onClose: () => void;
  onSubmit: (linkage: FormBuilder.DefaultValueLinkage) => void;
  linkage?: FormBuilder.DefaultValueLinkage;
  isLinkedFieldShow?: boolean;
  isLinkedTableReadonly?: boolean;
}

function LinkageConfig({
  onClose, onSubmit, linkage, isLinkedFieldShow, isLinkedTableReadonly,
}: Props): JSX.Element {
  const actions = createFormActions();
  const { setFieldState, getFieldValue, setFieldValue } = actions;
  const [linkageTables, setLinkageTables] = useState<Array<FormBuilder.Option>>([]);
  const linkedTableFieldsRef = useRef<LinkedTableFieldOptions[]>([]);
  const store = useContext(StoreContext);
  const { actions: configActions } = useContext(FieldConfigContext);
  const defaultValue = linkage || DEFAULT_VALUE_LINKAGE;

  const fieldsSchema = toJS(store.schema.properties || {});
  const currentFormFields = Object.entries(fieldsSchema).filter(([key, fieldSchema]) => {
    if (INTERNAL_FIELD_NAMES.includes(key) || key === store.activeField?.fieldName) {
      return false;
    }

    return fieldSchema.type === 'string' ||
      fieldSchema.type === 'number' ||
      fieldSchema.type === 'datetime';
  }).map(([key, fieldSchema]) => ({ label: fieldSchema.title as string, value: key }));

  function resetFormDefaultValueOnLinkTableChanged(fields: LinkedTableFieldOptions[]): void {
    setFieldValue('sortBy', fields[0]?.value);
    setFieldValue('sortOrder', '+');
    setFieldValue('ruleJoinOperator', DEFAULT_VALUE_LINKAGE.ruleJoinOperator);
    setFieldValue('rules', DEFAULT_VALUE_LINKAGE.rules);
    setFieldValue('linkedField', DEFAULT_VALUE_LINKAGE.linkedField);
  }

  function updateFieldsEnumOnLinkedTableChanged(fields: LinkedTableFieldOptions[]): void {
    const options = fields.map(({ label, value }) => ({ label, value }));

    setFieldState('rules.*.fieldName', (state) => state.props.enum = options);
    setFieldState('linkedField', (state) => {
      state.props.enum = fields.filter((field) => {
        return field['x-component'].toLowerCase() === store.activeField?.componentName.toLowerCase();
      }).map(({ label, value }) => ({ label, value }));
    });
    setFieldState('sortBy', (state) => state.props.enum = options);

    linkedTableFieldsRef.current = fields;

    setFieldState('rules.*.fieldName', updateCompareOperatorFieldOnFieldNameChanged);
  }

  useEffect(() => {
    // find all available linkage tables
    getLinkageTables(store.appID).then((options) => {
      const filteredOptions = options.filter(({ value }) => value !== store.pageID);
      setLinkageTables(filteredOptions);
      setFieldState('linkedTableID', (state) => state.props.enum = filteredOptions);
      if (isLinkedTableReadonly) {
        configActions.getFieldState('Fields.linkedTable', (state) => {
          setFieldValue('linkedTableID', state.value.tableID);
        });
        return;
      }
      if (!defaultValue.linkedTable.id) {
        setFieldValue('linkedTableID', filteredOptions[0]?.value);
      }
    });
  }, []);

  function formEffect(): void {
    onFieldValueChange$('linkedTableID').pipe(
      filter(({ value }) => !!value),
      switchMap(({ value }) => from(fetchLinkedTableFields(store.appID, value))),
      tap(updateFieldsEnumOnLinkedTableChanged),
      skip(1),
    ).subscribe(resetFormDefaultValueOnLinkTableChanged);

    // todo why this observable emit value when un-mount?
    onFieldValueChange$('rules.*.fieldName').pipe(
      filter(({ value }) => !!value),
      tap(updateCompareOperatorFieldOnFieldNameChanged),
    ).subscribe(updateCompareValueFieldOnCompareToChanged);

    onFieldValueChange$('rules.*.compareOperator').pipe(
      filter(({ value }) => !!value),
    ).subscribe(updateCompareValueFieldOnCompareOperatorChanged);

    onFieldValueChange$('rules.*.compareTo').pipe(
      filter(({ name, value }) => name && value),
    ).subscribe(updateCompareValueFieldOnCompareToChanged);
  }

  function updateCompareOperatorFieldOnFieldNameChanged({ name, value }: IFieldState): void {
    const xComponent = linkedTableFieldsRef.current.find((field) => {
      return field.value === value;
    })?.['x-component'];

    if (!xComponent) {
      return;
    }

    const operators = getSourceElementOperator(xComponent) || [];
    const operatorOptions = getCompareOperatorOptions(operators);
    const compareOperatorPath = FormPath.transform(name, /\d/, ($1) => `rules.${$1}.compareOperator`);
    const currentOperator = getFieldValue(compareOperatorPath);
    const shouldReset = !operators.includes(currentOperator);

    setFieldState(compareOperatorPath, (state) => {
      state.props.enum = operatorOptions;
      if (shouldReset) {
        state.value = operatorOptions[0].value;
      }
    });
  }

  function updateCompareValueFieldOnCompareOperatorChanged({ name, value }: IFieldState): void {
    const isMultiple = ['⊇', '∩', '∈', '∉'].includes(value);
    updateCompareValueFieldMode(name, isMultiple);
  }

  function updateCompareValueFieldOnCompareToChanged({ name, value }: IFieldState): void {
    setFieldState(
      FormPath.transform(name, /\d/, ($1) => `rules.${$1}.compareValue`),
      (state) => {
        const linkedFieldKey = getFieldValue(FormPath.transform(name, /\d/, ($1) => {
          return `rules.${$1}.fieldName`;
        }));
        const linkTableField = linkedTableFieldsRef.current.find((field) => field.value === linkedFieldKey);
        const enumerable = !!(linkTableField?.fieldEnum || []).length;

        if (value === 'fixedValue' && enumerable) {
          state.props['x-component'] = 'AntdSelect';
          state.props.enum = linkTableField?.fieldEnum || [];
          return;
        }

        if (value === 'fixedValue') {
          state.props['x-component'] = linkTableField?.['x-component'] ?? 'input';
          state.props.enum = undefined;
          return;
        }

        state.props['x-component'] = 'AntdSelect';
        state.props.enum = currentFormFields;
      },
    );
  }

  function updateCompareValueFieldMode(name: string, isMultiple: boolean): void {
    const compareValuePath = FormPath.transform(name, /\d/, ($1) => `rules.${$1}.compareValue`);
    setFieldState(compareValuePath, (state) => {
      const compareValue = getFieldValue(compareValuePath);
      state.props['x-component-props'] = isMultiple ? { mode: 'multiple' } : {};

      if (isMultiple && !Array.isArray(compareValue)) {
        const values = [];
        values.push(compareValue);
        state.value = values;
        return;
      }

      if (!isMultiple && Array.isArray(compareValue)) {
        state.value = compareValue[0];
        return;
      }
    },
    );
  }

  if (!isLinkedFieldShow) {
    SCHEMA.properties = omit(SCHEMA.properties, 'linkedField');
  }
  if (isLinkedTableReadonly && SCHEMA.properties) {
    SCHEMA.properties['linkedTableID'].readOnly = true;
  }

  return (
    <Modal
      title={`设置数据联动: ${store.activeField?.configValue.title}`}
      className="setting-data-linkage"
      onClose={onClose}
    >
      <SchemaForm
        className="p-20"
        actions={actions}
        schema={SCHEMA}
        components={COMPONENTS}
        defaultValue={convertLinkage(defaultValue)}
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
