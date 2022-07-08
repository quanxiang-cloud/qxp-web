import React, { useRef, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { nanoid } from 'nanoid';
import { isUndefined } from 'lodash';
import { useUpdateEffect } from 'react-use';

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
import BodyEditor, { EditorRefType } from './body-editor';
import { getWebhookPathTreeValue } from './utils';

interface Props {
  value: Input[];
  onChange: (v: Input[]) => void;
  values: Record<string, any>;
  error?: string;
}

function Inputs({ value, onChange, values, error }: Props): JSX.Element | null {
  const { type: triggerType, url, editWay } = values;
  const formulaEditorRef = useRef<RefType>();
  const refEditor = useRef<EditorRefType>();
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

  const getInit = useCallback((type: 'header' | 'body' | 'query'): Input => {
    const item: Input = {
      type: 'string', name: '', data: '', in: type,
    };
    if (editWay === 'multiple') {
      return { ...item, id: nanoid() };
    }
    return item;
  }, [editWay]);

  const inputVal = useMemo(() => {
    return ['header' as const, 'body' as const, 'query' as const].map(getInit);
  }, [getInit]);

  useEffect(() => {
    if (triggerType === 'send' && !value?.length) {
      onChange(inputVal);
    }
  }, [triggerType]);

  useUpdateEffect(() => {
    triggerType === 'send' && onChange(inputVal);
  }, [triggerType, inputVal]);

  if (isLoading) {
    return <Loading desc="加载中..." />;
  }

  if (triggerType === 'request' && !url) {
    return null;
  }

  const onInsertText = (val: string): void=>{
    refEditor.current?.onInsertText(val);
  };

  return (
    <div className="webhook-request-inputs">
      {triggerType === 'request' && (
        <div className='flex-1 overflow-hidden'>
          {editWay === 'simple' && (
            <BodyEditor value={JSON.stringify(value, null, 4)} onChange={onChange} ref={refEditor}/>
          )}
          {editWay === 'multiple' && (
            <ApiParamsConfig
              onChange={onChange}
              ref={formulaEditorRef}
              value={value}
              url={values.url}
              customRules={customRules!}
              validating={!isUndefined(error)}
            />
          )}
        </div>)}
      { triggerType === 'send' && (
        <div className='flex-1 overflow-y-auto'>
          {editWay === 'simple' && (
            <BodyEditor value={JSON.stringify(value, null, 4)} onChange={onChange} ref={refEditor}/>
          )}
          {editWay === 'multiple' && (
            <Send
              value={value}
              onChange={onChange}
              ref={formulaEditorRef}
              customRules={customRules!}
            />
          )}
        </div>
      )}
      <PathTreeWithOperates
        currentFormulaEditorRef={formulaEditorRef}
        pathTreeValue={pathTreeValue}
        onRulesChange={setCustomRules}
        onInsertText={onInsertText}
      />
    </div>
  );
}

export default Inputs;
