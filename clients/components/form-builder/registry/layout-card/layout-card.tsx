import React from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { Card } from 'antd';

import Icon from '@c/icon';

function LayoutCard(p: ISchemaFieldComponentProps): JSX.Element {
  const [closed, setClosed] = React.useState(false);

  const collapsible = p.props?.['x-component-props']?.collapsible;

  const handleClick = (): void => {
    if (collapsible) setClosed(!closed);
  };

  return (
    <div className="layout-card">
      <Card title={p.props.title && (
        <div
          onClick={handleClick}
          style={{ cursor: 'pointer' }}
          className="layout-card-title"
        >
          <span>{p.props.title}</span>
          {collapsible &&
            (<Icon
              style={{
                transform: `rotate(${closed ? '180deg' : '0'})`,
                transition: '0.3s',
              }}
              name="arrow_drop_down"
            />)}
        </div>
      )}>
        <div
          style={{ height: closed ? '0px' : 'auto' }}
          className='layout-card-content'
        >
          {p.children}
        </div>
      </Card>
    </div>
  );
}

LayoutCard.isVirtualFieldComponent = true;

export default LayoutCard;
