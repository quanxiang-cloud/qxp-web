import React from 'react';
import { get } from 'lodash';

import SizeController from '../components/size-controller';

export default function SizingField({
  onChange,
  value,
}: StyleFieldBaseProps): JSX.Element {
  function handleChange(size: number): void {
    onChange({
      important: false,
      property: 'width',
      type: 'Declaration',
      value: {
        type: 'Value',
        children: [{
          type: 'Dimension',
          unit: 'px',
          value: size.toString(),
        }],
      },
    });
  }

  const inputValue: string = get(value, 'value.children[0].value');

  return (
    <SizeController onChange={handleChange} value={Number(inputValue)} />
  );
}
