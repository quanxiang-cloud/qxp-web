import React, { useRef, useEffect, useCallback } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import FormulaEditor, { RefProps, CustomRule } from '@c/formula-editor';
import PathTree, { CurrentNode } from '@c/logic/path-tree';
import { getElementHeight } from '@polyApi/utils/dom';
import Operates from '@polyApi/components/operates';
import { CONDITION_OPERATES_MAP } from '@polyApi/constants';
import usePathTreeSource from '@polyApi/effects/hooks/use-path-tree-source';

function ConditionForm(props: ISchemaFieldComponentProps): JSX.Element {
  const [customRules, setCustomRules] = React.useState<CustomRule[]>();
  const formulaRef = useRef<RefProps | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const polyPathTreeValue = usePathTreeSource();

  useEffect(() => {
    const el = document.querySelector('.node-config-form-section') as HTMLDivElement;
    if (!el || !ref.current) {
      return;
    }
    ref.current.style.height = `${getElementHeight(el)}px`;
  }, []);

  function onSelectVariable(node: CurrentNode): void {
    formulaRef.current?.insertEntity({
      name: node.data?.descPath,
      key: node.path,
    });
  }

  function handleChange(value: string): void {
    props.mutators.change({ type: 'direct_expr', data: value });
  }

  const handleOperateChange = useCallback((operate: string) => {
    formulaRef.current?.insertText(operate);
  }, []);

  return (
    <div className="h-full flex" ref={ref}>
      <div className="h-full flex-2">
        {customRules && (
          <FormulaEditor
            className="h-full node-formula-editor"
            ref={formulaRef}
            onChange={handleChange}
            customRules={customRules}
            defaultValue={props.initialValue?.data || props.value?.data || ''}
            help=""
          />
        )}
      </div>
      <div className="flex-1 overflow-hidden formula-config">
        <Operates
          operates={CONDITION_OPERATES_MAP}
          onClick={handleOperateChange}
          className="bg-white"
        />
        <PathTree
          className="h-full bg-white overflow-auto"
          value={polyPathTreeValue}
          onChange={onSelectVariable}
          onRulesChange={setCustomRules}
        />
      </div>
    </div>
  );
}

ConditionForm.isFieldComponent = true;

export default ConditionForm;
