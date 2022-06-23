import React, { useState, useEffect } from 'react';
import { UnionColumn } from 'react-table';
import { useParams } from 'react-router-dom';

import toast from '@lib/toast';
import PopConfirm from '@c/pop-confirm';
import Button from '@c/button';
import Table from '@c/table';
import EmployeeOrDepartmentPickerModal from '@c/employee-or-department-picker';
import Modal from '@c/modal';

import { addAppMembers, deleteAppMembers, getAppVisitPermission } from '../api';
import { getTwoDimenArrayHead } from '@lib/utils';

function AppVisitPermission(): JSX.Element {
  const [modalType, setModalType] = useState<'addMember' | 'confirmRemoveMember' | ''>('');
  const [selectedIdArr, setSelectedArr] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);
  const { appID } = useParams<{ appID: string }>();
  const [members, setMembers] = useState<Array<Employee>>([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  function fetchMembers(): void {
    setLoading(true);
    getAppVisitPermission(appID).then((employees) => {
      setLoading(false);
      setMembers(employees);
    });
  }

  function removeMembers(idArr: string[]): Promise<void> {
    setDelLoading(true);
    return deleteAppMembers(appID, idArr).then(() => {
      setDelLoading(false);
      fetchMembers();
      toast.success('删除成功！');
    });
  }

  const batchRemove = (): void => {
    removeMembers(selectedIdArr).then(() => {
      setModalType('');
    });
  };

  const handleSelectChange = (selectedArr: string[]): void => {
    setSelectedArr(selectedArr);
  };

  async function handleAdd(
    _: EmployeeOrDepartmentOfRole[],
    selected: EmployeeOrDepartmentOfRole[],
  ): Promise<void> {
    if (selected.length === 0 && members.length === 0) {
      toast.error('请选择要添加的成员');
      return;
    }

    return addAppMembers(appID, selected.map(({ id }) => id)).then(() => {
      fetchMembers();
      setModalType('');
    });
  }

  const columns: UnionColumn<Employee>[] = React.useMemo(
    () => [
      {
        id: 'name',
        Header: '员工',
        accessor: 'name',
      },
      {
        id: 'phone',
        Header: '手机号',
        accessor: 'phone',
      },
      {
        id: 'email',
        Header: '邮箱',
        accessor: 'email',
      },
      {
        id: 'dep',
        Header: '部门',
        accessor: ({ deps }) => {
          const dep = getTwoDimenArrayHead(deps);
          return dep?.name || '未分配部门';
        },
      },
      {
        id: 'action',
        Header: '操作',
        accessor: ({ id }: { id: string }): JSX.Element => (
          <PopConfirm onOk={() => removeMembers([id])} content={<span>确认移除成员吗？</span>}>
            <span className="text-btn">移除</span>
          </PopConfirm>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <div className="flex-1 py-16">
        {!!selectedIdArr.length && (
          <Button
            className="ml-16"
            onClick={() => setModalType('confirmRemoveMember')}
            modifier="primary"
            iconName="restore_from_trash"
          >
            批量移除
          </Button>
        )}
        <Button
          onClick={() => setModalType('addMember')}
          className="ml-16"
          modifier="primary"
          iconName="add"
          textClassName="text-12 py-6"
        >
          添加成员
        </Button>
        <div className="bg-white px-16 py-8 rounded-12">
          <Table
            showCheckbox
            rowKey="id"
            style={{ maxHeight: 'calc(100vh - 300px)' }}
            columns={columns}
            data={members}
            loading={loading}
            className="text-12"
            onSelectChange={handleSelectChange}
          />
        </div>
        {modalType === 'confirmRemoveMember' && (
          <Modal
            title="批量移除"
            onClose={() => setModalType('')}
            footerBtns={[
              {
                text: '取消',
                key: 'cancel',
                iconName: 'close',
                onClick: () => setModalType(''),
              },
              {
                text: '确定移除',
                key: 'confirm',
                iconName: 'check',
                loading: delLoading,
                modifier: 'primary',
                onClick: batchRemove,
              },
            ]}
          >
            <p className="p-20">确定要批量移除成员吗？</p>
          </Modal>
        )}
        {modalType === 'addMember' && (
          <EmployeeOrDepartmentPickerModal
            onlyEmployees
            title="添加可访问成员"
            submitText="添加"
            employees={[]}
            departments={[]}
            onSubmit={handleAdd}
            onCancel={() => setModalType('')}
          />
        )}
      </div>
    </>
  );
}

export default AppVisitPermission;
