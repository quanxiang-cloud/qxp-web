import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

import FormData from '../components/form-data';

export default function FormDataNode(props: any) {
  return (
    <>
      <FormData {...props} />
      <Handle
        type="source"
        position={Position.Bottom}
      />
    </>
  );
}
