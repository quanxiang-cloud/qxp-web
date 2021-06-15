import React, { useState } from 'react';
import { Input, Field, Label, Control, Icon } from '@QCFE/lego-ui';
import useDebounce from 'react-use/lib/useDebounce';
import cs from 'classnames';

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
}: ISearchInput) {
  const [val, setVal] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(!!visible);
  useDebounce(
    () => {
      onChange(val);
    },
    500,
    [val],
  );

  return (
    <div className={cs('flex flex-row items-center', className)}>
      <Field className="flex flex-row items-center w-full">
        {typeof prefix === 'string' && <Label>{prefix}</Label>}
        {typeof prefix !== 'string' && prefix && <>{prefix}</>}
        <Control className="flex flex-row items-center w-full relative">
          <Icon name="magnifier" className="absolute left-16 z-10" />
          <Input
            className={cs('search-input', {
              'pr-28': appendix,
            })}
            type="text"
            placeholder={placeholder}
            onChange={(e: Event, value: string) => {
              setVal(value);
              setIsVisible(value !== '');
            }}
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
        </Control>
        <Label></Label>
      </Field>
    </div>
  );
}
