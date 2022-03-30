import React from 'react';

import { Select } from '@one-for-all/headless-ui';
import { BaseColorConfig } from '@one-for-all/style-guide';

type Props = {
  baseColorConfig: BaseColorConfig;
  onChange: (value: string) => void;
  value?: string;
}

function toColorList(baseColorConfig: BaseColorConfig): string[] {
  const colors: string[] = [];
  baseColorConfig.colors.forEach((colour) => {
    baseColorConfig.colorNos.forEach((no) => {
      colors.push(`--${colour.name}-${no}`);
    });
  });

  return colors;
}

export default function ColorPalette({ baseColorConfig, onChange, value }: Props): JSX.Element {
  const colors = toColorList(baseColorConfig);
  const options = colors.map((color) => ({
    label: <span className='w-16 h-16 inline-block' style={{ backgroundColor: `var(${color})` }} />,
    value: `var(${color})`,
  }));
  return (
    <Select
      optionClassName='grid grid-cols-10 w-auto-important'
      value={value}
      options={options}
      onChange={onChange}
    />
  );
}
