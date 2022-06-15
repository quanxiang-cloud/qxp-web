import React from 'react';
import cs from 'classnames';
import RadioButton from './button';

export type Props = {
  data: LabelValue[];
  current?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
  buttonContentRender?: (item: LabelValue, index: number) => JSX.Element;
  onChange: (value: string) => void;
}

function RadioButtonGroup({
  style,
  className,
  data,
  current,
  disabled,
  buttonContentRender,
  onChange,
}: Props): JSX.Element {
  return (
    <div
      style={style}
      className={cs('flex justify-center items-center gap-4 p-4 border-1 border-gray-200 rounded-6', {
        'opacity-60 cursor-not-allowed': disabled,
      }, className)}
    >
      {
        data.map((item, index) => {
          const { label, value } = item;
          const isActive = value === current;
          return (
            <RadioButton
              key={value}
              isActive={isActive}
              onClick={() => !disabled && onChange?.(value)}
            >
              {buttonContentRender?.(item, index) || label}
            </RadioButton>
          );
        })
      }
    </div>
  );
}

export default RadioButtonGroup;
