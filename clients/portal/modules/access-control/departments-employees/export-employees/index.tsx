import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { toJS } from 'mobx';

import {
  getDepartmentStructure,
} from '@portal/modules/access-control/role-management/api';
import Loading from '@c/loading';
import ErrorTips from '@c/error-tips';
import Modal from '@c/modal';

import DepartmentSelectTree from './employ-tree';
import SelectedList from './selected-list';
import OwnerStore from './owner-store';

interface Props {
  closeModal(): void;
  onSubmit: (ids: string[]) => void;
}

export default function index({ closeModal, onSubmit }: Props) {
  const [store, setStore] = useState<OwnerStore>();
  const { data: department, isLoading, isError } = useQuery(
    ['GET_DEPARTMENT_STRUCTURE'],
    getDepartmentStructure,
    {
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    if (department) {
      setStore(new OwnerStore(department, []));
    }
  }, [department]);

  const onDepartmentTreeChange = (prevNodes: Department[], currentNodes: Department[]) => {
    if (!store) {
      return;
    }
    const add: EmployeeOrDepartmentOfRole[] = [];
    const remove: string[] = [];
    currentNodes.filter((node) => !prevNodes.find((n) => n.id === node.id)).forEach((node) => {
      const parent = store.departmentTreeStore.getNodeParents(node.id)[0];
      add.push({
        type: 2,
        ownerID: node.id,
        ownerName: node.departmentName,
        phone: '',
        email: '',
        departmentName: parent?.name,
        departmentID: parent?.id,
        createdAt: -1,
        id: node.id,
      });
    });
    prevNodes.filter((node) => !currentNodes.find((n) => n.id === node.id)).forEach((node) => {
      remove.push(node.id);
    });
    add.length && store.addOwners(add);
    remove.length && store.removeOwners(remove);
  };

  function handleSubmit() {
    const _store: any = store;
    const { owners } = _store;
    const _owners = toJS(owners);
    const ids: string[] = [];
    _owners.map((own: EmployeeOrDepartmentOfRole) => {
      ids.push(own.id);
    });
    onSubmit(ids);
  }

  if (!store || isLoading) {
    return <Loading desc="加载中..." />;
  }
  if (isError) {
    return <ErrorTips desc="something wrong" />;
  }

  return (
    <Modal
      title="导出部门人员"
      className="static-modal"
      onClose={closeModal}
      width={840}
      height={460}
      footerBtns={[
        {
          text: '取消',
          key: 'cancel',
          iconName: 'close',
          onClick: closeModal,
        },
        {
          text: '确定',
          key: 'confirm',
          iconName: 'check',
          modifier: 'primary',
          onClick: handleSubmit,
        },
      ]}
    >
      <div className="h-full p-20 overflow-hidden flex">
        <div className="flex-2 overflow-auto">
          <div className="text-gray-900 flex justify-between items-center text-h6">选择部门</div>
          <DepartmentSelectTree
            store={store.departmentTreeStore}
            wrapperClassName="flex-1 bg-white rounded-12"
            onChange={onDepartmentTreeChange}
          />
        </div>
        <div className="vertical-line flex-grow-0"></div>
        <div className="flex-1">
          <SelectedList
            ownerStore={store}
          />
        </div>
      </div>
    </Modal>
  );
}
