import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { toJS } from 'mobx';
import {
  SchemaForm,
  SchemaMarkupField as Field,
  FormButtonGroup,
  createFormActions,
  FormEffectHooks,
} from '@formily/antd';
import { FormPath } from '@formily/shared';
import {
  Input, Select as AntdSelect, DatePicker, NumberPicker, Switch, FormItemGrid, Radio,
} from '@formily/antd-components';

import Modal from '@c/modal';
import Button from '@c/button';

import { StoreContext } from '@c/form-builder/context';

import { INTERNAL_FIELD_NAMES } from '../../../store';
import { OPERATORS } from '../../consts';
import { operatorOption } from '../../utils';
import { ArrayCustom, JoinOperatorSelect } from './customized-fields';
import { getLinkageTables, getTableSchema } from './get-tables';

const { onFieldInputChange$ } = FormEffectHooks;
const COMPONENTS = {
  ArrayCustom,
  Input,
  AntdSelect,
  DatePicker,
  NumberPicker,
  Switch,
  RadioGroup: Radio.Group,
  JoinOperatorSelect,
};
const AVAILABLE_FIELD = [
  'Input', 'DatePicker', 'NumberPicker', 'RadioGroup', 'MultipleSelect', 'CheckboxGroup', 'Select',
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

type Option = {
  label: string;
  value: string;
}

type Props = {
  onClose: () => void;
  onSubmit: (linkage: FormBuilder.DefaultValueLinkage) => void;
}

type LinkedTableFieldOptions = Option & {
  availableCompareValues: Array<Option>;
  'x-component': string;
}

function LinkageConfig({ onClose, onSubmit }: Props): JSX.Element {
  const store = useContext(StoreContext);
  const { pageId } = useParams<{ pageId: string }>();
  const [linkageTables, setLinkageTables] = useState<Array<Option>>([]);
  const [linkedTableFields, setLinkedTableFields] = useState<LinkedTableFieldOptions[]>([]);

  useEffect(() => {
    getLinkageTables(store.appID).then((options) => {
      // filter off current page
      setLinkageTables(options.filter(({ value }) => value !== pageId));
    });
  }, []);

  const fieldSchema = toJS(store.schema.properties || {});

  const currentFormFields = Object.keys(fieldSchema)
    .filter((key) => !INTERNAL_FIELD_NAMES.includes(key))
    .reduce<Array<Option>>((acc, key) => {
      acc.push({ label: fieldSchema[key].title as string, value: key });
      return acc;
    }, []);

  function formatFormData(values: any): FormBuilder.DefaultValueLinkage {
    return {
      linkedAppID: store.appID,
      linkedTable: {
        id: values.linkedTableID,
        name: linkageTables.find((option) => option.value === values.linkedTableID)?.label || '',
      },
      linkedTableSortRules: [values.sortOrder ? '-' + values.sortBy : values.sortBy],
      linkedField: values.linkedField,
      targetField: '',
      ruleJoinOperator: values.ruleJoinOperator,
      rules: values.rules,
    };
  }

  function formModelEffect() {
    const { setFieldState, getFieldValue } = createFormActions();

    onFieldInputChange$('linkedTableID').subscribe(({ value }) => {
      getTableSchema({ appID: store.appID, tableID: value }).then((schema) => {
        const fields = Object.entries(schema.properties || {}).filter(([key, value]) => {
          return !INTERNAL_FIELD_NAMES.includes(key) &&
            AVAILABLE_FIELD.includes(value['x-component'] || '');
        }).map(([key, value]) => {
          return {
            value: key,
            label: (value.title || key) as string,
            availableCompareValues: (value.enum || []) as Array<Option>,
            'x-component': value['x-component'] || 'AntdSelect',
          };
        });

        setLinkedTableFields(fields);

        const optionValues = fields.map(({ label, value }) => ({ label, value }));
        setFieldState('rules.*.formField', (state) => {
          state.props.enum = optionValues;
        });
        setFieldState('linkedField', (state: any) => {
          state.props.enum = optionValues;
        });
        setFieldState('sortBy', (state) => {
          state.props.enum = optionValues;
        });
      });
    });

    onFieldInputChange$('rules.*.fieldName').subscribe(({ name, value }) => {
      if (!value || !name) {
        return;
      }
      const componentType = linkedTableFields.find((field) => field.value === value)?.['x-component'];

      setFieldState(FormPath.transform(name, /\d/, ($1) => {
        return `rules.${$1}.compareOperator`;
      }), (state) => {
        const operators = operatorOption(componentType);
        state.props.enum = operators;
        state.value = operators[0].value;
      });

      setFieldState(FormPath.transform(name, /\d/, ($1) => {
        return `rules.${$1}.compareTo`;
      }), (state) => {
        state.value = 'currentFormValue';
      });
      setFieldState(FormPath.transform(name, /\d/, ($1) => {
        return `rules.${$1}.compareValue`;
      }), (state) => {
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

      const path = FormPath.transform(name, /\d/, ($1) => {
        return `rules.${$1}.compareValue`;
      });

      setFieldState(path, (state) => {
        let options = currentFormFields;
        let componentType = 'AntdSelect';
        let tips = '当前表单字段值';

        if (value === 'fixedValue') {
          const fixFieldKey = getFieldValue(FormPath.transform(name, /\d/, ($1) => {
            return `rules.${$1}.linkedField`;
          }));

          const linkTableField = linkedTableFields.find((field) => field.value === fixFieldKey);

          options = linkTableField?.availableCompareValues ?? [];
          if (options.length === 0) {
            componentType = linkTableField?.['x-component'] ?? 'Input';
          }
          tips = '请输入固定值';
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

  const defaultValue: FormBuilder.DefaultValueLinkage =
    store.activeField?.configValue.defaultValueLinkage || DEFAULT_VALUE_LINKAGE;

  return (
    <Modal title="设置数据联动" onClose={onClose}>
      <SchemaForm
        components={COMPONENTS}
        defaultValue={defaultValue}
        effects={formModelEffect}
        onSubmit={(values) => {
          onSubmit(formatFormData(values));
        }}
      >
        <Field
          required
          name="linkedTableID"
          x-component="AntdSelect"
          title="联动表单"
          default={defaultValue.linkedTable.id}
          enum={linkageTables}
        />
        <FormItemGrid gutter={20}>
          <Field
            title="取值规则"
            name="sortBy"
            x-component="AntdSelect"
          />
          <Field
            name="sortOrder"
            x-component="RadioGroup"
            default={false}
            enum={[
              { label: '升序', value: false },
              { label: '降序', value: true },
            ]}
          />
        </FormItemGrid>
        <Field
          name="ruleJoinOperator"
          type="string"
          x-component="JoinOperatorSelect"
        />
        <Field
          name="rules"
          type="array"
          x-component="ArrayCustom"
        >
          <Field type="object">
            <Field
              required
              name="fieldName"
              x-component="AntdSelect"
              x-component-props={{ placeholder: '联动表单字段' }}
              enum={linkedTableFields.map(({ label, value }) => ({ label, value }))}
            />
            <Field
              required
              name="compareOperator"
              x-component="AntdSelect"
              enum={OPERATORS.Default}
            />
            <Field
              required
              name="compareTo"
              x-component="AntdSelect"
              title=""
              default="currentFormValue"
              enum={[
                { label: '表单值', value: 'currentFormValue' },
                { label: '固定值', value: 'fixedValue' },
              ]}
            />
            <Field
              required
              name="compareValue"
              x-component='AntdSelect'
              x-component-props={{
                placeholder: '当前表单字段值',
              }}
              enum={currentFormFields}
            />
          </Field>
        </Field>
        <Field
          name="linkedField"
          title={`${store.activeField?.configValue.title}的值联动显示为`}
          enum={linkedTableFields.map(({ label, value }) => ({ label, value }))}
          x-component="AntdSelect"
          x-mega-props={{
            wrapperCol: 8,
            span: 1,
          }}
        />
        <FormButtonGroup offset={4}>
          <Button type="submit" modifier="primary">保存</Button>
          <Button type="submit" onClick={onClose}>关闭</Button>
        </FormButtonGroup>
      </SchemaForm>
    </Modal>
  );
}

export default LinkageConfig;
