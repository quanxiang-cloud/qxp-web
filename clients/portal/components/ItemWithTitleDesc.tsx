import React from 'react'
import classnames from 'classnames'

export interface IItemWithTitleDesc {
  title: string
  desc?: string
  itemRender: () => JSX.Element
  titleClassName?: string
  descClassName?: string
  textDirection?: 'row' | 'col'
}

export const ItemWithTitleDesc = ({
  title,
  desc,
  itemRender,
  titleClassName,
  descClassName,
  textDirection,
}: IItemWithTitleDesc) => {
  return (
    <div className="flex justify-start items-center">
      {itemRender()}
      <div
        className={classnames('justify-between ml-dot-4 flex flex-1', {
          'flex-row': textDirection == 'row',
          'flex-col': textDirection != 'row',
        })}
      >
        <div className={classnames('text-base', titleClassName)}>{title}</div>
        {desc && (
          <span className={classnames('flex items-center text-dot-6', descClassName)}>{desc}</span>
        )}
      </div>
    </div>
  )
}
