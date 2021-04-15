import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Message } from '@QCFE/lego-ui';

import TextHeader from '@c/text-header';
import Button from '@appC/button';
import Table from '@c/table/index';
import { appAddAdmin, fetchAppAdminUsers, delAppAdminUsers } from '@appLib/api';
import EmployeeOrDepartmentPickerModal from '@c/employee-or-department-picker';

function AppAdmin() {
  const [employeeVisible, setEmployeeVisible] = useState(false);
  const [selectedIdArr, setSelectedArr] = useState([]);
  const [loading, setLoading] = useState(false);
  const { appId } = useParams<any>();
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({ page: 1, limit: 9999, id: appId });
  const [appAdminList, setAppAdminList] = useState<Employee[]>([]);

  const handleChangeParams = (newParams: any) => {
    setParams({ ...params, ...newParams });
  };

  const fetchAdmins = () => {
    setLoading(true);
    fetchAppAdminUsers(params).then((res) => {
      setLoading(false);
      setTotal(res.data.total_count);
      setAppAdminList(res.data.data || [
        {
          id: '1',
          userName: '谭杰',
          a: '1',
          b: '2',
          c: '3',
          d: '4',
          phone: '4564567897899',
          email: '384759564@qq.com',
          dep: { departmentName: 'fasdfa' },
        },
        {
          id: '2',
          userName: '谭杰',
          a: '1',
          b: '2',
          c: '3',
          d: '4',
          phone: '4564567897899',
          email: '384759564@qq.com',
          dep: { departmentName: 'fasdfa' },
        },
      ]);
    });
  };

  const removeAdmin = (idArr: string[]) => {
    delAppAdminUsers({ appID: appId, userIDs: idArr }).then(() => {
      setAppAdminList(appAdminList.filter(({ id }) => !idArr.includes(id)));
    });
  };

  const handleSelectChange = (selectedArr: any) => {
    setSelectedArr(selectedArr);
  };

  const addAdmin = (_: any, employees: any) => {
    if (employees.length === 0) {
      Message.error('请选择添加为管理员的员工');
      return Promise.reject({ message: '' });
    }

    return appAddAdmin({ appId, userIDs: employees.map(({ id }: Employee) => id) }).then(() => {
      fetchAdmins();
      setEmployeeVisible(false);
    });
  };

  useEffect(() => {
    fetchAdmins();
  }, [params]);

  const columns = React.useMemo(() => [
    {
      id: 'userName',
      Header: '员工',
      accessor: 'userName',
    },
    {
      id: 'phone',
      Header: '手机号',
      fixed: true,
      width: 200,
      accessor: 'phone',
    },
    {
      id: 'email',
      Header: '邮箱',
      fixed: true,
      width: 200,
      accessor: 'email',
    },
    {
      id: 'a',
      Header: '邮箱',
      accessor: 'email',
    },
    {
      id: 'b',
      Header: '邮箱',
      accessor: 'email',
    },
    {
      id: 'c',
      Header: '邮箱',
      accessor: 'email',
    },
    {
      id: 'd',
      Header: '邮箱',
      accessor: 'email',
    },
    {
      id: 'dep',
      Header: '部门',
      accessor: ({ dep }: Employee) => {
        return dep.departmentName || '未分配部门';
      },
    },
    {
      id: 'action',
      Header: '操作',
      accessor: ({ id }: any): JSX.Element =>
        <span onClick={() => removeAdmin([id])} className='text-btn'>移除</span>,
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
          <Button onClick={() => setEmployeeVisible(true)} className='mr-16' isPrimary icon='add'>
            添加管理员
          </Button>
          {selectedIdArr.length > 0 && (
            <Button onClick={() => removeAdmin(selectedIdArr)} isPrimary icon='restore_from_trash'>
              批量移除
            </Button>
          )}
        </div>
        <Table
          showCheckBox
          selectKey='id'
          // selectedRowKeys={['00896f2e-17f5-4888-9236-d60608a19f65']}
          style={{ maxHeight: 'calc(100vh - 272px)' }}
          columns={columns}
          data={appAdminList}
          loading={loading}
          onSelectChange={handleSelectChange}
        />
        {employeeVisible && (
          <EmployeeOrDepartmentPickerModal
            visible
            onOk={addAdmin}
            onCancel={() => setEmployeeVisible(false)}
            employees={[]}
          />
        )}
      </div>
    </>
  );
}

export default AppAdmin;
