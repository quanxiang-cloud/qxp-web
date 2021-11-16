import React from 'react';
import { observer } from 'mobx-react';

import type { NodeRenderProps } from '@c/headless-tree/types';

type Props = NodeRenderProps<POLY_API.PolyNodeInput>

function NamespaceNode({ node }: Props): JSX.Element | null {
  return (
    <div className="transition-all w-full flex items-center justify-between" onClick={() => console.log(node.level)}>
      <div className="ml-10 truncate" title={node.data.name}>
        {node.data.desc}
        <span className="text-gray-400 ml-4">
          {node.level !== 2 ? `${node.data.name},${node.data.type}` : `${node.data.name}`}
        </span>
      </div>
    </div>
  );
}

export default observer(NamespaceNode);
