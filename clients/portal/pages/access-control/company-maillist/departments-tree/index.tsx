import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useQuery } from 'react-query';

import Tree from '@portal/components/headless-tree';

import Store from './store';
import DepartmentNode from './department-node';
import { getERPTree } from '../api';

interface Props {
  onSelect?: (department: IDepartment) => void;
}

function DepartmentsTree({ onSelect }: Props): JSX.Element {
  const [store, setStore] = useState<Store | null>(null);
  // todo refactor getERPTree
  const { data: rootDep, isLoading, isError } = useQuery('getERPTree', () => {
    return getERPTree().then((_treeData: any) => {
      return _treeData;
    });
  });

  useEffect(() => {
    if (rootDep && !isLoading && !isError) {
      setStore(new Store(rootDep));
    }
  }, [rootDep]);

  // todo render loading and error state
  if (!store) {
    return (<span></span>);
  }

  return (
    <div className="tree-wrapper">
      <Tree
        store={store}
        NodeRender={DepartmentNode}
        RootNodeRender={DepartmentNode}
        onSelect={onSelect}
      />
    </div>
  );
}

export default observer(DepartmentsTree);
