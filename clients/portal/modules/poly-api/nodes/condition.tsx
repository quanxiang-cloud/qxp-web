import React from 'react';
import { NodeProps } from 'react-flow-renderer';

import useObservable from '@lib/hooks/use-observable';
import Icon from '@c/icon';

import NodeWrapper from './wrapper';

export default function ConditionNode(props: NodeProps<POLY_API.SubjectPolyNode>): JSX.Element | null {
  const nodeData = useObservable<POLY_API.PolyNode>(props.data);

  if (nodeData.type !== 'if') {
    return null;
  }

  return (
    <NodeWrapper
      noPadding
      noBg
      {...props}
    >
      <Icon
        name="condition"
        size={50}
        className="poly-condition"
        style={{ backgroundColor: 'transparent' }}
      />
    </NodeWrapper>
  );
}
