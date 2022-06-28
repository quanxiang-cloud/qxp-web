import React, { useEffect, useState } from 'react';
import { ColorResult } from 'react-color';
import { ColorPicker, Icon, Tooltip } from '@one-for-all/ui';

import StyleSubTitle from '../components/style-sub-title';
import StyleInput from '../components/style-input';
import { PartialCSSProperties } from '../../utils';
import RadioButtonGroup from '../components/radio-button-group';
import { BORDER_POSITION, BORDER_STYLE, BORDER_RADIUS } from '../constant';

export type Props = {
  defaultValue: BorderValue;
  onChange: (value: BorderValue) => void;
  onReset?: () => void;
}

export type BorderValue = PartialCSSProperties<
  'borderWidth' | 'borderTopWidth' | 'borderBottomWidth' | 'borderLeftWidth' |
  'borderRightWidth' | 'borderColor' | 'borderLeftColor' | 'borderRightColor' |
  'borderTopColor' | 'borderBottomColor' | 'borderStyle' | 'borderRadius' |
  'borderTopLeftRadius' | 'borderTopRightRadius' | 'borderBottomLeftRadius' | 'borderBottomRightRadius'
>

function BorderConfig({ defaultValue, onChange, onReset }: Props): JSX.Element {
  const [curBorderPos, setCurBorderPos] = useState('');
  const [curRadiusPos, setCurRadiusPos] = useState('');

  function handleChange(value: string, name?: string): void {
    if ( name === 'borderWidth') {
      onChange({
        borderWidth: value,
        borderTopWidth: '',
        borderBottomWidth: '',
        borderLeftWidth: '',
        borderRightWidth: '',
      });
      return;
    }
    if ( name === 'borderColor') {
      onChange({
        borderColor: value,
        borderTopColor: '',
        borderBottomColor: '',
        borderLeftColor: '',
        borderRightColor: '',
      });
      return;
    }
    if ( name === 'borderRadius') {
      onChange({
        borderRadius: value,
        borderTopLeftRadius: '',
        borderBottomRightRadius: '',
        borderBottomLeftRadius: '',
        borderTopRightRadius: '',
      });
      return;
    }
    onChange({ [name || 'unknown']: value });
  }

  function borderPosOptionRender(data: LabelValue): JSX.Element {
    return (
      <Tooltip
        position='top'
        label={data.label}
      >
        <Icon
          size={16}
          name={`border_${data.value?.toLocaleLowerCase() || 'all'}`}
        />
      </Tooltip>
    );
  }

  function radiusPosOptionRender(data: LabelValue): JSX.Element {
    return (
      <Tooltip
        position='top'
        label={data.label}
      >
        <div
          style={{
            width: 16,
            height: 16,
            border: '1px solid gray',
            [`border${data.value === 'all' ? '' : data.value }Radius`]: data.value ? 5 : 'none',
          }}
        />
      </Tooltip>
    );
  }

  function findValueLabel(labelValueArr: LabelValue[], value: string): string {
    const labelValue = labelValueArr.find((item) => item.value === value);
    if (!labelValue) return '';
    return labelValue.label;
  }

  useEffect(() => {
    if (Object.keys(defaultValue).some((key) => key.includes('Radius'))) {
      setCurRadiusPos('all');
    }
  }, [defaultValue]);

  return (
    <>
      <StyleSubTitle title='边框位置' onResetValue={onReset}/>
      <RadioButtonGroup
        data={BORDER_POSITION}
        buttonContentRender={borderPosOptionRender}
        current={curBorderPos}
        onChange={setCurBorderPos}
      />
      <StyleInput
        value={defaultValue[`border${curBorderPos}Width` as keyof BorderValue] || defaultValue.borderWidth || ''}
        onChange={handleChange}
        name={`border${curBorderPos}Width`}
        placeholder={`border${curBorderPos}Width`}
        label={findValueLabel(BORDER_POSITION, curBorderPos) + '边框宽度'}
      />
      <div className='flex relative align-center gap-8'>
        <StyleInput
          inputClassName='pl-32'
          value={defaultValue[`border${curBorderPos}Color` as keyof BorderValue] || defaultValue.borderColor || ''}
          onChange={handleChange}
          name={`border${curBorderPos}Color`}
          label={findValueLabel(BORDER_POSITION, curBorderPos) + '边框颜色'}
          placeholder='#FFFFFF'
        />
        <div className='absolute left-8 bottom-8'>
          <ColorPicker
            value={defaultValue[`border${curBorderPos}Color` as keyof BorderValue] as string || defaultValue.borderColor || ''}
            onChange={(color: ColorResult) => {
              const { r, g, b, a } = color.rgb;
              handleChange(a === 1 ? color.hex : `rgba(${r},${g},${b},${a})`, `border${curBorderPos}Color`);
            }}
          />
        </div>
      </div>
      <StyleSubTitle title='所有边框样式 (Border Style)' />
      <RadioButtonGroup
        data={BORDER_STYLE}
        current={defaultValue.borderStyle}
        onChange={(borderStyle) => {
          handleChange(borderStyle, 'borderStyle');
        }}
      />
      {
        defaultValue.borderStyle !== 'none' && (
          <>
            <StyleSubTitle title='边框圆角 (Border Radius)' />
            <RadioButtonGroup
              data={BORDER_RADIUS}
              current={curRadiusPos}
              buttonContentRender={radiusPosOptionRender}
              onChange={setCurRadiusPos}
            />
            {
              curRadiusPos && (
                <StyleInput
                  value={defaultValue[`border${curRadiusPos}Radius` as keyof BorderValue] || defaultValue.borderRadius || ''}
                  onChange={handleChange}
                  name={`border${curRadiusPos === 'all' ? '' : curRadiusPos }Radius`}
                  placeholder={`border${curRadiusPos === 'all' ? '' : curRadiusPos }Radius`}
                  label={findValueLabel(BORDER_RADIUS, curRadiusPos) + '圆角半径'}
                />
              )
            }
          </>
        )
      }
    </>

  );
}

export default BorderConfig;
