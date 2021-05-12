import React, { useState } from 'react';
import cs from 'classnames';

import List from '@c/list';
import Icon from '@c/icon';

import AsideMenuItem from './menu-item';

interface Props {
  onChange: (key: 'edit' | 'settings' | 'variables') => void;
  currentOperateType: string;
}

export default function NewFlow({ onChange, currentOperateType }: Props) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  function onCollapse() {
    setIsCollapsed((i) => !i);
  }

  return (
    <aside
      className="h-full bg-white shadow-flow-aside flex flex-col justify-between transition-all"
    >
      <List
        itemClassName="cursor-pointer hover:bg-blue-100 group"
        items={[
          <AsideMenuItem
            key="edit"
            iconName="edit"
            text={isCollapsed ? '' : '工作流设计'}
            title="工作流设计"
            onClick={() => onChange('edit')}
            isActive={currentOperateType === 'edit'}
          />,
          <AsideMenuItem
            key="settings"
            iconName="settings"
            text={isCollapsed ? '' : '全局配置'}
            title="全局配置"
            onClick={() => onChange('settings')}
            isActive={currentOperateType === 'settings'}
          />,
          <AsideMenuItem
            key="variables"
            iconName="settings_ethernet"
            text={isCollapsed ? '' : '工作流变量'}
            title="工作流变量"
            onClick={() => onChange('variables')}
            isActive={currentOperateType === 'variables'}
          />,
        ]}
      />
      <div className="flex justify-center items-center py-12" style={{
        boxShadow: 'inset 0px 1px 0px var(--gray-200)',
      }}>
        <Icon
          name="login"
          className={cs(
            'transform cursor-pointer transition',
            { 'rotate-180': isCollapsed }
          )}
          onClick={onCollapse}
        />
      </div>
    </aside>
  );
}
