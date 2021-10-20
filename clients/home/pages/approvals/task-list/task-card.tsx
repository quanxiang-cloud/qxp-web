import React from 'react';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import { map, get } from 'lodash';
import duration from 'dayjs/plugin/duration';

import Status from '@c/process-node-status';
import Icon from '@c/icon';
import { getBasicValue } from '@c/form-data-value-renderer';

import Avatar from '../avatar';
import './index.scss';

interface Props {
  task: ApprovalTask;
  type: 'APPLY_PAGE' | 'WAIT_HANDLE_PAGE' | 'HANDLED_PAGE' | 'CC_PAGE' | 'ALL_PAGE';
}

dayjs.extend(duration);

function formatOverTime(dueDate?: string): string {
  if (!dueDate) {
    return '';
  }

  if (dayjs().isBefore(dueDate)) {
    return '';
  }

  const duration = dayjs.duration(dayjs().diff(dayjs(dueDate)));
  return [
    [duration.years(), '年'],
    [duration.months(), '月'],
    [duration.days(), '天'],
    [duration.hours(), '小时'],
    [duration.minutes(), '分钟'],
  ].filter(([length]) => !!length).map(([length, unit]) => `${length}${unit}`).join('');
}

export default function TaskCard({ task, type }: Props): JSX.Element {
  const history = useHistory();
  const multiTask = ['ALL_PAGE', 'APPLY_PAGE', 'HANDLED_PAGE'].includes(type);

  const handleClick = (): void => {
    const procInstId = multiTask ? task.processInstanceId : task.flowInstanceEntity.processInstanceId;
    history.push(`/approvals/${procInstId}/${task.id}/${type}`);
  };

  const getCurTaskName = (): string => {
    if (['WAIT_HANDLE_PAGE', 'CC_PAGE'].includes(type)) {
      // 任务维度，节点名取第一层级的name
      return task.name;
    } else {
      // 流程维度，节点名取nodes.taskName
      return map(task?.nodes || [], 'taskName').join(', ');
    }
  };

  const {
    name, flowInstanceEntity, startTime, createTime, creatorName, creatorAvatar, appName, formData,
    formSchema, status, keyFields, dueDate, urgeNum,
  } = task;
  const taskCardData = (multiTask ? formData : flowInstanceEntity?.formData) || {};
  const properties = (multiTask ? formSchema?.properties : flowInstanceEntity?.formSchema?.properties) || {};
  const taskKeyFields = (multiTask ? keyFields : flowInstanceEntity?.keyFields) || [];
  const filterTaskKeyFields = taskKeyFields.filter(
    (keyField) => keyField in properties,
  );

  return (
    <div className="corner-2-8-8-8 bg-white mb-16 approval-card">
      <div className="flex">
        <div className="left-info p-20 cursor-pointer" onClick={handleClick}>
          <div className="flex flex-col justify-between">
            <div className="flex justify-between">
              <div className="flex items-center">
                <Avatar
                  name={multiTask ? creatorName : flowInstanceEntity?.creatorName || ''}
                  link={multiTask ? creatorAvatar : flowInstanceEntity?.creatorAvatar}
                />
                <div className="inline-flex task-info">
                  <span className="mr-8">
                    {multiTask ? creatorName : flowInstanceEntity?.creatorName || ''}
                  </span>
                  <span>·</span>
                  <span className="ml-8">{multiTask ? name : flowInstanceEntity?.name}</span>
                </div>
              </div>
              {/* @ts-ignore */}
              <Status value={multiTask ? status : flowInstanceEntity?.status} className='task-status' />
            </div>

            <div className="flex mt-24 bottom-info">
              <div className="flex">
                <span className="info-label"><Icon name="trending_up" className="mr-6" />当前节点: </span>
                <div>{getCurTaskName()}</div>
              </div>
              <div className="flex">
                <span className="info-label"><Icon name="layers" className="mr-6" />应用: </span>
                <div>{multiTask ? appName : flowInstanceEntity?.appName}</div>
              </div>
            </div>

            <div className='flex mt-8'>
              {!!formatOverTime(dueDate) && (
                <div className='urge-card text-red-600 bg-red-50'>
                  超时：{formatOverTime(dueDate)}
                </div>
              )}
              {!!urgeNum && (
                <div className='urge-card text-yellow-600 bg-yellow-50'>
                  被催办+{urgeNum}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="right-info px-20 py-12 flex flex-1 justify-between pl-40 overflow-hidden">
          <div className="flex flex-col">
            {
              filterTaskKeyFields.slice(0, 6).map((taskCardName) => {
                const taskCardField = get(properties, taskCardName, {});
                return (
                  <p key={taskCardName} className="mb-4 form-data-item">
                    <span>{taskCardField?.title || taskCardName}: </span>
                    <span>{getBasicValue(taskCardField, taskCardData[taskCardName])}</span>
                  </p>
                );
              })
            }
          </div>
          <div className="create-time whitespace-nowrap">
            接收于: {dayjs(multiTask ? createTime : startTime).format('YYYY-MM-DD HH:mm')}
          </div>
        </div>
      </div>
    </div>
  );
}
