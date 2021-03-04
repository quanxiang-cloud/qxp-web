import React from 'react'
import classnames from 'classnames'

import { ItemWithTitleDesc } from './ItemWithTitleDesc'

export interface ITextHeader {
  className?: string
  title: string
  desc?: string
  action?: JSX.Element | string
}

export const TextHeader = ({ className, title, desc, action }: ITextHeader) => {
  return (
    <header className={classnames('flex justify-between items-center pb-4', className)}>
      <ItemWithTitleDesc
        desc={desc}
        itemRender={() => (
          <div className="font-bold text-dot-8 text-0F172A flex justify-between items-center">
            {title}
          </div>
        )}
        descClassName="transition-all duration-300 ease-linear text-dot-6 text-697886"
      />
      {action}
    </header>
  )
}
