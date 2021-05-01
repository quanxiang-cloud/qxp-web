import React from 'react';
import cs from 'classnames';

import { updateStore, Data } from '../store';
import NodeHeader from './_common/node-header';

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
      <NodeHeader
        title={data.nodeData.name}
        type="approve"
        iconName="approves"
        className="bg-indigo-500"
        iconClassName="text-white"
        titleClassName="text-white bg-indigo-500"
      />
      <footer className="p-8 flex items-center flex-1">
        <span className="text-caption text-gray-400 px-4">设置审批规则</span>
      </footer>
    </div>
  );
}
