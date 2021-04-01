import * as React from 'react';
import classnames from 'classnames';
import { Placement } from '@popperjs/core';

import { Icon } from '@QCFE/lego-ui';
import Popper from '@c/popper';

export type MenuItem<T> = {
  key: T;
  label: React.ReactNode;
  disabled?: boolean | undefined;
}

type Props<T> = {
  menuDesc?: string;
  iconName?: string;
  className?: string;
  onVisibilityChange?: (visible: boolean) => void;
  onChange: (key: T) => void;
  menus: MenuItem<T>[];
  placement?: Placement;
  likeBtn?: boolean;
  children?: React.ReactElement;
}

type MenuItemsProps<T> = {
  onClick: (key: T) => void;
  menuDesc?: string;
  items: MenuItem<T>[];
}

const modifiers = [
  {
    name: 'offset',
    options: {
      offset: [0, 4],
    },
  },
];

function stopPropagation(e: any) {
  // prevent click event propagate to parent node
  // incase parent node also has an event handler too
  e.stopPropagation();
}

// todo combine with select component
function RenderMenuItems<T extends React.Key>(
  { menuDesc, items, onClick }: MenuItemsProps<T>
): JSX.Element {
  return (
    <div className="select-options">
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
              className={classnames('select-options__option', 'select-option', {
                'select-option--disabled': disabled,
              })}
            >
              <div className="select-option__content py-6">{label}</div>
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
  iconName, className, menus, children, onVisibilityChange, onChange, menuDesc, placement, likeBtn,
}: Props<T>): JSX.Element {
  // todo fix this ref any type
  const reference = React.useRef<any>(null);
  const popperRef = React.useRef<Popper>(null);

  return (
    <>
      {
        children ? React.cloneElement(children, { ref: reference, onClick: stopPropagation }) :
          <span ref={reference} onClick={stopPropagation}>
            <Icon
              changeable
              clickable
              name={iconName ? iconName : 'more'}
              style={{ transform: 'rotate(90deg)' }}
              className={className}
            />
          </span>
      }
      <Popper
        ref={popperRef}
        reference={reference}
        onVisibilityChange={onVisibilityChange}
        placement={placement || 'bottom-start'}
        modifiers={modifiers}
      >
        <RenderMenuItems
          items={menus}
          menuDesc={menuDesc}
          onClick={(key): void => {
            popperRef.current?.close();
            onChange(key);
          }}
        />
      </Popper>
    </>
  );
}
