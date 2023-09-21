import React from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

function SubTableFields({ props, children }: ISchemaFieldComponentProps): JSX.Element {
  const xProps = props['x-component-props'];

  return (
    <div className="flex flex-col mb-10 w-11/12">
      <div>{xProps.title}</div>
      <div className="border border-dashed px-10 pt-10">
        {children}
      </div>
    </div>
  );
}

SubTableFields.isVirtualFieldComponent = true;

export default SubTableFields;
