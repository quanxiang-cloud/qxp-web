import React, { useState } from 'react';

import List from '@c/list';
import ItemWithTitleDesc from '@c/item-with-title-desc';

import RoleListItem, { IRoleListItem } from './role-list-item';

export interface IRoleList {
  items: IRoleListItem[];
  onChange: (id: number | string) => void;
}

export default function RoleList({ items, onChange }: IRoleList) {
  const [current, setCurrent] = useState(items[0]?.id);

  const onClick = (id: number | string) => {
    setCurrent(id);
    onChange(id);
  };

  return (
    <div className="pt-20">
      <ItemWithTitleDesc
        itemRender={
          (<div
            className="text-h6-bold pl-20 text-black-900 flex justify-between items-center"
          >
            角色列表
          </div>)
        }
        desc={`(${items.length} 个)`}
        descClassName="transition ease-linear text-12 text-blueGray-400 text-caption-no-color"
        textClassName="ml-3.5"
        className="mb-8"
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
}
