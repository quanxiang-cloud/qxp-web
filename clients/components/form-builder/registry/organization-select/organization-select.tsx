import React from 'react';
import { useQuery } from 'react-query';
import { TreeSelect } from 'antd';
import { TreeSelectProps } from 'antd/lib/tree-select';
import { DataNode } from 'rc-tree-select/lib/interface';
import { searchOrganization, Organization } from './messy/api';

type Props = TreeSelectProps<any> & {
  appID: string;
  onChange: (value: LabelValue[]) => void;
  optionalRange: 'all' | 'customize';
  rangeList?: LabelValue[];
  value?: LabelValue[];
}

type ParseTreeProps = {
  depTreeData?: Organization | undefined;
  initData?: DataNode[];
  rootPId?: string | number;
  fullPath?: string;
}

function parseTree({
  depTreeData,
  initData = [],
  rootPId,
  fullPath,
}: ParseTreeProps): DataNode[] {
  if (!depTreeData) {
    return initData;
  }

  const _fullPath = fullPath ? `${fullPath}/${depTreeData?.id}` : depTreeData?.id;
  initData.push({
    id: depTreeData?.id,
    title: depTreeData?.departmentName,
    pId: depTreeData?.pid || rootPId,
    value: depTreeData?.id,
    fullPath: _fullPath,
  });
  if (depTreeData?.child) {
    depTreeData.child.map((dep) => parseTree({ depTreeData: dep, initData, fullPath: _fullPath }));
  }

  return initData;
}

const OrganizationPicker = ({
  rangeList,
  appID,
  onChange,
  optionalRange,
  value = [],
  ...otherProps
}: Props): JSX.Element => {
  const { data } = useQuery(['query_user_picker', appID], () => searchOrganization(appID));
  const treeData = React.useMemo(() => {
    const treeDataTmp = parseTree({ depTreeData: data, rootPId: 0 });
    if (optionalRange === 'customize') {
      if (!rangeList || !rangeList.length) {
        return [];
      }

      const fullPaths: string[] = [];
      const visibleParentNodes: string[] = rangeList.reduce((acc, { value }) => {
        const nodeTmp = treeDataTmp?.find(({ id }) => id === value);
        if (nodeTmp) {
          fullPaths.push(nodeTmp.fullPath);
          return acc.concat(nodeTmp.fullPath.split('/'));
        }

        return acc;
      }, rangeList.map(({ value }) => value)).filter((id, index, self) => {
        return self.indexOf(id) === index;
      });

      return treeDataTmp.filter(({ id, fullPath }) => {
        if (visibleParentNodes.includes(id) || fullPaths.some((path) => fullPath.startsWith(path))) {
          return true;
        }

        return false;
      });
    }

    return treeDataTmp;
  }, [data, optionalRange, rangeList]);

  const handleChange = (value: string | string[], labels: React.ReactNode[]): void => {
    const valueTmp = Array.isArray(value) ? value : [value];
    onChange(
      valueTmp.map((v, index) => ({
        value: v,
        label: labels[index] as string,
      })),
    );
  };

  const valList = (value || []).map(({ value }: LabelValue) => value) || [];
  const selected = otherProps.multiple ? valList : valList.toString();

  return (
    <TreeSelect
      {...otherProps}
      className='flex-1'
      allowClear
      showSearch
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      treeNodeFilterProp="title"
      treeDataSimpleMode={{
        id: 'id',
        rootPId: 0,
      }}
      onChange={handleChange}
      value={selected ? selected : undefined}
      treeData={treeData}
    />
  );
};

export default OrganizationPicker;
