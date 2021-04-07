import React from 'react';
import cs from 'classnames';

type Nav = {
  name: string;
  key: string;
}

type Props = {
  activeNav: string;
  onChange: (key: string) => void;
  navList: Nav[]
}

function SettingNav({ activeNav, onChange, navList }: Props) {
  return (
    <div className='app-setting-nav-box'>
      {navList.map(({ name, key }) => (
        <div
          onClick={() => onChange(key)}
          className={cs('app-setting-nav-item text-h6', { 'select-nav-active': activeNav === key })}
          key={key}
        >{name}</div>
      ))}
    </div>
  );
}

export default SettingNav;
