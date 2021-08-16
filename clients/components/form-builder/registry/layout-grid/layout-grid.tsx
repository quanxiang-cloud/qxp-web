import React from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

function LayoutGrid(p: ISchemaFieldComponentProps): JSX.Element {
  const columns = p.props?.['x-component-props'].columns || 2;
  return (
    <div className="layout-grid-form" style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gridColumnGap: '4px',
    }}>
      {React.Children.toArray(p.children).map((itm, idx) => (
        <div key={idx}>{itm}</div>
      ))}
    </div>
  );
}

LayoutGrid.isVirtualFieldComponent = true;

export default LayoutGrid;
