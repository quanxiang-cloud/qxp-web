import React from 'react';

import NodeComponentWrapper, { Props } from './node-component-wrapper';
import { ProcessBranchData } from '../type';

export default function ProcessBranchNodeComponent(props: Props): JSX.Element {
  const { rule, ignore } = props.data.businessData as ProcessBranchData;

  return (
    <NodeComponentWrapper {...props} iconName="share">
      {rule && (
        <div className="text-caption-no-color px-4 bg-gray-100 rounded-4 w-full">
          <span className="text-gray-400">公式: </span>
          <span className="text-gray-600 break-all">{rule}</span>
        </div>
      )}
      {ignore && (
        <div className="text-caption-no-color px-4 bg-gray-100 rounded-4 w-full">
          <span className="text-gray-600">else 条件</span>
        </div>
      )}
      {!rule && !ignore && '请配置筛选条件'}
    </NodeComponentWrapper>
  );
}
