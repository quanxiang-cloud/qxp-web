import React, { useRef, useState } from 'react';
import cs from 'classnames';

import useObservable from '@lib/hooks/use-observable';
import type { Data, FillInData, StoreValue } from '@flow/content/editor/type';

import store from '../store';
import NodeHeader from './_common/node-header';
import NodeRemover from './_common/node-remover';
import { getPerson, getRule } from './_common/utils';
import usePositionChange from './hooks/use-node-position-change';
import useNodeSwitch from './hooks/use-node-switch';

interface Props {
  data: Data;
  id: string;
  xPos: number;
  yPos: number;
  isDragging: boolean;
}

export default function ApproveNodeComponent({ data, id, xPos, yPos, isDragging }: Props): JSX.Element {
  const { errors, readonly } = useObservable<StoreValue>(store);
  const lastTime = useRef(+new Date());
  const [showRemover, setShowRemover] = useState(false);
  const switcher = useNodeSwitch();

  usePositionChange({ xPos, yPos, id }, isDragging);

  const { nodeData, businessData } = data;

  const { basicConfig } = businessData as FillInData;

  function onMouseUp(): void {
    if (+new Date - lastTime.current < 200) {
      switcher(id);
    }
  }

  function onMouseEnter(): void {
    setShowRemover(true);
  }

  function onMouseLeave(): void {
    setShowRemover(false);
  }

  const hasApproveRule = !!basicConfig.multiplePersonWay;
  const hasApprovePerson = !!basicConfig?.approvePersons?.departments?.length ||
    !!basicConfig?.approvePersons?.users?.length || basicConfig?.approvePersons?.type !== 'person';

  const hasError = id === errors?.publish?.data?.id;

  return (
    <div
      className={cs(
        'shadow-title rounded-tl-8 rounded-tr-8 rounded-br-2',
        'rounded-bl-8 bg-white flex flex-col border relative',
        {
          'border-red-600 border-dashed animate-node-error': hasError,
          'cursor-pointer': !readonly,
          'cursor-default': readonly,
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
          iconName="approves"
          className="bg-indigo-500"
          iconClassName="text-white"
          titleClassName="text-white bg-indigo-500"
          readonly={readonly}
        />
        {!readonly && (
          <NodeRemover
            onVisibilityChange={setShowRemover}
            visible={showRemover}
            id={id}
            type="light"
          />
        )}
      </div>
      <footer className="p-8 flex flex-1 flex-col justify-center">
        {(hasApproveRule || hasApprovePerson) && (
          <div
            className="bg-gray-100 py-4 px-8 rounded-4 flex flex-col justify-center"
          >
            {hasApproveRule && (
              <div className="text-caption-no-color text-gray-400">
                规则: <span className="text-gray-600">{getRule(basicConfig)}</span>
              </div>
            )}
            {hasApprovePerson && (
              <div className="text-caption-no-color text-gray-400">
                审批人: <span className="text-gray-600">{getPerson(basicConfig.approvePersons)}</span>
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
