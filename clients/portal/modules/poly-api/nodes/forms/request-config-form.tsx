import React, { useState } from 'react';
import { isEmpty } from 'lodash';

import { ApiDetails } from '../../effects/api/poly';
import ApiSelector from './request-config/api-selector';
import ApiFormulaConfig from './request-config/api-formula';
import ApiParamsConfig from './request-config/api-params-config';

function RequestConfigForm(): JSX.Element {
  const [params, setParams] = useState<ApiDetails>();

  function convertToParamsConfig(apiData: ApiDetails | undefined): any[] {
    if (apiData) {
      const { doc } = apiData;
      const { url, input } = doc;

      let path = {};
      const pathArr = url.split('/:');
      pathArr.shift();
      if (!isEmpty(pathArr)) {
        path = {
          path: pathArr.map((path: string) => {
            return { name: path.split('/')[0].split('?')[0], required: true };
          }),
        };
      }

      const test = input.inputs.map((input: any) => {
        const { title, name } = input;
        return [input.in, { title, name }];
      });

      const test1: any = {};
      test.forEach((item: any) => {
        test1[item[0]] = test1[item[0]] || [];
        test1[item[0]].push(item[1]);
      });

      return Object.assign(path, test1);
    }

    return [];
  }

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
