import React from 'react'
import useCss from 'react-use/lib/useCss'
import { twCascade } from '@mariusmarais/tailwind-cascade'

import { TextHeader } from './TextHeader'

export interface ICard {
  title: string | JSX.Element
  desc?: string
  action?: string | JSX.Element
  content?: JSX.Element
  className?: string
  headerClassName?: string
  children?: JSX.Element
  headerActionClassName?: string
  contentClassName?: string
  style?: Record<string, string>
}

export const Card = ({
  title,
  action,
  content,
  className,
  desc,
  children,
  headerClassName,
  headerActionClassName,
  contentClassName,
  style,
}: ICard) => {
  const classNames = useCss({
    'backdrop-filter': 'blur(120px)',
    'border-radius': '12px',
  })

  return (
    <div style={style} className={twCascade('bg-white-dot-6-5 m-2', classNames, className)}>
      <TextHeader
        title={title}
        desc={desc}
        action={action}
        actionClassName={headerActionClassName}
        className={headerClassName}
      />
      {(content || children) && (
        <main className={twCascade('flex-1', contentClassName)}>{content || children}</main>
      )}
    </div>
  )
}
