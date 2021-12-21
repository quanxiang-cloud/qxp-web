import React, { useRef } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';

import Icon from '@c/icon';
import Popper from '@c/popper';

import UnreadTaskBox from './unread-task-box';

import './index.scss';
import { NavTaskBarContext } from './context';

type Props = {
  type?: string
  className?: string;
}

const modifiers = [
  {
    name: 'offset',
    options: {
      offset: [30, -30],
    },
  },
];

const NavTaskBar = ({ type, className }: Props): JSX.Element => {
  const toggleRef = useRef<HTMLDivElement>(null);

  return (
    <div className={cs('group task-wrap', className)}>
      <div
        ref={toggleRef}
        className={cs(
          'relative cursor-pointer text-blue-100 nav-item',
          {
            'text-gray-50 group-hover:bg-blue-500': type === 'home',
            'text-gray-400 group-hover:bg-gray-100 hover:text-gray-600': type !== 'home',
          },
        )}
      >
        <Icon
          size={20}
          name="task"
          style={{ fill: `${type !== 'home' ? 'var(--gray-400)' : 'var(--blue-100)'}` }}
          className="m-6"
        />
      </div>
      <NavTaskBarContext.Provider value={{ type }}>
        <Popper
          trigger='hover'
          reference={toggleRef}
          modifiers={modifiers}
        >
          <UnreadTaskBox />
        </Popper>
      </NavTaskBarContext.Provider>
    </div>
  );
};

export default observer(NavTaskBar);
