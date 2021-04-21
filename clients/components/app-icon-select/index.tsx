import React, { useRef, useState } from 'react';
import cs from 'classnames';
import { Control } from '@QCFE/lego-ui';

import Icon from '@c/icon';
import Popper from '@c/popper';

type Value = string;

type Option = {
  value: Value;
  label: React.ReactNode;
  disabled?: boolean;
}

type Props = {
  onChange: (value: Value) => void
  value: Value;
  placeholder?: string;
  options: Option[]
}

const modifiers = [
  {
    name: 'offset',
    options: {
      offset: [0, 4],
    },
  },
];

function IconSelect({
  onChange,
  value,
  options,
  placeholder = '请选择',
}: Props, ref?: React.LegacyRef<Control>) {
  const [isVisible, setIsVisible] = useState(false);
  const [iconName, setIconName] = useState(value);
  const popperRef = useRef<any>();
  const reference = useRef<any>();

  const optionsVisibilityChange = (visible: boolean) => {
    setIsVisible(visible);
  };

  const optionClick = (_value: Value) => {
    popperRef.current?.close();
    onChange(_value);
    setIconName(_value);
  };

  const renderOptions = () => {
    const width = reference.current ? reference.current.clientWidth : 200;

    return (
      <div className='app-icon-select-option-box' style={{ width: width + 'px' }}>
        {options.map(({ value: _value }: Option) => (
          <div
            onClick={() => optionClick(_value)}
            className={cs('app-icon-select-option',
              { 'app-icon-select-active': _value === iconName }
            )}
            key={_value}
          >
            <Icon className='app-icon-color-inherit' name={_value} size={24} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <Control ref={ref}>
      <div ref={reference} className='app-bg-icon-select'>
        <div>{iconName ? <Icon name={iconName} size={24} /> : placeholder}</div>
        <Icon size={20} name={isVisible ? 'expand_less' : 'expand_more'} />
      </div>
      <Popper
        ref={popperRef}
        reference={reference}
        placement="bottom-start"
        modifiers={modifiers}
        onVisibilityChange={optionsVisibilityChange}
      >
        {renderOptions()}
      </Popper>
    </Control>
  );
}

export default React.forwardRef(IconSelect);
