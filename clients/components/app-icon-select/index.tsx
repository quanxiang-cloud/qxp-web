import React, { useRef, useState } from 'react';
import cs from 'classnames';
import { Control } from '@QCFE/lego-ui';

import Icon from '@c/icon';
import Popper from '@c/popper';

type Value = string;

type Props = {
  onChange: (value: Value) => void
  value: Value;
  placeholder?: string;
  options?: string[]
}

const APP_ICON_LIST = [
  'event_available',
  'people_alt',
  'person_add_alt_1',
  'role',
  'theme',
  'backup-shared',
  'application_management',
  'fact_check',
  'insert_chart',
  'record',
  'request_quote',
  'cogwheel',
  'flight_takeoff',
  'donut_large',
  'color_picker',
  'black',
];

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
        {(options ? options : APP_ICON_LIST).map((icon) => (
          <div
            onClick={() => optionClick(icon)}
            className={cs('app-icon-select-option',
              { 'app-icon-select-active': icon === iconName }
            )}
            key={icon}
          >
            <Icon className='app-icon-color-inherit' name={icon} size={24} />
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
