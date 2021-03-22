import React, { Dispatch, SetStateAction, useRef } from 'react';
import { Link } from 'react-router-dom';

import { PersonalSettingMenu } from './personal-setting-menu';
import { Hamburger } from './hamburger2';

export interface IHeader {
  onMenuToggle: Dispatch<SetStateAction<boolean | null>>;
  getSetter: (f: Function) => void;
}

export const Header = ({ onMenuToggle, getSetter }: IHeader) => {
  const hamburgerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="mx-auto flex justify-between h-6-dot-4 py-dot-8 px-1-dot-2 bg-white text-1-dot-4 global-header">
      <div className="flex justify-between items-center">
        <div
          className="mr-8 flex justify-between items-center cursor-pointer"
          onClick={() => hamburgerRef.current?.click()}
        >
          <Hamburger onChange={onMenuToggle} getSetter={getSetter} ref={hamburgerRef} />
          <span className="ml-dot-3-5">平台管理</span>
        </div>
        <div className="cursor-pointer">
          <Link to="/" className="flex justify-between items-center mr-2-dot-8 px-dot-8 py-dot-6
            hover-gong
          ">
            <img className="w-8 h-8 mr-dot-4" src="/dist/images/work-space.svg" />
            <span className="text-gray-600">工作台</span>
          </Link>
        </div>
      </div>
      <div className="flex justify-between items-center">
        {/* <img className="w-12 h-12" src="/dist/images/logo.svg" alt="logo" />
        <img src="/dist/images/qxy-text.svg" alt="qxy-text" className="w-24 h-6 ml-dot-6" /> */}
        <img className="" src="/dist/images/quanxiangyun.svg" alt="quanxiangyun" />
      </div>
      <div className="flex justify-between items-center">
        <div className="flex justify-between items-center mr-2-dot-8">
          <img className="w-8 h-8 mr-dot-4" src="/dist/images/book.svg" alt="help documentation" />
          <span>帮助文档</span>
        </div>
        <div className="flex justify-between items-center">
          <img className="w-10 h-10 mr-dot-4" src="/dist/images/settings.svg" alt="settings" />
          <PersonalSettingMenu />
        </div>
      </div>
    </div>
  );
};
