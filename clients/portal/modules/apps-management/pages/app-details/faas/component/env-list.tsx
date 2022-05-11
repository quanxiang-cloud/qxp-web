import React from 'react';
import styled from 'styled-components';
import { toArr, FormPath } from '@formily/shared';
import { ArrayList } from '@formily/react-shared-components';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { Schema, SchemaField } from '@formily/antd';

import Icon from '@c/icon';
import Button from '@c/button';

const RowStyleLayout = styled((props) => <div {...props} />)`
  display: block;

  .variable-name {
    width: 70px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

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

function EnvList(props: ISchemaFieldComponentProps): JSX.Element {
  const { value, path, mutators, schema } = props;

  function handAddRule(): void {
    if (!schema.items) {
      return;
    }
    mutators.push((schema.items as Schema).getEmptyValue());
  }

  return (
    <ArrayList value={value}>
      {toArr(value).map((item, index) => (
        <RowStyleLayout key={index} className='sss'>
          <SchemaField path={FormPath.parse(path).concat(index)} />
          <Icon
            clickable
            changeable
            name="delete"
            size={32}
            className="mr-15"
            onClick={() => mutators.remove(index)}
          />
        </RowStyleLayout>
      ))}
      <Button onClick={handAddRule}>新增赋值规则</Button>
    </ArrayList>
  );
}

EnvList.isFieldComponent = true;

export default EnvList;
