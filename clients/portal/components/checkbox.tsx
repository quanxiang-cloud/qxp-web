import React from 'react';
import { Checkbox as LegoCheckbox, CheckboxProps } from '@QCFE/lego-ui';
import { twCascade } from '@mariusmarais/tailwind-cascade';
import useCss from 'react-use/lib/useCss';

export const Checkbox = ({
  className,
  defaultChecked,
  checked,
  disabled,
  indeterminate,
  onChange,
  value,
  children,
}: CheckboxProps) => {
  return (
    <LegoCheckbox
      className={twCascade(
        'inline-flex flex-row items-center',
        useCss({
          '& > span.label-value': {
            color: '#0F172A',
            'font-size': '1.2rem',
            'line-height': '2rem',
          },
        }),
        className,
      )}
      defaultChecked={!!defaultChecked}
      checked={!!checked}
      disabled={!!disabled}
      indeterminate={indeterminate}
      onChange={(e: Event, checked:boolean) => {
        if (onChange) {
          onChange(e, checked);
        }
      }}
      value={value}
    >
      {children}
    </LegoCheckbox>
  );
};
