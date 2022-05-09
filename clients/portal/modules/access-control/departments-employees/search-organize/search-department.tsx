import React, { useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import cs from 'classnames';

import Loading from '@c/loading';
import { TreeNode } from '@c/headless-tree/types';

import store from '../store';

type Props = {
  searchWord: string;
  onChange?: (department: Department) => void;
};

function SearchDepartment({ searchWord, onChange }: Props): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<TreeNode<Department>>();

  const searchDepartment = useMemo(() => {
    if (!store.depTreeNode) return [];
    setLoading(false);

    return store.searchNodesByName(store.depTreeNode, searchWord);
  }, [searchWord, store.depTreeNode]);

  function handleClick(department: TreeNode<Department>): void {
    if (department === selectedDepartment) return;
    setSelectedDepartment(department);
    onChange?.(department.data);
  }

  if (loading) {
    return <Loading />;
  }

  if (!searchDepartment.length) {
    return <></>;
  }

  return (
    <div className='px-5'>
      <span className='search-title'>部门({searchDepartment.length})</span>
      {searchDepartment.map((dep) => (
        <div
          key={dep.id}
          className={cs('search-item', dep === selectedDepartment && 'is-selected')}
          onClick={() => handleClick(dep)}
        >{ dep.name }</div>
      ))}
    </div>
  );
}

export default observer(SearchDepartment);
