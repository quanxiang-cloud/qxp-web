import React, { useEffect, useRef } from 'react';
import { InputNumber, InputNumberProps } from 'antd';

type Props = Omit<InputNumberProps, 'onChange'> & {
  onChange: (val: any) => void;
}

function NumberPicker({ defaultValue, ...other }: Props): JSX.Element {
  const InputNumberRef = useRef<any>();

  useEffect(()=>{
    InputNumberRef?.current?.addEventListener('input', (event: any) => {
      const inputValue = event.target.value;
      if (inputValue === '') {
        setTimeout(()=>{
          other.onChange?.(null);
        });
      }
    });
  }, [InputNumberRef?.current]);

  useEffect(() => {
    if (other.value || other.value === 0 || other.value === null || defaultValue === undefined) {
      return;
    }

    if (typeof defaultValue === 'number' || !isNaN(Number(defaultValue))) {
      other.onChange?.(defaultValue);
    }
  }, []);

  function handleChange(val: null | number | string): void {
    // if (val === null) {
    //   other.onChange?.(undefined);
    //   return;
    // }
    other.onChange?.(val);
  }

  return <InputNumber ref={InputNumberRef} {...other} onChange={handleChange} />;
}

export default NumberPicker;
