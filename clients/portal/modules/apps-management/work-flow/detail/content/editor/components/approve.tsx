import React, { useRef, useState } from 'react';
import cs from 'classnames';

import useObservable from '@lib/hooks/use-observable';

import store, { updateStore, Data, StoreValue } from '../store';
import NodeHeader from './_common/node-header';
import NodeRemover from './_common/node-remover';
import usePositionChange from './usePositionChange';

interface Props {
  data: Data;
  id: string;
  xPos: number;
  yPos: number;
}

export default function ApproveNodeComponent({ data, id, xPos, yPos }: Props) {
  const { errors } = useObservable<StoreValue>(store) || {};
  const lastTime = useRef(+new Date());
  const [showRemover, setShowRemover] = useState(false);

  usePositionChange({ xPos, yPos, id });

  const { nodeData, businessData: { basicConfig } } = data;

  function onMouseUp() {
    if (+new Date - lastTime.current < 200) {
      updateStore(null, () => ({ asideDrawerType: id }));
    }
  }

  function getRule() {
    return `常规审批; ${basicConfig.multiplePersonWay === 'or' ? '或签' : '会签'}`;
  }

  function getPerson() {
    return [
      ...basicConfig.approvePersons.users,
      ...basicConfig.approvePersons.departments,
    ].map((v) => v.ownerName || v.departmentName).join('; ');
  }

  function onMouseEnter() {
    setShowRemover(true);
  }

  function onMouseLeave() {
    setShowRemover(false);
  }

  const hasApproveRule = !!basicConfig.multiplePersonWay;
  const hasApprovePerson = !!basicConfig.approvePersons.departments.length ||
    !!basicConfig.approvePersons.users.length;

  const hasError = id === errors?.publish?.data?.id;

  return (
    <div
      className={cs(
        'shadow-title rounded-tl-8 rounded-tr-8 rounded-br-2',
        'rounded-bl-8 bg-white flex flex-col border relative',
        {
          'border-red-600 border-dashed animate-node-error': hasError,
        }
      )}
      style={{
        width: nodeData.width,
        height: nodeData.height,
      }}
      onMouseDown={() => lastTime.current = +new Date()}
      onMouseUp={onMouseUp}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative">
        <NodeHeader
          title={nodeData.name}
          id={id}
          iconName="approves"
          className="bg-indigo-500"
          iconClassName="text-white"
          titleClassName="text-white bg-indigo-500"
        />
        <NodeRemover visible={showRemover} id={id} type="light" />
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
