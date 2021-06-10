import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

import FormDataNodeComponent from '../components/form-data';

export default function FormDataNode(props: any) {
  return (
    <>
      <FormDataNodeComponent {...props} />
      <Handle
        type="source"
        position={Position.Bottom}
      />
    </>
  );
}
