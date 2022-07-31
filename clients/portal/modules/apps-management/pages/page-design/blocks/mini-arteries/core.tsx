import React from 'react';

import RenderMiniArtery from './render-mini-artery';
import CreateMiniArtery from './create-mini-artery';
import { deleteMiniArtery, updateMiniArtery, useMiniArteries } from './utils';
import { MiniArtery } from './types';

function MiniArteriesCore(): JSX.Element {
  const { miniArteries, refetch } = useMiniArteries();

  function handleDelete(key: string): void {
    deleteMiniArtery(key).then(refetch);
  }

  function handleUpdate(miniArtery: MiniArtery): void {
    updateMiniArtery(miniArtery).then(refetch);
  }

  return (
    // prevent panel collapse
    <div onClick={(e) => e.stopPropagation()}>
      <CreateMiniArtery miniArteries={miniArteries} onCreate={refetch} />
      {miniArteries.map((miniArtery) => {
        return (
          <RenderMiniArtery
            key={miniArtery.key}
            miniArtery={miniArtery}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        );
      })}
      {!miniArteries.length && (
        <div>没有区块模版，请选中节点后新建。</div>
      )}
    </div>
  );
}

export default MiniArteriesCore;
