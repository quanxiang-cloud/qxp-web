import React, { useState } from 'react';
import cs from 'classnames';
import { clone } from 'ramda';
import { Cascader } from 'antd';
import { getQuery } from '@lib/utils';
import { SingleValueType, DefaultOptionType } from 'rc-cascader/lib/Cascader';

import { RawApiDocDetail } from '@polyApi/effects/api/raw';
import ApiDocDetail from '@polyApi/components/api-doc-detail';
import { getChildrenOfCurrentSelectOption } from '@polyApi/utils/request-node';

import { useGetOptions } from './hooks/api-selector-hooks';

type Props = {
  initRawApiPath: string;
  setApiPath: (apiPath: string) => void;
  label?: string;
  error?: string;
  className?: string;
  usePolyApiOption?: boolean;
  simpleMode?: boolean;
  apiDocDetail?: RawApiDocDetail;
}

function ApiSelector({
  error,
  className,
  simpleMode,
  setApiPath,
  apiDocDetail,
  initRawApiPath,
  label = '全部API:',
  usePolyApiOption = false,
}: Props): JSX.Element {
  const { appID } = getQuery<{appID: string, pageName: string, arteryID: string }>();
  const [apiNamespacePath, setApiNamespacePath] = useState('');
  const options = useGetOptions(appID, apiNamespacePath, usePolyApiOption);

  function onChange(value: SingleValueType | SingleValueType[], selectedOptions: DefaultOptionType[]): void {
    const leafOption = clone(selectedOptions).pop();
    if (leafOption?.isLeaf) {
      setApiPath(leafOption.path);
      return;
    }
  }

  function loadData(selectedOptions: DefaultOptionType[]): void {
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
