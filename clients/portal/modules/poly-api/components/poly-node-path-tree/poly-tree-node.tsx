import React from 'react';
import { observer } from 'mobx-react';

import type { NodeRenderProps } from '@c/headless-tree/types';

import ApiFormulaTreeStore from './store';

type Props = NodeRenderProps<POLY_API.PolyNodeInput>

function NamespaceNode({ node, store: _store }: Props): JSX.Element | null {
  const { currentNodePath, setCurrentNodePath } = _store as ApiFormulaTreeStore;

  function handleClick(): void {
    if (node.isLeaf) {
      setCurrentNodePath(node.path);
    }
  }

  return (

    <div
      onClick={handleClick}
      className="transition-all w-full flex items-center justify-between"
    >
      <div className="ml-10 truncate" title={node.name}>
        {node.name}
      </div>
    </div>
  );
}

export default observer(NamespaceNode);
