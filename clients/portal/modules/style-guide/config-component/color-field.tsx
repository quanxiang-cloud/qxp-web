import React from 'react';
import { get } from 'lodash';

export default function ColorField({ onChange, value, property }: StyleFieldBaseProps): JSX.Element {
  function handleChange(color: string): void {
    onChange({
      important: false,
      property: property || 'color',
      type: 'Declaration',
      value: {
        type: 'Value',
        children: [{
          type: 'Hash',
          value: color.replace('#', ''),
        }],
      },
    });
  }

  const _value = '#' + get(value, 'value.children[0].value');

  return (
    <input value={_value} type='color' onChange={(e) => handleChange(e.target.value)} />
  );
}
