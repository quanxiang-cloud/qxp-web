import React, { useEffect } from 'react';
import { InputNumber, InputNumberProps } from 'antd';

function NumberPicker({ defaultValue, ...other }: InputNumberProps): JSX.Element {
  useEffect(() => {
    if (other.value || defaultValue === undefined) {
      return;
    }

    if (typeof defaultValue === 'number' || !isNaN(Number(defaultValue))) {
      other.onChange?.(defaultValue);
    }
  }, []);

  return (
    <InputNumber {...other} />
  );
}

export default NumberPicker;
