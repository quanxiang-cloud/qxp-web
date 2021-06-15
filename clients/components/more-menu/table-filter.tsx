import React from 'react';
import { Placement } from '@popperjs/core';

import Icon from '@c/icon';

import MoreMenu, { MenuItem } from './index';

type Props<T extends React.Key = string> = {
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

export default function TableMoreFilterMenu<T extends React.Key>({
  iconName, className, menus, children, onVisibilityChange, onChange, placement, checkedKey,
}: Props<T>): JSX.Element {
  const reference = React.useRef<SVGSVGElement>(null);
  const [curCheckedKey, setCurCheckedKey] = React.useState<React.Key>(checkedKey || '');

  React.useEffect(() => {
    setCurCheckedKey(checkedKey || '');
  }, [checkedKey]);

  function onMenuClick(key: React.Key): void {
    setCurCheckedKey(key === curCheckedKey ? '' : key);
    onChange((key === curCheckedKey ? '' : key) as T);
  }

  return (
    <MoreMenu<React.Key>
      placement={placement}
      onVisibilityChange={onVisibilityChange}
      onMenuClick={onMenuClick}
      menus={menus.map((menu) => {
        const checked = curCheckedKey === menu.key;
        return {
          ...menu,
          label: (
            <span>
              {menu.label} {checked ? <Icon className="ml-6" name="check" /> : null}
            </span>
          ),
        };
      })}
    >
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
    </MoreMenu>
  );
}
