import React from 'react';
import { Checkbox } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/antd';

import useEnumOptions from '@lib/hooks/use-enum-options';

const CheckboxGroup = Checkbox.Group;

function Placeholder(fieldProps: ISchemaFieldComponentProps): JSX.Element {
  const labels = useEnumOptions(fieldProps);

  return (
    <>
      {!labels.length ? <span>暂无可选项</span> : <CheckboxGroup options={labels} />}
    </>
  );
}

export default Placeholder;
