import React, { useRef } from 'react';
import cs from 'classnames';

import useObservable from '@lib/hooks/use-observable';

import type { Data, StoreValue, DelayedData } from '../type';
import store from '../store';
import NodeHeader from './_common/node-header';
import usePositionChange from './hooks/use-node-position-change';
import useNodeSwitch from './hooks/use-node-switch';

interface Props {
  data: Data;
  id: string;
  xPos: number;
  yPos: number;
  isDragging: boolean;
}

export default function DelayedNodeComponent({
  data, id, xPos, yPos, isDragging,
}: Props): JSX.Element {
  const { readonly } = useObservable<StoreValue>(store);
  const isNew = !(data.businessData as DelayedData)?.timer;
  const lastTime = useRef(+new Date());

  usePositionChange({ id, xPos, yPos }, isDragging);
  const switcher = useNodeSwitch();

  function onMouseUp(): void {
    if (+new Date - lastTime.current < 200) {
      switcher(id);
    }
  }
  return (
    <div
      className={cs(
        'shadow-title rounded-tl-8 rounded-tr-8 rounded-br-2',
        'rounded-bl-8 bg-white flex flex-col',
        {
          'cursor-pointer': !readonly,
          'cursor-default': readonly,
        },
      )}
      style={{
        width: data.nodeData.width,
        minHeight: data.nodeData.height,
      }}
      onMouseDown={() => lastTime.current = +new Date()}
      onMouseUp={onMouseUp}
    >
      <NodeHeader
        title={data.nodeData.name}
        id={id}
        className="bg-gray-100"
        iconName="form-data"
        titleClassName="text-gray-600 bg-gray-100"
        readonly={readonly}
      />
      <footer className="p-8 flex items-center flex-1">
        {isNew && (
          <span className="text-caption text-gray-400 px-4">填写时间</span>
        )}
        {!isNew && (
          <div className="text-caption-no-color px-4 bg-gray-100 rounded-4 w-full">
            <span className="text-gray-400">触发时间: </span>
            <span className="text-gray-600">{(data.businessData as DelayedData)?.timer}</span>
          </div>
        )}
      </footer>
    </div>
  );
}
