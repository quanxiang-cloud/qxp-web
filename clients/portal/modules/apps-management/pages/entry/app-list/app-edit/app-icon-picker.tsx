import React, { useEffect } from 'react';

import IconSelect, { APP_ICON_LIST } from '@c/app-icon-select';
import ColorPicker, { COLORS } from '@c/app-icon-picker/color-picker';
import { parseJSON } from '@lib/utils';

type AppIconInfo = {
  bgColor?: BgColor;
  iconName?: string;
}

interface Props {
  value?: string;
  onChange?: (value: string) => void;
}

function AppIconPicker({ value = '{}', onChange }: Props): JSX.Element {
  const _value = parseJSON(value, {}) || '';
  const { iconName, bgColor } = _value as AppIconInfo;
  const _iconName = iconName || APP_ICON_LIST[0];
  const _bgColor = bgColor || COLORS[0];

  useEffect(() => {
    onChange && onChange(JSON.stringify({ iconName: _iconName, bgColor: _bgColor }));
  }, []);

  function handleCheckIcon(iconName: string): void {
    onChange && onChange(JSON.stringify({ iconName, bgColor: _bgColor }));
  }

  function handleFormChange(bgColor: BgColor): void {
    onChange && onChange(JSON.stringify({ iconName: _iconName, bgColor }));
  }

  return (
    <>
      <IconSelect
        onChange={handleCheckIcon}
        value={_iconName}
      />
      <ColorPicker
        className='mt-8'
        defaultColor={_bgColor}
        onChange={handleFormChange}
        iconName={_iconName}
      />
    </>
  );
}

export default AppIconPicker;
