import React from 'react';

import NodeComponentWrapper, { Props } from './node-component-wrapper';

export default function ProcessVariableAssignmentNodeComponent(props: Props): JSX.Element {
  let isConfiged = false;
  if (props.data.type === 'processVariableAssignment') {
    isConfiged = !!props.data.businessData.assignmentRules.length;
  }

  return (
    <NodeComponentWrapper {...props} iconName="assignment">
      <div className="bg-gray-100 py-4 px-8 rounded-4 flex flex-col justify-center w-full">
        变更流程参数: {isConfiged ? '已配置' : '未配置'}
      </div>
    </NodeComponentWrapper>
  );
}
