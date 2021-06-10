import * as React from 'react';
import cs from 'classnames';
import { Placement } from '@popperjs/core';

import Icon from '@c/icon';
import Popper from '@c/popper';

export type MenuItem<T> = {
  key: T;
  label: React.ReactNode;
  disabled?: boolean | undefined;
}

type Props<T> = {
  iconName?: string;
  className?: string;
  onVisibilityChange?: (visible: boolean) => void;
  onChange: (key: T) => void;
  menus: MenuItem<T>[];
  placement?: Placement;
  likeBtn?: boolean;
  children?: React.ReactElement;
  checkedKey?: React.Key;
}

type MenuItemsProps<T> = {
  onClick: (key: T) => void;
  items: MenuItem<T>[];
  checkedKey?: T;
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
  { items, onClick, checkedKey }: MenuItemsProps<T>,
): JSX.Element {
  return (
    <div className="dropdown-options">
      {
        items.map(({ key, label, disabled }) => {
          const isChecked = checkedKey === key;
          return (
            <div
              key={key}
              onClick={(e): void => {
                e.stopPropagation();
                !disabled && onClick(key);
              }}
              className={cs('dropdown-options__option flex justify-between items-center', {
                'select-option--disabled': disabled,
              })}
            >
              <div className="select-option__content py-6 mr-5">{label}</div>
              {isChecked && (
                <Icon name="check" />
              )}
              {!isChecked && (
                <span></span>
              )}
            </div>
          );
        })
      }
    </div>
  );
}

// todo fix this
// opened more-menu will not be closed when another more-menu opened
export default function TableMoreFilterMenu<T extends React.Key>({
  iconName, className, menus, children, onVisibilityChange, onChange, placement,
  checkedKey,
}: Props<T>): JSX.Element {
  // todo fix this ref any type
  const reference = React.useRef<any>(null);
  const popperRef = React.useRef<Popper>(null);
  const [curCheckedKey, setCurCheckedKey] = React.useState<React.Key>(checkedKey || '');

  React.useEffect(() => {
    setCurCheckedKey(checkedKey || '');
  }, [checkedKey]);

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
          checkedKey={curCheckedKey}
          items={menus}
          onClick={(key): void => {
            setCurCheckedKey(key);
            popperRef.current?.close();
            onChange(key as T);
          }}
        />
      </Popper>
    </>
  );
}
