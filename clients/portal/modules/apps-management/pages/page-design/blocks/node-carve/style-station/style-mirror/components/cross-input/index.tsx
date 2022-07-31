import React, { useEffect, useState } from 'react';
import cs from 'classnames';

import { Icon } from '@one-for-all/ui';
import { getValidMaxValue, isNumberString } from '../../utils/helper';
import './index.scss';
import StyleInput from '../style-input';

export type Props = {
  defaultValue: CrossValue;
  onChange: (value: CrossValue) => void;
  style?: React.CSSProperties;
  className?: string;
}

export type Direction = 'top' | 'bottom' | 'left' | 'right';

export type CrossValue = {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}

function CrossInput({
  style,
  className,
  defaultValue,
  onChange,
}: Props): JSX.Element {
  const [verticalLock, setVerticalLock] = useState<boolean>(false);
  const [horizontalLock, setHorizontalLock] = useState<boolean>(false);
  const [allLock, setAllLock] = useState<boolean>(false);
  const [value, setValue] = useState<CrossValue>({});

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  function handleInputChange(value: string, direction?: string): void {
    if (!direction) return;
    setValue((prevValue) => {
      let newValue = {};
      if (allLock) {
        newValue = { top: value, bottom: value, left: value, right: value, unite: value };
      } else if (['top', 'bottom'].includes(direction) && verticalLock) {
        newValue = { ...prevValue, top: value, bottom: value };
      } else if (['left', 'right'].includes(direction) && horizontalLock) {
        newValue = { ...prevValue, left: value, right: value };
      } else {
        newValue = { ...prevValue, [direction]: value };
      }

      onChange?.(newValue);
      return newValue;
    });
  }

  function handleVerticalLock(): void {
    setVerticalLock((prevState) => !prevState);
  }

  function handleHorizontalLock(): void {
    setHorizontalLock((prevState) => !prevState);
  }

  function getMaxValueString(value: CrossValue): string {
    const _value = getValidMaxValue([value.top, value.bottom, value.left, value.right]);
    return isNumberString(_value) ? _value + 'px' : _value;
  }

  function handleAllLock(): void {
    setAllLock((prevState) => {
      setVerticalLock(!prevState);
      setHorizontalLock(!prevState);

      setValue((prevValue) => {
        if (!prevState) {
          const maxValue = getMaxValueString(prevValue);
          const _value = {
            top: maxValue,
            bottom: maxValue,
            left: maxValue,
            right: maxValue,
          };
          onChange?.(_value);
          return _value;
        }
        return prevValue;
      });

      return !prevState;
    });
  }

  useEffect(() => {
    if (!verticalLock || !horizontalLock) {
      setAllLock(false);
    }

    if (verticalLock) {
      const _value = getValidMaxValue([value.top, value.bottom]);
      const minValue = isNumberString(_value) ? _value + 'px' : _value;
      setValue((prevValue) => {
        const value = {
          ...prevValue,
          top: minValue,
          bottom: minValue,
        };
        onChange?.(value);
        return value;
      });
      return;
    }
    if (horizontalLock) {
      const _value = getValidMaxValue([value.left, value.right]);
      const minValue = isNumberString(_value) ? _value + 'px' : _value; // '11px' > '1px' return false, why?
      setValue((prevValue) => {
        const value = {
          ...prevValue,
          left: minValue,
          right: minValue,
        };
        onChange?.(value);
        return value;
      });
      return;
    }
  }, [verticalLock, horizontalLock]);

  return (
    <div
      style={style}
      className={cs('relative flex justify-center items-center h-200 cross-input', className)}
    >
      <StyleInput
        name='top'
        value={defaultValue.top || ''}
        placeholder='top'
        inputClassName='text-center'
        className='cross-top'
        onChange={handleInputChange}
      />
      <StyleInput
        name='bottom'
        value={defaultValue.bottom || ''}
        placeholder='bottom'
        inputClassName='text-center'
        className='cross-bottom'
        onChange={handleInputChange}
      />
      <StyleInput
        name='left'
        value={defaultValue.left || ''}
        placeholder='left'
        inputClassName='text-center'
        className='cross-left'
        onChange={handleInputChange}
      />
      <StyleInput
        name='right'
        value={defaultValue.right || ''}
        placeholder='right'
        inputClassName='text-center'
        className='cross-right'
        onChange={handleInputChange}
      />
      <div className='absolute'>
        <div
          className='lock-left'
          onClick={handleHorizontalLock}
        >
          <div
            className={cs('lock-line', {
              'lock-line-active': horizontalLock || allLock,
            })}
          />
        </div>
        <div
          className='lock-right'
          onClick={handleHorizontalLock}
        >
          <div
            className={cs('lock-line', {
              'lock-line-active': horizontalLock || allLock,
            })}
          />
        </div>
        <div
          className='lock-top'
          onClick={handleVerticalLock}
        >
          <div
            className={cs('lock-line', {
              'lock-line-active': verticalLock || allLock,
              'lock-solid': allLock,
            })}
          />
        </div>
        <div
          className='lock-bottom'
          onClick={handleVerticalLock}
        >
          <div
            className={cs('lock-line', {
              'lock-line-active': verticalLock || allLock,
              'lock-solid': allLock,
            })}
          />
        </div>
      </div>
      <div className={ allLock ? 'text-blue-600' : '' }>
        <Icon
          name={allLock ? 'lock' : 'lock_open'}
          size={20}
          className='p-4 box-content rounded-4 cursor-pointer hover:shadow-md'
          onClick={handleAllLock}
        />
      </div>

    </div>
  );
}

export default CrossInput;
