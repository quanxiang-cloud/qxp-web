import React, { useState } from 'react';

import { List } from '@portal/components/list2';
import { ItemWithTitleDesc } from '@portal/components/item-with-title-desc4';
import { RoleListItem, IRoleListItem } from './role-list-item';

export interface IRoleList {
  items: IRoleListItem[];
  onChange: (id: number | string) => void;
}

export const RoleList = ({ items, onChange }: IRoleList) => {
  const [current, setCurrent] = useState(items[0]?.id);

  const onClick = (id: number | string) => {
    setCurrent(id);
    onChange(id);
  };

  return (
    <div className="pt-8">
      <ItemWithTitleDesc
        itemRender={
          <div
            className="font-bold text-1-dot-6 px-8 text-gray-900 flex justify-between items-center"
          >
            角色列表
          </div>
        }
        desc={`(${items.length} 个)`}
        descClassName="transition ease-linear text-1-dot-2 text-blueGray-400"
      />
      <List
        className="flex-col justify-start items-stretch mt-2"
        itemClassName="cursor-pointer truncate flex-shrink-0"
        items={items.map((item) => (
          <RoleListItem key={item.id} {...item} active={item.id === current} onClick={onClick} />
        ))}
      />
    </div>
  );
};
