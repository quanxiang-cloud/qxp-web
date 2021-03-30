import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useQuery } from 'react-query';

import Tree from '@c/headless-tree';

import Store from './store';
import DepartmentNode from './department-node';
import { getERPTree } from '@net/corporate-directory';

interface Props {
  onSelect?: (department: IDepartment) => void;
}

function DepartmentsTree({ onSelect }: Props): JSX.Element {
  const [store, setStore] = useState<Store | null>(null);
  // todo refactor getERPTree
  const { data: rootDep, isLoading, isError } = useQuery('GET_ERP_TREE', () => {
    return getERPTree().then((_treeData: any) => {
      return _treeData;
    });
  });

  useEffect(() => {
    console.log('zoule这里了');
    if (rootDep && !isLoading && !isError) {
      setStore(new Store(rootDep));
    }
  }, [rootDep]);

  // todo render loading and error state
  if (!store) {
    return <></>;
  }

  console.log('store', store);
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
