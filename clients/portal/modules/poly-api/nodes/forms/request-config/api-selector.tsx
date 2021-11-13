import React from 'react';
import { Cascader } from 'antd';

type Props = {
  options: LabelValue[];
  apiDocDetail: any;
  setApiDocPath: (apiPath: string) => void;
}

function ApiSelector({ options, apiDocDetail, setApiDocPath }: Props): JSX.Element {
  return (
    <div className="px-20 py-12 flex">
      <div className="poly-api-selector">
        全部API：
        <Cascader
          className="cascader"
          options={options}
          expandTrigger="hover"
          onChange={(value: any) => setApiDocPath(value.pop().toString())}
        />
      </div>
      {apiDocDetail && (
        <div className="flex-1 flex items-center justify-between overflow-auto">
          请求方法：<span className="text-green-600 mr-8">{apiDocDetail.doc.method}</span>
          接口路径：<span className="flex-2 truncate mr-8">{apiDocDetail.doc.url}</span>
          API标识：<span className="flex-1 truncate">{apiDocDetail.apiPath.split('/').pop()}</span>
        </div>
      )}
    </div>
  );
}

export default ApiSelector;
