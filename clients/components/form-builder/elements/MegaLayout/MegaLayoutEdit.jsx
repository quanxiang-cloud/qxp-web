import React from 'react';
import { MegaLayout } from '@formily/antd-components';
import DndWrapper from '../../DndWrapper';

const CardEdit = ({ id, item, children, className, path, index }) => {
  const { layoutMode, ...restProps } = item.props;
  const layout = {
    className: 'mega-layout-edit',
  };
  if (layoutMode === 'inline') {
    layout.inline = true;
    layout.className = 'mega-layout-edit mega-inline';
  } else if (layoutMode === 'grid') {
    layout.grid = true;
    // layout.autoRow = true;
    layout.className = 'mega-layout-edit mega-grid';
  }
  return (
    <DndWrapper id={id} className={className} item={item} path={path} index={index}>
      <div className="wrapper-title">布局容器</div>
      <MegaLayout {...layout} {...restProps}>
        <DndWrapper draggable={false} isWrapper innerWrapper item={item} path={path} index={index}>
          {children}
        </DndWrapper>
      </MegaLayout>
    </DndWrapper>
  );
};

export default CardEdit;
