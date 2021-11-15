import React, { useContext } from 'react';
import { observer } from 'mobx-react';

import type { NodeRenderProps } from '@c/headless-tree/types';

import { ApiRequestNodeConfigContext } from '../../nodes/forms/request-config/context';

type Props = NodeRenderProps<POLY_API.PolyNodeInput>

function NamespaceNode({ node }: Props): JSX.Element | null {
  const currentFormulaEditorRef = useContext(ApiRequestNodeConfigContext);

  function handleClick(): void {
    if (node.isLeaf) {
      currentFormulaEditorRef.current.insertEntity({ key: node.path, name: node.path + 'hh' });
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
