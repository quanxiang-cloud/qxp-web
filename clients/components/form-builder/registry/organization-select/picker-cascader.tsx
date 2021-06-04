import * as React from 'react';

import Cascader, { parseTree } from './cascader';
import { useQuery } from 'react-query';
import { searchOrganziation } from './messy/api';
import { TreeNode } from 'react-dropdown-tree-select';

interface PickerProps {
    value: string | string[];
    onChange: (list: string[]) => void;
    mode: 'radioSelect' | 'multiSelect'
}

const Picker = ({ value, onChange, mode }: PickerProps) => {
  const { data } = useQuery(['query_user_picker'], searchOrganziation);

  const CascaderData = parseTree(data);

  const handleChange = (selects: TreeNode[]) => {
    onChange(selects.map((itm) => itm.value));
  };

  return (<Cascader
    mode={mode}
    value={value}
    data={CascaderData}
    onChange={handleChange}
  />);
};

export default Picker;
