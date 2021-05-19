import React from 'react';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';

import Avatar from '../avatar';
import Status from '@c/status';
import Icon from '@c/icon';

import './index.scss';

interface Props {
  task: ApprovalTask;
}

function getEnumLabelFromSchema(schema: Record<string, any>, key: string, value: string) {
  const enumData = schema?.[key]?.enum || [];
  if (enumData.length) {
    return (enumData.find((v: { value: any }) => v.value === value))?.label || value;
  }
  return value;
}

export default function TaskCard({ task }: Props): JSX.Element {
  const history = useHistory();

  function handleClick() {
    history.push(`/approvals/${task.processInstanceId}/${task.id}`);
  }

  const { name, createTime, flowInstanceEntity } = task;

  return (
    <div className="corner-2-8-8-8 bg-white mb-16 approval-card">
      <div className="flex">
        <div className="left-info p-20 cursor-pointer" onClick={handleClick}>
          <div className="flex flex-col justify-between">
            <div className="flex justify-between">
              <div>
                <Avatar name={flowInstanceEntity?.creatorName || ''} link={flowInstanceEntity?.creatorAvatar} />
                <div className="inline-flex task-info">
                  <span className="mr-8">{flowInstanceEntity?.creatorName || ''}</span>
                  <span>·</span>
                  <span className="ml-8">{flowInstanceEntity.name}</span>
                </div>
              </div>
              {/* @ts-ignore */}
              <Status value={flowInstanceEntity?.status} className='task-status' />
            </div>

            <div className="flex mt-24 bottom-info">
              <span>
                <span className="info-label"><Icon name="trending_up" className="mr-6" />当前节点: </span>
                <span>{name}</span>
              </span>
              <span>
                <span className="info-label"><Icon name="layers" className="mr-6" />应用: </span>
                <span>{flowInstanceEntity?.appName}</span>
              </span>
            </div>
          </div>
        </div>
        <div className="right-info px-20 py-12 flex flex-1 justify-between pl-40">
          <div className="flex flex-col">
            {
              Object.entries(flowInstanceEntity?.formData || {}).map(([keyName, value]) => {
                const properties = flowInstanceEntity?.formSchema?.properties as Record<string, any>;
                if (!properties[keyName] || properties[keyName]?.display === false) {
                  return null;
                }
                return (
                  <p key={keyName} className="mb-4 form-data-item">
                    <span>{properties[keyName]?.title || keyName}: </span><span>{getEnumLabelFromSchema(properties, keyName, value)}</span>
                  </p>
                );
              })
            }
          </div>
          <div className="create-time">
            接收于: {dayjs(createTime).format('YYYY-MM-DD HH:mm')}
          </div>
        </div>
      </div>
    </div>
  );
}
