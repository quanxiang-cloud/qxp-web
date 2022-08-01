import React, { useState } from 'react';
import Icon from '@one-for-all/icon';

import NameInput from './name-input';
import { MiniArtery } from './types';

interface Props {
  miniArtery: MiniArtery;
  onDelete: (key: string) => void;
  onUpdate: (miniArtery: MiniArtery) => void;
}

const img = new Image();
img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

function overrideDragImage(dateTransfer: DataTransfer): void {
  dateTransfer.setDragImage(img, 0, 0);
}

function RenderMiniArtery({ miniArtery, onDelete, onUpdate }: Props): JSX.Element {
  const [renaming, setRenaming] = useState(false);

  if (renaming) {
    return (
      <div className="mini-artery">
        <NameInput
          name={miniArtery.name}
          onCancel={() => setRenaming(false)}
          onChange={(newName) => {
            onUpdate({ ...miniArtery, name: newName });
            setRenaming(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="mini-artery">
      <span
        draggable
        className="mini-artery__action"
        onDragStart={(e) => {
          e.stopPropagation();
          overrideDragImage(e.dataTransfer);

          e.dataTransfer.setData('artery_node', JSON.stringify(miniArtery.node));

          return false;
        }}
      >
        <Icon name="drag_indicator" />
      </span>
      <span className="mini-artery__name">{miniArtery.name}</span>
      <span className="mini-artery__action" onClick={() => setRenaming(true)}>
        <Icon name="edit" />
      </span>
      <span className="mini-artery__action" onClick={() => onDelete(miniArtery.key)}>
        <Icon name="delete" />
      </span>
    </div>
  );
}

export default RenderMiniArtery;
