import React, { CSSProperties } from 'react';
import cs from 'classnames';
import StyleSubTitle from '../components/style-sub-title';
import CrossInput, { CrossValue } from '../components/cross-input';
import { firstWordUpperCase } from '../utils/helper';
import { PartialCSSProperties } from '../../utils';

export type PaddingValue = PartialCSSProperties<
'paddingTop' | 'paddingBottom' | 'paddingLeft' | 'paddingRight' | 'padding'
>;

export type Props = {
  defaultValue: PaddingValue;
  onChange: (value: PaddingValue) => void;
  style?: CSSProperties;
  className?: string;
}

const RESET_VALUE: CSSProperties = {
  paddingTop: '',
  paddingBottom: '',
  paddingLeft: '',
  paddingRight: '',
};

function paddingConfig({ style, className, defaultValue, onChange }: Props): JSX.Element {
  function handleChange(crossValue: CrossValue): void {
    let keyValueArray;
    const valueArray = Object.entries(crossValue).map(([, value]) => value);
    const isUnite = valueArray.every((value, _, array) => value === array[0]) && valueArray.length > 1;
    if (isUnite) {
      keyValueArray = [['padding', crossValue.top]];
    } else {
      keyValueArray = Object.entries(crossValue).map(([crossKey, _value]) => {
        const key = 'padding' + firstWordUpperCase(crossKey);
        return [key, _value];
      }).concat([['padding', '']]);
    }
    const paddingValue = Object.fromEntries(keyValueArray);
    onChange?.(paddingValue);
  }

  function convertToCrossInputValue(paddingStyles: PaddingValue ): CrossValue {
    const sourceObj = paddingStyles.padding ? RESET_VALUE : paddingStyles;
    const valueArray = Object.entries(sourceObj).map(([paddingKey, _value]) => {
      const key = paddingKey.replace('padding', '').toLowerCase();
      const value = paddingStyles.padding || _value;
      return [key, value];
    });
    return Object.fromEntries(valueArray);
  }

  function handleReset(): void {
    onChange?.({ ...RESET_VALUE, padding: '' });
  }

  return (
    <div
      style={style}
      className={cs(className)}
    >
      <StyleSubTitle title='内边距 (padding)' onResetValue={handleReset} />
      <CrossInput
        defaultValue={convertToCrossInputValue(defaultValue || RESET_VALUE)}
        onChange={handleChange}
      />
    </div>
  );
}

export default paddingConfig;
