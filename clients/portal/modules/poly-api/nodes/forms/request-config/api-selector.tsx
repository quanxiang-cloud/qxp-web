import React, { useEffect, useState } from 'react';
import { clone } from 'ramda';
import { Cascader } from 'antd';
import { useParams } from 'react-router-dom';
import cs from 'classnames';

import toast from '@lib/toast';
import ApiDocDetail from '@polyApi/components/api-doc-detail';
import { RawApiDocDetail, useGetRequestNodeApiList } from '@polyApi/effects/api/raw';
import { useGetNamespaceFullPath, useQueryNameSpaceRawRootPath } from '@polyApi/effects/api/namespace';
import { getChildrenOfCurrentSelectOption, mergeApiListToOptions } from '@polyApi/utils/request-node';

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

  const { data: namespace, error: fetchRootPathError } = useQueryNameSpaceRawRootPath(appID);
  const { data: namespacePaths, error: fetchNameSpacePathError } = useGetNamespaceFullPath({
    path: namespace?.appPath?.slice(1) || '',
    body: { active: -1 },
  }, { enabled: !!namespace?.appPath });
  const { data: currentRawApiDetails, isLoading, error: fetchApiListError } = useGetRequestNodeApiList({
    path: apiNamespacePath.slice(1) || '',
    body: { active: 1, page: 1, pageSize: -1 },
  }, { enabled: !!apiNamespacePath });

  // api cascader merge apiList options
  useEffect(() => {
    if ((isLoading && !currentRawApiDetails) || !options) {
      return;
    }

    setOptions(mergeApiListToOptions(options, apiNamespacePath, currentRawApiDetails?.list || []));
  }, [currentRawApiDetails, isLoading]);

  // api cascader load root options
  useEffect(() => {
    setOptions(getChildrenOfCurrentSelectOption(namespacePaths?.root.children));
  }, [namespacePaths?.root.children]);

  useEffect(() => {
    fetchApiListError && toast.error(fetchApiListError.message);
    fetchNameSpacePathError && toast.error(fetchNameSpacePathError.message);
    fetchRootPathError && toast.error(fetchRootPathError.message);
  }, [fetchApiListError, fetchNameSpacePathError, fetchRootPathError]);

  function onChange(value: any, selectedOptions: any): any {
    const leafOption = clone(selectedOptions).pop();
    if (leafOption?.isLeaf) {
      setApiPath(leafOption.path);
      return;
    }
  }

  function loadData(selectedOptions: any): void {
    const targetOption = selectedOptions[selectedOptions.length - 1];

    setApiNamespacePath(targetOption.path);
    targetOption.children = getChildrenOfCurrentSelectOption(targetOption.childrenData);
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
      <div className="poly-api-selector">
        <label className="mr-8">{label}</label>
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
