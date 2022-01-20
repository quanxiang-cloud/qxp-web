import React, { useState, useRef, useEffect, useCallback, useMemo, useContext } from 'react';
import { mergeRight } from 'ramda';
import { useQuery } from 'react-query';

import FormularEditor, { RefProps, CustomRule } from '@c/formula-editor';
import PolyNodePathTree, { RefType } from '@polyApi/components/poly-node-path-tree';
import { getElementHeight } from '@polyApi/utils/dom';
import { TreeNode } from '@c/headless-tree/types';
import Operates from '@polyApi/components/operates';
import { CONDITION_OPERATES_MAP, OPERATES_MAP } from '@polyApi/constants';
import { webhookPathTreeSourceGetter } from '@flow/content/editor/forms/webhook/utils';
import sourceTable from '@flow/content/editor/forms/flow-source-table';
import store from '@flow/content/editor/store';
import type { StoreValue } from '@flow/content/editor/type';
import useObservable from '@lib/hooks/use-observable';
import { getVariableList } from '@flow/api';
import Loading from '@c/loading';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

function ConfigForm({ value, onChange }: Props): JSX.Element {
  const [customRules, setCustomRules] = useState<CustomRule[]>([]);
  const nodePathTreeRef = useRef<RefType | null>(null);
  const formularRef = useRef<RefProps | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const { tableSchema } = useContext(sourceTable);
  const { id: flowId = '' } = useObservable<StoreValue>(store);

  useEffect(() => {
    if (customRules.length) {
      return;
    }
    const rules = nodePathTreeRef.current?.getCustomRules();
    setCustomRules(rules || []);
  }, [customRules]);

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

  function onSelect(node: TreeNode<POLY_API.PolyNodeInput & { descPath: string }>): void {
    formularRef.current?.insertEntity({
      name: node.data?.descPath,
      key: `[${node.path}]`,
    });
  }

  const handleOperateChange = useCallback((operate: string) => {
    formularRef.current?.insertText(operate);
  }, []);

  const getVariables = useCallback(() => {
    return getVariableList(flowId);
  }, [flowId]);

  const { data, isLoading } = useQuery('GET_VARIABLE_LIST', getVariables, {
    refetchOnWindowFocus: false,
    enabled: !!flowId,
  });

  const sourceGetter = useMemo(() => {
    return webhookPathTreeSourceGetter(tableSchema, data);
  }, [data]);

  if (isLoading) {
    return <Loading desc="加载中..." />;
  }

  return (
    <div className="h-full flex overflow-hidden" ref={ref}>
      <div className="h-full flex-2">
        {!!customRules?.length && (
          <FormularEditor
            className="h-full node-formula-editor"
            ref={formularRef}
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
        <PolyNodePathTree
          hasSuffix
          className="h-full bg-white overflow-auto"
          onSelect={onSelect}
          ref={nodePathTreeRef}
          sourceGetter={sourceGetter}
        />
      </div>
    </div>
  );
}

export default ConfigForm;
