import React from 'react';
import useCss from 'react-use/lib/useCss';
import cs from 'classnames';

export interface Props {
  active: boolean;
}

export default function Hamburger({ active }: Props) {
  const activeClassName = {
    '& > div > div:nth-child(1)': {
      transform: 'translateY(5.8px) rotate(45deg)',
    },
    '& > div > div:nth-child(2)': {
      opacity: 0,
    },
    '& > div > div:nth-child(3)': {
      transform: 'translateY(-5.8px) rotate(-45deg)',
    },
  };
  const className = {
    hamburger: cs(useCss({
      width: '24px',
      height: '24px',
      cursor: 'pointer',
      ...(active ? activeClassName : {}),
    }), 'flex justify-center items-center'),
    line: useCss({
      display: 'block',
      width: '18px',
      height: '3px',
      'border-radius': '4px',
      'background-color': 'var(--gray-600)',
      '&:not(:last-child)': {
        'margin-bottom': '3px',
      },
      '-webkit-transition': 'all .3s ease-in-out',
      transition: 'all .3s ease-in-out',
    }),
  };

  return (
    <div className={className.hamburger}>
      <div>
        <div className={className.line}></div>
        <div className={className.line}></div>
        <div className={className.line}></div>
      </div>
    </div>
  );
}

