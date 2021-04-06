import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useQuery } from 'react-query';

import Tree from '@c/headless-tree';
import Loading from '@c/loading';
import { getERPTree } from '@lib/requests/corporate-directory';

import Store from './store';
import DepartmentNode from './department-node';

interface Props {
  onSelect?: (department: Department) => void;
}

function DepartmentsTree({ onSelect }: Props): JSX.Element {
  const [store, setStore] = useState<Store | null>(null);
  const { data: rootDep, isLoading, isError } = useQuery('GET_ERP_TREE', () => {
    return getERPTree().then((_treeData: any) => {
      return _treeData;
    });
  });

  useEffect(() => {
    if (rootDep && !isLoading && !isError) {
      setStore(new Store(rootDep));
    }
  }, [rootDep]);

  if (!store) {
    return (<Loading className="h-full" desc="加载中..." />);
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
