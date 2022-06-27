import React, { useState, KeyboardEvent, useEffect } from 'react';
import { observer } from 'mobx-react';

import Search from '@c/search';
import store from '../store';
import DesignTokenStore from './store';

function TokenFilter(): JSX.Element {
  const { tokenFilter, setTokenFilter } = store.designTokenStore as DesignTokenStore;
  const [inputValue, setInputValue] = useState(tokenFilter || '');

  useEffect(() => {
    setInputValue(tokenFilter);
  }, [tokenFilter]);

  function handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      setTokenFilter(inputValue);
    }
  }

  function handleChange(val: string): void {
    setInputValue(val);
  }

  return (
    <Search
      className='w-552'
      value={inputValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder='search'
    />
  );
}

export default observer(TokenFilter);
