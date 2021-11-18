import React, { useContext, useEffect, useRef } from 'react';
import { observer } from 'mobx-react';

import Operates from '@polyApi/components/operates';
import { ApiRequestNodeConfigContext } from './context';
import FormulaTree, { RefType } from '@polyApi/components/poly-node-path-tree';
import { OPERATES_MAP } from '@portal/modules/poly-api/constants';
import { CustomRule } from '@c/formula-editor';

type Props = {
  setCustomRules: (rules: CustomRule[]) => void;
}
function ApiFormulaConfig({ setCustomRules }: Props): JSX.Element {
  const { currentFormulaEditorRef, customRules } = useContext(ApiRequestNodeConfigContext);
  const polyNodePathTreeRef = useRef<RefType | null>(null);

  useEffect(() => {
    if (customRules.length) {
      return;
    }
    const rules = polyNodePathTreeRef.current?.getCustomRules();
    setCustomRules(rules || []);
  }, [customRules]);

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
        <FormulaTree ref={polyNodePathTreeRef} onSelect={handleTreeNodeClick} />
      </div>
    </div>
  );
}

export default observer(ApiFormulaConfig);
