import React, { useState } from 'react';
import { useDebounce } from 'react-use';
import cs from 'classnames';

import Icon from '@c/icon';
import usePrevious from '@lib/hooks/use-previous';

export interface ISearchInput {
  name: string;
  prefix?: JSX.Element | string;
  placeholder: string;
  visible?: boolean;
  onChange: (value: string) => void;
  onClear?: () => void;
  appendix: JSX.Element | string;
  className?: string;
}

export default function SearchInput({
  visible,
  placeholder,
  onChange,
  onClear,
  prefix,
  appendix,
  name,
  className,
}: ISearchInput): JSX.Element {
  const [val, setVal] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(!!visible);
  const previousVal = usePrevious(val);
  useDebounce(
    () => val !== previousVal && previousVal !== undefined && onChange(val),
    300,
    [val],
  );

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const value = e.target.value;
    setVal(value);
    setIsVisible(value !== '');
  }

  return (
    <div className={cs('flex flex-row items-center', className)}>
      <div className="flex flex-row items-center w-full">
        {typeof prefix === 'string' && <div>{prefix}</div>}
        {typeof prefix !== 'string' && prefix && <>{prefix}</>}
        <div className="flex flex-row items-center w-full relative">
          <Icon name="search" className="absolute left-16 z-10" />
          <input
            className={cs('search-input w-full py-4', {
              'pr-28': appendix,
            })}
            type="text"
            placeholder={placeholder}
            onChange={handleInputChange}
            name={name}
            value={val}
          />
          {isVisible && typeof appendix === 'string' && (
            <Icon
              className="absolute right-12 z-10"
              name={appendix}
              clickable
              onClick={() => {
                setVal('');
                setIsVisible(false);
                onClear?.();
              }}
            />
          )}
          {isVisible && typeof appendix !== 'string' && appendix && <>{appendix}</>}
        </div>
      </div>
    </div>
  );
}
