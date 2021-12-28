import React, { useRef, useEffect } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';

import Icon from '@c/icon';
import Popper from '@c/popper';
import BtnBadge from '@c/btn-badge';

import UnreadTaskBox from './unread-task-box';

import { NavTaskBarContext } from './context';
import { useTaskComplete } from './utils';
import { getTaskList, subscribe } from './api';
import store from './store';

import './index.scss';

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
  useEffect(() => {
    store.refreshInProgressCount().then((inProgressCount) => {
      if (inProgressCount > 0) {
        getTaskList({ limit: 100, page: 1, status: 1 }).then((taskList) => {
          taskList.map(({ id }) => subscribe(id));
        });
      }
    });
  }, []);

  const toggleRef = useRef<HTMLDivElement>(null);
  useTaskComplete('refresh-task-in-progress-count', () => store.refreshInProgressCount());

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
        {!!store.inProgressCount && <BtnBadge className='task_count_btn' count={store.inProgressCount} />}
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