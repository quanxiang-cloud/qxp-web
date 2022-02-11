import React, { useEffect } from 'react';
import { InputNumber, InputNumberProps } from 'antd';

type Props = Omit<InputNumberProps, 'onChange'> & {
  onChange: (val: any) => void;
}

function NumberPicker({ defaultValue, ...other }: Props): JSX.Element {
  useEffect(() => {
    if (other.value || defaultValue === undefined) {
      return;
    }

    if (typeof defaultValue === 'number' || !isNaN(Number(defaultValue))) {
      other.onChange?.(defaultValue);
    }
  }, []);

  function handleChange(val: null | number | string): void {
    if (val === null) {
      other.onChange?.(undefined);
      return;
    }
    other.onChange?.(val);
  }

  return <InputNumber {...other} onChange={handleChange} />;
}

export default NumberPicker;
