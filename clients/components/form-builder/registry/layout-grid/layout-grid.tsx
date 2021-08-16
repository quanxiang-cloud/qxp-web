import React from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import { blockStyle } from './utils';

function LayoutGrid(p: ISchemaFieldComponentProps): JSX.Element {
  const columns = p.props?.['x-component-props'].columns || 2;
  return (
    <div
      className="layout-grid-form grid gap-4"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {React.Children.toArray(p.children).map((itm: any, idx: number) => {
        return (
          <div
            key={idx}
            style={blockStyle(itm?.props?.schema?.['x-component'], columns)}
          >
            {itm}
          </div>
        );
      })}
    </div>
  );
}

LayoutGrid.isVirtualFieldComponent = true;

export default LayoutGrid;
