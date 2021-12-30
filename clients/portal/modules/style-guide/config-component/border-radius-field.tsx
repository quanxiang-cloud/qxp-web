import React, { useMemo } from 'react';
import { ValuePlain, Dimension } from 'css-tree';

import SizeController from '../components/size-controller';

export default function BorderRadiusField({
  onChange,
  value,
}: StyleFieldBaseProps): JSX.Element {
  const [tl, tr, br, bl] = value ? (value?.value as ValuePlain).children.map((_value) => {
    return Number((_value as Dimension).value);
  }) : [];

  const allBR = useMemo(() => {
    const tmp = [tl, tr, br, bl].sort();
    if (tmp.shift() === tmp.pop()) {
      return tmp.pop();
    }

    return undefined;
  }, [tl, tr, br, bl]);

  function handleChange(valueList: number[]): void {
    onChange({
      important: false,
      property: 'border-radius',
      type: 'Declaration',
      value: {
        type: 'Value',
        children: valueList.map((number) => ({
          type: 'Dimension',
          unit: 'px',
          value: number?.toString() || '0',
        })),
      },
    });
  }

  return (
    <div>
      <SizeController value={allBR} onChange={(_value) => handleChange([_value, _value, _value, _value])} />
      <div className='gird grid-cols-2'>
        <div>
          <div>左上</div>
          <SizeController value={tl} onChange={(_value) => handleChange([_value, tr, br, bl])} />
        </div>
        <div>
          <div>右上</div>
          <SizeController value={tr} onChange={(_value) => handleChange([tl, _value, br, bl])} />
        </div>
        <div>
          <div>右下</div>
          <SizeController value={br} onChange={(_value) => handleChange([tl, tr, _value, bl])} />
        </div>
        <div>
          <div>左下</div>
          <SizeController value={bl} onChange={(_value) => handleChange([tl, tr, br, _value])} />
        </div>
      </div>
    </div>
  );
}
