import React, { useState, useEffect } from 'react'

import useCss from 'react-use/lib/useCss'

export interface IHamburger {
  onChange: (active: boolean) => void
  getSetter: (f: Function) => void
}

export const Hamburger = ({ onChange, getSetter }: IHamburger) => {
  const [active, setActive] = useState<boolean>(false)
  useEffect(() => {
    getSetter(setActive)
  }, [setActive])
  const activeClassName = {
    '& > div:nth-child(1)': {
      transform: 'translateY(4.5px) rotate(45deg)',
    },
    '& > div:nth-child(2)': {
      opacity: 0,
    },
    '& > div:nth-child(3)': {
      transform: 'translateY(-4.5px) rotate(-45deg)',
    },
  }
  const className = {
    hamburger: useCss({
      width: '18px',
      cursor: 'pointer',
      ...(active ? activeClassName : {}),
    }),
    line: useCss({
      display: 'block',
      width: '100%',
      height: '2px',
      'border-radius': '4px',
      'background-color': '#1E293B',
      '&:not(:last-child)': {
        'margin-bottom': '3px',
      },
      '-webkit-transition': 'all .3s ease-in-out',
      transition: 'all .3s ease-in-out',
    }),
  }

  const onToggle = () => {
    onChange(!active)
    setActive((v) => !v)
  }

  return (
    <div className={className.hamburger} onClick={onToggle}>
      <div className={className.line}></div>
      <div className={className.line}></div>
      <div className={className.line}></div>
    </div>
  )
}
