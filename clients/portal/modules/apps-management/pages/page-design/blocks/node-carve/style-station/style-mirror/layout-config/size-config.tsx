import React, { useState, CSSProperties } from 'react';
import cs from 'classnames';
import StyleInput from '../components/style-input';
import StyleSubTitle from '../components/style-sub-title';
import { useEffect } from 'react';
import { PartialCSSProperties } from '../../utils';

export type SizeValue = PartialCSSProperties<
'width' | 'minWidth' | 'maxWidth' | 'height' | 'minHeight' | 'maxHeight'
>;

export type Props = {
  style?: CSSProperties;
  className?: string;
  defaultValue?: SizeValue;
  onChange?: (value: SizeValue) => void;
}

const RESET_VALUE: CSSProperties = {
  width: '',
  minWidth: '',
  maxWidth: '',
  height: '',
  minHeight: '',
  maxHeight: '',
};

function SizeConfig({
  style,
  className,
  defaultValue,
  onChange,

}: Props): JSX.Element {
  const [sizes, setSizes] = useState<SizeValue>({});

  function handleChange(value: string, type?: string): void {
    if (!type) return;
    setSizes((prevSizes) => {
      const newSizes = { ...prevSizes, [type]: value };
      onChange?.(newSizes);
      return newSizes;
    });
  }

  function handleReset(): void {
    onChange?.(RESET_VALUE);
  }

  useEffect(() => {
    setSizes(defaultValue || {});
  }, [defaultValue]);

  return (
    <div className='flex flex-col gap-4'>
      <StyleSubTitle title='尺寸' onResetValue={handleReset} />
      <div
        style={style}
        className={cs('flex gap-8', className)}
      >
        <div className='flex flex-col gap-8 flex-1'>
          <StyleInput
            value={sizes.width || ''}
            onChange={handleChange}
            className='flex-1
          ' placeholder='width'
            name='width'
            label='宽'
          />
          <StyleInput
            value={sizes.minWidth || ''}
            onChange={handleChange}
            className='flex-1'
            placeholder='minWidth'
            name='minWidth'
            label='最小宽'
          />
          <StyleInput
            value={sizes.maxWidth || ''}
            onChange={handleChange}
            className='flex-1'
            placeholder='maxWidth'
            name='maxWidth'
            label='最大宽'
          />
        </div>
        <div className='flex flex-col gap-8 flex-1'>
          <StyleInput
            value={sizes.height || ''}
            onChange={handleChange} className='flex-1'
            placeholder='height'
            name='height'
            label='高'
          />
          <StyleInput
            value={sizes.minHeight || ''}
            onChange={handleChange}
            className='flex-1'
            placeholder='minHeight'
            name='minHeight'
            label='最小高'
          />
          <StyleInput
            value={sizes.maxHeight || ''}
            onChange={handleChange}
            className='flex-1'
            placeholder='minHeight'
            name='maxHeight'
            label='最大高'
          />
        </div>
      </div>
    </div>

  );
}

export default SizeConfig;
