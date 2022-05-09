import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import cs from 'classnames';

import MoreMenu, { MenuItem } from '@c/more-menu';
import Authorized from '@c/authorized';
import Icon from '@c/icon';
import { NodeRenderProps } from '@c/headless-tree/types';

import EditDepartment from './edit-department';
import DeleteDepartment from './delete-department';

// model click event should not propagate to parent nodes
// this is an bug of lego UI modal
function stopModalClickPropagate(e: React.MouseEvent): void {
  e.stopPropagation();
}

type OpenedModal = '' | 'edit_modal' | 'delete_modal';
type MenuDesc = {
  key: string;
  iconName: string;
  label: string;
};

function DepartmentNode({ node }: NodeRenderProps<Department>): JSX.Element | null {
  const [modalType, setModalType] = useState<OpenedModal>('');
  const [departmentToEdit, setDepartment] = useState(node.data);
  const [menus, setMenus] = useState<MenuItem<string>[]>([]);

  useEffect(() => {
    const menuDescList: MenuDesc[] = [
      { key: 'add', iconName: 'device_hub', label: '添加部门' },
      { key: 'edit', iconName: 'create', label: '修改信息' },
      { key: 'delete', iconName: 'restore_from_trash', label: '删除' },
    ];

    if (isCompany()) {
      menuDescList.unshift({ key: 'add-sub-company', iconName: 'house', label: '添加子公司' });
    }

    setMenus(createMenuItem(menuDescList));
  }, []);

  function createMenuItem(menuDescList: MenuDesc[]): MenuItem<string>[] {
    return menuDescList.map((menuDesc) => ({
      key: menuDesc.key,
      label: (
        <div className="flex items-center">
          <Icon name={menuDesc.iconName} size={16} className="mr-8" />
          <span className="font-normal">{menuDesc.label}</span>
        </div>
      ),
    }));
  }

  function onAdd(attr: number): void {
    setDepartment({ id: '', name: '', pid: node.data.id, superID: '', grade: 0, attr });
    openModal('edit_modal');
  }

  function onEdit(): void {
    setDepartment(node.data);
    openModal('edit_modal');
  }

  function onDelete(): void {
    openModal('delete_modal');
  }

  function openModal(type: OpenedModal): void {
    setModalType(type);
  }

  function closeModal(): void {
    setModalType('');
  }

  function isCompany(): boolean {
    return node.data.attr !== 2;
  }

  function getIconName(): string {
    if (node.data.attr === 0) return 'm-organization_chart';
    if (isCompany()) return 'house';
    return 'people';
  }

  function handleMenuClick(key: string): void {
    if (key === 'add-sub-company') {
      onAdd(1);
    } else if (key === 'add') {
      onAdd(2);
    } else if (key === 'edit') {
      onEdit();
    } else {
      onDelete();
    }
  }

  return (
    <div className="flex items-center flex-grow max-w-full">
      <span className={cs('truncate mr-auto', node.parentId && node.isLeaf && 'pl-20')} title={node.name}>
        {<Icon name={getIconName()} />}
        {node.name}
      </span>
      <Authorized authority={['accessControl/mailList/manage']}>
        <MoreMenu
          menus={menus}
          placement="bottom-end"
          className="opacity-0 group-hover:opacity-100"
          onMenuClick={handleMenuClick}
        />
      </Authorized>
      {
        modalType === 'edit_modal' && (
          <span onClick={stopModalClickPropagate}>
            <EditDepartment
              department={departmentToEdit}
              closeModal={closeModal}
            />
          </span>
        )
      }
      {
        modalType === 'delete_modal' && (
          <span onClick={stopModalClickPropagate}>
            <DeleteDepartment
              id={node.data.id}
              closeModal={closeModal}
            />
          </span>
        )
      }
    </div>
  );
}

export default observer(DepartmentNode);
