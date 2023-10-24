import React, {
  forwardRef,
  DetailedHTMLProps,
  InputHTMLAttributes,
  useState,
  Ref,
  ChangeEvent,
  useEffect,
} from 'react';
import cs from 'classnames';

import { uuid } from '@lib/utils';
import BtnBadge from '@c/btn-badge';

export type Props = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  onChange?: (value: string | number | boolean) => void;
  label?: string;
  value: string | number | boolean;
  error?: boolean;
  disabled?: boolean;
  radioClass?: string;
  className?: string;
  count?: number ;
};

function InternalRadio(props: Props, ref?: Ref<HTMLInputElement>): JSX.Element {
  const {
    defaultChecked, error, className, radioClass, onChange, label, checked: isChecked, disabled, count, ...inputProps
  } = props;
  const [checked, setChecked] = useState(defaultChecked);
  const id = uuid();

  useEffect(() => {
    setChecked(!!isChecked);
  }, [isChecked]);

  useEffect(() => {
    setChecked(!!defaultChecked);
  }, [defaultChecked]);

  function handleChange(checked: boolean): void {
    if (disabled) {
      return;
    }
    setChecked(checked);
    onChange && onChange(props.value);
  }

  return (
    <div className={cs('flex items-center', className)}>
      <div
        className={cs(
          'w-16 h-16 mr-8 border flex justify-center items-center transition cursor-pointer', {
            'bg-white': !checked,
            'bg-blue-600': checked,
            'border-red-600': error,
            'border-gray-400': !error,
            'bg-gray-200': disabled,
          },
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          radioClass)}
        style={{ borderRadius: '50%' }}
      >
        <input
          {...inputProps}
          ref={ref}
          style={{ zIndex: 1, opacity: 0, position: 'absolute' }}
          checked={checked}
          type="radio"
          id={id}
          disabled={disabled}
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
      <label htmlFor={id} className={cs('cursor-pointer',
        {
          'cursor-not-allowed': disabled,
        })
      }>{label}</label>
      {
        !!count &&
        <BtnBadge count={count} className="radio-btnBadge relative text-white" />
      }
    </div>
  );
}

const Radio = forwardRef(InternalRadio);

export default Radio;

