import React, { useEffect, useState } from 'react';
import { Props } from '@m/qxp-ui-mobile';
import cs from 'classnames';

import './index.scss';
import Avatar from '@m/qxp-ui-mobile/avatar';
import FlowStatus from '@m/components/flow-status';
import { FlowType, Task } from '@m/pages/approvals/tab/types';
import { computeTaskTag, TaskTag } from './utils';

export interface TaskCardProps extends Props {
  task: Task;
  type: FlowType;
}

export default function TaskCard(props: TaskCardProps): JSX.Element | null {
  const { task, type } = props;
  const [taskTag, setTaskTag] = useState<TaskTag>({});
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    setTaskTag(computeTaskTag(task));
    setDeleted(!!task.isDeleted);
  }, [props.task]);

  if (deleted) return null;

  return (
    <div className={cs('task-card bg-white pointer-shadow padding-16',
      props.className,
      { 'opacity-60': type === 'CC_PAGE' && task.handled === 'COMPLETED' },
    )}
    style={props.style}>

      <div className='flex justify-center'>
        <Avatar size='.24rem' name={task.creatorName} />
        <div className='flex-1 title3 text-black truncate ml-8 mr-8'>
          {task.creatorName ? `${task.creatorName}${task.name ? ' · ' + task.name : ''}` : task.name}
        </div>
        {!!task.status && (<FlowStatus
          desc={type === 'WAIT_HANDLE_PAGE' ? task.description : undefined}
          status={task.status}/>)}
      </div>

      {!!task.nodeName && (<div className="task-node-row body1 text-placeholder mt-8">
        当前节点：
        <span className="text-secondary">{task.nodeName}</span>
      </div>)}

      {!!task.flowSummary && (<div className="task-flow-summary body1 text-placeholder mt-8">
        流程摘要：
        <span className="text-secondary">{task.flowSummary}</span>
      </div>)}

      {!!task.flowSummaryPair?.length && task.flowSummaryPair.map((item) => {
        return (
          <div
            className="task-flow-summary-pair body1 text-second content-center mt-6"
            key={item.key}>
            {item.key}：
            {!!item.value && <div className="text-primary truncate flex-1">{item.value}</div>}
            {!item.value && <div className="text-placeholder flex-1">未填写</div>}
          </div>
        );
      })}

      {!!(taskTag.overTime || taskTag.urgeTime) && (<div className="task-tag-wrapper caption">
        {!!taskTag.overTime && (<div className="task-tag-item task-tag__overtime mt-8">
          {taskTag.overTime}
        </div>)}
        {!!taskTag.urgeTime && (<div className="task-tag-item task-tag__urgeTime mt-8">
          {taskTag.urgeTime}
        </div>)}
      </div>)}

      {props.children}

    </div>
  );
}
