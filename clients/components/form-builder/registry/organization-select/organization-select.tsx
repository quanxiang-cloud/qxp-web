import * as React from 'react';
import { useQuery } from 'react-query';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import { TreeData, Mode, TreeNode } from 'react-dropdown-tree-select';
import { searchOrganziation } from './messy/api';
import Cascader, { parseTree, searchTree } from './cascader';

interface Props {
  data: TreeData
  placeholder?: string
  mode?: Mode
  onChange?: (currentNode: TreeNode, selectedNodes: TreeNode[]) => void
  disabled?: boolean
  className?: string;
  value?: string | string[]
}

const OrganizationPicker = (p: ISchemaFieldComponentProps) => {
  const appID: string = p.props.appID;

  const { data } = useQuery(['query_user_picker', appID], () => searchOrganziation(appID));

  React.useEffect(() => {
    p.mutators.change(p.props.defaultValues);
  }, []);

  const { optionalRange, rangeList } = p.props;

  const TreeData = React.useMemo(() => {
    if (optionalRange == 'customize') {
      const Tree = parseTree(data);
      return rangeList ? rangeList.map((itm: string) => searchTree(Tree as TreeNode, itm)).filter(Boolean) : [];
    } else {
      return parseTree(data);
    }
  }, [data, optionalRange, rangeList]);

  const cascaderParams = {
    mode: p.props.multiple == 'signle' ? 'radioSelect' : 'multiSelect',
    placeholder: p.props.placeholder,
  } as Props;

  return (<Cascader
    {...cascaderParams}
    data={TreeData}
    value={(p.value || []).map((itm: TreeNode) => itm.value)}
    onChange={(selects) => p.mutators.change(selects)}
  />);
};

OrganizationPicker.isFieldComponent = true;

export default OrganizationPicker;
