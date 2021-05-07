import React, { useRef } from 'react';
import cs from 'classnames';

import { updateStore, Data } from '../store';
import NodeHeader from './_common/node-header';
import NodeRemover from './_common/node-remover';

interface Props {
  data: Data;
  id: string;
}

export default function ApproveNodeComponent({ data, id }: Props) {
  const lastTime = useRef(+new Date());

  const { nodeData, businessData: { basicConfig } } = data;

  function onMouseUp() {
    if (+new Date - lastTime.current < 100) {
      updateStore(null, () => ({ asideDrawerType: 'approveForm' }));
    }
  }

  function getRule() {
    return `常规审批; ${basicConfig.multiplePersonWay === 'or' ? '或签' : '会签'}`;
  }

  function getPerson() {
    return [
      ...basicConfig.persons.employees,
      ...basicConfig.persons.departments,
    ].map((v) => v.ownerName || v.departmentName).join('; ');
  }

  const hasApproveRule = !!basicConfig.multiplePersonWay;
  const hasApprovePerson = !!basicConfig.persons.departments.length ||
    !!basicConfig.persons.employees.length;

  return (
    <div
      className={cs(
        'shadow-title rounded-tl-8 rounded-tr-8 rounded-br-2',
        'rounded-bl-8 bg-white flex flex-col',
        `w-${nodeData.width}`, `m-h-${nodeData.height}`
      )}
      onMouseDown={() => lastTime.current = +new Date()}
      onMouseUp={onMouseUp}
    >
      <div className="relative">
        <NodeHeader
          title={nodeData.name}
          type="approve"
          iconName="approves"
          className="bg-indigo-500"
          iconClassName="text-white"
          titleClassName="text-white bg-indigo-500"
        />
        <NodeRemover id={id} type="light" />
      </div>
      <footer className="p-8 flex flex-1 flex-col justify-center">
        {(hasApproveRule || hasApprovePerson) && (
          <div
            className="bg-gray-100 py-4 px-8 rounded-4 flex flex-col justify-center"
          >
            {hasApproveRule && (
              <div className="text-caption-no-color text-gray-400">
                规则: <span className="text-gray-600">{getRule()}</span>
              </div>
            )}
            {hasApprovePerson && (
              <div className="text-caption-no-color text-gray-400">
                审批人: <span className="text-gray-600">{getPerson()}</span>
              </div>
            )}
          </div>
        )}
        {!hasApprovePerson && !hasApproveRule && (
          <span className="text-caption text-gray-400 px-4">设置审批规则</span>
        )}
      </footer>
    </div>
  );
}
