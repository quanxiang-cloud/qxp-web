import React, { KeyboardEvent } from 'react';
import cs from 'classnames';

import Icon from '@c/icon';

import { Params } from '../engine';
import { updateStore, Data, updateNodeData } from '../store';

export function approve(params: Params) {
  return Promise.resolve({ formData: 'approve', ...params });
}

interface Props {
  data: Data;
}

export default function ApproveNodeComponent({ data }: Props) {
  return (
    <div
      className={cs(
        'shadow-title rounded-tl-8 rounded-tr-8 rounded-br-2',
        'rounded-bl-8 bg-white flex flex-col',
        `w-${data.nodeData.width}`, `h-${data.nodeData.height}`
      )}
      onClick={() => updateStore(null, () => ({ asideDrawerType: 'approveForm' }))}
    >
      <header className="flex items-center py-4 px-12 bg-indigo-500 rounded-tl-8
        rounded-tr-8 rounded-br-2 rounded-bl-8">
        <Icon name="approves" className="mr-4 text-white" />
        <input
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => updateNodeData('approve', 'name', () => e.target.value)}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              (e.target as HTMLInputElement).blur();
            }
          }}
          className="bg-indigo-500 text-caption-no-color-weight font-medium text-white
          outline-none work-flow-node-header-input"
          defaultValue={data.nodeData.name}
        />
      </header>
      <footer className="p-8 flex items-center flex-1">
        <span className="text-caption text-gray-400 px-4">设置审批规则</span>
      </footer>
    </div>
  );
}
