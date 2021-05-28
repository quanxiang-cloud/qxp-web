import React from 'react';
import cs from 'classnames';

import './index.scss';

export type TabProps = {
  label: React.ReactNode;
  key: string;
}

type Props = {
  activeTab: string;
  tabs: TabProps[];
  onChange: (tab: string) => void;
  className?: string;
  size?: 'small' | 'normal' | 'big';
}

function Tab({ activeTab, onChange, tabs, size = 'big', className = '' }: Props) {
  return (
    <div className={`qxp-tab-container qxp-tab-size-${size} ${className}`}>
      {tabs.map(({ label, key }) => (
        <div
          className={cs('qxp-tab-item', { 'qxp-tab-active': activeTab === key })}
          onClick={() => onChange(key)}
          key={key}
        >
          {label}
        </div>
      ))}
    </div>
  );
}

export default Tab;
