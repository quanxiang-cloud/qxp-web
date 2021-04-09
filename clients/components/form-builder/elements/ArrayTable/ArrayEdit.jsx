import React from 'react';
import DndWrapper from '../../DndWrapper';

const ArrayEdit = ({ id, item, children, className, path, index }) => {
  const { label } = item.props;
  return (
    <DndWrapper id={id} className={className} item={item} path={path} index={index}>
      <div className="wrapper-title">自增容器: {label}</div>
      <div className="wrapper-outline">
        <DndWrapper draggable={false} isWrapper innerWrapper item={item} path={path} index={index}>
          {children}
        </DndWrapper>
      </div>
    </DndWrapper>
  );
};

export default ArrayEdit;
