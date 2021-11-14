import React, { useEffect, useState } from 'react';
import { clone } from 'ramda';
import { Cascader } from 'antd';
import { useParams } from 'react-router-dom';

import { useQueryNameSpaceRawRootPath } from '@portal/modules/poly-api/effects/api/namespace';
import { useGetNamespaceFullPath, useGetRequestNodeApiList } from '@portal/modules/poly-api/effects/api/poly';
import {
  convertRawApiListToOptions, getChildrenOfCurrentSelectOption,
} from '@portal/modules/poly-api/utils/request-node';

type Props = {
  apiDocDetail: any;
  setApiPath: (apiPath: string) => void;
}

function ApiSelector({ apiDocDetail, setApiPath }: Props): JSX.Element {
  const { appID } = useParams<{ appID: string }>();
  const [selectValue, setSelectValue] = useState<any>();
  const [apiNamespacePath, setApiNamespacePath] = useState('');
  const [allApiOptions, setAllApiOptions] = useState<any[]>();

  const { data: namespace } = useQueryNameSpaceRawRootPath(appID);
  const { data: namespacePaths } = useGetNamespaceFullPath({
    path: namespace?.appPath?.slice(1) || '',
    body: { active: -1 },
  }, { enabled: !!namespace?.appPath });
  const { data: currentRawApiDetails } = useGetRequestNodeApiList({
    path: apiNamespacePath.slice(1) || '',
    body: { withSub: true, active: -1, page: 1, pageSize: -1 },
  }, { enabled: !!apiNamespacePath });

  function updateApiLeafOptions(option: any): any {
    if (!option) {
      return;
    }

    if (option.path === apiNamespacePath) {
      return {
        ...option,
        children: convertRawApiListToOptions(currentRawApiDetails?.list || []),
        childrenData: currentRawApiDetails?.list,
      };
    } else if (option.children) {
      option.children = option.children.map(updateApiLeafOptions);
    }

    return option;
  }

  useEffect(() => {
    setAllApiOptions(clone(allApiOptions)?.map(updateApiLeafOptions));
  }, [currentRawApiDetails]);

  function onChange(value: any, selectedOptions: any): any {
    const leafOption = clone(selectedOptions).pop();
    if (leafOption.isLeaf) {
      setApiPath(leafOption.path);
      setSelectValue(value);
    }
  }

  function loadData(selectedOptions: any): void {
    const targetOption = selectedOptions[selectedOptions.length - 1];

    targetOption.children = getChildrenOfCurrentSelectOption(targetOption.childrenData) ||
    setApiNamespacePath(targetOption.path);
  }

  useEffect(() => {
    setAllApiOptions(getChildrenOfCurrentSelectOption(namespacePaths?.root.children));
  }, [namespacePaths?.root.children]);

  return (
    <div className="px-20 py-12 flex">
      <div className="poly-api-selector">
        全部API：
        <Cascader
          changeOnSelect
          className="cascader"
          value={selectValue}
          options={allApiOptions}
          loadData={loadData}
          onChange={onChange}
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
