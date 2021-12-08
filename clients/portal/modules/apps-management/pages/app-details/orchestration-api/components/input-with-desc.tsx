import React from 'react';
import { lensPath, view, prop } from 'ramda';
import { Input } from '@formily/antd-components';
import { ISchemaFieldComponentProps } from '@formily/antd';

function InputWithDesc(props: ISchemaFieldComponentProps): JSX.Element {
  const error = prop<number, string[]>(0, view(lensPath(['errors']), props));

  const desc = props.props?.['x-component-props']?.desc;
  return (
    <div className="flex flex-col w-full">
      <Input {...props} />
      {desc && (
        <div
          className={'text-caption mt-4'}
          {...(error ? { style: { color: 'var(--red-1000)' } } : { })}
        >{error || desc}</div>
      )}
    </div>
  );
}

InputWithDesc.isFieldComponent = true;

export default InputWithDesc;
