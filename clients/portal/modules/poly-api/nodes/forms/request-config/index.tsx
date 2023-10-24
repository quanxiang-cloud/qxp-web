import { diff } from 'just-diff';
import { useParams } from 'react-router-dom';
import { groupBy, lensPath, set, dissocPath, last, view, and, or } from 'ramda';
import React, {
  useEffect, useRef, useCallback, useState, forwardRef, ForwardedRef, useImperativeHandle,
} from 'react';

import toast from '@lib/toast';
import PageLoading from '@c/page-loading';
import type { CustomRule } from '@c/formula-editor';
import { useGetRequestNodeApi } from '@polyApi/effects/api/raw';
import { filterPolyApiInputs } from '@polyApi/utils/request-node';

import ApiSelector from './api-selector';
import PathTreeWithOperates from './path-tree-with-operates';
import ApiParamsConfig, { RefType } from './api-params-config';

type Props = {
  initialValues: POLY_API.PolyRequestNodeDetail;
  value: POLY_API.PolyRequestNodeDetail;
  onChange: (value: Partial<POLY_API.PolyRequestNodeDetail>) => void;
}

export function mergeInputs(
  vInputs: POLY_API.PolyNodeInput[], apiInputs: POLY_API.PolyNodeInput[],
): POLY_API.PolyNodeInput[] {
  const { add = [], replace = [], remove = [] } = groupBy(
    ({ op }) => op,
    diff(vInputs, apiInputs),
  );
  const diff2Sets = [...add, ...replace];

  const values = diff2Sets?.reduce((acc, diff) => {
    const { path, value } = diff;
    const lastPath = `${last(path)}`;
    const typePath = lastPath === 'type' ? path : path.slice(0, -1).concat('type');
    const oldTypeValue = view(lensPath(typePath), acc);
    const newTypeValue = view(lensPath(typePath), apiInputs);
    const isUpdateData = last(path) === 'data';
    const isUpdateType = last(path) === 'type';
    const isNewTypeSimple = !['array', 'object'].includes(newTypeValue);
    const isExpressSeted = oldTypeValue === 'direct_expr';

    if (isExpressSeted && (isUpdateData || isUpdateType) && isNewTypeSimple) {
      return acc;
    }
    return set(lensPath(path), value, acc);
  }, vInputs);

  return remove?.reduce((acc, diff) => dissocPath(diff.path, acc), values);
}

type RequestConfigRef = {
  validate(): never | void;
}
function RequestConfigForm(
  { initialValues, value, onChange }: Props,
  ref: ForwardedRef<RequestConfigRef>,
): JSX.Element {
  const formulaEditorRef = useRef<RefType>();
  const [customRules, setCustomRules] = useState<CustomRule[]>();

  const { appID } = useParams<{ appID: string }>();

  useImperativeHandle(ref, () => ({
    validate: () => formulaEditorRef.current?.validate(),
  }));

  const { data: apiDocDetail, isLoading, error } = useGetRequestNodeApi({
    path: value.rawPath.slice(1),
    body: { docType: 'raw', titleFirst: true },
  }, { enabled: !!value.rawPath });

  useEffect(() => {
    if (isLoading || !apiDocDetail) {
      return;
    }

    if (initialValues.rawPath === value.rawPath) {
      const apiInputs = filterPolyApiInputs(apiDocDetail.doc?.input?.inputs || []);
      const inputs = mergeInputs(initialValues.inputs, apiInputs);
      onChange({
        outputs: apiDocDetail?.doc?.output?.doc?.[0]?.data || [],
        inputs: filterPolyApiInputs(inputs),
      });
      return;
    }

    apiDocDetail.doc?.input?.inputs && onChange({
      outputs: apiDocDetail.doc?.output?.doc?.[0]?.data || [],
      inputs: filterPolyApiInputs(apiDocDetail.doc?.input?.inputs || []),
    });
  }, [isLoading, apiDocDetail]);

  useEffect(() => {
    error && toast.error(error?.message);
  }, [error]);

  const handleApiPathChange = useCallback((path: string) => {
    onChange({ ...value, rawPath: path });
  }, [onChange, value]);

  const setRequestNodeInputs = useCallback((inputs: POLY_API.PolyNodeInput[]) => {
    onChange({ ...value, inputs });
  }, [onChange, value]);

  const isNoData = or(!value.rawPath, and(!isLoading, !apiDocDetail));

  return (
    <>
      <ApiSelector
        setApiPath={handleApiPathChange}
        initRawApiPath={value.rawPath}
        apiDocDetail={apiDocDetail}
        appID={appID}
      />
      <div className="flex flex-1 border-t-1" style={{ height: 'calc(100% - 56px)' }}>
        {isLoading && <PageLoading />}
        {apiDocDetail && (
          <>
            {customRules && (
              <ApiParamsConfig
                onChange={setRequestNodeInputs}
                ref={formulaEditorRef}
                value={value.inputs}
                url={apiDocDetail.doc.url}
                customRules={customRules}
              />
            )}
            <PathTreeWithOperates
              currentFormulaEditorRef={formulaEditorRef}
              onRulesChange={setCustomRules}
            />
          </>
        )}
        {isNoData && (
          <div className="m-auto flex flex-col items-center">
            <img src='/dist/images/no-approval-task.svg'/>
            <span className="mt-8 text-12 text-gray-400">暂无数据，请选择上方“全部API”选项</span>
          </div>
        )}
      </div>
    </>
  );
}

export default forwardRef<RequestConfigRef, Props>(RequestConfigForm);
