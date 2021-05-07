import React, { useState } from 'react';
import cs from 'classnames';

import Icon from '../icon';

interface Props {
  value?: string;
  placeholder?: string;
  onChange?: (val:string) => void;
  onBlur?(val?: string): void;
  onKeyDown?(e?: React.KeyboardEvent): void;
  className?: string;
}

export default function Search(
  { value: _value, placeholder, onChange, onKeyDown, onBlur, className }: Props) {
  const [value, setValue] = useState(_value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setValue(e.target.value);
    onChange && onChange(e.target.value);
  };

  function handleClick() {
    setValue('');
    onChange && onChange('');
    onBlur && onBlur('');
  }

  return (
    <div className={cs('px-16 py-6 select-border-radius bg-white flex items-center', className)}>
      <Icon name="search" size={20} className='mr-8' />
      <input
        style={{ background: 'none', width: 122, boxShadow: 'none' }}
        className="outline-none flex-grow"
        type="text"
        placeholder={placeholder}
        name="search"
        onChange={handleChange}
        value={value}
        onKeyDown={(e: React.KeyboardEvent) => onKeyDown && onKeyDown(e)}
        onBlur={() => onBlur && onBlur()}
      />
      {value !== '' && (
        <Icon
          className="ml-8"
          name="close"
          size={20}
          clickable
          onClick={handleClick}
        />
      )}
    </div>
  );
}
