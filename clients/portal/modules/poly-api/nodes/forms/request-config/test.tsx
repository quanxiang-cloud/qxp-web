import React, { useEffect, useState } from 'react';
import { Cascader } from 'antd';
import { useParams } from 'react-router-dom';

import { useQueryNameSpaceRawRootPath } from '@portal/modules/poly-api/effects/api/namespace';
import { useGetNamespaceFullPath, useGetRequestNodeApiList } from '@portal/modules/poly-api/effects/api/poly';
import { clone } from 'ramda';

function TestCascader(): JSX.Element {
  const { appID } = useParams<{ appID: string }>();
  const [selectValue, setSelectValue] = useState<any>();
  const [apiNamespacePath, setApiNamespacePath] = useState('');
  const [allApiOptions, setAllApiOptions] = useState<any[]>();

  const { data: namespace } = useQueryNameSpaceRawRootPath(appID);
  const { data: namespacePaths } = useGetNamespaceFullPath({
    path: namespace?.appPath?.slice(1) || '',
    body: { active: -1 },
  }, { enabled: !!namespace?.appPath });
  const { data: currentRawApiList } = useGetRequestNodeApiList({
    path: apiNamespacePath.slice(1) || '',
    body: { withSub: true, active: -1, page: 1, pageSize: -1 },
  }, { enabled: !!apiNamespacePath });

  function forEachOptions(option: any): any {
    if (!option) {
      return;
    }

    if (option.path === apiNamespacePath) {
      return {
        ...option,
        children: currentRawApiList?.list.length ? currentRawApiList?.list.map(({ name, fullPath }) => {
          return {
            label: name,
            value: fullPath,
            path: fullPath,
            isLeaf: true,
          };
        }) : [{ label: '暂无api', value: '', isLeaf: true, disabled: true }],
        childrenData: currentRawApiList?.list,
      };
    } else if (option.children) {
      option.children = option.children.map((opt: any) => forEachOptions(opt));
    }

    return option;
  }

  useEffect(() => {
    setAllApiOptions(clone(allApiOptions)?.map((option) => forEachOptions(option)));
  }, [currentRawApiList]);

  function mapRootChildren(data: any): any {
    if (!data) {
      return;
    }

    return data.map(({ name, children, parent }: any) => ({
      label: name,
      value: name,
      isLeaf: false,
      childrenData: children,
      path: `${parent}/${name}`,
    }));
  }

  function getChildrenOfCurrentSelectOption(selectedOption: any): any {
    if (!selectedOption.childrenData) {
      return null;
    }

    return selectedOption.childrenData.map(({ name, children, parent }: any) => {
      return {
        label: name,
        value: name,
        childrenData: children,
        isLeaf: false,
        path: `${parent}/${name}`,
      };
    });
  }

  function onChange(value: any, selectedOptions: any): void {}

  function loadData(selectedOptions: any): void {
    const targetOption = selectedOptions[selectedOptions.length - 1];

    targetOption.children = getChildrenOfCurrentSelectOption(targetOption) ||
    setApiNamespacePath(targetOption.path);
    allApiOptions && setAllApiOptions([...allApiOptions]);
  }

  useEffect(() => {
    setAllApiOptions(mapRootChildren(namespacePaths?.root.children));
  }, [namespacePaths?.root.children]);

  return <Cascader options={allApiOptions} loadData={loadData} onChange={onChange} changeOnSelect />;
}

export default TestCascader;
