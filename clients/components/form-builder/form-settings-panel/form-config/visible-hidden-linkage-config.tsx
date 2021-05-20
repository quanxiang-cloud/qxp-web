import React, { useState } from 'react';
import styled from 'styled-components';
import {
  SchemaForm,
  SchemaField,
  SchemaMarkupField as Field,
  FormButtonGroup,
  createFormActions,
  FormEffectHooks,
} from '@formily/antd';
import { ArrayList } from '@formily/react-shared-components';
import { toArr, FormPath } from '@formily/shared';
import { Input, Select as AntdSelect, DatePicker, NumberPicker } from '@formily/antd-components';

import Modal from '@c/modal';
import Icon from '@c/icon';
import Button from '@c/button';
import Select from '@c/select';
import { INTERNAL_FIELD_NAMES } from '../../store';
import Store from '../../store';
import { toJS } from 'mobx';

const { onFieldInputChange$ } = FormEffectHooks;
const RowStyleLayout = styled((props) => <div {...props} />)`
  .ant-btn {
    margin-right: 16px;
  }
  .ant-form-item {
    display: inline-flex;
    margin-right: 16px;
    margin-bottom: 16px;
  }
  > .ant-form-item {
    margin-bottom: 0;
    margin-right: 0;
  }
`;

function ArrayCustom(props: any): JSX.Element {
  const { value, path, mutators, schema } = props;
  const onAdd = () => mutators.push(schema.items.getEmptyValue());
  const onRemove = (index: number) => mutators.remove(index);

  return (
    <ArrayList value={value}>
      {toArr(value).map((item, index) => (
        <RowStyleLayout key={index}>
          <SchemaField path={FormPath.parse(path).concat(index)} />
          <Icon clickable changeable name="delete" onClick={() => onRemove(index)} size={32} />
        </RowStyleLayout>
      ))}
      <Button onClick={onAdd}>新增条件</Button>
    </ArrayList>
  );
}

ArrayCustom.isFieldComponent = true;

const OPERATORS = {
  Input: [
    { value: '===', label: '等于' },
    { value: '!==', label: '不等于' },
  ],
  Select: [
    { value: '===', label: '等于' },
    { value: '!==', label: '不等于' },
    { value: '∈', label: '包含' },
    { value: '∉', label: '不包含' },
  ],
  DatePicker: [
    { value: '===', label: '等于' },
    { value: '!==', label: '不等于' },
    { value: '>', label: '早于' },
    { value: '<', label: '晚于' },
  ],
  NumberPicker: [
    { value: '===', label: '等于' },
    { value: '!==', label: '不等于' },
    { value: '>', label: '大于' },
    { value: '<', label: '小于' },
  ],
};

const DEFAULT_VALUE: FormBuilder.VisibleHiddenLinkage = {
  key: '',
  ruleJoinOperator: 'every',
  rules: [{ sourceKey: '', compareOperator: '===', compareValue: '' }],
  targetKeys: [],
};

type Props = {
  onClose: () => void;
  linkageKey: string;
  store: Store;
  onSubmit: (linkage: FormBuilder.VisibleHiddenLinkage) => void;
}

function VisibleHiddenLinkageConfig({ onClose, store, linkageKey, onSubmit }: Props): JSX.Element {
  const [tag, setTag] = useState('every');
  const sourceSchema = toJS(store.schema);
  const linkages = (
    sourceSchema['x-internal']?.visibleHiddenLinkages || []
  ) as FormBuilder.VisibleHiddenLinkage[];
  const defaultValue = linkages.find((linkage) => linkage.key === linkageKey) || DEFAULT_VALUE;
  const existingCondistions: Array<string> = [];
  let availableFields = Object.entries(sourceSchema.properties || {})
    .filter(([key]) => !INTERNAL_FIELD_NAMES.includes(key))
    .map(([key, value]) => {
      return { value: key, label: value.title || key, availableCompareValues: value.enum || [],
        'x-component': value['x-component'] || 'AntdSelect',
      };
    }).filter((availableField) => {
      return availableField['x-component'] !== 'textarea';
    });

  const sourceKeyOptions = availableFields.filter((availableField) => {
    return availableField['x-component'] !== 'textarea';
  });

  function setCompareValueOptions() {
    const { setFieldState } = createFormActions();
    let index = 0;
    onFieldInputChange$('rules.*.sourceKey').subscribe(({ name, value }) => {
      if (!value || !name) {
        return;
      }

      const path = FormPath.transform(name, /\d/, ($1) => {
        index = Number($1);
        existingCondistions[index] = value;
        return `rules.${$1}.compareValue`;
      });

      availableFields = Object.entries(sourceSchema.properties || {})
        .filter(([key]) => !INTERNAL_FIELD_NAMES.includes(key))
        .map(([key, value]) => {
          return { value: key, label: value.title || key, availableCompareValues: value.enum || [],
            'x-component': value['x-component'] || 'AntdSelect',
          };
        })
        .filter((availableField) => {
          return availableField['x-component'] !== 'textarea';
        });
      availableFields = availableFields.filter((availableField) => {
        return !existingCondistions.includes(availableField.value);
      });

      setFieldState('targetKeys', (state) => {
        state.props.enum = availableFields.map(({ label, value }) => {
          return { label, value };
        });
      });

      const availableCompareValues = sourceKeyOptions.find((sourceKeyOption) => {
        return sourceKeyOption.value === value;
      });

      let compareField = '';
      if (availableCompareValues) {
        compareField = availableCompareValues['x-component'];
      }

      setFieldState(FormPath.transform(name, /\d/, ($1) => {
        return `rules.${$1}.compareOperator`;
      }), (state) => {
        switch (compareField) {
        case 'Input':
          state.props.enum = OPERATORS.Input;
          break;
        case 'DatePicker':
          state.props.enum = OPERATORS.DatePicker;
          break;
        case 'NumberPicker':
          state.props.enum = OPERATORS.NumberPicker;
          break;
        default:
          state.props.enum = OPERATORS.Select;
          break;
        }
      });

      setFieldState(path, (state) => {
        if (availableCompareValues?.availableCompareValues.length !== 0) {
          state.props.enum = availableCompareValues?.availableCompareValues;
          state.value = [];
          state.props['x-component'] = 'AntdSelect';
          if (compareField === 'CheckboxGroup' || compareField === 'MultipleSelect') {
            state.props['x-component-props'] = { mode: 'multiple' };
          }
        } else {
          state.props.enum = undefined;
          state.props['x-component'] = compareField;
        }
      });
    });
  }

  return (
    <Modal title="编辑字段显隐条件" onClose={onClose}>
      <div className='flex items-center mb-16'>
        满足以下
        <Select
          className='mx-4'
          value={tag}
          onChange={(tag: string) => {
            setTag(tag);
            store.visibleHiddenLinkages.map((linkage: any) => {
              linkage.ruleJoinOperator = tag;
              return linkage;
            });
            store.linkageCondition = tag === 'every' ? '所有' : '任一';
          }}
          options={[{
            label: '所有',
            value: 'every',
          },
          {
            label: '任一',
            value: 'some',
          }]}
        />
      条件时
      </div>
      <SchemaForm
        components={{ ArrayCustom, Input, AntdSelect, DatePicker, NumberPicker }}
        defaultValue={defaultValue}
        onSubmit={onSubmit}
        effects={() => setCompareValueOptions()}
      >
        <Field
          title="条件列表"
          name="rules"
          type="array"
          x-component="ArrayCustom"
        >
          <Field type="object">
            <Field
              required
              name="sourceKey"
              x-component="AntdSelect"
              title=""
              enum={sourceKeyOptions.map(({ label, value }) => ({ label, value }))}
            />
            <Field
              required
              name="compareOperator"
              x-component="AntdSelect"
              title=""
              enum={OPERATORS.Select}
            />
            <Field
              title=""
              required
              name="compareValue"
              default=""
              x-component='AntdSelect'
            />
          </Field>
        </Field>
        <Field
          required
          name="targetKeys"
          x-component="AntdSelect"
          title="显示以下字段"
          enum={availableFields.map(({ label, value }) => ({ label, value }))}
          x-component-props={{ mode: 'multiple' }}
        />
        <FormButtonGroup offset={4}>
          <Button type="submit" modifier="primary">保存</Button>
          <Button type="submit" onClick={onClose}>关闭</Button>
        </FormButtonGroup>
      </SchemaForm>
    </Modal>
  );
}

export default VisibleHiddenLinkageConfig;
