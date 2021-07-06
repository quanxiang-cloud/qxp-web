import React from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

function SubTableFields({ props, children }: ISchemaFieldComponentProps): JSX.Element {
  // console.log('sub table props:', props);
  const { title } = props['x-component-props'];

  return (
    <div className="flex flex-col mb-10">
      <div>{title}</div>
      <div className="border border-dashed px-10 pt-10">
        {children}
      </div>
    </div>
  );
}

SubTableFields.isVirtualFieldComponent = true;

export default SubTableFields;
