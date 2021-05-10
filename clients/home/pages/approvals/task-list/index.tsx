import React from 'react';
import { observer } from 'mobx-react';
import Loading from '@c/loading';
import Store from '../base-store';

import TaskCard from './task-card';

interface Props {
  className?: string;
  store: Store;
  tasks: Array<ApprovalTask>;
}

function TaskList({ tasks, store, className }: Props) {
  if (store.loading) {
    return <Loading />
  }

  return (
    <div className={className}>
      {tasks.map((task) => {
        return (<TaskCard key={task.id} task={task} />);
      })}
    </div>
  );
}

export default observer(TaskList);
