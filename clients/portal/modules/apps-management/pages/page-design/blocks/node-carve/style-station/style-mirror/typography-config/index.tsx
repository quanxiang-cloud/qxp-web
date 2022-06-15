import React from 'react';
import { ColorResult } from 'react-color';
import { Icon, Tooltip, ColorPicker } from '@one-for-all/ui';

import StyleInput from '../components/style-input';
import StyleSubTitle from '../components/style-sub-title';
import RadioButtonGroup from '../components/radio-button-group';
import AutoComplete from '../../class-station/auto-complete';
import { PartialCSSProperties } from '../../utils';
import { TEXT_CONTENT_MAP, FONT_WEIGHT, TEXT_ALIGN, TEXT_TRANSFORM } from '../constant';

export type Props = {
  defaultValue: TypographyValue;
  onChange: (value: TypographyValue) => void;
  onReset?: () => void;
}

export type TypographyValue = PartialCSSProperties<
  'fontSize' | 'color' | 'lineHeight' | 'letterSpacing' |
  'fontWeight' | 'textAlign' | 'textTransform' | 'textDecoration'
>

function TypographyConfig({ defaultValue, onChange, onReset }: Props): JSX.Element {
  function handleChange(value: string, name?: string): void {
    onChange({ [name || 'unknown']: value });
  }

  function textAlignOptionRender(data: LabelValue): JSX.Element {
    return (
      <Tooltip
        position='top'
        label={data.label}
      >
        <Icon
          size={16}
          name={`format_align_${data.value}`}
        />
      </Tooltip>
    );
  }

  function textTransformOptionRender(data: LabelValue): JSX.Element {
    return (
      <Tooltip
        position='top'
        label={data.label}
      >
        <span className='font-semibold'>{TEXT_CONTENT_MAP[data.value]}</span>
      </Tooltip>
    );
  }

  return (
    <>
      <StyleSubTitle title='常用' onResetValue={onReset}/>
      <div className='flex gap-8 flex-1'>
        <StyleInput
          value={defaultValue.fontSize || ''}
          onChange={handleChange}
          className='flex-1'
          placeholder='auto'
          name='fontSize'
          label='字体大小'
        />
        <StyleInput
          value={defaultValue.lineHeight || ''}
          onChange={handleChange}
          className='flex-1'
          placeholder='auto'
          name='lineHeight'
          label='行高'
        />
        <StyleInput
          value={defaultValue.letterSpacing || ''}
          onChange={handleChange}
          className='flex-1'
          placeholder='auto'
          name='letterSpacing'
          label='字符间距'
        />
      </div>
      <div className='flex relative align-center gap-8'>
        <StyleInput
          inputClassName='pl-32'
          value={defaultValue.color || ''}
          onChange={handleChange}
          placeholder='#FFFFFF'
          name='color'
          label='字体颜色'
        />
        <div className='absolute left-8 bottom-8'>
          <ColorPicker
            value={defaultValue.color || ''}
            onChange={(color: ColorResult) => {
              handleChange(color.hex, 'color');
            }}
          />
        </div>
      </div>

      <StyleSubTitle title='字体粗细 (Font Weight)' />
      <AutoComplete
        data={FONT_WEIGHT}
        placeholder='400'
        currentValue={defaultValue.fontWeight?.toString()}
        onSelect={(fontWeight) => {
          handleChange(fontWeight as string, 'fontWeight');
        }}
      />
      <StyleSubTitle title='对其方式 (Text Align)' />
      <RadioButtonGroup
        data={TEXT_ALIGN}
        current={defaultValue.textAlign}
        buttonContentRender={(data) => textAlignOptionRender(data)}
        onChange={(alignItems) => {
          handleChange(alignItems, 'textAlign');
        }}
      />
      <StyleSubTitle title='字符变换 (Text Transform)' />
      <RadioButtonGroup
        data={TEXT_TRANSFORM}
        current={defaultValue.textTransform}
        buttonContentRender={(data) => textTransformOptionRender(data)}
        onChange={(textTransform) => {
          handleChange(textTransform, 'textTransform');
        }}
      />
    </>
  );
}

export default TypographyConfig;
