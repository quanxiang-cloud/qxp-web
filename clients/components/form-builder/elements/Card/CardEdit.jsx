import React from 'react';
import { Card } from 'antd';
import DndWrapper from '../../DndWrapper';

const CardEdit = ({ id, item, children, className, path, index }) => {
  const { title, size, className: cardClassName } = item.props;
  return (
    <DndWrapper id={id} className={className} item={item} path={path} index={index}>
      <Card title={title} size={size} className={cardClassName}>
        <DndWrapper draggable={false} isWrapper innerWrapper item={item} path={path} index={index}>
          {children}
        </DndWrapper>
      </Card>
    </DndWrapper>
  );
};

export default CardEdit;
