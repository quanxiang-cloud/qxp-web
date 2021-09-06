import React, { useState } from 'react';
import cs from 'classnames';

import List from '@c/list';
import Icon from '@c/icon';
import useFitView from '@flow/content/editor/hooks/use-fit-view';

import AsideMenuItem from './menu-item';

interface Props {
  onChange: (key: 'edit' | 'settings' | 'variables') => void;
  currentOperateType: string;
}

const durationTime = 300;

export default function WorkFlowAsideMenu({ onChange, currentOperateType }: Props): JSX.Element {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const fitView = useFitView();
  let tid = -1;

  function onCollapse(): void {
    setIsCollapsed((i) => !i);
    clearTimeout(tid);
    tid = window.setTimeout(() => {
      fitView();
    }, durationTime);
  }

  return (
    <aside
      className={cs(
        'h-full bg-white shadow-flow-aside flex flex-col justify-between',
        `duration-${durationTime}`, { 'w-214': !isCollapsed, 'w-72': isCollapsed },
      )}
      style={{
        transitionProperty: 'width',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <List
        className="flex-col"
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
      <div
        onClick={onCollapse}
        className="flex justify-center items-center py-12 cursor-pointer"
        style={{
          boxShadow: 'inset 0px 1px 0px var(--gray-200)',
        }}
      >
        <Icon
          name="login"
          className={cs('transform transition', { 'rotate-180': !isCollapsed })}
        />
      </div>
    </aside>
  );
}
