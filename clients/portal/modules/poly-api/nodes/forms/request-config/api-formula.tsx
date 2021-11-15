import React, { useContext } from 'react';
import { observer } from 'mobx-react';

import Operates from '@polyApi/components/operates';
import { ApiRequestNodeConfigContext } from './context';
import FormulaTree from '@polyApi/components/poly-node-path-tree';
import { OPERATES_MAP } from '@portal/modules/poly-api/constants';

function ApiFormulaConfig(): JSX.Element {
  const currentFormulaEditorRef = useContext(ApiRequestNodeConfigContext);

  function handleTreeNodeClick(node: any): void {
    if (node.isLeaf) {
      currentFormulaEditorRef?.current.insertEntity({ key: node.path, name: node.data.descPath });
    }
  }

  function handleOperatesClick(operate: string): void {
    currentFormulaEditorRef?.current.insertText(operate);
  }

  return (
    <div className="formula-config">
      <Operates operates={OPERATES_MAP} onClick={handleOperatesClick} />
      <div className="pt-6 border-gray-200 flex-1 text-12 overflow-auto">
        <FormulaTree onSelect={handleTreeNodeClick} />
      </div>
    </div>
  );
}

export default observer(ApiFormulaConfig);
