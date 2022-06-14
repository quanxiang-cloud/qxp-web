import React, { useState } from 'react';
import cs from 'classnames';
import { clone } from 'ramda';
import { Cascader } from 'antd';
import { SingleValueType, DefaultOptionType } from 'rc-cascader/lib/Cascader';

import { RawApiDocDetail } from '@polyApi/effects/api/raw';
import ApiDocDetail from '@polyApi/components/api-doc-detail';
import { PathType } from '@lib/api-collection';

import { useGetOptionFromCollection } from './hooks/api-selector-hooks';

type Props = {
  initRawApiPath: string;
  setApiPath: (apiPath: string, method?: string) => void;
  appID: string,
  label?: string;
  error?: string;
  className?: string;
  usePolyApiOption?: boolean;
  simpleMode?: boolean;
  apiDocDetail?: RawApiDocDetail;
  onClear?: () => void;
};

function ApiSelector({
  error,
  className,
  simpleMode,
  setApiPath,
  appID,
  apiDocDetail,
  initRawApiPath,
  label = '全部API:',
  usePolyApiOption = false,
  onClear,
}: Props): JSX.Element {
  const [apiDirectoryWithPathType, setApiDirectoryWithPathType] = useState({ directory: '', pathType: PathType.RAW_ROOT });
  const options = useGetOptionFromCollection({ appID, apiDirectoryWithPathType, usePolyApiOption });

  function onChange(
    value: SingleValueType | SingleValueType[],
    selectedOptions: DefaultOptionType[],
  ): void {
    const leafOption = clone(selectedOptions).pop();
    if (leafOption?.isLeaf) {
      setApiPath(leafOption.path, leafOption.method);
      return;
    } else {
      const targetOption = selectedOptions[selectedOptions.length - 1];
      if (hasLeaf(targetOption)) return;

      setApiDirectoryWithPathType({ directory: targetOption.path, pathType: targetOption.pathType });
    }
    if (Array.isArray(value) && !value.length) onClear?.();
  }

  function hasLeaf(targetOption: DefaultOptionType): boolean {
    return !!targetOption.children?.some(({ isLeaf }) => isLeaf);
  }

  if (simpleMode) {
    return (
      <Cascader
        changeOnSelect
        className={cs('cascader', className)}
        defaultValue={[initRawApiPath]}
        // displayRender={(label)=> label[label.length - 1]}
        options={options}
        loadData={() => {}}
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
          loadData={() => {}}
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
