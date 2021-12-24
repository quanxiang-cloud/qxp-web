import React, { useRef, useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { useQuery } from 'react-query';
import { nanoid } from 'nanoid';

import type { CustomRule } from '@c/formula-editor';
import { Input } from '@flow/content/editor/type';
import ApiFormulaConfig from '@polyApi/nodes/forms/request-config/api-formula';
import ApiParamsConfig, { RefType } from '@polyApi/nodes/forms/request-config/api-params-config';
import type { RefType as PathTreeRefType } from '@polyApi/components/poly-node-path-tree';
import sourceTable from '@flow/content/editor/forms/flow-source-table';
import { getVariableList } from '@flow/api';
import store from '@flow/content/editor/store';
import Loading from '@c/loading';
import useObservable from '@lib/hooks/use-observable';
import type { StoreValue } from '@flow/content/editor/type';

import Send from './send';

import { webhookPathTreeSourceGetter } from './utils';

interface Props {
  value: Input[];
  onChange: (v: Input[]) => void;
  values: Record<string, any>;
}

function Inputs({ value, onChange, values }: Props): JSX.Element | null {
  const formulaEditorRef = useRef<RefType>();
  const [customRules, setCustomRules] = useState<CustomRule[]>();
  const polyNodePathTreeRef = useRef<PathTreeRefType | null>(null);
  const { tableSchema } = useContext(sourceTable);
  const { id: flowId = '' } = useObservable<StoreValue>(store);

  const getVariables = useCallback(() => {
    return getVariableList(flowId);
  }, [flowId]);

  const { data, isLoading } = useQuery('GET_VARIABLE_LIST', getVariables, {
    refetchOnWindowFocus: false,
    enabled: !!flowId,
  });

  useEffect(() => {
    if (customRules?.length || !polyNodePathTreeRef.current) {
      return;
    }
    const rules = polyNodePathTreeRef.current.getCustomRules();
    setCustomRules(rules ?? []);
  }, [customRules, polyNodePathTreeRef.current]);

  const sourceGetter = useMemo(() => {
    return webhookPathTreeSourceGetter(tableSchema, data);
  }, [data]);

  useEffect(() => {
    const getInit = (type: 'header' | 'body' | 'query'): Input => ({
      type: 'string', name: '', data: '', in: type, id: nanoid(),
    });
    if (values.type === 'send' && !value?.length) {
      onChange(['header' as const, 'body' as const, 'query' as const].map(getInit));
    }
  }, [values.type]);

  if (isLoading) {
    return <Loading desc="加载中..." />;
  }

  if (values.type === 'request' && !values.url) {
    return null;
  }

  return (
    <div className="grid items-stretch webhook-request-inputs">
      {values.type === 'request' && customRules && (
        <ApiParamsConfig
          onChange={onChange}
          ref={formulaEditorRef}
          value={value}
          url={values.url}
          customRules={customRules}
        />
      )}
      {values.type === 'send' && customRules && (
        <Send
          value={value}
          onChange={onChange}
          ref={formulaEditorRef}
          customRules={customRules}
        />
      )}
      <ApiFormulaConfig
        currentFormulaEditorRef={formulaEditorRef}
        ref={polyNodePathTreeRef}
        sourceGetter={sourceGetter}
      />
    </div>
  );
}

export default Inputs;
