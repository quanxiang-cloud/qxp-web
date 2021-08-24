import React, { useState, useEffect } from 'react';
import { UnionColumns } from 'react-table';
import { useParams } from 'react-router-dom';

import toast from '@lib/toast';
import TextHeader from '@c/text-header';
import PopConfirm from '@c/pop-confirm';
import Button from '@c/button';
import Table from '@c/table';
import EmployeeOrDepartmentPickerModal from '@c/employee-or-department-picker';
import Modal from '@c/modal';

import {
  appAddAdmin, fetchAppAdminUsers, delAppAdminUsers,
} from '../api';

type Admin = {
  id: string;
  userName: string;
}

function AppAdmin() {
  const [modalType, setModalType] = useState('');
  const [selectedIdArr, setSelectedArr] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);
  const { appID } = useParams<{ appID: string }>();
  const [params] = useState({ page: 1, limit: 9999, id: appID });
  const [appAdminList, setAppAdminList] = useState([]);

  const fetchAdmins = () => {
    setLoading(true);
    fetchAppAdminUsers(params).then((res: any) => {
      setLoading(false);
      setAppAdminList(res.data.map((admin: Admin) => {
        return { ...admin, ownerID: admin.id, type: 1, ownerName: admin.userName };
      }));
    });
  };

  const removeAdmin = (idArr: string[]) => {
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

  const batchRemove = () => {
    removeAdmin(selectedIdArr).then(() => {
      setModalType('');
    });
  };

  const handleSelectChange = (selectedArr: string[]) => {
    setSelectedArr(selectedArr);
  };

  const addAdmin = (
    _: EmployeeOrDepartmentOfRole[],
    employees: EmployeeOrDepartmentOfRole[]) => {
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
  }, [params]);

  const columns: UnionColumns<Employee>[] = React.useMemo(() => [
    {
      id: 'userName',
      Header: '员工',
      accessor: 'userName',
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
      accessor: ({ dep }) => {
        return dep?.departmentName || '未分配部门';
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
      <TextHeader
        title="应用管理员"
        className="app-list-header header-background-image mb-24"
      />
      <Button
        onClick={() => setModalType('addAdmin')}
        className='mr-16 ml-20'
        modifier='primary'
        iconName='add'
      >
        添加管理员
      </Button>
      {selectedIdArr.length > 0 && (
        <Button
          onClick={() => setModalType('batchRemove')}
          modifier='primary'
          iconName='restore_from_trash'
        >
          批量移除
        </Button>
      )}
      <Table
        showCheckbox
        rowKey="id"
        className='m-20'
        style={{ maxHeight: 'calc(100vh - 300px)' }}
        columns={columns}
        data={appAdminList}
        loading={loading}
        onSelectChange={handleSelectChange}
      />
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
          submitText='保存'
          employees={appAdminList}
          departments={[]}
          onSubmit={addAdmin}
          onCancel={() => setModalType('')}
        />
      )}
    </>
  );
}

export default AppAdmin;