/* eslint-disable max-len */
import React, { useState, useRef, useEffect, useCallback, useMemo, useContext } from 'react';
import { mergeRight } from 'ramda';
import { useQuery } from 'react-query';

import FormulaEditor, { RefProps, CustomRule } from '@c/formula-editor';
import PathTree from '@c/logic/path-tree';
import { getElementHeight } from '@polyApi/utils/dom';
import { TreeNode } from '@c/headless-tree/types';
import Operates from '@polyApi/components/operates';
import { CONDITION_OPERATES_MAP, OPERATES_MAP } from '@polyApi/constants';
import { getWebhookPathTreeValue } from '@newFlow/content/editor/forms/webhook/utils';
import sourceTable from '@newFlow/content/editor/forms/flow-source-table';
import store from '@newFlow/content/editor/store';
import type { StoreValue } from '@newFlow/content/editor/type';
import useObservable from '@lib/hooks/use-observable';
import { getVariableList } from '@newFlow/api';
import Loading from '@c/loading';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

function ConfigForm({ value, onChange }: Props): JSX.Element {
  const [customRules, setCustomRules] = useState<CustomRule[]>();
  const formulaRef = useRef<RefProps | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const { tableSchema } = useContext(sourceTable);
  const { id: flowId = '' } = useObservable<StoreValue>(store);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const parentElement = ref.current.parentElement;
    const height = getElementHeight(parentElement);
    if (height) {
      ref.current.style.height = `${height + 18}px`;
    }
  });

  function onSelectVariable(node: TreeNode<POLY_API.PolyNodeInput & { descPath: string }>): void {
    formulaRef.current?.insertEntity({
      name: node.data?.descPath,
      key: `[${node.path}]`,
    });
  }

  const handleOperateChange = useCallback((operate: string) => {
    formulaRef.current?.insertText(operate);
  }, []);

  const getVariables = useCallback(() => {
    return getVariableList(flowId);
  }, [flowId]);

  const { data, isLoading } = useQuery('GET_VARIABLE_LIST', getVariables, {
    refetchOnWindowFocus: false,
    enabled: !!flowId,
  });

  const pathTreeValue = useMemo(() => getWebhookPathTreeValue(tableSchema, data), [tableSchema, data]);

  if (isLoading) {
    return <Loading desc="加载中..." />;
  }

  return (
    <div className="h-full flex overflow-hidden" ref={ref}>
      <div className="h-full flex-2">
        {customRules && (
          <FormulaEditor
            className="h-full node-formula-editor"
            ref={formulaRef}
            onChange={onChange}
            customRules={customRules}
            value={value}
            help=""
          />
        )}
      </div>
      <div className="flex-1 overflow-hidden formula-config">
        <Operates
          operates={mergeRight(CONDITION_OPERATES_MAP, OPERATES_MAP)}
          onClick={handleOperateChange}
          className="bg-white"
        />
        <PathTree
          className="h-full bg-white overflow-auto"
          onChange={onSelectVariable}
          onRulesChange={(rules)=> setCustomRules(rules?.map((item: any)=>({ ...item, key: `[${item?.key}]` })))}
          value={pathTreeValue}
        />
      </div>
    </div>
  );
}

export default ConfigForm;
