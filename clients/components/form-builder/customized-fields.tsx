import React from 'react';
import styled from 'styled-components';
import {
  SchemaField,
  SchemaMarkupField as Field,
  ISchemaFieldComponentProps,
  Schema,
} from '@formily/antd';
import { toArr, FormPath } from '@formily/shared';
import { ArrayList } from '@formily/react-shared-components';

// todo refactor this
import { OPERATORS } from '@c/form-builder/form-settings-panel/consts';
import Select from '@c/select';
import Icon from '@c/icon';
import Button from '@c/button';

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

function RulesList(props: any): JSX.Element {
  const { value, path, mutators, schema } = props;
  const onAdd = () => {
    if (!schema.items) {
      return;
    }
    mutators.push((schema.items as Schema).getEmptyValue());
  };
  const onRemove = (index: number) => mutators.remove(index);

  return (
    <ArrayList value={value}>
      {toArr(value).map((item, index) => (
        <RowStyleLayout key={index}>
          <SchemaField path={FormPath.parse(path).concat(index)} />
          <Icon clickable changeable name="delete" onClick={() => onRemove(index)} size={32} />
        </RowStyleLayout>
      ))}
      <div>
        <Button onClick={onAdd}>新增条件</Button>
      </div>
    </ArrayList>
  );
}

RulesList.isFieldComponent = true;

function JoinOperatorSelect(props: ISchemaFieldComponentProps): JSX.Element {
  return (
    <div className="flex items-center">
      满足以下
      <Select
        className='mx-4 w-40'
        value={props.value}
        onChange={(value: string) => props.mutators.change(value)}
        options={[
          { label: '所有', value: 'every' },
          { label: '任一', value: 'some' },
        ]}
      />
      条件时:
    </div>
  );
}

JoinOperatorSelect.isFieldComponent = true;

type RulesFieldFragmentProps = {
  linkedTableFields: Array<{ label: string; value: any; }>;
  currentFormFields: Array<{ label: string; value: any; }>;
}

function FormDataFilterRuleFieldFragments(
  { linkedTableFields, currentFormFields }: RulesFieldFragmentProps,
): JSX.Element {
  return (
    <>
      <Field
        name="ruleJoinOperator"
        type="string"
        x-component="JoinOperatorSelect"
      />
      <Field
        name="rules"
        type="array"
        title="条件列表"
        x-component="RulesList"
      >
        <Field type="object">
          <Field
            required
            name="fieldName"
            x-component="AntdSelect"
            enum={linkedTableFields}
            x-component-props={{ placeholder: '请选择表单字段' }}
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
            enum={currentFormFields}
            x-component-props={{ placeholder: '当前表单字段值' }}
          />
        </Field>
      </Field>
    </>
  );
}

export { RulesList, JoinOperatorSelect, FormDataFilterRuleFieldFragments };
