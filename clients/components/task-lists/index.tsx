import React, { useRef, useEffect, ForwardedRef } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';

import Icon from '@c/icon';
import Modal from '@c/modal';
import Popper from '@c/popper';
import BtnBadge from '@c/btn-badge';

import UnreadTaskBox from './unread-task-box';

import { NavTaskBarContext } from './context';
import { useTaskComplete } from './utils';
import { getTaskList, subscribe } from './api';
import store from './store';

import './index.scss';

interface Props extends React.HTMLProps<HTMLDivElement> {
  type?: string
  className?: string;
  'data-in-canvas'?: boolean;
}

const modifiers = [
  {
    name: 'offset',
    options: {
      offset: [30, -30],
    },
  },
];

const NavTaskBar = ({ type, className, ...rest }: Props, ref?: ForwardedRef<HTMLDivElement>): JSX.Element => {
  const history = useHistory();
  useEffect(() => {
    store.refreshInProgressCount().then((inProgressCount) => {
      if (inProgressCount > 0) {
        getTaskList({ limit: 100, page: 1, status: 1 }).then((taskList) => {
          taskList.map(({ id }) => subscribe(id));
        });
      }
    });
  }, []);

  const dataInCanvas = !!rest['data-in-canvas'];
  const toggleRef = useRef<HTMLDivElement>(null);
  useTaskComplete('refresh-task-in-progress-count', () => store.refreshInProgressCount());

  return (
    <>
      <div ref={ref} {...rest} className={cs('group task-wrap', className)}>
        <div
          ref={toggleRef}
          className={cs(
            'relative cursor-pointer text-blue-100 nav-item',
            {
              'text-gray-50 group-hover:bg-enfi-500': type === 'home',
              'text-gray-400 group-hover:bg-gray-100 hover:text-gray-600': type !== 'home',
            },
          )}
        >
          <Icon
            size={20}
            name="task"
            style={{ fill: 'var(--gray-400)' }}
            className="m-6"
          />
          {!!store.inProgressCount && <BtnBadge className='task_count_btn' count={store.inProgressCount} />}
        </div>
        {!dataInCanvas && !store.showJumpModal && (
          <NavTaskBarContext.Provider value={{ type }}>
            <Popper
              trigger='hover'
              reference={toggleRef}
              modifiers={modifiers}
            >
              <UnreadTaskBox />
            </Popper>
          </NavTaskBarContext.Provider>
        )}
      </div>
      {!dataInCanvas && store.showJumpModal && (
        <Modal
          title="提示"
          onClose={() => store.showJumpModal = false}
          footerBtns={[
            {
              text: '取消',
              key: 'cancel',
              iconName: 'close',
              onClick: () => store.showJumpModal = false,
            },
            {
              text: '确定',
              key: 'confirm',
              modifier: 'primary',
              iconName: 'check',
              onClick: () => {
                const { value } = store.currentTask as Qxp.TaskItem;
                history.push(`/apps/${value.appID}?pageID=${value.tableID}`);
                store.showJumpModal = false;
              },
            },
          ]}
        >
          <div className='py-24 px-40'>
            <div className='flex text-yellow-600 text-14 items-center font-semibold'>
              <Icon size={20} name="info" className="mr-8"/>
              <div>确认要离开吗？</div>
            </div>
            <div className='text-gray-900 text-14 ml-28 mt-8'>当前页面数据未提交，离开后将丢失更改。</div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default observer(React.forwardRef<HTMLDivElement, Props>(NavTaskBar));
