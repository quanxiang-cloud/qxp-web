import React from 'react';
import cs from 'classnames';
import { StyleConfigInterface } from '@one-for-all/style-guide';

type Props = {
  compSpec: StyleConfigInterface;
  onClick: () => void;
  Component: React.FC;
  isActive: boolean;
}

function PreviewItem({ compSpec, onClick, Component, isActive }: Props): JSX.Element {
  return (
    <div style={{ padding: '5px 0' }} key={compSpec.title}>
      <div style={{ marginBottom: '5px' }}>{compSpec.title}</div>
      <div
        onClick={onClick}
        className={cs('style-guide-comp-item', { 'style-guide-comp-item-active': isActive })}
      >
        {Array.isArray(compSpec.componentProps) ? compSpec.componentProps.map((props) => (
          <Component key={JSON.stringify(props)} {...props} />
        )) : (<Component {...compSpec.componentProps} />)}
      </div>
    </div>
  );
}

export default PreviewItem;
