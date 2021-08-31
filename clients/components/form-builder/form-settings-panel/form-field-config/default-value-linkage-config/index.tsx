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
  IForm,
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
import { getLinkageTables } from '@c/form-builder/utils/api';
import schemaToFields from '@lib/schema-convert';

import { fetchLinkedTableFields } from './get-tables';
import SCHEMA from './schema';
import { convertFormValues, convertLinkage } from './convertor';
import { compareValueValidateMap } from '../../form-config/visible-hidden-rules/constants';

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
  componentName: string;
}

type Option = {
  label: string,
  value: string,
}

type Props = {
  form: IForm;
  onClose: () => void;
  onSubmit: (linkage: FormBuilder.DefaultValueLinkage) => void;
  linkage?: FormBuilder.DefaultValueLinkage;
  isLinkedFieldHide?: boolean;
  isLinkedTableReadonly?: boolean;
}

function LinkageConfig({
  onClose, onSubmit, linkage, isLinkedFieldHide, isLinkedTableReadonly, form,
}: Props): JSX.Element {
  const actions = createFormActions();
  const { setFieldState, getFieldValue, setFieldValue } = actions;
  const [linkageTables, setLinkageTables] = useState<Array<FormBuilder.Option>>([]);
  const linkedTableFieldsRef = useRef<LinkedTableFieldOptions[]>([]);
  const store = useContext(StoreContext);
  const defaultValue = linkage || DEFAULT_VALUE_LINKAGE;

  const currentFormFields = schemaToFields(toJS(store.schema)).filter((field) => {
    if (INTERNAL_FIELD_NAMES.includes(field.id) || field.id === store.activeField?.fieldName) {
      return false;
    }
    // todo match type
    return ['string', 'number', 'datetime'].includes(field.type || '');
  }).map((field) => ({ label: field.title as string, value: field.id }));

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
        // todo match type
        return field.componentName === store.activeField?.componentName.toLowerCase();
      }).map(({ label, value }) => ({ label, value }));
    });
    setFieldState('sortBy', (state) => state.props.enum = options);

    linkedTableFieldsRef.current = fields;

    setFieldState('rules.*.fieldName', updateCompareOperatorFieldOnFieldNameChanged);
    setFieldState('rules.*.fieldName', updateCompareValueFieldEnumAndComponent);
    setFieldState('rules.*.compareOperator', updateCompareValueFieldOnCompareOperatorChanged);
    setFieldState('rules.*.compareTo', updateCompareValueFieldEnumAndComponent);
  }

  useEffect(() => {
    // find all available linkage tables
    getLinkageTables(store.appID).then((options) => {
      const filteredOptions = options.filter(({ value }) => value !== store.pageID);
      setLinkageTables(filteredOptions);
      setFieldState('linkedTableID', (state) => state.props.enum = filteredOptions);
      if (isLinkedTableReadonly) {
        form.getFieldState('Fields.linkedTable', (state) => {
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
    ).subscribe(updateCompareValueFieldEnumAndComponent);

    onFieldValueChange$('rules.*.compareOperator').pipe(
      filter(({ value }) => !!value),
    ).subscribe(updateCompareValueFieldOnCompareOperatorChanged);

    onFieldValueChange$('rules.*.compareTo').pipe(
      filter(({ name, value }) => name && value),
    ).subscribe(updateCompareValueFieldEnumAndComponent);
  }

  function updateCompareOperatorFieldOnFieldNameChanged({ name, value }: IFieldState): void {
    const xComponent = linkedTableFieldsRef.current.find((field) => {
      return field.value === value;
    })?.componentName;

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
    const fieldNamePath = FormPath.transform(name, /\d/, ($1) => `rules.${$1}.fieldName`);
    const compareToPath = FormPath.transform(name, /\d/, ($1) => `rules.${$1}.compareTo`);
    const currentFieldNameValue = getFieldValue(fieldNamePath);
    const currentCompareToValue = getFieldValue(compareToPath);
    let compareValueOptions: Option[] | undefined = [];
    if (currentCompareToValue === 'fixedValue') {
      compareValueOptions = linkedTableFieldsRef.current.find(
        (field) => field.value === currentFieldNameValue,
      )?.fieldEnum.map(({ label, value })=> ({ label, value }));
    }
    if (currentCompareToValue === 'currentFormValue') {
      compareValueOptions = currentFormFields;
    }

    updateCompareValueFieldMode(name, isMultiple, compareValueOptions);
  }

  function updateCompareValueFieldEnumAndComponent({ name }: IFieldState): void {
    const fieldNamePath = FormPath.transform(name, /\d/, ($1) => `rules.${$1}.fieldName`);
    const compareToPath = FormPath.transform(name, /\d/, ($1) => `rules.${$1}.compareTo`);
    const compareValuePath = FormPath.transform(name, /\d/, ($1) => `rules.${$1}.compareValue`);
    const currentFieldNameValue = getFieldValue(fieldNamePath);
    const currentCompareToValue = getFieldValue(compareToPath);
    const currentCompareValue = getFieldValue(compareValuePath);
    const linkTableField = linkedTableFieldsRef.current.find(
      (field) => field.value === currentFieldNameValue,
    );
    const enumerable = !!(linkTableField?.fieldEnum || []).length;
    let shouldReset = false;
    if (linkTableField) {
      shouldReset = compareValueValidateMap[linkTableField.componentName](currentCompareValue);
    }

    setFieldState(compareValuePath, (state) => {
      if (currentCompareToValue === 'fixedValue' && enumerable) {
        state.props['x-component'] = 'AntdSelect';
        state.props.enum = linkTableField?.fieldEnum;
        if (linkTableField?.fieldEnum && !!linkTableField?.fieldEnum?.length) {
          const optionValues = linkTableField?.fieldEnum.map(({ value }) => value);
          if (Array.isArray(currentCompareValue)) {
            state.value = currentCompareValue.filter((value: any) => optionValues.includes(value));
            return;
          }

          state.value = optionValues.includes(currentCompareValue) ? currentCompareValue : undefined;
          return;
        }
      }

      if (currentCompareToValue === 'fixedValue') {
        state.props['x-component'] = linkTableField?.componentName || 'input';
        state.props.enum = undefined;

        if (shouldReset) {
          state.value = undefined;
        }
        return;
      }

      state.props['x-component'] = 'AntdSelect';
      state.props.enum = currentFormFields;
      if (currentFormFields && !!currentFormFields.length) {
        const optionValues = currentFormFields.map(({ value }) => value);
        if (Array.isArray(currentCompareValue)) {
          state.value = currentCompareValue.filter((value: any) => optionValues.includes(value));
          return;
        }

        if (currentCompareValue && !optionValues.includes(currentCompareValue)) {
          state.value = undefined;
          return;
        }
      }
    });
  }

  function updateCompareValueFieldMode(
    name: string, isMultiple: boolean, options: Option[] | undefined,
  ): void {
    const compareValuePath = FormPath.transform(name, /\d/, ($1) => `rules.${$1}.compareValue`);
    setFieldState(compareValuePath, (state) => {
      const compareValue = getFieldValue(compareValuePath);
      state.props['x-component-props'] = isMultiple ? { mode: 'multiple' } : {};

      if (options && !!options?.length) {
        if (isMultiple && !Array.isArray(compareValue)) {
          const shouldResetToValue = options.find(({ value }) => {
            return value === compareValue;
          })?.value;

          state.value = [shouldResetToValue];
          return;
        }

        if (!isMultiple && Array.isArray(compareValue)) {
          const shouldResetToValue = options.find(({ value }) => {
            return compareValue.includes(value);
          })?.value;

          state.value = shouldResetToValue;
          return;
        }
      }
    });
  }

  if (isLinkedFieldHide) {
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
        <FormButtonGroup offset={8}>
          <Button type="submit" modifier="primary">保存</Button>
          <Button type="submit" onClick={onClose}>关闭</Button>
        </FormButtonGroup>
      </SchemaForm>
    </Modal>
  );
}

export default LinkageConfig;
