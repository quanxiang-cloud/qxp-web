import React, { useEffect, useState } from 'react';
import { clone } from 'ramda';
import { Cascader } from 'antd';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';

import { useGetRequestNodeApiList } from '@portal/modules/poly-api/effects/api/raw';
import {
  useGetNamespaceFullPath,
  useQueryNameSpaceRawRootPath,
} from '@portal/modules/poly-api/effects/api/namespace';
import {
  convertRawApiListToOptions,
  getChildrenOfCurrentSelectOption,
} from '@portal/modules/poly-api/utils/request-node';
import ApiDocDetail from '@polyApi/components/api-doc-detail';

type Props = {
  apiDocDetail: any;
  initRawApiPath: string;
  setApiPath: (apiPath: string) => void;
}

function ApiSelector({ apiDocDetail, setApiPath, initRawApiPath }: Props): JSX.Element {
  const { appID } = useParams<{ appID: string }>();
  const [selectValue, setSelectValue] = useState<any>();
  const [apiNamespacePath, setApiNamespacePath] = useState('');
  const [options, setOptions] = useState<any[]>();
  const [init, setInit] = useState<undefined | boolean>();
  const [initValueAndOptions, setInitValueAndOptions] = useState<{
    initValue: string; initOptions: any;
  }>();

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
    initRawApiPath && setInitValueAndOptions(getInitOptions(
      getInitSelectValue(),
      getChildrenOfCurrentSelectOption(namespacePaths?.root.children),
    ));
    setOptions(getChildrenOfCurrentSelectOption(namespacePaths?.root.children));
  }, [namespacePaths?.root.children]);

  useEffect(() => {
    initRawApiPath && setSelectValue(getInitSelectValue());
  }, []);

  function getInitSelectValue(): string[] {
    const rawApiPath = initRawApiPath;
    const test = initRawApiPath.replace(namespace?.appPath || '', '')?.split('/');
    test.shift();
    test.pop();
    namespace?.appPath && test.push(rawApiPath);
    return test;
  }

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
      setSelectValue(value);
      return;
    }
    setSelectValue(value);
  }

  function loadData(selectedOptions: any): void {
    const targetOption = selectedOptions[selectedOptions.length - 1];

    targetOption.children = getChildrenOfCurrentSelectOption(targetOption.childrenData) ||
    setApiNamespacePath(targetOption.path);
  }

  // todo refactor this
  function getInitOptions(initValue: any, allData: any): any {
    return {
      initValue: initValue,
      initValueAndOptions: [allData.find(({ label }: any) => label === initValue[0])]
        .map(({ label, value, childrenData, path, isLeaf }: any) =>{
          return {
            label,
            value,
            path,
            isLeaf,
            children: [childrenData.find(({ name }: any) => name === initValue[1])]
              .map(({ name, parent }: any) => {
                return {
                  label: name,
                  value: name,
                  isLeaf: false,
                  children: [
                    {
                      label: name,
                      value: `${parent}/${name}`,
                      path: `${parent}/${name}`,
                      isLeaf: true,
                    },
                  ],
                  childrenData: '',
                  path: `${parent}/${name}`,
                };
              }),
            childrenData: childrenData,
          };
        }),
    };
  }

  return (
    <div className="px-20 py-12 flex">
      <div className="poly-api-selector">
        全部API：
        <Cascader
          changeOnSelect
          className="cascader"
          value={selectValue}
          options={typeof init === 'undefined' ? initValueAndOptions?.initOptions : options}
          loadData={loadData}
          onChange={onChange}
          onPopupVisibleChange={(value) => setInit(value)}
        />
      </div>
      {apiDocDetail && (
        <ApiDocDetail
          className="flex-1"
          method={apiDocDetail.doc.method}
          url={apiDocDetail.doc.url}
          identifier={apiDocDetail.apiPath.split('/').pop()}
        />
      )}
    </div>
  );
}

export default observer(ApiSelector);
