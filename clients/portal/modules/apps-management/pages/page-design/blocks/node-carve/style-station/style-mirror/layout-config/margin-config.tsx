import React, { CSSProperties } from 'react';
import cs from 'classnames';
import StyleSubTitle from '../components/style-sub-title';
import CrossInput, { CrossValue } from '../components/cross-input';
import { firstWordUpperCase } from '../utils/helper';
import { PartialCSSProperties } from '../../utils';

export type MarginValue = PartialCSSProperties<
'marginTop' | 'marginBottom' | 'marginLeft' | 'marginRight' | 'margin'
>;

export type Props = {
  defaultValue: MarginValue;
  onChange: (value: MarginValue) => void;
  style?: CSSProperties;
  className?: string;
}

const RESET_VALUE: CSSProperties = {
  marginTop: '',
  marginBottom: '',
  marginLeft: '',
  marginRight: '',
};

function MarginConfig({ style, className, defaultValue, onChange }: Props): JSX.Element {
  function handleChange(crossValue: CrossValue): void {
    let keyValueArray;
    const valueArray = Object.entries(crossValue).map(([, value]) => value);
    const isUnite = valueArray.every((value, _, array) => value === array[0]) && valueArray.length > 1;
    if (isUnite) {
      keyValueArray = [['margin', crossValue.top]];
    } else {
      keyValueArray = Object.entries(crossValue).map(([crossKey, _value]) => {
        const key = 'margin' + firstWordUpperCase(crossKey);
        return [key, _value];
      }).concat([['margin', '']]);
    }
    const marginValue = Object.fromEntries(keyValueArray);
    onChange?.(marginValue);
  }

  function convertToCrossInputValue(marginStyles: MarginValue ): CrossValue {
    const sourceObj = marginStyles.margin ? RESET_VALUE : marginStyles;
    const valueArray = Object.entries(sourceObj).map(([marginKey, _value]) => {
      const key = marginKey.replace('margin', '').toLowerCase();
      const value = marginStyles.margin || _value;
      return [key, value];
    });
    return Object.fromEntries(valueArray);
  }

  function handleReset(): void {
    onChange?.({ ...RESET_VALUE, margin: '' });
  }

  return (
    <div
      style={style}
      className={cs(className)}
    >
      <StyleSubTitle title='外边距 (Margin)' onResetValue={handleReset} />
      <CrossInput
        defaultValue={convertToCrossInputValue(defaultValue || RESET_VALUE)}
        onChange={handleChange}
      />
    </div>
  );
}

export default MarginConfig;
