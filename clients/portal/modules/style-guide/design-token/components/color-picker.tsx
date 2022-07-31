import React, { useState, useEffect, CSSProperties } from 'react';
import { SketchPicker, ColorResult } from 'react-color';

import Tab from '@c/tab';
import usePopper from '@c/popper2';
import store from '../../store';
import DesignTokenStore, { GLOBAL_SET } from '../store';
import { TokenTypes } from '../constants/constants-types';
import { isSingleToken, mappedTokens, TokenListType } from '../utils';

interface ColorPickerProps {
  className?: string;
  style?: CSSProperties;
  onChange: (val: string) => void;
  value: string;
}

interface ColorTreeProps {
  values: Record<string, any>;
  path: string;
  onChange: (val: string) => void
}

function ColorTree({ path, values, onChange }: ColorTreeProps): JSX.Element {
  return (
    <>
      {Object.entries(values).map(([name, value]) => {
        const _path = [path, name].filter((n) => n).join('.');
        return typeof value === 'object' && !isSingleToken(value) ? (
          <div className="flex justify-start flex-row flex-wrap pb-4">
            <ColorTree values={value} onChange={onChange} path={_path}/>
          </div>
        ) : (
          <div
            className="p-4 w-20 h-20 mr-4 cursor-pointer border-1 border-gray-200"
            style={{ backgroundColor: value.value }}
            onClick={() => onChange(`{${_path}}`)}
          ></div>
        );
      })}
    </>
  );
}

function BaseColorSelector({
  onChange,
}: {
  onChange: (val: string) => void
}): JSX.Element {
  const { tokens } = store.designTokenStore as DesignTokenStore;
  const baseColors = mappedTokens(tokens[GLOBAL_SET], '').filter(
    ([key, group]: [string, TokenListType]) => key === TokenTypes.COLOR,
  );

  return (
    <div className='px-10'>
      {baseColors.map(([key, group]: [string, TokenListType]) => (
        <ColorTree key={key} path='' values={group.values} onChange={onChange}/>
      ))}
    </div>
  );
}

function ColorPicker({
  className,
  style,
  onChange,
  value,
}: ColorPickerProps): JSX.Element {
  const { isEditDisabled } = store.designTokenStore as DesignTokenStore;
  const [currColor, setCurrColor] = useState<string>(value || '#FFFFFF');
  const { handleClick, Popper, referenceRef, close } = usePopper<HTMLDivElement>();
  const tabs = [
    {
      id: 'SketchPicker',
      name: '调色板',
      content: (
        <SketchPicker
          color={currColor}
          onChangeComplete={handleColorChange}
        />
      ),
    },
  ];

  if (!isEditDisabled) {
    tabs.unshift({
      id: 'BaseColorSelector',
      name: '基础色板',
      content: <BaseColorSelector onChange={handleSelectChange} />,
    });
  }

  useEffect(() => {
    setCurrColor(value || '#FFFFFF');
  }, [value]);

  function handleColorChange(color: ColorResult): void {
    const { r, g, b, a } = color.rgb;
    const value = `rgba(${[r, g, b, a].join(',')})`;
    setCurrColor(value);
    onChange && onChange(value);
  }

  function handleSelectChange(color: string): void {
    onChange && onChange(color);
    close();
  }

  return (
    <>
      <div
        className={className}
        style={{ backgroundColor: currColor, ...style }}
        ref={referenceRef}
        onClick={handleClick()}
      ></div>
      <Popper style={{ zIndex: 99 }} placement='right-end'>
        <Tab
          className="bg-white"
          items={tabs}
        />
      </Popper>
    </>
  );
}

export default ColorPicker;
