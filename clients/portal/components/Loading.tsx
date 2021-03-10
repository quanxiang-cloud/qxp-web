import React from 'react'
import { Loading as LegoLoading } from '@QCFE/lego-ui'
import { twCascade } from '@mariusmarais/tailwind-cascade'

export interface ILoading {
  desc?: string | JSX.Element
  className?: string
}

export const Loading = ({ desc = 'Loading...', className }: ILoading) => {
  return (
    <div
      className={twCascade(
        'w-full h-full flex flex-col items-center justify-center py-4',
        className,
      )}
    >
      <LegoLoading />
      <span>{desc}</span>
    </div>
  )
}
