import React, { useRef, useEffect, useCallback } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import FormularEditor, { RefProps, CustomRule } from '@c/formula-editor';
import PolyNodePathTree, { RefType } from '@polyApi/components/poly-node-path-tree';
import { getElementHeight } from '@polyApi/utils/dom';
import { TreeNode } from '@c/headless-tree/types';
import Operates from '@polyApi/components/operates';
import { CONDITION_OPERATES_MAP } from '@polyApi/constants';

function ConditionForm(props: ISchemaFieldComponentProps): JSX.Element {
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
      <div className="h-full flex-2">
        {!!customRules?.length && (
          <FormularEditor
            className="h-full node-formula-editor"
            ref={formularRef}
            onChange={handleChange}
            customRules={customRules}
            defaultValue={props.initialValue?.data || props.value?.data || ''}
            help=""
          />
        )}
      </div>
      <div className="flex-1 overflow-auto">
        <Operates
          operates={CONDITION_OPERATES_MAP}
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

ConditionForm.isFieldComponent = true;

export default ConditionForm;
