import React from 'react';

import NodeComponentWrapper, { Props } from './node-component-wrapper';
import { ProcessBranchData } from '../type';

export default function ProcessBranchNodeComponent(props: Props): JSX.Element {
  const { rule } = props.data.businessData as ProcessBranchData;

  return (
    <NodeComponentWrapper {...props}>
      {rule && (
        <div className="text-caption-no-color px-4 bg-gray-100 rounded-4 w-full">
          <span className="text-gray-400">公式: </span>
          <span className="text-gray-600">{rule}</span>
        </div>
      )}
      {!rule && '请配置筛选条件'}
    </NodeComponentWrapper>
  );
}
