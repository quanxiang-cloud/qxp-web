import React from 'react'

import useCss from 'react-use/lib/useCss'

export interface ICard {
  title: string
  desc?: string
  action: JSX.Element
  content: JSX.Element
  className?: string
}

export const Card = ({ title, action, content, className, desc }: ICard) => {
  const classNames = useCss({
    'backdrop-filter': 'blur(120px)',
    'border-radius': '12px',
  })

  return (
    <div
      className={`px-1-dot-6 py-4 bg-white-dot-6-5 m-2 ${className ? className : ''} ${classNames}`}
    >
      <header className="flex justify-between items-center pb-4">
        <div className="font-bold text-dot-8 color-0F172A flex justify-between items-center">
          {title}
          {desc && <span className="ml-dot-2">{desc}</span>}
        </div>
        {action}
      </header>
      <main className="flex-1">{content}</main>
    </div>
  )
}
