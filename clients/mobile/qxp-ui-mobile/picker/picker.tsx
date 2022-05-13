import React, { useEffect, useState } from 'react';
import cs from 'classnames';

import { PickerProps, PickerOption } from './types';
import Icon from '@m/qxp-ui-mobile/icon';
import Popup from '../popup';

export default function Picker<T extends React.Key>(props: PickerProps<T>): JSX.Element {
  const [pickerValue, setPickerValue] = useState(props.value || props.defaultValue);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    props.multiple ? setPickerValue([]) : '';
  }, []);

  useEffect(() => {
    props.onChange?.(pickerValue as T & T[]);
  }, [pickerValue]);

  function handlePickerOption(option: PickerOption<T>): void {
    if (props.multiple && Array.isArray(pickerValue)) {
      if (pickerValue.includes(option.value)) {
        setPickerValue(pickerValue.filter((value) => value !== option.value));
        return;
      }
      setPickerValue([...pickerValue, option.value]);
      return;
    }

    setPickerValue(option.value);
    setVisible(false);
  }

  function isSelected(value: any): boolean {
    if (Array.isArray(pickerValue)) {
      return pickerValue.includes(value);
    }

    return pickerValue === value;
  }

  function renderPickerOption(): JSX.Element {
    if (Array.isArray(pickerValue) && pickerValue.length) {
      return (
        <div className='flex-1 multiple-selected-wrapper content-center'>
          {props.multiple && pickerValue.map((pickerOption, index) => {
            return (
              <div
                key={index}
                className={`multiple-selected multiple-selected-${(index + 1) % 3} mr-8 button ellipsis`}
              >
                {props.options.find((option) => option.value === pickerOption)?.label}
              </div>
            );
          })}
        </div>
      );
    }

    if (!pickerValue || (Array.isArray(pickerValue) && !pickerValue.length)) {
      return (
        <div className='body1 text-placeholder ellipsis flex-1 mr-8'>
          {props.placeholder || '请选择'}
        </div>
      );
    }

    return (
      <div className='body1 text-primary ellipsis flex-1 mr-16'>
        {props.options.find((option) => option.value === pickerValue)?.label}
      </div>
    );
  }

  return (
    <>
      <div>
        {props.title && <div className='body1 text-second mb-8'>{props.title}</div>}
        <div
          className={cs(props.className, 'flex items-center picker__selector-box', {
            'picker-disabled': props.disabled,
          })}
          onClick={() => setVisible(true)}
        >
          {renderPickerOption()}
          <div className='text-gray-600'>
            <Icon size='0.2rem' name='keyboard_arrow_down' />
          </div>
        </div>
      </div>
      <Popup
        visible={visible}
        onClose={() => setVisible(false)}
        position="bottom"
        title={props.title}
        closeIcon='close'
        round
      >
        <div className='dialog-wrapper body1'>
          {props.options.length && props.options.map((option, index) => {
            return (
              <div
                key={index}
                className={cs('flex justify-center picker-action-wrapper body1 text-primary', {
                  'picker-action-active': isSelected(option.value),
                })}
                onClick={() => handlePickerOption(option)}
              >
                <div className='picker-action mr-8'>{option.label}</div>
                <Icon
                  size='0.18rem'
                  style={{ color: 'var(--green-600)' }}
                  name={isSelected(option.value) ? 'done' : ''}
                />
              </div>
            );
          })}
        </div>
      </Popup>
    </>
  );
}
