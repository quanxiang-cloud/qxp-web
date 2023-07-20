/* eslint-disable max-len */
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
import { OperatorOptions, OPERATORS } from '@c/form-builder/constants';
import schemaToFields, { schemaToMap } from '@lib/schema-convert';
import { compareValueValidateMap } from '@c/form-builder/form-settings-panel/utils';

import './index.scss';
import { JoinOperatorSelectAll, RulesList } from '@c/form-builder/customized-fields';

const COMPONENTS = {
  Input, AntdSelect, DatePicker, NumberPicker, Switch, RadioGroup: Radio.Group, RulesList, JoinOperatorSelectAll,
};

const { onFieldValueChange$ } = FormEffectHooks;

const DEFAULT_VALUE: FormBuilder.SelectAllLinkage = {
  key: '',
  ruleJoinOperator: 'every',
  rules: [{ sourceKey: '', compareOperator: '==', compareValue: '' }],
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
  data: any;
  onClose: () => void;
  onSubmit: (linkage: FormBuilder.RequiredLinkage) => void;
}

function RulesConfig({ data, onClose, onSubmit }: Props): JSX.Element {
  const store = useContext(StoreContext);
  const sourceSchema = toJS(store.schema);
  const sourceSchemaMap = schemaToMap(sourceSchema);
  const actions = createFormActions();
  const { setFieldState, getFieldValue, setFieldValue } = actions;
  const defaultValue = data || DEFAULT_VALUE;
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

  const sourceKeyEnum = availableFormFields.filter(({ xComponent }) => !DISABLE_FIELD.includes(xComponent));

  function formEffect(): void {
    onFieldValueChange$('rules.*.sourceKey').pipe(
      filter(({ value }) => !!value),
      tap(updateCompareOperatorOnSourceKeyChanged),
      tap(updateCompareValueOnSourceKeyChanged),
      skip(defaultValue.rules.length),
    ).subscribe(resetValueOfCompareValue);
  }

  function updateCompareValueOnSourceKeyChanged({ name, value }: IFieldState): void {
    const sourceKeySchema = sourceSchemaMap[value];
    const currentSourceKeyFieldComponent = sourceKeySchema?.['x-component'];
    const currentSourceKeyFieldProps = sourceKeySchema?.['x-component-props'];
    const compareValuePath = FormPath.transform(name, /\d/, ($1) => `rules.${$1}.compareValue`);
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
    let currentCompareValue = getFieldValue(compareValuePath);
    const sourceKeySchema = sourceSchemaMap[value];
    const currentSourceKeyFieldComponent = sourceKeySchema?.componentName;
    const currentSourceKeyFieldProps = sourceKeySchema?.['x-component-props'];

    if (currentSourceKeyFieldComponent === 'select' || currentSourceKeyFieldComponent === 'radiogroup' ) {
      currentCompareValue = currentCompareValue ? [currentCompareValue] : currentCompareValue;
    }

    const shouldInitValue = compareValueValidateMap[currentSourceKeyFieldComponent](
      currentCompareValue, currentSourceKeyFieldProps?.format,
    );
    if (shouldInitValue) {
      setTimeout(()=>{
        setFieldValue(compareValuePath, undefined);
      });
    }
  }

  function updateCompareOperatorOnSourceKeyChanged({ name, value }: IFieldState): any {
    const sourceKeyFieldComponent = sourceKeyEnum.find((sourceKeyOption) => sourceKeyOption.value === value);
    const operators = OperatorOptions[sourceKeyFieldComponent?.xComponent as string];
    const compareOperatorPath = FormPath.transform(name, /\d/, ($1) => `rules.${$1}.compareOperator`);
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

  const handleClose = ()=>{
    onClose();
  };

  const handleSubmit = (values: any)=>{
    onSubmit(values);
  };

  return (
    <Modal title={'设置选择全部数据规则'} onClose={handleClose}>
      <div className="p-20 select-all-config">
        <SchemaForm
          components={COMPONENTS}
          defaultValue={defaultValue}
          actions={actions}
          effects={formEffect}
          onSubmit={handleSubmit}
        >
          <Field name="ruleJoinOperator" x-component="JoinOperatorSelectAll" />
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
