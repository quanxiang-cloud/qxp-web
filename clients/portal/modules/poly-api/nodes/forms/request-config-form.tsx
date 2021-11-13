import React, { useState } from 'react';

import { ApiDetails } from '../../effects/api/poly';
import ApiSelector from './request-config/api-selector';
import ApiFormulaConfig from './request-config/api-formula';
import ApiParamsConfig from './request-config/api-params-config';
import { convertToParamsConfig } from '../../utils/request-node';

function RequestConfigForm(): JSX.Element {
  const [params, setParams] = useState<ApiDetails>();

  return (
    <>
      <ApiSelector setParams={setParams} />
      <div className="flex flex-1 border-t-1" style={{ height: 'calc(100% - 56px)' }}>
        {params ? (
          <>
            <ApiParamsConfig configs={convertToParamsConfig(params)} />
            <ApiFormulaConfig />
          </>
        ) : (
          <div className="m-auto flex flex-col items-center">
            <img src='/dist/images/no-approval-task.svg'/>
            <span className="mt-8">暂无数据，请选择上方“全部API”选项</span>
          </div>
        )}
      </div>
    </>
  );
}
export default RequestConfigForm;
