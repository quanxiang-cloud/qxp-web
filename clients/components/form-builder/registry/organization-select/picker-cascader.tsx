import * as React from 'react';

import Cascader, { parseTree } from './cascader';
import { useQuery } from 'react-query';
import { searchOrganziation } from './messy/api';
import { TreeNode } from 'react-dropdown-tree-select';
import { StoreContext } from '../../context';

interface PickerProps {
  value: string | string[];
  onChange: (list: string[]) => void;
  mode: 'radioSelect' | 'multiSelect';
  isMy: boolean
}

const Picker = ({ value, onChange, mode, isMy }: PickerProps) => {
  if (isMy) {
    const isMyDep = window.USER.dep.id == value[0];
    isMyDep || onChange([window.USER.dep.id]);
  }

  const store = React.useContext(StoreContext);
  const { appID } = store;
  const { data } = useQuery(['query_user_picker', appID], () => searchOrganziation(appID));

  const cascaderData = parseTree(data);

  const handleChange = (selects: TreeNode[]) => {
    onChange(selects.map((itm) => itm.value));
  };

  return (
    <Cascader
      mode={mode}
      value={value}
      data={cascaderData}
      onChange={handleChange}
      disabled={isMy}
    />
  );
};

export default Picker;
