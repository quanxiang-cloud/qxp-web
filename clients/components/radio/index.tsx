import React, {
  forwardRef,
  DetailedHTMLProps,
  InputHTMLAttributes,
  useState,
  Ref,
  ChangeEvent,
  useEffect,
  memo,
} from 'react';
import cs from 'classnames';

import { uuid } from '@lib/utils';

export type Props = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  onChange?: (value: string | number | boolean) => void;
  label?: string;
  value: string | number | boolean;
};

function InternalRadio(props: Props, ref?: Ref<HTMLInputElement>) {
  const { defaultChecked, className, onChange, label, checked: isChecked, ...inputProps } = props;
  const [checked, setChecked] = useState(defaultChecked);
  const id = uuid();

  useEffect(() => {
    setChecked(!!isChecked);
  }, [isChecked]);

  useEffect(() => {
    setChecked(!!defaultChecked);
  }, [defaultChecked]);

  function handleChange(checked: boolean) {
    setChecked(checked);
    onChange && onChange(props.value);
  }

  return (
    <div className={cs('flex items-center', className)}>
      <div
        className={cs(
          'w-16 h-16 mr-8 border border-gray-400 flex justify-center items-center transition', {
            'bg-white': !checked,
            'bg-blue-600': checked,
          }, 'cursor-pointer')}
        style={{ borderRadius: '50%' }}
        onClick={() => handleChange(true)}
      >
        <input
          {...inputProps}
          ref={ref}
          checked={checked}
          type="radio"
          id={id}
          className="hidden"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const { checked } = e.target;
            handleChange(checked);
          }}
        />
        <span
          className={cs('w-8 h-8 bg-white transition', {
            'opacity-0': !checked,
            'opacity-1': checked,
          })}
          style={{ borderRadius: '50%' }}
        ></span>
      </div>
      <label htmlFor={id} className="text-body2 cursor-pointer">{label}</label>
    </div>
  );
}

const Radio = forwardRef(InternalRadio);

export default memo(Radio) as typeof Radio;

