
import React from 'react';

import DropdownTreeSelect, { TreeData, Mode, TreeNode } from 'react-dropdown-tree-select';
import 'react-dropdown-tree-select/dist/styles.css';
import './index.scss';
import { Organization } from './messy/api';
import classNames from 'classnames';

export interface Props {
  data: TreeData
  placeholder?: string
  mode?: Mode
  onChange?: (selectedNodes: TreeNode[]) => void
  disabled?: boolean
  className?: string
  value?: string | string[]
  noMatches?: string
  inlineSearchPlaceholder?: string
}

// @ts-ignore
const calcData = (data, value, allChecked = false) => {
  const isArray = Array.isArray(data);

  const tempArr: any[] = [].concat(data);

  if (!tempArr.length) return [];

  const temp = tempArr.map(((itm) => {
    itm.checked = allChecked || (Array.isArray(value) ? value.includes(itm.value) : itm.value == value);

    itm.children && (itm.children = calcData(itm.children, value, itm.checked));

    return itm;
  }));

  return isArray ? temp : temp[0];
};

export const parseTree = (data: Organization | undefined): TreeData => {
  if (!data) return {};
  const label = data.departmentName;
  const value = data.id;

  const children = data.child ? data.child.map((itm: Organization) => parseTree(itm)) : null;

  return {
    label,
    value,
    children,
  };
};

export const searchTree = (tree: TreeNode | TreeNode[], target: string) => {
  const tempArr = ([] as TreeNode[]).concat(tree);

  let node = null;

  const findTarget = (treeArr: TreeNode[]): any => treeArr.forEach((itm: TreeNode) => {
    if (itm.value == target) return node = itm;
    if (itm.children && itm.children.length) {
      return findTarget(itm.children);
    }
  });

  findTarget(tempArr);

  return node;
};

const Cascader = (props: Props) => {
  const {
    data,
    placeholder = '请选择',
    mode = 'radioSelect',
    onChange,
    disabled,
    className,
    value,
    noMatches = '未找到匹配关键字...',
    inlineSearchPlaceholder = '搜索',
  } = props;

  const selectsRef = React.useRef<TreeNode[]>();

  return (
    <div className="cascader_bg">
      <DropdownTreeSelect
        className={classNames(className, {
          no_rm_cascader: 'radioSelect' != mode,
        })}
        mode={mode}
        keepChildrenOnSearch
        keepOpenOnSelect={mode != 'radioSelect'}
        keepTreeOnSearch
        clearSearchOnChange
        onChange={(_, selects) => {
          if (mode == 'radioSelect') {
            onChange && onChange(selects);
          }
          selectsRef.current = selects;
        }}
        texts={{
          placeholder,
          inlineSearchPlaceholder,
          noMatches,
        }}
        onBlur={() => {
          if (onChange) {
            onChange(selectsRef.current || []);
          }
        }}
        disabled={disabled || false}
        data={calcData(data, value)}
      />
    </div>
  );
};

export default Cascader;
