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
    label: (<><Icon name="pen" className="mr-dot-4" />添加部门</>),
  },
  {
    key: 'edit',
    label: (<><Icon name="pen" className="mr-dot-4" />修改信息</>),
  },
  {
    key: 'delete',
    label: (<><Icon name="pen" className="mr-dot-4" />删除部门</>),
  },
];

function DepartmentNode({ node, store }: DepartmentNodeProps): JSX.Element {
  const [showModal, toggleModal] = useState(false);
  const [departmentToEdit, setDepartment] = useState(node.data);

  function onAdd() {
    setDepartment({ id: '', departmentName: '', pid: node.data.id, superID: '', grade: 0, });
    toggleModal(true);
  }

  function onEdit() {
    setDepartment(node.data);
    toggleModal(true);
  }

  return (
    <>
      <span className="truncate">{node.name}</span>
      <MoreMenu
        menus={MENUS}
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
    </>
  );
}

function DepartmentsTree({ rootDep }: Props): JSX.Element {
  const store = new Store(rootDep);

  return (
    <Tree
      store={store}
      nodeRender={(node) => (
        <DepartmentNode node={node} store={store} />
      )}
    />
  );
}

export default observer(DepartmentsTree);
