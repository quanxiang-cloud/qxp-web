import React from 'react';
import { useQuery } from 'react-query';

import { TreeNode } from 'react-dropdown-tree-select';
import { searchOrganziation } from './messy/api';
import Cascader, { parseTree, searchTree } from './cascader';

interface Props {
  appID: string;
  value: string[];
  onChange: (value: TreeNode | TreeNode[]) => void;
  multiple: 'single' | 'multiple';
  optionalRange: 'all' | 'customize';
  placeholder?: string;
  rangeList?: string[];
}

const OrganizationPicker = ({
  multiple,
  rangeList,
  appID,
  onChange,
  optionalRange,
  ...otherProps
}: Props): JSX.Element => {
  const { data } = useQuery(['query_user_picker', appID], () => searchOrganziation(appID));

  const CustomizeTreeData = React.useMemo(() => {
    const Tree = parseTree(data);
    return rangeList ? rangeList.map((itm) => searchTree(Tree as TreeNode, itm)).filter(Boolean) : [];
  }, [data, rangeList]);

  const TreeData = React.useMemo(() => {
    return parseTree(data);
  }, [data]);

  React.useEffect(() => {
    onChange([]);
  }, [optionalRange, multiple]);

  return (
    <Cascader
      mode={multiple === 'single' ? 'radioSelect' : 'multiSelect'}
      data={optionalRange === 'customize' ? CustomizeTreeData : TreeData}
      onChange={onChange}
      {...otherProps}
    />
  );
};

export default OrganizationPicker;
