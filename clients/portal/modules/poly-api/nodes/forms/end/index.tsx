import React, { useRef, useEffect, useCallback } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import { RefProps, CustomRule } from '@c/formula-editor';
import PolyNodePathTree, { RefType } from '@polyApi/components/poly-node-path-tree';
import { getElementHeight } from '@polyApi/utils/dom';
import { TreeNode } from '@c/headless-tree/types';
import Operates from '@polyApi/components/operates';
import { OPERATES_MAP } from '@polyApi/constants';
import OutputEditor from './output-editor';

function EndForm(props: ISchemaFieldComponentProps): JSX.Element {
  props;
  const [customRules, setCustomRules] = React.useState<CustomRule[]>([]);
  const polyNodePathTreeRef = useRef<RefType | null>(null);
  const formularRef = useRef<RefProps | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (customRules.length) {
      return;
    }
    const rules = polyNodePathTreeRef.current?.getCustomRules();
    rules?.length && setCustomRules(rules);
  });

  useEffect(() => {
    const el = document.querySelector('.node-config-form-section') as HTMLDivElement;
    if (!el || !ref.current) {
      return;
    }
    ref.current.style.height = `${getElementHeight(el)}px`;
  }, []);

  function onSelect(node: TreeNode<POLY_API.PolyNodeInput & { descPath: string }>): void {
    formularRef.current?.insertEntity({
      name: node.data?.descPath,
      key: node.path,
    });
  }

  function handleChange(value: string): void {
    props.mutators.change({ type: 'direct_expr', data: value });
  }

  const handleOperateChange = useCallback((operate: string) => {
    formularRef.current?.insertText(operate);
  }, []);

  return (
    <div className="h-full flex" ref={ref}>
      <div className="h-full flex-2 px-20">
        <OutputEditor {...props} />
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

