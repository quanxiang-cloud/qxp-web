import React from 'react';
import { Checkbox } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/antd';

import useEnumOptions from '@lib/hooks/use-enum-options';

const CheckboxGroup = Checkbox.Group;
function CheckBoxGroup({
  options = [],
  optionsLayout = '',
}: {
  optionsLayout: string;
  options: string[];
}): JSX.Element {
  if (optionsLayout === 'vertical') {
    return (
      <div className='flex flex-col'>
        {options.map((ck: string) =>
          (<span key={ck} className='inline-block'><Checkbox>{ck}</Checkbox></span>))
        }
      </div>
    );
  }

  return <CheckboxGroup options={options} />;
}

function Placeholder(fieldProps: ISchemaFieldComponentProps): JSX.Element {
  const labels = useEnumOptions(fieldProps);
  const { optionsLayout } = fieldProps?.props?.['x-component-props'];

  if (!labels.length) {
    return <span>暂无可选项</span>;
  }
  return <CheckBoxGroup optionsLayout={optionsLayout} options={labels} />;
}

export default Placeholder;
