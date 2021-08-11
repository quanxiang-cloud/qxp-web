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

import DatePicker from '@c/form-builder/registry/date-picker/date-picker';
import Modal from '@c/modal';
import Button from '@c/button';
import { INTERNAL_FIELD_NAMES } from '@c/form-builder/store';
import { StoreContext } from '@c/form-builder/context';
import { toJS } from 'mobx';
import { filter, tap, skip } from 'rxjs/operators';

import { JoinOperatorSelect, RulesList } from '@c/form-builder/customized-fields';
import { OperatorOptions, OPERATORS } from '@c/form-builder/constants';
import { compareValueValidateMap } from './constants';

const COMPONENTS = {
  Input, AntdSelect, DatePicker, NumberPicker, Switch, RadioGroup: Radio.Group, RulesList, JoinOperatorSelect,
};

const { onFieldValueChange$ } = FormEffectHooks;

const DEFAULT_VALUE: FormBuilder.VisibleHiddenLinkage = {
  key: '',
  ruleJoinOperator: 'every',
  rules: [{ sourceKey: '', compareOperator: '==', compareValue: '' }],
  targetKeys: [],
  isShow: true,
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
];

type Props = {
  mode: string;
  onClose: () => void;
  linkageKey: string;
  onSubmit: (linkage: FormBuilder.VisibleHiddenLinkage) => void;
}

function RulesConfig({ mode, onClose, linkageKey, onSubmit }: Props): JSX.Element {
  const store = useContext(StoreContext);
  const sourceSchema = toJS(store.schema);
  const actions = createFormActions();
  const { setFieldState, getFieldValue, setFieldValue } = actions;
  const linkages = (
    sourceSchema['x-internal']?.visibleHiddenLinkages || []
  ) as FormBuilder.VisibleHiddenLinkage[];
  const defaultValue = linkages.find((linkage) => linkage.key === linkageKey) || DEFAULT_VALUE;
  const availableFormFields = Object.entries(sourceSchema.properties || {})
    .filter(([key]) => !INTERNAL_FIELD_NAMES.includes(key))
    .map(([key, value]) => {
      return { value: key, label: value.title || key, availableCompareValues: value.enum || [],
        xComponent: value['x-component'] || 'AntdSelect',
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
    const currentSourceKeyFieldComponent = sourceSchema?.properties?.[value]['x-component'];
    const currentSourceKeyFieldProps = sourceSchema?.properties?.[value]['x-component-props'];
    const compareValuePath = FormPath.transform(name, /\d/, ($1) => `rules.${$1}.compareValue`);
    const currentCompareValue = getFieldValue(compareValuePath);
    setFieldState(compareValuePath, (state) => {
      const selectTypeComponent = ['CheckboxGroup', 'MultipleSelect', 'Select', 'RadioGroup'];
      if (selectTypeComponent.includes(currentSourceKeyFieldComponent as string)) {
        state.props['x-component'] = 'AntdSelect';
        state.props.enum = sourceSchema?.properties?.[value].enum;
      } else {
        state.props['x-component'] = currentSourceKeyFieldComponent;
        state.props.enum = undefined;
      }
      state.props['x-component-props'] = currentSourceKeyFieldProps;

      if (currentSourceKeyFieldProps?.mode === 'multiple' && currentCompareValue === '') {
        state.value = undefined;
      }
    });
  }

  function resetValueOfCompareValue({ name, value }: IFieldState): void {
    const compareValuePath = FormPath.transform(name, /\d/, ($1) => `rules.${$1}.compareValue`);
    const currentCompareValue = getFieldValue(compareValuePath);
    const currentSourceKeyFieldComponent = sourceSchema?.properties?.[value]['x-component'] as string;
    const currentSourceKeyFieldProps = sourceSchema?.properties?.[value]['x-component-props'];
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
    const currentOperator = getFieldValue(compareOperatorPath);
    const shouldReset = !operators.includes(currentOperator);

    setFieldState(compareOperatorPath, (state) => {
      state.props.enum = operators;
      if (shouldReset) {
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
    <Modal title={`${mode}字段显隐条件`} onClose={onClose}>
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
            name="isShow"
            title="以下字段"
            x-component="RadioGroup"
            enum={[
              { label: '显示', value: true },
              { label: '隐藏', value: false },
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
