import React, { useRef, useEffect } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import { CustomRule } from '@c/formula-editor';
import PolyNodePathTree, { RefType } from '@polyApi/components/poly-node-path-tree';
import { getElementHeight } from '@polyApi/utils/dom';
import { TreeNode } from '@c/headless-tree/types';
import Operates from '@polyApi/components/operates';
import { OPERATES_MAP } from '@polyApi/constants';

import OutputEditor, { RefType as OutPutEditorRefType } from './output-editor';

function EndForm(props: ISchemaFieldComponentProps): JSX.Element {
  props;
  const [customRules, setCustomRules] = React.useState<CustomRule[]>([]);
  const polyNodePathTreeRef = useRef<RefType | null>(null);
  const outputEditorRef = useRef<OutPutEditorRefType | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (customRules.length) {
      return;
    }
    const rules = polyNodePathTreeRef.current?.getCustomRules();
    setCustomRules(rules || []);
  }, [customRules]);

  useEffect(() => {
    const el = document.querySelector('.node-config-form-section') as HTMLDivElement;
    if (!el || !ref.current) {
      return;
    }
    ref.current.style.height = `${getElementHeight(el)}px`;
  }, []);

  function onSelect(node: TreeNode<POLY_API.PolyNodeInput & { descPath: string }>): void {
    outputEditorRef.current?.getCurrent()?.insertEntity({
      name: node.data?.descPath.replace(/\s/g, ''),
      key: node.path.replace(/\s+/g, ''),
    });
  }

  function handleOperateChange(operate: string): void {
    outputEditorRef.current?.getCurrent()?.insertText(operate);
  }

  return (
    <div className="h-full flex" ref={ref}>
      <div className="h-full flex-2 px-20">
        <OutputEditor
          {...props}
          customRules={customRules}
          ref={outputEditorRef}
        />
      </div>
      <div className="flex-1 overflow-auto">
        <Operates
          operates={OPERATES_MAP}
          onClick={handleOperateChange}
          className="bg-white"
        />
        <PolyNodePathTree
          className="h-full bg-white"
          onSelect={onSelect}
          ref={polyNodePathTreeRef}
        />
      </div>
    </div>
  );
}

EndForm.isFieldComponent = true;

export default EndForm;

