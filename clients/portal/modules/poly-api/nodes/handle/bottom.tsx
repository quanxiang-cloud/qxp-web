import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

interface Props {
  id?: string;
}

export default function NodeRightHandle({ id }: Props): JSX.Element {
  return (
    <Handle
      id={id}
      type="source"
      position={Position.Bottom}
      style={{ bottom: 0 }}
    />
  );
}
