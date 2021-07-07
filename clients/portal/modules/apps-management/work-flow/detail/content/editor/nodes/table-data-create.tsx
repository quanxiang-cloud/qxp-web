import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

import TableDataCreateNodeComponent from '../components/table-data-create';

export default function TableDataCreateNode(props: any): JSX.Element {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={false}
      />
      <TableDataCreateNodeComponent {...props} />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={false}
      />
    </>
  );
}
