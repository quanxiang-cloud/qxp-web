import React, { useRef, useState } from 'react';
import cs from 'classnames';

import useObservable from '@lib/hooks/use-observable';
import type { Data, StoreValue } from '@flow/content/editor/type';

import store from '../store';
import NodeHeader from './_common/node-header';
import NodeRemover from './_common/node-remover';
import usePositionChange from './hooks/use-node-position-change';
import useNodeSwitch from './hooks/use-node-switch';

export interface Props {
  data: Data;
  id: string;
  xPos: number;
  yPos: number;
  isDragging: boolean;
  children: React.ReactNode;
  simple: boolean;
  iconName: string;
}

export default function NodeComponentWrapper(props: Props): JSX.Element {
  const { data, id, xPos, yPos, isDragging, children, simple, iconName } = props;
  const { errors, readonly } = useObservable<StoreValue>(store);
  const lastTime = useRef(+new Date());
  const [showRemover, setShowRemover] = useState(false);
  const switcher = useNodeSwitch();

  usePositionChange({ xPos, yPos, id }, isDragging);

  const { nodeData } = data;

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
      {!simple && (
        <>
          <div className="relative">
            <NodeHeader
              title={nodeData.name}
              id={id}
              iconName={iconName}
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
            {children}
          </footer>
        </>
      )}
      {simple && (
        <>{children}</>
      )}
    </div>
  );
}
