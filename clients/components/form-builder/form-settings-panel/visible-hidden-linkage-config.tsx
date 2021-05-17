import React from 'react';
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
import { Input, Select, DatePicker, NumberPicker } from '@formily/antd-components';

import Modal from '@c/modal2';
import Icon from '@c/icon';
import Button from '@c/button';
import { INTERNAL_FIELD_NAMES } from '../store';

const { onFieldChange$ } = FormEffectHooks;
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

const DEFAULT_VALUE: VisibleHiddenLinkage = {
  key: '',
  ruleJoinOperator: 'every',
  rules: [{ sourceKey: '', compareOperator: '===', compareValue: '' }],
  targetKeys: [],
};

type Props = {
  onClose: () => void;
  sourceSchema: ISchema;
  linkageKey: string;
  onSubmit: (linkage: VisibleHiddenLinkage) => void;
}

function VisibleHiddenLinkageConfig({ sourceSchema, onClose, linkageKey, onSubmit }: Props): JSX.Element {
  // const [compareField, setCompareField] = useState('Select');
  const linkages = (sourceSchema['x-internal']?.visibleHiddenLinkages || []) as VisibleHiddenLinkage[];
  const defaultValue = linkages.find((linkage) => linkage.key === linkageKey) || DEFAULT_VALUE;
  const availableFields = Object.entries(sourceSchema.properties || {})
    .filter(([key]) => !INTERNAL_FIELD_NAMES.includes(key))
    .map(([key, value]) => {
      return { value: key, label: value.title || key, availableCompareValues: value.enum || [],
        'x-component': value['x-component'] || 'Select',
      };
    });

  const sourceKeyOptions = availableFields.filter((availableField) => {
    return availableField['x-component'] !== 'Input';
  }).filter((availableField) => {
    return availableField['x-component'] !== 'textarea';
  });

  function setCompareValueOptions() {
    const { setFieldState } = createFormActions();

    onFieldChange$('rules.*.sourceKey').subscribe(({ name, value }) => {
      let compareField = '';
      if (!value || !name) {
        return;
      }

      const availableCompareValues = sourceKeyOptions.find((sourceKeyOption) => {
        return sourceKeyOption.value === value;
      });

      if (availableCompareValues?.availableCompareValues.length === 0) {
        compareField = availableCompareValues['x-component'];
      }

      const path = FormPath.transform(name, /\d/, ($1) => {
        return `rules.${$1}.compareValue`;
      });

      setFieldState(path, (state) => {
        if (availableCompareValues?.availableCompareValues.length !== 0) {
          state.props['x-component'] = 'Select';
          state.props.enum = availableCompareValues?.availableCompareValues;
        } else {
          state.props.enum = undefined;
          state.props['x-component'] = compareField;
        }
      });
    });
  }

  return (
    <Modal title="编辑字段显隐条件" onClose={onClose}>
      <p>满足以下条件时</p>
      <SchemaForm
        components={{ ArrayCustom, Input, Select, DatePicker, NumberPicker, TextArea: Input }}
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
              x-component="Select"
              title=""
              enum={sourceKeyOptions.map(({ label, value }) => ({ label, value }))}
            />
            <Field
              required
              name="compareOperator"
              x-component="Select"
              title=""
              enum={[
                { value: '===', label: '等于' },
                { value: '!==', label: '不等于' },
                // { value: '>', label: '大与' },
                // { value: '<', label: '小于' },
              ]}
            />
            <Field
              title=""
              required
              name="compareValue"
              default=""
              x-component='Select'
            />
          </Field>
        </Field>
        <Field
          required
          name="targetKeys"
          x-component="Select"
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
