import React from 'react';
import { observer } from 'mobx-react';
import { Artery, Node } from '@one-for-all/artery';

import Outline from './outline';

type Props = {
  artery: Artery;
  activeNode?: Node;
  onChange: (artery: Artery) => void;
  setActiveNode: (node?: Node) => void;
};

function PageTree({
  artery,
  activeNode,
  onChange,
  setActiveNode,
}: Props): JSX.Element {
  function handleChangeNode(node: Node): void {
    onChange({ ...artery, node });
  }

  return (
    <div className="w-full h-full flex flex-col items-center overflow-hidden relative page-tree">
      <div className="w-full h-full mt-10 overflow-auto">
        <Outline
          rootNode={artery.node}
          onChange={handleChangeNode}
          activeNode={activeNode}
          setActiveNode={setActiveNode}
        />
      </div>
    </div>
  );
}

export default observer(PageTree);
