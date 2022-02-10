import React, { useRef, useEffect } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import type { CustomRule } from '@c/formula-editor';
import PathTree from '@c/logic/path-tree';
import { getElementHeight } from '@polyApi/utils/dom';
import { TreeNode } from '@c/headless-tree/types';
import Operates from '@polyApi/components/operates';
import { OPERATES_MAP } from '@polyApi/constants';
import usePathTreeSource from '@polyApi/effects/hooks/use-path-tree-source';

import OutputEditor, { RefType as OutPutEditorRefType } from './output-editor';

function EndForm(props: ISchemaFieldComponentProps): JSX.Element {
  const [customRules, setCustomRules] = React.useState<CustomRule[]>();
  const outputEditorRef = useRef<OutPutEditorRefType | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const polyPathTreeValue = usePathTreeSource();

  useEffect(() => {
    const el = document.querySelector('.node-config-form-section') as HTMLDivElement;
    if (!el || !ref.current) {
      return;
    }
    ref.current.style.height = `${getElementHeight(el)}px`;
  }, []);

  function onSelectVariable(node: TreeNode<POLY_API.PolyNodeInput & { descPath: string }>): void {
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
        {customRules && (
          <OutputEditor
            {...props}
            customRules={customRules}
            ref={outputEditorRef}
          />
        )}
      </div>
      <div className="flex-1 overflow-hidden formula-config">
        <Operates
          operates={OPERATES_MAP}
          onClick={handleOperateChange}
          className="bg-white"
        />
        <PathTree
          className="h-full bg-white overflow-auto"
          onChange={onSelectVariable}
          onRulesChange={setCustomRules}
          value={polyPathTreeValue}
        />
      </div>
    </div>
  );
}

EndForm.isFieldComponent = true;

export default EndForm;

