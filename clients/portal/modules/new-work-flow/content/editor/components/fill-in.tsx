import React, { useRef, useState, useEffect } from 'react';
import cs from 'classnames';

import useObservable from '@lib/hooks/use-observable';
import type { Data, FillInData, StoreValue } from '@newFlow/content/editor/type';

import store from '../store';
import NodeHeader from './_common/node-header';
import NodeRemover from './_common/node-remover';
import useNodeSwitch from './hooks/use-node-switch';
import { getPersonByIds, getRule } from './_common/utils';
import usePositionChange from './hooks/use-node-position-change';
import { isArray } from 'lodash';

interface Props {
  data: Data;
  id: string;
  xPos: number;
  yPos: number;
  isDragging: boolean;
}

export default function FillInNodeComponent({ data, id, xPos, yPos, isDragging }: Props): JSX.Element {
  const { errors, nodeIdForDrawerForm, readonly } = useObservable<StoreValue>(store);
  const lastTime = useRef(+new Date());
  const [showRemover, setShowRemover] = useState(false);
  const switcher = useNodeSwitch();
  usePositionChange({ id, xPos, yPos }, isDragging);
  useEffect(() => {
    nodeIdForDrawerForm && setShowRemover(false);
  }, [nodeIdForDrawerForm]);

  const { nodeData, businessData } = data;

  const { basicConfig } = businessData as FillInData;

  const [fillInPersons, setFillInPersons] = useState<any>();

  useEffect(()=>{
    basicConfig?.approvePersons && getPersonByIds(basicConfig?.approvePersons, setFillInPersons);
  }, [basicConfig?.approvePersons]);

  function onMouseUp(): void {
    if (+new Date - lastTime.current < 200) {
      switcher(id, fillInPersons);
    }
  }

  function onMouseEnter(): void {
    setShowRemover(true);
  }

  function onMouseLeave(): void {
    setShowRemover(false);
  }

  const hasFillInRule = !!basicConfig?.multiplePersonWay;
  const hasFillInPerson = !!basicConfig?.approvePersons?.departments?.length ||
    !!basicConfig?.approvePersons?.users?.length || basicConfig?.approvePersons?.type !== 'person';

  const hasError = id === errors?.publish?.data?.id;
  const { departments } = basicConfig?.approvePersons || [];
  return (
    <div
      className={cs(
        'shadow-title rounded-tl-8 rounded-tr-8 rounded-br-2',
        'rounded-bl-8 bg-white flex flex-col',
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
          className="bg-teal-500"
          iconName="edit"
          iconClassName="text-white"
          titleClassName="text-white bg-teal-500"
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
      <footer className="p-8 flex items-center flex-1">
        {(hasFillInRule || hasFillInPerson) && (
          <div
            className="bg-gray-100 py-4 px-8 rounded-4 flex flex-col justify-center w-full"
          >
            {hasFillInRule && (
              <div className="text-caption-no-color text-gray-400">
                规则: <span className="text-gray-600">{getRule(basicConfig)}</span>
              </div>
            )}
            {hasFillInPerson && (
              <div className="text-caption-no-color text-gray-400">
                填写人: <span className="text-gray-600 break-all">{
                  isArray(fillInPersons) ?
                    fillInPersons
                      .concat(departments)
                      .map((item: any) => {
                        const { ownerName, departmentName } = item || {};
                        return ownerName || departmentName;
                      })
                      .join('; ') :
                    fillInPersons}</span>
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
