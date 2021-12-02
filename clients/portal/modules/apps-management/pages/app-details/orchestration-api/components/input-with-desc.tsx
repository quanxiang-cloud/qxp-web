import React from 'react';
import { Input } from '@formily/antd-components';
import { ISchemaFieldComponentProps } from '@formily/antd';

function InputWithDesc(props: ISchemaFieldComponentProps): JSX.Element {
  const desc = props.props?.['x-component-props']?.desc;
  return (
    <div className="flex flex-col w-full">
      <Input {...props} />
      {desc && (
        <div className="text-caption mt-4">{desc}</div>
      )}
    </div>
  );
}

InputWithDesc.isFieldComponent = true;

export default InputWithDesc;
