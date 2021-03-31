import React from 'react';

import SvgIcon from '../icon';

interface Props {
  value: string;
  onChange?: (val:string) => void;
  onBlur?(val?: string): void;
  onKeyDown?(e?: React.KeyboardEvent): void;
}

export default function Search(
  { value, onChange, onKeyDown, onBlur }: Props) {
  function handleClick() {
    onChange && onChange('');
    onBlur && onBlur('');
  }
  return (
    <div className="px-16 py-6 rounded-r-6 rounded-tl-2 rounded-bl-6
    bg-gray-100 flex items-center">
      <SvgIcon name="search" size={20} className='mr-8' />
      <input
        style={{ background: 'none', width: 122 }}
        className="outline-none flex-grow"
        type="text"
        placeholder="搜索员工名称"
        name="search"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange && onChange(e.target.value)}
        value={value}
        onKeyDown={(e: React.KeyboardEvent) => onKeyDown && onKeyDown(e)}
        onBlur={() => onBlur && onBlur()}
      />
      {value !== '' && (
        <SvgIcon
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
