import React, { useState } from 'react'
import { Checkbox as LegoCheckbox, CheckboxProps } from '@QCFE/lego-ui'
import { twCascade } from '@mariusmarais/tailwind-cascade'
import useCss from 'react-use/lib/useCss'

export interface ICheckbox extends CheckboxProps {}

export const Checkbox = ({
  className,
  defaultChecked,
  checked,
  disabled,
  indeterminate,
  onChange,
  value,
  children,
}: ICheckbox) => {
  const [isCheck, setIsCheck] = useState<boolean>(!!checked)

  return (
    <LegoCheckbox
      className={twCascade(
        'inline-flex flex-row items-center',
        useCss({
          '& > span.label-value': {
            color: '#0F172A',
            'font-size': '0.6rem',
            'line-height': '0.9rem',
          },
        }),
        className,
      )}
      defaultChecked={defaultChecked}
      checked={isCheck}
      disabled={disabled}
      indeterminate={indeterminate}
      onChange={(e, checked) => {
        setIsCheck(checked)
        if (onChange) {
          onChange(e, checked)
        }
      }}
      value={value}
    >
      {children}
    </LegoCheckbox>
  )
}
