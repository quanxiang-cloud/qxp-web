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

export type MenuItem = {
  key: React.Key;
  label: React.ReactNode;
  disabled?: boolean | undefined;
}

type MenusProps = {
  onClick: (key: React.Key) => void;
  items: MenuItem[];
}

function Menus({ items, onClick }: MenusProps): JSX.Element {
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

type Props = {
  iconName?: string;
  className?: string;
  onVisibilityChange?: (visible: boolean) => void;
  onMenuClick: (key: React.Key) => void;
  menus: MenuItem[];
  placement?: Placement;
  children?: React.ReactElement;
}

export default function MoreMenu({
  iconName, className, menus, children, onVisibilityChange, onMenuClick, placement,
}: Props): JSX.Element {
  const reference = React.useRef<Element>(null);
  const popperRef = React.useRef<Popper>(null);

  function handleMenuClick(key: React.Key) {
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
