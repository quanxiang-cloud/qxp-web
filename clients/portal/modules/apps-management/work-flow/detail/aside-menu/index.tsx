import React from 'react';

import List from '@c/list';

import AsideMenuItem from './menu-item';

interface Props {
  onChange: (key: 'edit' | 'settings' | 'variables') => void;
  currentOperateType: string;
}

export default function NewFlow({ onChange, currentOperateType }: Props) {
  return (
    <aside className="w-142 h-full bg-white shadow-flow-aside">
      <List
        itemClassName="cursor-pointer hover:bg-blue-100 group"
        items={[
          <AsideMenuItem
            key="edit"
            iconName="edit"
            text="工作流设计"
            onClick={() => onChange('edit')}
            isActive={currentOperateType === 'edit'}
          />,
          <AsideMenuItem
            key="settings"
            iconName="settings"
            text="全局配置"
            onClick={() => onChange('settings')}
            isActive={currentOperateType === 'settings'}
          />,
          <AsideMenuItem
            key="variables"
            iconName="settings_ethernet"
            text="工作流变量"
            onClick={() => onChange('variables')}
            isActive={currentOperateType === 'variables'}
          />,
        ]}
      />
    </aside>
  );
}
