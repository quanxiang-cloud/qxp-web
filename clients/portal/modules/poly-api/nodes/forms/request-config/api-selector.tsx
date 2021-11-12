import React, { useEffect, useState } from 'react';
import { Cascader } from 'antd';
import { useParams } from 'react-router-dom';

import { useQueryNameSpaceRawRootPath } from '@portal/modules/poly-api/effects/api/namespace';
import {
  DirectoryPath,
  ApiDetails,
  useGetRequestNodeApi,
  useGetRequestNodeApiList,
} from '@portal/modules/poly-api/effects/api/poly';

type Props = {
  setParams: (params: ApiDetails) => void,
}

function ApiSelector({ setParams }: Props): JSX.Element {
  const { appID } = useParams<{ appID: string }>();
  const [apiPath, setApiPath] = useState('');
  const { data: namespace } = useQueryNameSpaceRawRootPath(appID);
  const { data } = useGetRequestNodeApiList({
    path: namespace?.appPath?.slice(1) || '',
    body: { withSub: true, active: -1, page: 1, pageSize: -1 },
  }, { enabled: !!namespace?.appPath });
  const { data: apiData } = useGetRequestNodeApi({
    path: apiPath.slice(1),
    body: { docType: 'raw', titleFirst: true },
  }, { enabled: !!apiPath });

  function convertToOptions(rawApiList: DirectoryPath[]): any {
    return rawApiList.map(({ name, fullPath }) => {
      return { label: name, value: fullPath };
    });
  }

  useEffect(() => {
    setParams(apiData as ApiDetails);
  }, [apiData]);

  return (
    <div className="px-20 py-12 flex">
      <div className="poly-api-selector">
        全部API：
        <Cascader
          className="cascader"
          options={convertToOptions(data?.list || [])}
          expandTrigger="hover"
          onChange={(value) => setApiPath(value.toString())}
        />
      </div>
      {apiData && (
        <div className="flex-1 flex items-center justify-between overflow-auto">
          请求方法：<span className="text-green-600 mr-8">{apiData?.doc.method}</span>
          接口路径：<span className="flex-2 truncate mr-8">{apiData?.doc.url}</span>
          API标识：<span className="flex-1 truncate">{apiData?.apiPath.split('/').pop()}</span>
        </div>
      )}
    </div>
  );
}

export default ApiSelector;
