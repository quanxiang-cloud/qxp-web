import * as React from 'react';
import { useQuery } from 'react-query';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import DropdownTreeSelect, { TreeData, Mode, TreeNode } from 'react-dropdown-tree-select'
import { searchOrganziation, Organization } from './messy/api'
import Cascader, { parseTree, searchTree } from './cascader'

interface Props {
    value: string | string[];
    onChange: (value: string | string[]) => void;
    multiple: 'signle' | 'multiple';
    rangeList: string[];
    optionalRange: 'all' | 'customize';

}

const OrganizationDefaultPicker = (props: Props) => {

    const { value, onChange, multiple, rangeList, optionalRange } = props

    const { data } = useQuery(['query_user_picker_df'], searchOrganziation)

    const CustomizeTreeData = React.useMemo(() => {
        const Tree = parseTree(data)
        return rangeList ? rangeList.map((itm) => searchTree(Tree as TreeNode, itm)).filter(Boolean) : []
    }, [data, rangeList])

    const TreeData = React.useMemo(() => {

        return parseTree(data)

    }, [data])
    return <Cascader
        mode={multiple == "signle" ? 'radioSelect' : 'multiSelect'}
        data={optionalRange == 'customize' ? CustomizeTreeData : TreeData}
        value={value || []}
        onChange={(selects) => {
            onChange(selects.map(itm => itm.value))
        }}
    />
}


export default OrganizationDefaultPicker
