import * as React from 'react';
import classnames from 'classnames';
import { Placement } from '@popperjs/core';

import Icon from '@c/icon';
import Popper from '@c/popper';

export type MenuItem<T> = {
  key: T;
  label: React.ReactNode | string;
  disabled?: boolean | undefined;
}

type Props<T> = {
  optionsClass?: string;
  optionsWarpClass?: string;
  menuDesc?: string;
  iconName?: string;
  className?: string;
  onVisibilityChange?: (visible: boolean) => void;
  onChange: (key: T) => void;
  value?: T;
  targetClass?: string;
  menus: MenuItem<T>[];
  placement?: Placement;
  likeBtn?: boolean;
  children?: React.ReactElement | JSX.Element;
  suffix?: JSX.Element | string
}

type MenuItemsProps<T> = {
  classname?: string;
  onClick: (key: T) => void;
  menuDesc?: string;
  items: MenuItem<T>[];
  value?: T;
  targetClass?: string;
  optionsClass?: string;
  suffix?: JSX.Element | string
}

const modifiers = [
  {
    name: 'offset',
    options: {
      offset: [0, 4],
    },
  },
];

// todo combine with select component
function RenderMenuItems<T extends React.Key>(
  { menuDesc, items, onClick, classname, targetClass, value, optionsClass, suffix }: MenuItemsProps<T>
): JSX.Element {
  return (
    <div className={`select-options ${classname}`}>
      {menuDesc && (<p className="select-options__desc">{menuDesc}</p>)}
      {
        items.map(({ key, label, disabled }) => {
          return (
            <div
              key={key}
              onClick={(e): void => {
                e.stopPropagation();
                !disabled && onClick(key);
              }}
              className={classnames('select-options__option', 'select-option', 'optionsClass', "select-option__content py-6", {
                'select-option--disabled': disabled,
                [targetClass||'']: value == key
              }, optionsClass)}
            >
              <span>{label}</span>
              {(value == key)&&suffix}
            </div>
          );
        })
      }
    </div>
  );
}

// todo fix this
// opened more-menu will not be closed when another more-menu opened
export default function MoreMenu<T extends React.Key>({
  iconName, className, menus, children, onVisibilityChange, onChange, menuDesc, placement, optionsWarpClass,
  value, targetClass, optionsClass, suffix
}: Props<T>): JSX.Element {
  // todo fix this ref any type
  const reference = React.useRef<any>(null);
  const popperRef = React.useRef<Popper>(null);

  return (
    <>
      {
        children ? React.cloneElement(children, { ref: reference }) : (
          <Icon
            ref={reference}
            changeable
            clickable
            name={iconName ? iconName : 'more_horiz'}
            className={className}
          />
        )
      }
      <Popper
        ref={popperRef}
        reference={reference}
        onVisibilityChange={onVisibilityChange}
        placement={placement || 'bottom-start'}
        modifiers={modifiers}
      >
        <RenderMenuItems
          classname={optionsWarpClass}
          items={menus}
          value={value} 
          targetClass={targetClass}
          menuDesc={menuDesc}
          optionsClass={optionsClass}
          suffix={suffix}
          onClick={(key): void => {
            popperRef.current?.close();
            onChange(key);
          }}
        />
      </Popper>
    </>
  );
}
