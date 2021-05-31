import React from 'react';
import styled from 'styled-components';
import {
  SchemaField,
  ISchemaFieldComponentProps,
  Schema,
} from '@formily/antd';
import { toArr, FormPath } from '@formily/shared';
import { ArrayList } from '@formily/react-shared-components';

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

function ArrayCustom(props: ISchemaFieldComponentProps): JSX.Element {
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

ArrayCustom.isFieldComponent = true;

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

export { ArrayCustom, JoinOperatorSelect };
