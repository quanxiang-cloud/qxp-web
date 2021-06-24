import React, { useRef, useState, useEffect } from 'react';
import cs from 'classnames';

import useObservable from '@lib/hooks/use-observable';
import type { Data, FillInData, StoreValue } from '@flowEditor/type';

import store from '../store';
import NodeHeader from './_common/node-header';
import NodeRemover from './_common/node-remover';
import usePositionChange from './hooks/use-node-position-change';
import useNodeSwitch from './hooks/use-node-switch';

interface Props {
  data: Data;
  id: string;
  xPos: number;
  yPos: number;
  isDragging: boolean;
}

export default function FillInNodeComponent({ data, id, xPos, yPos, isDragging }: Props): JSX.Element {
  const { errors, nodeIdForDrawerForm } = useObservable<StoreValue>(store);
  const lastTime = useRef(+new Date());
  const [showRemover, setShowRemover] = useState(false);
  const switcher = useNodeSwitch();
  usePositionChange({ id, xPos, yPos }, isDragging);
  useEffect(() => {
    nodeIdForDrawerForm && setShowRemover(false);
  }, [nodeIdForDrawerForm]);

  const { nodeData, businessData } = data;

  const { basicConfig } = businessData as FillInData;

  function onMouseUp(): void {
    if (+new Date - lastTime.current < 200) {
      switcher(id);
    }
  }

  function getRule(): string {
    return `常规填写; ${basicConfig.multiplePersonWay === 'or' ? '任填' : '全填'}`;
  }

  function getPerson(): string {
    return [
      ...basicConfig.approvePersons.users,
      ...basicConfig.approvePersons.departments,
    ].map((v) => v.ownerName || v.departmentName).join('; ');
  }

  function onMouseEnter(): void {
    setShowRemover(true);
  }

  function onMouseLeave(): void {
    setShowRemover(false);
  }

  const hasFillInRule = !!basicConfig.multiplePersonWay;
  const hasFillInPerson = !!basicConfig.approvePersons.departments.length ||
    !!basicConfig.approvePersons.users.length;

  const hasError = id === errors?.publish?.data?.id;

  return (
    <div
      className={cs(
        'shadow-title rounded-tl-8 rounded-tr-8 rounded-br-2',
        'rounded-bl-8 bg-white flex flex-col cursor-pointer',
        {
          'border-red-600 border-dashed animate-node-error': hasError,
        },
      )}
      style={{
        width: nodeData.width,
        minHeight: nodeData.height,
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
          className="bg-teal-500"
          iconName="edit"
          iconClassName="text-white"
          titleClassName="text-white bg-teal-500"
        />
        <NodeRemover
          onVisibilityChange={setShowRemover}
          visible={showRemover}
          id={id}
          type="light"
        />
      </div>
      <footer className="p-8 flex items-center flex-1">
        {(hasFillInRule || hasFillInPerson) && (
          <div
            className="bg-gray-100 py-4 px-8 rounded-4 flex flex-col justify-center w-full"
          >
            {hasFillInRule && (
              <div className="text-caption-no-color text-gray-400">
                规则: <span className="text-gray-600">{getRule()}</span>
              </div>
            )}
            {hasFillInPerson && (
              <div className="text-caption-no-color text-gray-400">
                填写人: <span className="text-gray-600">{getPerson()}</span>
              </div>
            )}
          </div>
        )}
        {!hasFillInPerson && !hasFillInRule && (
          <span className="text-caption text-gray-400 px-4">设置填写规则</span>
        )}
      </footer>
    </div>
  );
}
