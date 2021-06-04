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

// const parseTree = (data: Organization | undefined): TreeData => {
//     if (!data) return {}
//     const label = data.departmentName
//     const value = data.id

//     const children = data.child ? data.child.map((itm: Organization) => parseTree(itm)) : null

//     return {
//         label,
//         value,
//         children
//     }
// }

const OrganizationPicker = (p: ISchemaFieldComponentProps) => {
  const { data } = useQuery(['query_user_picker'], searchOrganziation);
  const CascaderParams = {
    mode: p.props.multiple == 'signle' ? 'radioSelect' : 'multiSelect',
    placeholder: p.props.placeholder,
  } as Props;

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

  return (<Cascader
    {...CascaderParams}
    data={TreeData}
    value={p.value || []}
    onChange={(selects) => p.mutators.change(selects.map((itm) => itm.value))}
  />);
};

OrganizationPicker.isFieldComponent = true;

export default OrganizationPicker;
