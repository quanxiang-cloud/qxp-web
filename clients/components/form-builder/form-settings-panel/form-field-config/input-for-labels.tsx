import React, { useState } from 'react';
import { uniq } from 'lodash';
import { Input } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

const TextArea = Input.TextArea;

function InputForLabels(props: ISchemaFieldComponentProps): JSX.Element {
  const [value, setValue] = useState(props.value.join('\n'));
  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    setValue(e.target.value);

    const labels = e.target.value.trim().split(/\r?\n/).map((label) => {
      return label.trim().slice(0, 15);
    }).filter(Boolean);

    props.mutators.change(uniq(labels));
  }

  return (<TextArea value={value} onChange={handleChange} rows={5} />);
}

InputForLabels.isFieldComponent = true;

export default InputForLabels;
