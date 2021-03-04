import React from 'react'
import classnames from 'classnames'
import useCss from 'react-use/lib/useCss'

import { TextHeader } from './TextHeader'

export interface ICard {
  title: string
  desc?: string
  action?: JSX.Element
  content?: JSX.Element
  className?: string
  headerClassName?: string
  children?: JSX.Element
}

export const Card = ({
  title,
  action,
  content,
  className,
  desc,
  children,
  headerClassName,
}: ICard) => {
  const classNames = useCss({
    'backdrop-filter': 'blur(120px)',
    'border-radius': '12px',
  })

  return (
    <div className={classnames('bg-white-dot-6-5 m-2', classNames, className)}>
      <TextHeader title={title} desc={desc} action={action} className={headerClassName} />
      {(content || children) && <main className="flex-1">{content || children}</main>}
    </div>
  )
}
