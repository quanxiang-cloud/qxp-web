import React, { useContext } from 'react';
import {
  SchemaForm,
  SchemaMarkupField as Field,
  FormButtonGroup,
  createFormActions,
  FormEffectHooks,
  IFieldState,
} from '@formily/antd';
import {
  Input, Select as AntdSelect, NumberPicker, Switch, Radio,
} from '@formily/antd-components';
import { FormPath } from '@formily/shared';
import { toJS } from 'mobx';
import { filter, tap, skip } from 'rxjs6/operators';

import DatePicker from '@c/form-builder/registry/date-picker/date-picker';
import Modal from '@c/modal';
import Button from '@c/button';
import { INTERNAL_FIELD_NAMES } from '@c/form-builder/store';
import { StoreContext } from '@c/form-builder/context';
import { JoinOperatorSelect, RulesList } from '@c/form-builder/customized-fields';
import { OperatorOptions, OPERATORS } from '@c/form-builder/constants';
import schemaToFields, { schemaToMap } from '@lib/schema-convert';

import { compareValueValidateMap } from '../../utils';

const COMPONENTS = {
  Input, AntdSelect, DatePicker, NumberPicker, Switch, RadioGroup: Radio.Group, RulesList, JoinOperatorSelect,
};

const { onFieldValueChange$ } = FormEffectHooks;

const DEFAULT_VALUE: FormBuilder.RequiredLinkage = {
  key: '',
  ruleJoinOperator: 'every',
  rules: [{ sourceKey: '', compareOperator: '==', compareValue: '' }],
  targetKeys: [],
  isRequired: true,
};

const DISABLE_FIELD: Array<string> = [
  'Textarea',
  'CascadeSelector',
  'SubTable',
  'AssociatedRecords',
  'UserPicker',
  'OrganizationPicker',
  'FileUpload',
  'ImageUpload',
  'AssociatedData',
  'AggregationRecords',
  'Serial',
];

type Props = {
  mode: string;
  onClose: () => void;
  linkageKey: string;
  onSubmit: (linkage: FormBuilder.RequiredLinkage) => void;
}

function RulesConfig({ mode, onClose, linkageKey, onSubmit }: Props): JSX.Element {
  const store = useContext(StoreContext);
  const sourceSchema = toJS(store.schema);
  const sourceSchemaMap = schemaToMap(sourceSchema);
  const actions = createFormActions();
  const { setFieldState, getFieldValue, setFieldValue } = actions;
  const linkages = (
    sourceSchema['x-internal']?.requiredLinkages || []
  ) as FormBuilder.RequiredLinkage[];
  const defaultValue = linkages.find((linkage) => linkage.key === linkageKey) || DEFAULT_VALUE;
  const availableFormFields = schemaToFields(sourceSchema).filter((field) => {
    return !INTERNAL_FIELD_NAMES.includes(field.id);
  }).map((field) => {
    return {
      value: field.id,
      label: field.title || field.id,
      availableCompareValues: field.enum || [],
      xComponent: field['x-component'] || 'AntdSelect',
    };
  });

  const targetKeyFieldsEnum = availableFormFields;
  const sourceKeyEnum = availableFormFields.filter(({ xComponent }) => !DISABLE_FIELD.includes(xComponent));

  function formEffect(): void {
    onFieldValueChange$('rules.*.sourceKey').pipe(
      filter(({ value }) => !!value),
      tap(updateTargetKeyOnSourceKeyChanged),
      tap(updateCompareOperatorOnSourceKeyChanged),
      tap(updateCompareValueOnSourceKeyChanged),
      skip(defaultValue.rules.length),
    ).subscribe(resetValueOfCompareValue);

    onFieldValueChange$('targetKeys').pipe(
      filter(({ value }) => !!value),
    ).subscribe(updateSourceKeyOnTargetKeysChanged);
  }

  function updateCompareValueOnSourceKeyChanged({ name, value }: IFieldState): void {
    const sourceKeySchema = sourceSchemaMap[value];
    const currentSourceKeyFieldComponent = sourceKeySchema?.['x-component'];
    const currentSourceKeyFieldProps = sourceKeySchema?.['x-component-props'];
    const compareValuePath = FormPath.transform(name, /\d/, ($1) => `rules.${$1}.compareValue`);
    // const currentCompareValue = getFieldValue(compareValuePath);
    const index = FormPath.transform(name, /\d/, ($1) => Number($1));
    const rules = getFieldValue('rules');
    const currentCompareValue = rules[index].compareValue;
    setFieldState(compareValuePath, (state: any) => {
      const selectTypeComponent = ['CheckboxGroup', 'MultipleSelect', 'Select', 'RadioGroup'];
      if (selectTypeComponent.includes(currentSourceKeyFieldComponent || '')) {
        state.props['x-component'] = 'AntdSelect';
        state.props.enum = sourceKeySchema.enum;
      } else {
        state.props['x-component'] = currentSourceKeyFieldComponent;
        state.props.enum = undefined;
      }
      state.props['x-component-props'] = currentSourceKeyFieldProps;
      state.props['x-component-props'].defaultValue = currentCompareValue;

      if (currentSourceKeyFieldComponent === 'MultipleSelect') {
        state.props['x-component-props'].mode = 'multiple';
      }
      if (currentSourceKeyFieldProps?.mode === 'multiple' && currentCompareValue === '') {
        state.value = undefined;
      }
    });
  }

  function resetValueOfCompareValue({ name, value }: IFieldState): void {
    const compareValuePath = FormPath.transform(name, /\d/, ($1) => `rules.${$1}.compareValue`);
    const currentCompareValue = getFieldValue(compareValuePath);
    const sourceKeySchema = sourceSchemaMap[value];
    const currentSourceKeyFieldComponent = sourceKeySchema?.componentName;
    const currentSourceKeyFieldProps = sourceKeySchema?.['x-component-props'];

    const shouldInitValue = compareValueValidateMap[currentSourceKeyFieldComponent](
      currentCompareValue, currentSourceKeyFieldProps?.format,
    );

    if (shouldInitValue) {
      setFieldValue(compareValuePath, undefined);
    }
  }

  function updateCompareOperatorOnSourceKeyChanged({ name, value }: IFieldState): any {
    const sourceKeyFieldComponent = sourceKeyEnum.find((sourceKeyOption) => sourceKeyOption.value === value);
    const operators = OperatorOptions[sourceKeyFieldComponent?.xComponent as string];
    const compareOperatorPath = FormPath.transform(name, /\d/, ($1) => `rules.${$1}.compareOperator`);
    // const currentOperator = getFieldValue(compareOperatorPath);
    // const shouldReset = !operators.includes(currentOperator);

    const index = FormPath.transform(name, /\d/, ($1) => Number($1));
    const rules = getFieldValue('rules');
    const currentOperator = rules[index].compareOperator;
    const shouldReset = !JSON.stringify(operators).includes(currentOperator);
    setFieldState(compareOperatorPath, (state) => {
      state.props.enum = operators;
      if (shouldReset || !currentOperator) {
        state.value = operators[0].value;
      }
    });
  }

  function updateTargetKeyOnSourceKeyChanged(): void {
    const rulesSourceKeys = getFieldValue('rules').map((field: any) => field.sourceKey);

    setFieldState('targetKeys', (state) => {
      state.props.enum = targetKeyFieldsEnum
        .map(({ label, value }) => ({ label, value }))
        .filter((option) => !rulesSourceKeys.includes(option.value));
    });
  }

  function updateSourceKeyOnTargetKeysChanged({ value }: IFieldState): void {
    setFieldState('rules.*.sourceKey', (state) => {
      state.props.enum = sourceKeyEnum
        .filter((option) => !value.includes(option.value))
        .map(({ label, value }) => ({ label, value }));
    });
  }

  return (
    <Modal title={`${mode}字段必填条件`} onClose={onClose}>
      <div className="p-20">
        <SchemaForm
          components={COMPONENTS}
          defaultValue={defaultValue}
          actions={actions}
          effects={formEffect}
          onSubmit={onSubmit}
        >
          <Field name="ruleJoinOperator" x-component="JoinOperatorSelect" />
          <Field
            title="条件列表"
            name="rules"
            type="array"
            x-component="RulesList"
          >
            <Field type="object">
              <Field
                required
                name="sourceKey"
                x-component="AntdSelect"
                title=""
                enum={sourceKeyEnum.map(({ label, value }) => ({ label, value }))}
              />
              <Field
                required
                name="compareOperator"
                x-component="AntdSelect"
                title=""
                enum={OPERATORS.Default}
              />
              <Field
                title=""
                name="compareValue"
                default=""
                x-component='AntdSelect'
              />
            </Field>
          </Field>
          <Field
            name="isRequired"
            title="以下字段"
            x-component="RadioGroup"
            enum={[
              { label: '必填', value: true },
              { label: '非必填', value: false },
            ]}
          />
          <Field
            required
            name="targetKeys"
            x-component="AntdSelect"
            enum={targetKeyFieldsEnum.map(({ label, value }) => ({ label, value }))}
            x-component-props={{ mode: 'multiple' }}
          />
          <FormButtonGroup offset={8}>
            <Button type="submit" modifier="primary">保存</Button>
            <Button type="submit" onClick={onClose}>关闭</Button>
          </FormButtonGroup>
        </SchemaForm>
      </div>
    </Modal>
  );
}

export default RulesConfig;
