import React, { CSSProperties } from 'react';
import SizeConfig, { SizeValue } from './size-config';
import MarginConfig, { MarginValue } from './margin-config';
import PaddingConfig, { PaddingValue } from './padding-config';

export type LayoutValue = {
  sizes: SizeValue;
  margin: MarginValue;
  padding: PaddingValue
}

export type Props = {
  defaultValue: LayoutValue;
  onChange: (value: CSSProperties) => void
}

function LayoutConfig({ defaultValue, onChange }: Props): JSX.Element {
  function handleStyleChange(style: CSSProperties): void {
    onChange?.(style);
  }

  return (
    <>
      <SizeConfig
        defaultValue={defaultValue.sizes}
        onChange={handleStyleChange}
      />
      <MarginConfig
        defaultValue={defaultValue.margin}
        onChange={handleStyleChange}
      />
      <PaddingConfig
        defaultValue={defaultValue.padding}
        onChange={handleStyleChange}
      />
    </>
  );
}

export default LayoutConfig;
