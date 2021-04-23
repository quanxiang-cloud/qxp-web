import React, { useState } from 'react';

import Icon from '../icon';

interface Props {
  value?: string;
  placeholder?: string;
  onChange?: (val:string) => void;
  onBlur?(val?: string): void;
  onKeyDown?(e?: React.KeyboardEvent): void;
  classname?: string;
}

export default function Search(
  { value: _value, placeholder, onChange, onKeyDown, onBlur, classname }: Props) {
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
    <div className={`px-16 py-6 rounded-r-6 rounded-tl-2 rounded-bl-6 bg-gray-100 flex items-center ${classname}`}>
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
