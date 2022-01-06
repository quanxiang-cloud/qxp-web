import React, { useEffect, useState } from 'react';
import { clone } from 'ramda';
import { Cascader } from 'antd';
import { useParams } from 'react-router-dom';
import cs from 'classnames';

import { RawApiDocDetail, useGetRequestNodeApiList } from '@polyApi/effects/api/raw';
import { useGetNamespaceFullPath, useQueryNameSpaceRawRootPath } from '@polyApi/effects/api/namespace';
import { convertRawApiListToOptions, getChildrenOfCurrentSelectOption } from '@polyApi/utils/request-node';
import ApiDocDetail from '@polyApi/components/api-doc-detail';

type Props = {
  apiDocDetail?: RawApiDocDetail;
  initRawApiPath: string;
  setApiPath: (apiPath: string) => void;
  simpleMode?: boolean;
  className?: string;
  label?: string;
  error?: string;
}

function ApiSelector({
  apiDocDetail, setApiPath, initRawApiPath, simpleMode, className, label = '全部API:', error,
}: Props): JSX.Element {
  const { appID } = useParams<{ appID: string }>();
  const [apiNamespacePath, setApiNamespacePath] = useState('');
  const [options, setOptions] = useState<any[]>();

  const { data: namespace } = useQueryNameSpaceRawRootPath(appID);
  const { data: namespacePaths } = useGetNamespaceFullPath({
    path: namespace?.appPath?.slice(1) || '',
    body: { active: -1 },
  }, { enabled: !!namespace?.appPath });
  const { data: currentRawApiDetails } = useGetRequestNodeApiList({
    path: apiNamespacePath.slice(1) || '',
    body: { withSub: true, active: -1, page: 1, pageSize: -1 },
  }, { enabled: !!apiNamespacePath });

  // load api nodes options
  useEffect(() => {
    setOptions(clone(options)?.map(updateApiLeafOptions));
  }, [currentRawApiDetails]);

  // load name space path options
  useEffect(() => {
    setOptions(getChildrenOfCurrentSelectOption(namespacePaths?.root.children));
  }, [namespacePaths?.root.children]);

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

  function onChange(value: any, selectedOptions: any): any {
    const leafOption = clone(selectedOptions).pop();
    if (leafOption?.isLeaf) {
      setApiPath(leafOption.path);
      return;
    }
  }

  function loadData(selectedOptions: any): void {
    const targetOption = selectedOptions[selectedOptions.length - 1];

    targetOption.children = getChildrenOfCurrentSelectOption(targetOption.childrenData) ||
    setApiNamespacePath(targetOption.path);
  }

  if (simpleMode) {
    return (
      <Cascader
        changeOnSelect
        className={cs('cascader', className)}
        defaultValue={[initRawApiPath]}
        // displayRender={(label)=> label[label.length - 1]}
        options={options}
        loadData={loadData}
        onChange={onChange}
      />
    );
  }

  return (
    <div className={cs('px-20 py-12 flex', className)}>
      <div className="poly-api-selector mb-8">
        <label>{label}</label>
        <Cascader
          changeOnSelect
          className="cascader"
          defaultValue={[initRawApiPath]}
          options={options}
          loadData={loadData}
          onChange={onChange}
          placeholder="请选择API"
        />
        {error && <span className="text-red-500 pt-8">{error}</span>}
      </div>
      {apiDocDetail && (
        <ApiDocDetail
          className="flex-1"
          method={apiDocDetail.doc.method}
          url={apiDocDetail.doc.url}
          identifier={apiDocDetail?.apiPath?.split('/')?.pop()?.split('.')?.shift()}
        />
      )}
    </div>
  );
}

export default ApiSelector;
