import React, { ChangeEvent, useMemo, useRef } from 'react';
import cs from 'classnames';
import { nanoid } from 'nanoid';

export type Props = {
  name?: string
  label?: string;
  value?: string | number;
  className?: string;
  defaultValue?: string;
  style?: React.CSSProperties;
  horizontal?: boolean;
  labelClassName?: string;
  inputClassName?: string;
  autoSelect?: boolean;
  placeholder?: string
  onChange?: (value: string, name?: string) => void;
}

function StyleInput({
  style,
  className,
  name,
  label,
  defaultValue,
  labelClassName,
  inputClassName,
  value,
  onChange,
  horizontal,
  placeholder,
  autoSelect,
}: Props): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputName = useMemo(() => (name || nanoid(4)), [name]);

  function onInputChange(e: ChangeEvent<HTMLInputElement>): void {
    const value = e.target.value.trim();
    onChange?.(value, name);
  }

  function handleInputFocus(): void {
    autoSelect && inputRef.current?.select();
  }

  return (
    <div
      className={cs('flex', {
        'flex-col': !horizontal,
        'gap-4': label,
      }, className)}
    >
      <label
        title={label}
        className={cs('truncate text-gray-500', labelClassName)}
        htmlFor={inputName}
      >
        {label}
      </label>
      <input
        style={style}
        id={inputName}
        type="text"
        ref={inputRef}
        onFocus={handleInputFocus}
        autoComplete='off'
        className={cs('rounded-4 px-8 py-6 w-full', inputClassName)}
        value={value}
        name={inputName}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={onInputChange}
      />
    </div>
  );
}

export default StyleInput;
