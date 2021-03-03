import React from 'react'
import classnames from 'classnames'

import { UUIDGeneratorBrowser } from '@assets/lib/f'

export interface IList {
  items: JSX.Element[]
  itemClassName?: string
  className?: string
}

export const List = ({ className, itemClassName, items }: IList) => {
  return (
    <ul className={classnames('flex', className)}>
      {items.map((item) => {
        return (
          <li key={UUIDGeneratorBrowser()} className={classnames(itemClassName)}>
            {item}
          </li>
        )
      })}
    </ul>
  )
}
