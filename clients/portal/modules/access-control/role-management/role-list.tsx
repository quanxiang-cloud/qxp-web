import React, { useMemo, useState } from 'react';

import TwoLevelMenu from '@c/two-level-menu';

import { IRoleListItem } from './role-list-item';
import { iconColor } from '@c/icon';

export interface IRoleList {
  items: IRoleListItem[];
  onChange: (id: number | string) => void;
}

export default function RoleList({ items, onChange }: IRoleList): JSX.Element {
  const [current, setCurrent] = useState<string>(items[0]?.id);

  const onClick = (id: string): void => {
    setCurrent(id);
    onChange(id);
  };

  const menus = useMemo(() => {
    return items.map((item) => {
      return {
        id: item.id,
        title: item.name,
        iconName: item.tag,
        iconColor: 'gray' as iconColor,
        type: 'leaf',
        source: item,
      };
    });
  }, [items]);

  return (
    <div className="pt-16 h-full pb-4 border-r min-w-212 bg-gray-50">
      <TwoLevelMenu<IRoleListItem>
        menus={menus}
        defaultSelected={current}
        onSelect={(node) => onClick(node.id)}
      />
    </div>
  );
}
