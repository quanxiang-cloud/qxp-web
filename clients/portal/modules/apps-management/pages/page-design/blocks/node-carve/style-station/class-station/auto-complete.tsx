import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import cs from 'classnames';

import usePopper from '@c/popper2';
import { Icon } from '@one-for-all/ui';

type LabelValue = {
  label: string;
  value: string | number;
}

export type Props = {
  data: LabelValue[];
  currentValue?: string;
  style?: React.CSSProperties;
  className?: string;
  placeholder?: string;
  optionClassName?: string;
  onSelect?: (value: string | number) => void;
  labelRender?: (data: LabelValue) => JSX.Element
}

type SearchProp = {
  text: string;
  suggestions: LabelValue[]
}

function AutoComplete({
  data,
  currentValue,
  style,
  onSelect,
  className,
  placeholder,
  optionClassName,
  labelRender,
}: Props): JSX.Element {
  const [search, setSearch] = useState<SearchProp>({
    text: '',
    suggestions: [],
  });

  const { close, handleFocus, referenceRef, Popper } = usePopper<HTMLInputElement>();

  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearch({ suggestions: data, text: '' });
  }, [data]);

  function handleOptionClick(suggestion: LabelValue): void {
    onSelect?.(suggestion.value);
    close();
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>): void {
    const value = e.target.value.trim();
    const regex = new RegExp(`\\w*${value}\\w*`, 'i');
    const suggestions = data.filter((value: LabelValue) => regex.test(value.label)).sort();
    setSearch({ suggestions, text: value });
  }

  function getWrapWidth(): number {
    if (!wrapRef.current) return 200;
    return wrapRef.current.offsetWidth;
  }

  function suggestionsRender(suggestion: LabelValue[]): JSX.Element {
    if (!suggestion.length) {
      return <div className='w-full px-14 py-4 text-center'>没有对应的内容</div>;
    }

    return (
      <>
        {
          search.suggestions.map((suggestion) => (
            <div
              key={suggestion.value}
              className={cs('px-14 py-4 duration-300 cursor-pointer hover:bg-blue-200 ', optionClassName)}
              onClick={() => handleOptionClick(suggestion)}
            >
              { labelRender?.(suggestion) || suggestion.label }
            </div>
          ))
        }
      </>
    );
  }

  return (
    <div
      style={style}
      ref={wrapRef}
      className={cs('relative', className)}
    >
      <input
        ref={referenceRef}
        onFocus={handleFocus()}
        type='text'
        autoComplete='off'
        value={currentValue || search.text}
        onChange={handleInputChange}
        className='w-full px-12 py-6 rounded-4'
        placeholder={placeholder}
      />
      {
        currentValue && (
          <Icon
            className='cursor-pointer absolute right-8 top-8'
            color='gray'
            name='cancel'
            size={16}
            onClick={() => onSelect?.('')}
          />
        )
      }
      <Popper placement='bottom-start'>
        <div
          style={{ width: getWrapWidth() }}
          className='py-4 flex flex-col bg-white max-h-230 overflow-auto rounded-4 shadow-more-action text-12'
        >
          {suggestionsRender(search.suggestions)}
        </div>
      </Popper>

    </div>
  );
}

export default AutoComplete;
