import React from 'react'
import useCss from 'react-use/lib/useCss'
import { twCascade } from '@mariusmarais/tailwind-cascade'

export interface IDot {
  className?: string
}

export const Dot = ({ className }: IDot) => {
  const dotItemClassName = useCss({
    width: '0.1665rem',
    height: '0.1665rem',
    background: '#375FF3',
    'border-radius': '50%',
    '&:not(:last-child)': {
      'margin-right': '0.125rem',
    },
  })

  return <div className={twCascade('flex', dotItemClassName, className)}></div>
}
