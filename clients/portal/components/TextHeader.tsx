import React from 'react'
import { twCascade } from '@mariusmarais/tailwind-cascade'

import { ItemWithTitleDesc } from './ItemWithTitleDesc'
import { isString } from '@assets/lib/f'

export interface ITextHeader {
  className?: string
  title: string
  desc?: string
  action?: JSX.Element | string
}

export const TextHeader = ({ className, title, desc, action }: ITextHeader) => {
  return (
    <header
      className={twCascade(
        'flex justify-between items-center pb-4 header-background-image opacity-95',
        className,
      )}
    >
      <ItemWithTitleDesc
        desc={desc}
        itemRender={() => (
          <div className="font-bold text-dot-8 text-0F172A flex justify-between items-center">
            {title}
          </div>
        )}
        descClassName="transition-all duration-300 ease-linear text-dot-6 text-697886"
      />
      {isString(action) && (
        <a className="transition-all duration-300 ease-linear text-dot-7 underline text-324558">
          {action}
        </a>
      )}
      {!isString(action) && action}
    </header>
  )
}
