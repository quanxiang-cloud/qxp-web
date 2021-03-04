import React, { MouseEvent } from 'react'

import { twCascade } from '@mariusmarais/tailwind-cascade'

export interface IItemWithTitleDesc {
  title?: string
  desc?: string
  itemRender: () => JSX.Element
  titleClassName?: string
  descClassName?: string
  textDirection?: 'row' | 'col'
  onClick?: (event: MouseEvent<HTMLDivElement>) => void
}

export const ItemWithTitleDesc = ({
  title,
  desc,
  itemRender,
  titleClassName,
  descClassName,
  textDirection,
  onClick = () => {},
}: IItemWithTitleDesc) => {
  return (
    <div className="flex justify-start items-center" onClick={onClick}>
      {itemRender()}
      <div
        className={twCascade('justify-between ml-dot-4 flex flex-1 transition duration-300', {
          'flex-row': textDirection == 'row',
          'flex-col': textDirection != 'row',
        })}
      >
        {title && <div className={twCascade('text-base', titleClassName)}>{title}</div>}
        {desc && (
          <span className={twCascade('flex items-center text-dot-6', descClassName)}>{desc}</span>
        )}
      </div>
    </div>
  )
}
