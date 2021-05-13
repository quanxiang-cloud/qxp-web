import * as React from 'react';
import cs from 'classnames';
import { Placement } from '@popperjs/core';

import Icon from '@c/icon';
import Popper from '@c/popper';

const modifiers = [
  {
    name: 'offset',
    options: {
      offset: [0, 4],
    },
  },
];

export type MenuItem<T extends React.Key = string> = {
  key: T;
  label: React.ReactNode;
  disabled?: boolean | undefined;
}

type MenusProps<T extends React.Key> = {
  onClick: (key: T) => void;
  items: MenuItem<T>[];
}

function Menus<T extends React.Key>({ items, onClick }: MenusProps<T>): JSX.Element {
  return (
    <div className="dropdown-options">
      {
        items.map(({ key, label, disabled }) => {
          return (
            <div
              key={key}
              className={cs('dropdown-options__option', { 'select-option--disabled': disabled })}
              onClick={(e): void => {
                e.stopPropagation();
                !disabled && onClick(key);
              }}
            >
              <div className="select-option__content py-6">{label}</div>
            </div>
          );
        })
      }
    </div>
  );
}

type Props<T extends React.Key> = {
  iconName?: string;
  className?: string;
  onVisibilityChange?: (visible: boolean) => void;
  onMenuClick: (key: T) => void;
  menus: MenuItem<T>[];
  placement?: Placement;
  children?: React.ReactElement;
}

export default function MoreMenu<T extends React.Key>({
  iconName, className, menus, children, onVisibilityChange, onMenuClick, placement,
}: Props<T>): JSX.Element {
  const reference = React.useRef<Element>(null);
  const popperRef = React.useRef<Popper>(null);

  function handleMenuClick(key: T) {
    popperRef.current?.close();
    onMenuClick(key);
  }

  return (
    <>
      {
        children ? React.cloneElement(children, { ref: reference }) : (
          <Icon
            ref={reference as React.RefObject<SVGSVGElement>}
            changeable
            clickable
            size={20}
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
        <Menus items={menus} onClick={handleMenuClick} />
      </Popper>
    </>
  );
}
