import React, { useState } from 'react';

import BgIcon from '../bg-icon';

const COLORS: BgColor[] = [
  'indigo',
  'amber',
  'teal',
  'orange',
  'fuchsia',
  'emerald',
  'red',
  'cyan',
];

type Props = {
  iconName: string;
  defaultColor?: string;
  className?: string;
  onChange: (color: BgColor) => void;
}

function ColorPicker({ iconName = '', onChange, defaultColor, className }: Props) {
  const [curBgColor, setCurBgColor] = useState(defaultColor);

  return (
    <div className={`${className} flex gap-x-16`}>
      {COLORS.map((color: BgColor) => (
        <BgIcon
          className='cursor-pointer'
          onClick={() => {
            onChange(color);
            setCurBgColor(color);
          }}
          key={color}
          bgColor={color}
          size={32}
          iconSize={20}
          iconName={curBgColor === color ? iconName : ''}
        />
      ))}
    </div>
  );
}

export default ColorPicker;
