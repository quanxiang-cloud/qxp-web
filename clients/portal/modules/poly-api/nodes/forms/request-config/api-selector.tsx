import React, { useEffect, useState } from 'react';
import { clone } from 'ramda';
import { useParams } from 'react-router-dom';

import { useQueryNameSpaceRawRootPath } from '@portal/modules/poly-api/effects/api/namespace';
import { useGetNamespaceFullPath, useGetRequestNodeApiList } from '@portal/modules/poly-api/effects/api/poly';
import { mapNamespacePathsToLabelValue } from '@portal/modules/poly-api/utils/request-node';
import TestCascader from './test';

type Props = {
  apiDocDetail: any;
  setApiDocPath: (apiPath: string) => void;
}

function ApiSelector({ apiDocDetail, setApiDocPath }: Props): JSX.Element {
  const { appID } = useParams<{ appID: string }>();
  const [selectValue, setSelectValue] = useState<any>();
  const [currentOptionPath, setCurrentOptionPath] = useState('');
  const [apiNamespacePath, setApiNamespacePath] = useState('');
  const [allApiOptions, setAllApiOptions] = useState<any[]>();

  const { data: namespace } = useQueryNameSpaceRawRootPath(appID);
  const { data: namespacePaths } = useGetNamespaceFullPath({
    path: namespace?.appPath?.slice(1) || '',
    body: { active: -1 },
  }, { enabled: !!namespace?.appPath });
  const { data: currentRawApiList, isSuccess, isLoading } = useGetRequestNodeApiList({
    path: apiNamespacePath.slice(1) || '',
    body: { withSub: true, active: -1, page: 1, pageSize: -1 },
  }, { enabled: !!apiNamespacePath });

  useEffect(() => {
    setAllApiOptions(mapNamespacePathsToLabelValue(namespacePaths?.root.children));
  }, [namespacePaths?.root.children]);

  function updateAllApiOptions(option: any): string {
    if (isLoading || !isSuccess) {
      return '';
    }

    if (allApiOptions && !currentRawApiList?.list.length) {
      console.log(option);
      const indexOfCurrentOptions = currentOptionPath.split('.');
      // if (!allApiOptions[Number(indexOfCurrentOptions[0])].children) {
      //   allApiOptions[Number(indexOfCurrentOptions[0])].children[Number(indexOfCurrentOptions[1])]
      // }
      // .disabled = true;
      // setAllApiOptions([...allApiOptions]);
      return '';
    }

    return '';
  }

  function onChange(value: any, selectedOptions: any): void {
    const namespacePathOption = selectedOptions?.pop();
    setCurrentOptionPath(namespacePathOption?.path);
    if (
      namespacePathOption?.children?.length === 1 && namespacePathOption?.children[0].value === ''
    ) {
      setApiNamespacePath(clone(value).pop().toString());
      updateAllApiOptions(namespacePathOption) && setSelectValue([]);
    }
  }

  return (
    <div className="px-20 py-12 flex">
      <div className="poly-api-selector">
        全部API：
        {/* <Cascader
          changeOnSelect
          className="cascader"
          options={allApiOptions}
          value={selectValue}
          onChange={onChange}
          // onPopupVisibleChange={(p) => {
          //   console.log(p);
          // }}
        /> */}
        <TestCascader />
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
