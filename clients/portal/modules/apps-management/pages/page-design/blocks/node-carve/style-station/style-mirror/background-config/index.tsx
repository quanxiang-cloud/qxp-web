import React from 'react';
import StyleSubTitle from '../components/style-sub-title';
import StyleInput from '../components/style-input';
import { PartialCSSProperties } from '../../utils';
import { ColorPicker } from '@one-for-all/ui';
import { ColorResult } from 'react-color';
import AutoComplete from '../../class-station/auto-complete';
import { BG_REPEAT, BG_SIZE } from '../constant';

export type Props = {
  defaultValue: BackgroundValue;
  onChange: (value: BackgroundValue) => void;
  onReset?: () => void;
}

export type BackgroundValue = PartialCSSProperties<
  'backgroundSize' | 'backgroundRepeat' | 'backgroundColor' | 'backgroundImage'
>

function BackgroundConfig({ defaultValue, onChange, onReset }: Props): JSX.Element {
  function handleChange(value: string, name?: string): void {
    if (name === 'backgroundImage') {
      onChange({ backgroundImage: `url(${value})` });
      return;
    }
    onChange({ [name || 'unknown']: value });
  }

  return (
    <>
      <StyleSubTitle title='常用' onResetValue={onReset} />
      <div className='flex relative align-center gap-8'>
        <StyleInput
          inputClassName='pl-32'
          value={defaultValue.backgroundColor || ''}
          onChange={handleChange}
          name='backgroundColor'
          placeholder='#FFFFFF'
          label='背景颜色'
        />
        <div className='absolute left-8 bottom-8'>
          <ColorPicker
            value={defaultValue.backgroundColor || ''}
            onChange={(color: ColorResult) => {
              const { r, g, b, a } = color.rgb;
              handleChange(a === 1 ? color.hex : `rgba(${r},${g},${b},${a})`, 'backgroundColor');
            }}
          />
        </div>
      </div>
      <StyleInput
        value={defaultValue.backgroundImage?.match(/url\((.+)\)/)?.[1] || ''}
        onChange={handleChange}
        name='backgroundImage'
        label='背景图片 Url'
        placeholder='url'
      />
      <StyleSubTitle title='背景图片尺寸 (Background Size)' />
      <AutoComplete
        data={BG_SIZE}
        placeholder='background size'
        currentValue={defaultValue.backgroundSize?.toString() || ''}
        onSelect={(backgroundSize) => {
          handleChange(backgroundSize as string, 'backgroundSize');
        }}
        labelRender={(data) => <span>{data.value} - {data.label}</span>}
      />
      <StyleSubTitle title='背景图片重复 (Background Repeat)' />
      <AutoComplete
        data={BG_REPEAT}
        placeholder='background repeat'
        currentValue={defaultValue.backgroundRepeat?.toString() || ''}
        onSelect={(backgroundRepeat) => {
          handleChange(backgroundRepeat as string, 'backgroundRepeat');
        }}
        labelRender={(data) => <span>{data.value} - {data.label}</span>}
      />
    </>
  );
}

export default BackgroundConfig;
