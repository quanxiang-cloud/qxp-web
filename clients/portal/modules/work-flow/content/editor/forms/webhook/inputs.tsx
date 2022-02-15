import React, { useRef, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { nanoid } from 'nanoid';
import { isUndefined } from 'lodash';
import { cond, propEq, and, always, T } from 'ramda';

import type { CustomRule } from '@c/formula-editor';
import { Input } from '@flow/content/editor/type';
import PathTreeWithOperates from '@polyApi/nodes/forms/request-config/path-tree-with-operates';
import ApiParamsConfig, { RefType } from '@polyApi/nodes/forms/request-config/api-params-config';
import sourceTable from '@flow/content/editor/forms/flow-source-table';
import { getVariableList } from '@flow/api';
import store from '@flow/content/editor/store';
import Loading from '@c/loading';
import useObservable from '@lib/hooks/use-observable';
import type { StoreValue } from '@flow/content/editor/type';

import Send from './send';

import { getWebhookPathTreeValue } from './utils';

interface Props {
  value: Input[];
  onChange: (v: Input[]) => void;
  values: Record<string, any>;
  error?: string;
}

function Inputs({ value, onChange, values, error }: Props): JSX.Element | null {
  const formulaEditorRef = useRef<RefType>();
  const [customRules, setCustomRules] = useState<CustomRule[]>();
  const { tableSchema } = useContext(sourceTable);
  const { id: flowId = '' } = useObservable<StoreValue>(store);

  const getVariables = useCallback(() => {
    return getVariableList(flowId);
  }, [flowId]);

  const { data, isLoading } = useQuery('GET_VARIABLE_LIST', getVariables, {
    refetchOnWindowFocus: false,
    enabled: !!flowId,
  });

  const pathTreeValue = useMemo(() => getWebhookPathTreeValue(tableSchema, data), [tableSchema, data]);

  useEffect(() => {
    const getInit = (type: 'header' | 'body' | 'query'): Input => ({
      type: 'string', name: '', data: '', in: type, id: nanoid(),
    });
    if (values.type === 'send' && !value?.length) {
      onChange(['header' as const, 'body' as const, 'query' as const].map(getInit));
    }
  }, [values.type]);

  function apiParamsConfig(): JSX.Element {
    return (
      <ApiParamsConfig
        onChange={onChange}
        ref={formulaEditorRef}
        value={value}
        url={values.url}
        customRules={customRules!}
        validating={!isUndefined(error)}
      />
    );
  }

  function send(): JSX.Element {
    return (
      <Send
        value={value}
        onChange={onChange}
        ref={formulaEditorRef}
        customRules={customRules!}
      />
    );
  }

  const isRequest = propEq('type', 'request');
  const isSend = propEq('type', 'send');
  const getInputsConfig = cond<Record<string, any>[], any>([
    [(val) => and(isRequest(val), !!customRules), always(apiParamsConfig)],
    [(val) => and(isSend(val), !!customRules), always(send)],
    [T, always(() => <></>)],
  ]);
  const InputsConfig = useMemo(() => getInputsConfig(values), [values.type, value.length, customRules]);

  if (isLoading) {
    return <Loading desc="加载中..." />;
  }

  if (values.type === 'request' && !values.url) {
    return null;
  }

  return (
    <div className="webhook-request-inputs">
      <InputsConfig />
      <PathTreeWithOperates
        currentFormulaEditorRef={formulaEditorRef}
        pathTreeValue={pathTreeValue}
        onRulesChange={setCustomRules}
      />
    </div>
  );
}

export default Inputs;
