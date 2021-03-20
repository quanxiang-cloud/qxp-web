import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import Tree from '@portal/components/headless-tree';

import Store from './store';
import DepartmentNode from './department-node';

interface Props {
  rootDep: Department;
}

function DepartmentsTree({ rootDep }: Props): JSX.Element {
  const [store, setStore] = useState<Store | null>(null);
  useEffect(() => {
    setStore(new Store(rootDep));
  }, []);

  if (!store) {
    return (<span></span>);
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
}

export default observer(DepartmentsTree);
