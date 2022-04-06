import React, { useState, useEffect } from 'react';
import { UnionColumn } from 'react-table';
import { useParams } from 'react-router-dom';

import toast from '@lib/toast';
import PopConfirm from '@c/pop-confirm';
import Button from '@c/button';
import Table from '@c/table';
import EmployeeOrDepartmentPickerModal from '@c/employee-or-department-picker';
import Modal from '@c/modal';

import {
  appAddAdmin, fetchAppAdminUsers, delAppAdminUsers,
} from '../api';
import { getTwoDimenArrayHead } from '@lib/utils';

type Admin = {
  id: string;
  name: string;
}

function ManagePermission(): JSX.Element {
  const [modalType, setModalType] = useState('');
  const [selectedIdArr, setSelectedArr] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);
  const { appID } = useParams<{ appID: string }>();
  const [params] = useState({ page: 1, limit: 9999, id: appID });
  const [appAdminList, setAppAdminList] = useState([]);

  const fetchAdmins = (): void => {
    setLoading(true);
    fetchAppAdminUsers(params).then((res: any) => {
      setLoading(false);
      setAppAdminList(res.data.users.map((admin: Admin) => {
        return { ...admin, ownerID: admin.id, type: 1, ownerName: admin.name };
      }));
    });
  };

  const removeAdmin = (idArr: string[]): Promise<void> => {
    setDelLoading(true);
    return delAppAdminUsers({ appID: appID, userIDs: idArr }).then(() => {
      setDelLoading(false);
      setAppAdminList(appAdminList.filter(({ id }) => !idArr.includes(id)));
      toast.success('删除成功！');
      if (idArr.includes(window.USER.id)) {
        toast.error('权限不符！2秒后跳转到首页');
        setTimeout(() => {
          window.location.href = '/apps';
        }, 2000);
      }
    }).catch(() => {
      setDelLoading(false);
    });
  };

  const batchRemove = (): void => {
    removeAdmin(selectedIdArr).then(() => {
      setModalType('');
    });
  };

  const handleSelectChange = (selectedArr: string[]): void => {
    setSelectedArr(selectedArr);
  };

  const addAdmin = (
    _: EmployeeOrDepartmentOfRole[],
    employees: EmployeeOrDepartmentOfRole[]): Promise<void>=> {
    if (employees.length === 0 && appAdminList.length === 0) {
      toast.error('请选择添加为管理员的员工');
      return Promise.reject(new Error('请选择添加为管理员的员工'));
    }

    return appAddAdmin({ appID, userIDs: employees.map(({ id }) => id) }).then(() => {
      fetchAdmins();
      setModalType('');
    });
  };

  useEffect(() => {
    fetchAdmins();
  }, [params, appID]);

  const columns: UnionColumn<Employee>[] = React.useMemo(() => [
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
        <PopConfirm onOk={() => removeAdmin([id])} content={<span>确认删除改管理员？</span>} >
          <span className='text-btn'>移除</span>
        </PopConfirm>
      ),
    },
  ], [appAdminList]);

  return (
    <>
      <div className="flex-1 py-16">
        {!!selectedIdArr.length && (
          <Button
            className="ml-16"
            onClick={() => setModalType('batchRemove')}
            modifier='primary'
            iconName='restore_from_trash'
          >
            批量移除
          </Button>
        )}
        <Button
          onClick={() => setModalType('addAdmin')}
          className='ml-16'
          modifier='primary'
          iconName='add'
          textClassName="text-12 py-6"
        >
          添加管理员
        </Button>
        <div className="bg-white px-16 py-8 rounded-12">
          <Table
            showCheckbox
            rowKey="id"
            style={{ maxHeight: 'calc(100vh - 300px)' }}
            columns={columns}
            data={appAdminList}
            loading={loading}
            className="text-12"
            onSelectChange={handleSelectChange}
          />
        </div>
        {(modalType === 'batchRemove') &&
        (<Modal
          title='批量移除'
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
          <p className="p-20">确定要批量移除应用的管理员吗？</p>
        </Modal>)
        }
        {modalType === 'addAdmin' && (
          <EmployeeOrDepartmentPickerModal
            title='添加管理员'
            onlyEmployees
            submitText='保存'
            employees={appAdminList}
            departments={[]}
            onSubmit={addAdmin}
            onCancel={() => setModalType('')}
          />
        )}
      </div>
    </>
  );
}

export default ManagePermission;
