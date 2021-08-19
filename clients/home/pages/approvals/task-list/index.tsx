import React from 'react';
import { observer } from 'mobx-react';
import Loading from '@c/loading';
import Store from '../base-store';

import TaskCard from './task-card';
import NoData from './no-data';

interface Props {
  className?: string;
  store: Store;
  tasks: Array<ApprovalTask>;
  taskType: 'my_applies' | 'todo' | 'done' | 'cc_to_me' | 'all',
  type: 'APPLY_PAGE' | 'WAIT_HANDLE_PAGE' | 'HANDLED_PAGE' | 'CC_PAGE' | 'ALL_PAGE'
}

const tipsMap = {
  my_applies: '未发起过工作流',
  todo: '暂无需要处理的工作流',
  done: '未处理过工作流',
  cc_to_me: '暂无抄送给我的工作流',
  all: '',
};

function TaskList({ tasks, type, store, className, taskType }: Props): JSX.Element {
  if (store.loading) {
    return <Loading />;
  }

  if (!tasks.length) {
    return <NoData tips={tipsMap[taskType] || '暂无工作流'} />;
  }

  return (
    <div className={className}>
      {tasks.map((task, idx) => {
        return (<TaskCard key={[task.id, idx].join('-')} task={task} type={type} />);
      })}
    </div>
  );
}

export default observer(TaskList);
