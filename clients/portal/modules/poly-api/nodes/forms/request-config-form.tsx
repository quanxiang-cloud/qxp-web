import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import ApiSelector from './request-config/api-selector';
import ApiFormulaConfig from './request-config/api-formula';
import ApiParamsConfig from './request-config/api-params-config';
import { convertToParamsConfig } from '../../utils/request-node';
import { useQueryNameSpaceRawRootPath } from '../../effects/api/namespace';
import {
  useGetNamespaceFullPath,
  useGetRequestNodeApi,
  useGetRequestNodeApiList,
} from '../../effects/api/poly';
import PageLoading from '@c/page-loading';

function RequestConfigForm(): JSX.Element {
  const { appID } = useParams<{ appID: string }>();
  const [apiPath, setApiPath] = useState('');

  const { data: namespace } = useQueryNameSpaceRawRootPath(appID);

  const { data } = useGetRequestNodeApiList({
    path: namespace?.appPath?.slice(1) || '',
    body: { withSub: true, active: -1, page: 1, pageSize: -1 },
  }, { enabled: !!namespace?.appPath });

  const { data: testData } = useGetNamespaceFullPath({
    path: namespace?.appPath?.slice(1) || '',
    body: { active: -1 },
  }, { enabled: !!namespace?.appPath });

  function mapToLabelValue(test: Array<any> | null): any {
    if (!test) {
      return;
    }

    return test.map(({ name, parent, children }: any) => {
      return { label: name, value: `${parent}/${name}`, children: mapToLabelValue(children) };
    });
  }

  const { data: apiDocDetail, isLoading, isSuccess } = useGetRequestNodeApi({
    path: apiPath.slice(1),
    body: { docType: 'raw', titleFirst: true },
  }, { enabled: !!apiPath });

  return (
    <>
      <ApiSelector
        setApiDocPath={setApiPath}
        apiDocDetail={apiDocDetail}
        options={mapToLabelValue(testData?.root.children)}
      />
      <div className="flex flex-1 border-t-1" style={{ height: 'calc(100% - 56px)' }}>
        {isLoading && <PageLoading />}
        {isSuccess && apiDocDetail && (
          <>
            <ApiParamsConfig configs={convertToParamsConfig(apiDocDetail)} />
            <ApiFormulaConfig />
          </>
        )}
        {( !apiPath || (isSuccess && !apiDocDetail)) && (
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
