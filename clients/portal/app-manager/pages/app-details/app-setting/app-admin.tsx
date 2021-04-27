import React, { useState, useEffect } from 'react';
import { Modal } from '@QCFE/lego-ui';
import { useParams } from 'react-router-dom';

import notify from '@lib/notify';
import TextHeader from '@c/text-header';
import PopConfirm from '@c/pop-confirm';
import Button from '@c/button';
import Table from '@c/table/index';
import { appAddAdmin, fetchAppAdminUsers, delAppAdminUsers } from '@appLib/api';
import EmployeeOrDepartmentPickerModal from '@c/employee-or-department-picker';
import { UnionColumns } from 'react-table';

function AppAdmin() {
  const [modalType, setModalType] = useState('');
  const [selectedIdArr, setSelectedArr] = useState([]);
  const [loading, setLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);
  const { appId } = useParams<any>();
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({ page: 1, limit: 9999, id: appId });
  const [appAdminList, setAppAdminList] = useState<any>([]);

  const handleChangeParams = (newParams: any) => {
    setParams({ ...params, ...newParams });
  };

  const fetchAdmins = () => {
    setLoading(true);
    fetchAppAdminUsers(params).then((res) => {
      setLoading(false);
      setTotal(res.data.total_count);
      setAppAdminList(res.data.data.map((admin: any) => {
        return { ...admin, ownerID: admin.id, type: 1, ownerName: admin.userName };
      }));
    });
  };

  const removeAdmin = (idArr: string[]) => {
    setDelLoading(true);
    return delAppAdminUsers({ appID: appId, userIDs: idArr }).then(() => {
      setDelLoading(false);
      setAppAdminList(appAdminList.filter(({ id }: any) => !idArr.includes(id)));
      notify.success('删除成功！');
    }).catch(()=>{
      setDelLoading(false);
    });
  };

  const batchRemove = () => {
    removeAdmin(selectedIdArr).then(() => {
      setModalType('');
    });
  };

  const handleSelectChange = (selectedArr: any) => {
    setSelectedArr(selectedArr);
  };

  const addAdmin = (_: any, employees: any) => {
    if (employees.length === 0) {
      notify.error('请选择添加为管理员的员工');
      return Promise.reject({ message: '' });
    }

    return appAddAdmin({ appId, userIDs: employees.map(({ id }: Employee) => id) }).then(() => {
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
      accessor: ({ dep }: any) => {
        return dep.departmentName || '未分配部门';
      },
    },
    {
      id: 'action',
      Header: '操作',
      accessor: ({ id }: any): JSX.Element => (
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
        className="my-app-header header-background-image "
      />
      <div className='px-20 py-24'>
        <div className='mb-20 flex'>
          <Button
            onClick={() => setModalType('addAdmin')}
            className='mr-16'
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
        </div>
        <Table
          showCheckbox
          rowKey="id"
          style={{ maxHeight: 'calc(100vh - 272px)' }}
          columns={columns}
          data={appAdminList}
          loading={loading}
          onSelectChange={handleSelectChange}
        />
        <Modal
          title='批量移除'
          className="static-modal"
          onCancel={() => setModalType('')}
          visible={modalType === 'batchRemove'}
          footer={(
            <div className="flex items-center">
              <Button iconName='close' onClick={() => setModalType('')}>
                取消
              </Button>
              <div className="px-2"></div>
              <Button
                modifier='primary'
                iconName='check'
                loading={delLoading}
                onClick={batchRemove}
              >
                确定移除
              </Button>
            </div>
          )}
        >
          确定要批量移除应用的管理员吗？
        </Modal>
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
      </div>
    </>
  );
}

export default AppAdmin;
