import React from 'react';
import { Radio } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/antd';

import useEnumOptions from '@lib/hooks/use-enum-options';

const RadioGroup = Radio.Group;
function RadioDirectGroup({
  options = [],
  optionsLayout = '',
}: {
  optionsLayout: string;
  options: string[];
}): JSX.Element {
  if (optionsLayout === 'vertical') {
    return (
      <div className='flex flex-col'>
        {
          options.map((label: string) =>
            (<Radio value={label} key={label}>{label}</Radio>))
        }
      </div>
    );
  }

  return <RadioGroup options={options} />;
}

function Placeholder(fieldProps: ISchemaFieldComponentProps): JSX.Element {
  const labels = useEnumOptions(fieldProps);
  const { optionsLayout } = fieldProps?.props?.['x-component-props'] ?? {};

  if (!labels.length) {
    return <span>暂无可选项</span>;
  }
  return (
    <RadioDirectGroup options={labels} optionsLayout={optionsLayout}></RadioDirectGroup>
  );
}

export default Placeholder;
