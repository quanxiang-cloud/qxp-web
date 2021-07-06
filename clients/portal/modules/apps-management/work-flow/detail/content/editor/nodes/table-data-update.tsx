import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

import TableDataUpdateNodeComponent from '../components/table-data-update';

export default function TableDataUpdateNode(props: any): JSX.Element {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
      />
      <TableDataUpdateNodeComponent {...props} />
      <Handle
        type="source"
        position={Position.Bottom}
      />
    </>
  );
}
