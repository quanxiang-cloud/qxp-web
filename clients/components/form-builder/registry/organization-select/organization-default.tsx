import * as React from 'react';
import { useQuery } from 'react-query';

import { TreeNode } from 'react-dropdown-tree-select';
import { searchOrganziation } from './messy/api';
import Cascader, { parseTree, searchTree } from './cascader';
import { StoreContext } from '../../context';

interface Props {
  value: TreeNode | TreeNode[];
  onChange: (value: TreeNode | TreeNode[]) => void;
  multiple: 'signle' | 'multiple';
  rangeList: string[];
  optionalRange: 'all' | 'customize';

}

const OrganizationDefaultPicker = (props: Props) => {
  const { value, onChange, multiple, rangeList, optionalRange } = props;
  const store = React.useContext(StoreContext);
  const { appID } = store;
  const { data } = useQuery(['query_user_picker', appID], () => searchOrganziation(appID));

  const CustomizeTreeData = React.useMemo(() => {
    const Tree = parseTree(data);
    return rangeList ? rangeList.map((itm) => searchTree(Tree as TreeNode, itm)).filter(Boolean) : [];
  }, [data, rangeList]);

  const TreeData = React.useMemo(() => {
    return parseTree(data);
  }, [data]);

  const MemoValue = React.useMemo(() => {
    return (value || []).map((itm: TreeNode) => itm.value);
  }, [value]);

  return (
    <Cascader
      mode={multiple == 'signle' ? 'radioSelect' : 'multiSelect'}
      data={optionalRange == 'customize' ? CustomizeTreeData : TreeData}
      value={MemoValue}
      onChange={(selects) => {
        onChange(selects);
      }}
    />
  );
};

export default OrganizationDefaultPicker;
