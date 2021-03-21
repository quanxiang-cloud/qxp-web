import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';

import Store from './store';
import Tree from '@portal/components/headless-tree';
import { getDepartmentStructure } from '@portal/pages/access-control/role-management/api';
import { Loading } from '@portal/components/loading';
import { DepartmentNode } from './department-node';
import { TNode } from '@portal/components/headless-tree/types';

export interface IDepartmentSelectTree {
  onChange: (departments: TNode<IDepartment>[]) => void
}
export const DepartmentSelectTree = ({ onChange }: IDepartmentSelectTree) => {
  const [store, setStore] = useState<Store | null>(null);
  const { data: department, isLoading, isError } = useQuery(
    ['getDepartmentStructure'],
    getDepartmentStructure,
    {
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    if (department && !isLoading && !isError) {
      setStore(new Store(department));
    }
  }, [department]);

  if (!store) {
    return <Loading desc="加载中..." />;
  }

  return (
    <div className="departments-tree">
      <Tree
        store={store}
        NodeRender={DepartmentNode}
        RootNodeRender={DepartmentNode}
      />
    </div>
  );
};
