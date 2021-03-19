import React, { useState } from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import { Icon } from '@QCFE/lego-ui';

import Tree from '@portal/components/headless-tree';
import MoreMenu, { MenuItem } from '@portal/components/more-menu';

import Store from './store';
import EditDepartment from './edit-department';

interface Props {
  rootDep: Department;
}

type DepartmentNodeProps = {
  store: Store;
  node: TreeNode<Department>;
}

const MENUS: MenuItem<string>[] = [
  {
    key: 'add',
    label: (
      <div className="flex items-center"><Icon name="add" className="mr-dot-4" />添加部门</div>
    ),
  },
  {
    key: 'edit',
    label: (
      <div className="flex items-center"><Icon name="pen" className="mr-dot-4" />修改信息</div>
    ),
  },
  {
    key: 'delete',
    label: (
      <div className="flex items-center"><Icon name="trash" className="mr-dot-4" />删除部门</div>
    ),
  },
];

function DepartmentNode({ node, store }: DepartmentNodeProps): JSX.Element {
  const [showModal, toggleModal] = useState(false);
  const [departmentToEdit, setDepartment] = useState(node.data);

  function onAdd() {
    setDepartment({ id: '', departmentName: '', pid: node.data.id, superID: '', grade: 0 });
    toggleModal(true);
  }

  function onEdit() {
    setDepartment(node.data);
    toggleModal(true);
  }

  return (
    <div className="flex flex-grow max-w-full">
      <span className="truncate mr-auto">{node.name}</span>
      <MoreMenu
        menus={MENUS}
        placement="bottom-end"
        className="opacity-0 group-hover:opacity-100"
        onChange={(key) => {
          if (key === 'add') {
            onAdd();
            return;
          }

          if (key === 'edit') {
            onEdit();
            return;
          }
        }}
      />
      {
        showModal && (
          <EditDepartment
            department={departmentToEdit}
            closeModal={() => toggleModal(false)}
          />
        )
      }
    </div>
  );
}

function DepartmentsTree({ rootDep }: Props): JSX.Element {
  const store = new Store(rootDep);

  return (
    <div className="departments-tree">
      <Tree
        store={store}
        nodeRender={(node) => (
          <DepartmentNode node={node} store={store} />
        )}
        rootNodeRender={(node) => (
          <DepartmentNode node={node} store={store} />
        )}
      />
    </div>
  );
}

export default observer(DepartmentsTree);
