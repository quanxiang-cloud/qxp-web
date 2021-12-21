import React from 'react';
import { observer } from 'mobx-react';

import TaskList from './task-list';

function UnreadTaskBox(): JSX.Element {
  return (
    <div className='task-box'>
      <div className='task-header'>
        <div className="text-h5 font-semibold">
          <span>多任务列表</span>
        </div>
      </div>
      <TaskList/>
    </div>
  );
}

export default observer(UnreadTaskBox);
