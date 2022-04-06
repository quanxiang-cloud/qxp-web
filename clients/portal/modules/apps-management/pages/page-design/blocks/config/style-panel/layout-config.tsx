import React, { useState } from 'react';
import { UseFormRegister, FieldValues, UseFormSetValue } from 'react-hook-form';

import { Icon } from '@one-for-all/ui';

import MarginBPadding from './margin-b-padding';
import SizeSetter from './size-setter';

interface Props {
  register: UseFormRegister<FieldValues>;
  initValues: Record<string, string | number>;
  setValue: UseFormSetValue<FieldValues>;
}

function LayoutConfig({ register, initValues, setValue }: Props): JSX.Element {
  const { width, widthUnit, height, heightUnit } = initValues;
  const [oldValue, setOldValue] = useState({
    width: Number(width) || 0,
    height: Number(height) || 0,
  });
  const [locking, setLocking] = useState(false);

  function handleLocking(): void {
    const _isLock = !locking;
    setLocking(_isLock);
  }

  function handleBlur(e: React.ChangeEvent<HTMLInputElement>, key: string): void {
    const newValue = Number(e.target.value) || 1;
    if (!locking) {
      setOldValue({
        ...oldValue,
        [key]: newValue,
      });
      return;
    }
    if (key === 'width') {
      const oldWidth = Number(oldValue.width) || 1;
      const oldHeight = Number(oldValue.height) || 1;
      const scale = Number((oldWidth / newValue).toFixed(2));
      const result = oldHeight / scale;
      const newHeight = parseFloat(result.toString());
      setValue('height', newHeight);
      setOldValue({
        width: newValue,
        height: newHeight,
      });
    } else {
      const oldWidth = Number(oldValue.width) || 1;
      const oldHeight = Number(oldValue.height) || 1;
      const scale = Number((oldHeight / newValue).toFixed(2));
      const result = oldWidth / scale;
      const newWidth = parseFloat(result.toString());
      setValue('width', newWidth);
      setOldValue({
        width: newWidth,
        height: oldHeight,
      });
    }
  }

  function handleUnitChange(e: React.ChangeEvent<HTMLSelectElement>, key: string): void {
    const _value = e.target.value;
    setValue(`${key}Unit`, _value);
    if (_value === 'auto') {
      setValue(key, 'auto');
      return;
    }

    if (_value === '%') {
      setValue(key, '100');
      return;
    }

    if (_value === 'px') {
      setValue(key, '');
      return;
    }
  }

  return (
    <>
      <div className='p-8 border border-gray-300 rounded-4'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-col gap-5'>
            <SizeSetter
              name="width"
              label="宽度"
              value={width}
              unit={widthUnit}
              option={{ label: 'vw', value: 'vw' }}
              handleBlur={handleBlur}
              handleChange={handleUnitChange}
              register={register}
            />
            <SizeSetter
              name="height"
              label="高度"
              value={height}
              unit={heightUnit}
              option={{ label: 'vh', value: 'vh' }}
              handleBlur={handleBlur}
              handleChange={handleUnitChange}
              register={register}
            />
          </div>
          <Icon
            name="link"
            className='cursor-pointer'
            color={locking ? 'blue' : 'gray'}
            onClick={handleLocking}
          />
        </div>
      </div>
      <div className='mt-8'>
        <MarginBPadding
          classNames='border border-dashed border-gray-400 bg-blue-200 rounded-4'
          title="margin"
          register={register}
          initValues={initValues}
          setKey='margin'
          setValue={setValue}
          keywords={['marginTop', 'marginLeft', 'marginRight', 'marginBottom']}
        >
          <MarginBPadding
            classNames='w-full border border-dashed border-gray-400'
            title="padding"
            styles={{ height: 98, backgroundColor: '#F0FDF4' }}
            register={register}
            initValues={initValues}
            setKey='padding'
            setValue={setValue}
            keywords={['paddingTop', 'paddingLeft', 'paddingRight', 'paddingBottom']}
          >
            <div
              className='w-full h-full bg-blue-200 text-12 text-center text-gray-400'
              style={{ height: 42, lineHeight: '42px' }}>
                1440 X 900
            </div>
          </MarginBPadding>
        </MarginBPadding>
      </div>
    </>
  );
}

export default LayoutConfig;
