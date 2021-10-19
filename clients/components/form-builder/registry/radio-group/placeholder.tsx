import React from 'react';
import { Radio } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/antd';

import useEnumOptions from '@lib/hooks/use-enum-options';

function Placeholder(fieldProps: ISchemaFieldComponentProps): JSX.Element {
  const labels = useEnumOptions(fieldProps);

  return (
    <>
      {!labels.length ? (
        <span>暂无可选项</span>
      ) : (
        <Radio.Group>
          {labels?.map((label: string, index: number) => {
            return <Radio key={index} value={index}>{label}</Radio>;
          })}
        </Radio.Group>
      )}
    </>
  );
}

export default Placeholder;
