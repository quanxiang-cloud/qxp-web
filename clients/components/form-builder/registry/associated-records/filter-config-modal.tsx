import React, { useState } from 'react';
import {
  SchemaForm,
  FormButtonGroup,
  createAsyncFormActions,
  FormEffectHooks,
} from '@formily/antd';
import { FormPath } from '@formily/shared';
import {
  Input, Select as AntdSelect, DatePicker, NumberPicker, Switch, Radio,
} from '@formily/antd-components';

import Modal from '@c/modal';
import Button from '@c/button';

import { INTERNAL_FIELD_NAMES } from '../../store';
import { operatorOption } from '@c/form-builder/form-settings-panel/utils';
import {
  JoinOperatorSelect, RulesList, FormDataFilterRuleFieldFragments,
} from '@c/form-builder/customized-fields';

type RuleConfig = {
  rules: Array<FormBuilder.FormDataFilterRule>;
  ruleJoinOperator: 'every' | 'some';
}

type Option = {
  value: string;
  label: string;
  availableCompareValues: Array<{ value: string; label: string; }>;
  'x-component': string;
};

const SUPPORT_COMPARED_COMPONENTS = [
  'input',
  'radiogroup',
  'checkboxgroup',
  'numberpicker',
  'datepicker',
  'select',
  'multipleselect',
];

const COMPONENTS = {
  RulesList, Input, AntdSelect, DatePicker, NumberPicker, Switch, RadioGroup: Radio.Group,
  JoinOperatorSelect,
};

const { onFieldInputChange$ } = FormEffectHooks;

function getTableFieldOptions(schema: ISchema): Array<Option> {
  return Object.entries(schema.properties || {})
    .filter(([key, fieldSchema]) => {
      return !INTERNAL_FIELD_NAMES.includes(key) ||
        !SUPPORT_COMPARED_COMPONENTS.includes(fieldSchema['x-component'] || '');
    }).map(([key, fieldSchema]) => {
      return {
        value: key,
        label: (fieldSchema.title || key) as string,
        availableCompareValues: (fieldSchema.enum || []) as Array<{ value: string; label: string; }>,
        'x-component': fieldSchema['x-component'] || 'AntdSelect',
      };
    });
}

type Props = {
  onClose: () => void;
  onSubmit: (ruleConfig: RuleConfig) => void;
  associatedTableSchema: ISchema;
  currentTableSchema: ISchema;
  filter?: RuleConfig;
}

export default function FilterConfigModal(
  { onClose, associatedTableSchema, currentTableSchema, filter, onSubmit }: Props,
): JSX.Element {
  const actions = createAsyncFormActions();
  const { setFieldState, getFieldValue } = actions;
  const [currentFormFields] = useState(getTableFieldOptions(currentTableSchema));
  const [associatedTableFields] = useState(getTableFieldOptions(associatedTableSchema));

  function formModelEffect() {
    onFieldInputChange$('rules.*.fieldName').subscribe(({ name, value }) => {
      if (!value || !name) {
        return;
      }
      const componentType = associatedTableFields.find((field) => field.value === value)?.['x-component'];

      setFieldState(FormPath.transform(name, /\d/, ($1) => {
        return `rules.${$1}.compareOperator`;
      }), (state) => {
        const operators = operatorOption(componentType);
        state.props.enum = operators;
        state.value = operators[0].value;
      });

      const pathOfCompareTo = FormPath.transform(name, /\d/, ($1) => `rules.${$1}.compareTo`);
      setFieldState(pathOfCompareTo, (state) => state.value = 'currentFormValue');

      const pathOfCompareValue = FormPath.transform(name, /\d/, ($1) => `rules.${$1}.compareValue`);
      setFieldState(pathOfCompareValue, (state) => {
        state.props['x-component'] = 'AntdSelect';
        state.props['x-component-props'] = {
          placeholder: '当前表单字段值',
        };
        state.props.enum = currentFormFields;
        state.value = undefined;
      });
    });

    onFieldInputChange$('rules.*.compareTo').subscribe(({ name, value }) => {
      if (!value || !name) {
        return;
      }

      const pathOfCompareTo = FormPath.transform(name, /\d/, ($1) => `rules.${$1}.compareTo`);

      setFieldState(pathOfCompareTo, (state) => {
        let options = currentFormFields.map(({ label, value }) => ({ label, value }));
        let componentType = 'AntdSelect';
        let tips = '当前表单字段值';

        if (value === 'fixedValue') {
          getFieldValue(FormPath.transform(name, /\d/, ($1) => {
            return `rules.${$1}.formField`;
          })).then((fixFieldKey) => {
            const linkTableField = associatedTableFields.find((field) => field.value === fixFieldKey);

            options = linkTableField?.availableCompareValues || [];
            if (options.length === 0) {
              componentType = linkTableField?.['x-component'] || 'Input';
            }
            tips = '请输入固定值';
          });
        }

        state.props['x-component'] = componentType;
        state.props['x-component-props'] = {
          placeholder: tips,
        };
        state.props.enum = options.length === 0 ? undefined : options;
        state.value = undefined;
      });
    });
  }

  return (
    <Modal onClose={onClose}>
      <SchemaForm
        className="p-20"
        actions={actions}
        components={COMPONENTS}
        defaultValue={filter}
        effects={formModelEffect}
        onSubmit={(values) => {
          onSubmit(values);
        }}
      >
        {/* 'x-component': 'mega-layout', */}
        <FormDataFilterRuleFieldFragments
          linkedTableFields={associatedTableFields}
          currentFormFields={currentFormFields }
        />
        <FormButtonGroup offset={4}>
          <Button type="submit" modifier="primary">保存</Button>
          <Button type="submit" onClick={onClose}>关闭</Button>
        </FormButtonGroup>
      </SchemaForm>
    </Modal>
  );
}
