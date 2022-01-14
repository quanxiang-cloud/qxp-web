import React, { MutableRefObject, forwardRef, ForwardedRef } from 'react';

import Operates from '@polyApi/components/operates';
import FormulaTree, { RefType } from '@polyApi/components/poly-node-path-tree';
import { OPERATES_MAP } from '@portal/modules/poly-api/constants';

import { RefType as ApiParamsConfigRefType } from './api-params-config';

import './formula.scss';

type Props = {
  currentFormulaEditorRef: MutableRefObject<ApiParamsConfigRefType | undefined>;
  sourceGetter?: () => POLY_API.PolyNodeInput[];
  hasSuffix?: boolean;
}
function ApiFormulaConfig(
  { currentFormulaEditorRef, sourceGetter, hasSuffix }: Props, ref: ForwardedRef<RefType>,
): JSX.Element {
  function handleTreeNodeClick(node: any): void {
    if (node.isLeaf) {
      currentFormulaEditorRef?.current?.getCurrent()?.insertEntity(
        { key: hasSuffix ? `[${node.path}]` : node.path, name: node.data.descPath },
      );
    }
  }

  function handleOperatesClick(operate: string): void {
    currentFormulaEditorRef?.current?.getCurrent()?.insertText(operate);
  }

  return (
    <div className="formula-config">
      <Operates operates={OPERATES_MAP} onClick={handleOperatesClick} />
      <div className="pt-6 border-gray-200 flex-1 text-12 overflow-auto">
        <FormulaTree
          ref={ref}
          hasSuffix={hasSuffix}
          onSelect={handleTreeNodeClick}
          sourceGetter={sourceGetter}
        />
      </div>
    </div>
  );
}

export default forwardRef<RefType, Props>(ApiFormulaConfig);
