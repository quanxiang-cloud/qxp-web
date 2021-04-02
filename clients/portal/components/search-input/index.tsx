import React, { useState } from 'react';
import { Control, Input } from '@QCFE/lego-ui';

import Icon from '@portal/components/icon';

import './index.scss';

type Props = {
  width?: string;
  placeholder?: string;
  height?: string;
  onSearch: (value: string) => void;
}

function SearchInput({
  placeholder,
  onSearch,
  width = '226px',
  height = '32px',
}: Props) {
  const [value, setValue] = useState<string>('');

  return (
    <Control style={{ width: width, height: height }} className='icon-input relative inline-block'>
      <Icon size={20} className='icon-position left-16' name="search" />
      <Input
        className='icon-input-self'
        type="text"
        onPressEnter={() => onSearch(value)}
        placeholder={placeholder}
        onChange={(e: React.MouseEvent, _value: string) => setValue(_value)}
        name="search"
        value={value}
      />
      {value && (
        <Icon
          size={20}
          className='icon-position right-8'
          changeable
          clickable
          name="close"
          onClick={() =>{
            onSearch('');
            setValue('');
          }}
        />
      )}
    </Control>
  );
}

export default SearchInput;
