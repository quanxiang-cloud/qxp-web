
import React from 'react';

import styled from 'styled-components';
import Icon from '@c/icon';
import Button from '@c/button';
import { SchemaField } from '@formily/antd';
import { ArrayList } from '@formily/react-shared-components';
import { toArr, FormPath } from '@formily/shared';

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
  const onAdd = (): void => mutators.push(schema.items.getEmptyValue());
  const onRemove = (index: number): void => mutators.remove(index);

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

export default ArrayCustom;
