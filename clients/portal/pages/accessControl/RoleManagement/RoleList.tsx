import React, { useState } from 'react';

import { List } from '@portal/components/List';
import { ItemWithTitleDesc } from '@portal/components/ItemWithTitleDesc';
import { RoleListItem, IRoleListItem } from './RoleListItem';

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
    <div>
      <ItemWithTitleDesc
        itemRender={
          <div className="font-bold text-dot-8 text-0F172A flex justify-between items-center">
            角色列表
          </div>
        }
        desc={`(${items.length} 个)`}
        descClassName="transition ease-linear text-dot-6 text-697886"
      />
      <List
        className="flex-col justify-start items-stretch mt-2"
        itemClassName="cursor-pointer"
        items={items.map((item) => (
          <RoleListItem key={item.id} {...item} active={item.id === current} onClick={onClick} />
        ))}
      />
    </div>
  );
};
