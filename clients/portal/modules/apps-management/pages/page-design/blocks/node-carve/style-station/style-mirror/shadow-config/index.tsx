import React, { useEffect, useState } from 'react';
import { ColorResult } from 'react-color';

import StyleSubTitle from '../components/style-sub-title';
import StyleInput from '../components/style-input';
import { ColorPicker } from '@one-for-all/ui';
import RadioButtonGroup from '../components/radio-button-group';
import { PartialCSSProperties } from '../../utils';
import { SHADOW_TYPE } from '../constant';

export type Props = {
  defaultValue: ShadowValue;
  onChange: (value: ShadowValue) => void
  onReset?: () => void;
}

export type ShadowValue = PartialCSSProperties<'boxShadow'>;

export type ShadowValueDetail = {
  type?: string;
  x: string;
  y: string;
  blur: string
  spread: string;
  color: string;
}

const DEFAULT_SHADOW = {
  type: 'none',
  x: '',
  y: '',
  blur: '',
  spread: '',
  color: '#FFFFFF',
};

function ShadowConfig({ defaultValue, onChange, onReset }: Props): JSX.Element {
  const [shadowValue, setShadowValue] = useState<ShadowValueDetail>(handleShadowValueSplit(defaultValue.boxShadow));

  function handleShadowValueSplit(value?: string): ShadowValueDetail {
    if (!value) {
      return DEFAULT_SHADOW;
    }
    const valueArray = value?.replace(/\s+/g, ' ').split(' ').reverse();

    const [color = '#FFFFFF', spread = '0px', blur = '0px', y = '0px', x = '0px', inset] = valueArray;

    const type = getShadowType(inset);

    return {
      type,
      x,
      y,
      blur,
      spread,
      color,
    };
  }

  function getShadowType(inset?: string): string {
    if (!inset) return 'outset';
    if (inset === 'inset') return 'inset';
    return '';
  }

  function shadowDetailValueToString(detail: ShadowValueDetail): string {
    const valueArr = [detail.x, detail.y, detail.blur, detail.spread, detail.color];
    if (detail.type === 'inset') {
      return ['inset'].concat(valueArr).join(' ');
    }
    return valueArr.join(' ');
  }

  useEffect(() => {
    setShadowValue(handleShadowValueSplit(defaultValue.boxShadow || ''));
  }, [defaultValue]);

  function handleChange(value: string, name?: string): void {
    setShadowValue((prevValue) => {
      const newValue = {
        ...prevValue,
        [name || 'unknown']: value,
      };
      onChange({ boxShadow: shadowDetailValueToString(newValue) } );
      return newValue;
    });
  }

  function handleShadowTypeChange(type: string): void {
    if (type === 'none') {
      onChange({ boxShadow: '' });
      setShadowValue(DEFAULT_SHADOW);
      return;
    }

    setShadowValue((prevValue) => {
      const newShadowValue = {
        type,
        x: prevValue.x || '0px',
        y: prevValue.y || '0px',
        blur: prevValue.blur || '0px',
        spread: prevValue.spread || '0px',
        color: prevValue.color || '',
      };
      onChange({ boxShadow: shadowDetailValueToString(newShadowValue) });
      return newShadowValue;
    });
  }

  function handleReset(): void {
    setShadowValue(DEFAULT_SHADOW);
    onReset?.();
  }

  return (
    <>
      <StyleSubTitle title='阴影位置' onResetValue={handleReset} />
      <RadioButtonGroup
        data={SHADOW_TYPE}
        current={shadowValue.type || ''}
        onChange={handleShadowTypeChange}
      />
      {
        shadowValue.type !== 'none' && (
          <>
            <StyleInput
              value={shadowValue.x || ''}
              onChange={handleChange}
              name='x'
              label='x'
              placeholder='x'
            />
            <StyleInput
              value={shadowValue.y || ''}
              onChange={handleChange}
              name='y'
              label='y'
              placeholder='y'
            />
            <StyleInput
              value={shadowValue.blur || ''}
              onChange={handleChange}
              name='blur'
              label='blur'
              placeholder='blur'
            />
            <StyleInput
              value={shadowValue.spread || ''}
              onChange={handleChange}
              name='spread'
              label='spread'
              placeholder='spread'
            />
            <div className='flex relative align-center gap-8'>
              <StyleInput
                inputClassName='pl-32'
                value={shadowValue.color || ''}
                onChange={handleChange}
                name='color'
                placeholder='#FFFFFF'
                label='阴影颜色'
              />
              <div className='absolute left-8 bottom-8'>
                <ColorPicker
                  value={shadowValue.color || ''}
                  onChange={(color: ColorResult) => {
                    handleChange(color.hex, 'color');
                  }}
                />
              </div>
            </div>
          </>
        )
      }
    </>
  );
}

export default ShadowConfig;
