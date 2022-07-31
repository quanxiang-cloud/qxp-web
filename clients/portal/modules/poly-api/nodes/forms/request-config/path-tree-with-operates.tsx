import React, { MutableRefObject } from 'react';

import Operates from '@polyApi/components/operates';
import PathTree from '@c/logic/path-tree';
import { OPERATES_MAP } from '@polyApi/constants';
import usePathTreeSource from '@polyApi/effects/hooks/use-path-tree-source';
import type { CustomRule } from '@c/formula-editor';

import { RefType as ApiParamsConfigRefType } from './api-params-config';

import './formula.scss';

type Props = {
  currentFormulaEditorRef: MutableRefObject<ApiParamsConfigRefType | undefined>;
  onRulesChange: (customRules?: CustomRule[]) => void;
  pathTreeValue?: POLY_API.PolyNodeInput[];
  onInsertText?: (val: string) => void;
}
export default function PathTreeWithOperates(props: Props): JSX.Element {
  const { currentFormulaEditorRef, pathTreeValue, onRulesChange, onInsertText } = props;
  const polyPathTreeValue = usePathTreeSource();

  function onSelectVariable(node: any): void {
    if (node.isLeaf) {
      currentFormulaEditorRef?.current?.getCurrent()?.insertEntity(
        { key: node.path, name: node.data.descPath },
      );
      onInsertText?.(node.path);
    }
  }

  function handleOperatesClick(operate: string): void {
    currentFormulaEditorRef?.current?.getCurrent()?.insertText(operate);
    onInsertText?.(operate);
  }

  return (
    <div className="formula-config">
      <Operates operates={OPERATES_MAP} onClick={handleOperatesClick} />
      <div className="pt-6 border-gray-200 flex-1 text-12 overflow-auto">
        <PathTree
          onChange={onSelectVariable}
          onRulesChange={onRulesChange}
          value={pathTreeValue ?? polyPathTreeValue}
        />
      </div>
    </div>
  );
}
