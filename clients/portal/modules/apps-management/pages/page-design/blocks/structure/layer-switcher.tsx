import React from 'react';
import cs from 'classnames';

import { useLayerList } from './hooks';
import { Artery } from '@one-for-all/artery';
import Icon from '@one-for-all/icon';

interface Props {
  artery: Artery;
  onChange: (artery: Artery) => void;
  onActiveModalLayerChange: (id: string) => void;
  activeLayer: string;
}

function LayerSwitcher({ artery, onChange, onActiveModalLayerChange, activeLayer }: Props): JSX.Element | null {
  const layers = useLayerList(artery, activeLayer);

  function handleDeleteLayer(id: string): void {
    if (!('children' in artery.node)) {
      return;
    }

    const firstLevelChildren = artery.node.children?.filter((firstLevelChild) => firstLevelChild.id === id);
    onChange({ ...artery, node: { ...artery.node, children: firstLevelChildren } });
  }

  if (layers.length <= 1) {
    return null;
  }

  return (
    <div className="outline-layers">
      {layers.map(({ id, name, active }, index) => {
        return (
          <div key={id} className={cs('outline-layer', { 'outline-layer--active': active })}>
            <span
              className="outline-layer__name"
              onClick={() => onActiveModalLayerChange(index === 0 ? '' : id)}
            >
              {name}
            </span>
            {index !== 0 && <Icon name="delete" onClick={() => handleDeleteLayer(id)} />}
          </div>
        );
      })}
    </div>
  );
}

export default LayerSwitcher;
