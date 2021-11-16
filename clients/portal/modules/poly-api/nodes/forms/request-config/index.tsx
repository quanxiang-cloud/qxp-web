import React, { useEffect, useState } from 'react';

import toast from '@lib/toast';
import PageLoading from '@c/page-loading';

import ApiSelector from './api-selector';
import ApiFormulaConfig from './api-formula';
import { useGetRequestNodeApi } from '../../../effects/api/raw';
import ApiParamsConfig from './api-params-config';
import { ApiRequestNodeConfigContext } from './context';
import { CustomRule } from '@c/formula-editor';

type Props = {
  initialValues: any;
  value: any;
  onChange: (value: any) => void;
}

function RequestConfigForm({ initialValues, value, onChange }: Props): JSX.Element {
  const [apiPath, setApiPath] = useState(initialValues.rawPath);
  const [currentFormulaEditorRef, setCurrentFormulaRef] = useState<HTMLDivElement>();
  const [customRules, setCustomRules] = React.useState<CustomRule[]>([]);
  const [requestNodeInputs, setRequestNodeInputs] = useState();

  const { data: apiDocDetail, isLoading, isSuccess, isError, error } = useGetRequestNodeApi({
    path: apiPath.slice(1),
    body: { docType: 'raw', titleFirst: true },
  }, { enabled: !!apiPath });

  useEffect(() => {
    onChange({
      rawPath: apiPath,
      apiName: apiPath.split('/').pop(),
      inputs: requestNodeInputs,
      // outputs: [...configValue.doc.outputs],
    });
  }, [requestNodeInputs, apiPath]);

  if (isError) {
    toast.error(error?.message);
  }

  return (
    <>
      <ApiRequestNodeConfigContext.Provider value={{ currentFormulaEditorRef, customRules }}>
        <ApiSelector
          setApiPath={setApiPath}
          initRawApiPath={apiPath || value?.rawPath}
          apiDocDetail={apiDocDetail}
        />
        <div className="flex flex-1 border-t-1" style={{ height: 'calc(100% - 56px)' }}>
          {isLoading && <PageLoading />}
          {isSuccess && apiDocDetail && (
            <>
              <ApiParamsConfig
                onChange={setRequestNodeInputs}
                setCurrentFormulaRef={setCurrentFormulaRef}
                initRequestNodeInputs={initialValues.inputs}
                configValue={apiDocDetail}
              />
              <ApiFormulaConfig setCustomRules={setCustomRules} />
            </>
          )}
          {(!apiPath || (isSuccess && !apiDocDetail)) && (
            <div className="m-auto flex flex-col items-center">
              <img src='/dist/images/no-approval-task.svg'/>
              <span className="mt-8 text-12 text-gray-400">暂无数据，请选择上方“全部API”选项</span>
            </div>
          )}
        </div>
      </ApiRequestNodeConfigContext.Provider>
    </>
  );
}
export default RequestConfigForm;
