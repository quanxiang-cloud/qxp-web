import React from 'react';
import { observer } from 'mobx-react';

import type { NodeRenderProps } from '@c/headless-tree/types';

type Props = NodeRenderProps<POLY_API.PolyNodeInput>

function NamespaceNode({ node }: Props): JSX.Element | null {
  return (

    <div className="transition-all w-full flex items-center justify-between">
      <div className="ml-10 truncate" title={node.name}>
        {node.name}
      </div>
    </div>
  );
}

export default observer(NamespaceNode);
