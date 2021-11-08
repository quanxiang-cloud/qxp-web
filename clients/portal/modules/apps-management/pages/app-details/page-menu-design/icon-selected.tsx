import React from 'react';

import IconSelect, { APP_ICON_LIST } from '@c/app-icon-select';

interface Props {
  value?: string;
  onChange?: (value: string) => void;
}

function IconSelected({ value, onChange }: Props): JSX.Element {
  const _value = value || APP_ICON_LIST[0];

  function handleCheckIcon(iconName: string): void {
    onChange && onChange(iconName);
  }

  return (
    <IconSelect
      onChange={handleCheckIcon}
      value={_value}
    />
  );
}

export default IconSelected;
