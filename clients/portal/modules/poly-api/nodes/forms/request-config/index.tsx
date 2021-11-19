import React, { useEffect, useRef, useCallback, useState } from 'react';
import { usePrevious } from 'react-use';
import { mergeDeepRight } from 'ramda';

import toast from '@lib/toast';
import PageLoading from '@c/page-loading';
import { useGetRequestNodeApi } from '@polyApi/effects/api/raw';
import type { CustomRule } from '@c/formula-editor';
import type { RefType as PathTreeRefType } from '@polyApi/components/poly-node-path-tree';

import ApiSelector from './api-selector';
import ApiFormulaConfig from './api-formula';
import ApiParamsConfig, { RefType } from './api-params-config';

type Props = {
  value: POLY_API.PolyRequestNodeDetail;
  onChange: (value: POLY_API.PolyRequestNodeDetail) => void;
}

function RequestConfigForm({ value, onChange }: Props): JSX.Element {
  const formularEditorRef = useRef<RefType>();
  const polyNodePathTreeRef = useRef<PathTreeRefType | null>(null);
  const [customRules, setCustomRules] = useState<CustomRule[]>([]);

  const { data: apiDocDetail, isLoading, error } = useGetRequestNodeApi({
    path: value.rawPath.slice(1),
    body: { docType: 'raw', titleFirst: true },
  }, { enabled: !!value.rawPath });

  function mergeInputs(
    vInputs: POLY_API.PolyNodeInput[], apiInputs: POLY_API.PolyNodeInput[],
  ): POLY_API.PolyNodeInput[] {
    const old = { inputs: vInputs };
    const news = { inputs: apiInputs };
    return mergeDeepRight(old, news).inputs as POLY_API.PolyNodeInput[];
  }

  const previousRawPath = usePrevious(isLoading ? undefined : value.rawPath);
  useEffect(() => {
    if ((previousRawPath && previousRawPath === value.rawPath) || isLoading || !value.rawPath) {
      return;
    }
    const apiInputs = apiDocDetail?.doc?.input?.inputs || [];
    const inputs = !previousRawPath ? value.inputs : mergeInputs(value.inputs, apiInputs);
    onChange({
      ...value,
      apiName: apiDocDetail?.apiPath.split('/').pop() || '',
      outputs: apiDocDetail?.doc?.output?.doc?.[0]?.data || [],
      inputs,
    });
  }, [apiDocDetail, value, previousRawPath, isLoading]);

  useEffect(() => {
    if (customRules.length || !polyNodePathTreeRef.current) {
      return;
    }
    const rules = polyNodePathTreeRef.current.getCustomRules();
    setCustomRules(rules || []);
  }, [customRules, polyNodePathTreeRef.current]);

  useEffect(() => {
    error && toast.error(error?.message);
  }, [error]);

  const handleApiPathChange = useCallback((path: string) => {
    onChange({ ...value, rawPath: path });
  }, [onChange, value]);

  const setRequestNodeInputs = useCallback((inputs: POLY_API.PolyNodeInput[]) => {
    onChange({ ...value, inputs });
  }, [onChange, value]);

  return (
    <>
      <ApiSelector
        setApiPath={handleApiPathChange}
        initRawApiPath={value.rawPath}
        apiDocDetail={apiDocDetail}
      />
      <div className="flex flex-1 border-t-1" style={{ height: 'calc(100% - 56px)' }}>
        {isLoading && <PageLoading />}
        {apiDocDetail && (
          <>
            <ApiParamsConfig
              onChange={setRequestNodeInputs}
              ref={formularEditorRef}
              value={value.inputs}
              url={apiDocDetail.doc.url}
              customRules={customRules}
            />
            <ApiFormulaConfig
              currentFormulaEditorRef={formularEditorRef}
              ref={polyNodePathTreeRef}
            />
          </>
        )}
        {(!value.rawPath || (!isLoading && !apiDocDetail)) && (
          <div className="m-auto flex flex-col items-center">
            <img src='/dist/images/no-approval-task.svg'/>
            <span className="mt-8 text-12 text-gray-400">暂无数据，请选择上方“全部API”选项</span>
          </div>
        )}
      </div>
    </>
  );
}

export default RequestConfigForm;
