import React, { Dispatch, SetStateAction } from 'react'
import { Link } from 'react-router-dom'

import { PersonalSettingMenu } from './PersonalSettingMenu'
import { Hamburger } from './Hamburger'

export interface IHeader {
  onMenuToggle: Dispatch<SetStateAction<boolean | null>>
  getSetter: (f: Function) => void
}

export const Header = ({ onMenuToggle, getSetter }: IHeader) => {
  return (
    <div className="mx-auto flex justify-between h-13 py-dot-8 px-1-dot-2 bg-white text-dot-7">
      <div className="flex justify-between items-center">
        <div className="mr-8 flex justify-between items-center">
          <Hamburger onChange={onMenuToggle} getSetter={getSetter} />
          <span className="ml-dot-3-5">平台管理</span>
        </div>
        <div>
          <Link to="/">工作台</Link>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <img className="w-6 h-6" src="/dist/images/logo.svg" alt="logo" />
        <img src="/dist/images/qxy-text.svg" alt="qxy-text" className="w-12 h-4 ml-dot-6" />
      </div>
      <div className="flex justify-between items-center">
        <div className="flex justify-between items-center mr-2-dot-8">
          <img className="w-4 h-4 mr-dot-2" src="/dist/images/book.svg" alt="help documentation" />
          <span>帮助文档</span>
        </div>
        <div className="flex justify-between items-center">
          <img className="w-5 h-5 mr-dot-2" src="/dist/images/settings.svg" alt="settings" />
          <PersonalSettingMenu />
        </div>
      </div>
    </div>
  )
}
