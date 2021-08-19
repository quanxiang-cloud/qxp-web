import React from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { Card } from 'antd';

import Icon from '@c/icon';

function LayoutCard(p: ISchemaFieldComponentProps): JSX.Element {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [closed, setClosed] = React.useState(false);
  const [cacheHeight, setHeight] = React.useState(0);
  const timer = React.useRef<any>();

  const collapsible = p.props?.['x-component-props']?.collapsible;

  const handleClick = (): void => {
    if (!collapsible) return;

    const dom = contentRef.current as HTMLDivElement;
    if (closed) {
      setClosed(false);

      dom.style.maxHeight = `${cacheHeight}px`;
      timer.current = setTimeout(() => {
        dom.style.maxHeight = 'auto';
      }, 400);
    } else {
      setClosed(true);

      const { height } = dom.getBoundingClientRect();
      dom.style.maxHeight = `${height}px`;
      dom.style.transition = '0.3s';
      setTimeout(() => {
        dom.style.maxHeight = '0px';
      }, 0);
      setHeight(height);
    }
  };

  React.useEffect(() => {
    () => clearTimeout(timer.current);
  }, []);

  return (
    <div className="layout-card">
      <Card title={p.props.title && (
        <div onClick={handleClick} className="layout-card-title" >
          <span>{p.props.title}</span>
          {collapsible &&
            (<Icon
              style={{ transform: `rotate(${closed ? '180deg' : '0'})`, transition: '0.3s' }}
              name="arrow_drop_down"
            />)}
        </div>
      )}>
        <div className="layout-card-content" ref={contentRef}>{p.children}</div>
      </Card>
    </div>
  );
}

LayoutCard.isVirtualFieldComponent = true;

export default LayoutCard;
