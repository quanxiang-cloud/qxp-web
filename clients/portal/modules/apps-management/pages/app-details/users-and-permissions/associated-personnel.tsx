import React, { useMemo, useState } from 'react';
import { observer } from 'mobx-react';

import Switch from '@c/switch';
import Button from '@c/button';
import store from './store';

import './index.scss';
import EmployeeOrDepartmentPickerModal from '@c/employee-or-department-picker';
import Table from '@c/table';
import Avatar from '@c/avatar';
import toast from '@lib/toast';

type UserOrDept = {
  id: string,
  ownerID: string,
  type: number,
  ownerName: string,
}

function AssociatedPerson(): JSX.Element {
  const [showBindType, setShowBindType] = useState<number>(1);
  const [showBindModal, setShowBindModal] = useState<boolean>(false);

  const userAndDept = useMemo(() => {
    if (store.currentRights.scopes && store.currentRights.scopes.length) {
      const users: UserOrDept[] = [];
      const deptList: UserOrDept[] = [];
      store.currentRights.scopes.forEach((scope) => {
        if (scope.type === 1) {
          users.push({
            id: scope.id,
            ownerID: scope.id,
            type: 1,
            ownerName: scope.name,
          });
        } else {
          deptList.push({
            id: scope.id,
            ownerID: scope.id,
            type: 2,
            ownerName: scope.name,
          });
        }
      });
      const usersIDList = Array.from(users, ({ id }) => id);
      store.fetchUserDetailList(usersIDList);
      return { users, deptList };
    }
    store.UserDetailList = [];
    return { users: [], deptList: [] };
  }, [store.currentRights]);

  const handleAdd = (
    deptList: EmployeeOrDepartmentOfRole[], employees: EmployeeOrDepartmentOfRole[],
  ): Promise<boolean | void> => {
    const scopes: DeptAndUser[] = [];
    deptList.forEach((dept) => {
      scopes.push({
        type: 2,
        id: dept.id,
        name: dept.ownerName,
      });
    });

    employees.forEach((employee) => {
      scopes.push({
        type: 1,
        id: employee.id,
        name: employee.ownerName,
      });
    });
    return store.updatePerGroupUser({ id: store.currentRights.id, scopes });
  };

  const deletePerGroupUser = (id: string) => {
    const newScopes = store.currentRights.scopes?.filter((scope) => scope.id !== id);
    store.updatePerGroupUser({ id: store.currentRights.id, scopes: newScopes });
  };

  const columns: any = [{
    Header: '操作',
    id: 'tool',
    accessor: (user: any) =>
      (<span
        className='text-btn'
        onClick={() => deletePerGroupUser(user.id)}
      >
      移除
      </span>),
  }];

  if (showBindType === 1) {
    columns.unshift(...[
      {
        Header: '姓名',
        id: 'userName',
        fixed: true,
        width: 120,
        accessor: (user: any) => (
          <div className='flex'>
            <Avatar username={user.userName} size={24}/>
            <span className='ml-4'>{user.userName}</span>
          </div>
        ),
      },
      {
        Header: '手机号码',
        id: 'phone',
        accessor: 'phone',
      },
      {
        Header: '邮箱',
        id: 'email',
        accessor: 'email',
      },
      {
        Header: '部门',
        id: 'departmentName',
        accessor: (user: any) => user.dep[0].departmentName,
      },
    ]);
  }
  if (showBindType === 2) {
    columns.unshift(
      {
        Header: '部门',
        id: 'ownerName',
        accessor: 'ownerName',
      },
    );
  }

  const OnClickBind = (): void => {
    if (!store.currentRights.add) {
      toast.error('未配置访问权限，请先配置');
      return;
    }
    setShowBindModal(true);
  };

  return (
    <>
      <div className='h-full flex flex-col'>
        <div className='flex items-center mx-10 mb-16'>
          <Switch
            className=""
            value={1}
            options={[{
              label: '员工',
              value: 1,
            }, {
              label: '部门',
              value: 2,
            }]}
            onChange={setShowBindType}
          />
          <Button
            modifier="primary"
            className="ml-2"
            iconName="link"
            onClick={OnClickBind}
          >
              关联员工与部门
          </Button>
        </div>
        <div className='flex-1'>
          <Table
            showCheckbox
            rowKey="id"
            data={showBindType === 1 ? store.UserDetailList : userAndDept.deptList}
            className="rounded-bl-none rounded-br-none"
            columns={columns}
            emptyTips={(
              <div className='flex flex-col justify-center items-center text-12 text-gray-400'>
                <img src='/dist/images/links.svg' alt="no data" className="mb-8"/>
                <span className='text-12'>暂无数据，选择
                  <span onClick={OnClickBind} className='text-btn'>&nbsp;关联员工与部门</span>
                </span>
              </div>
            )}
          />
          <div className="h-52 text-gray-600 text-12 flex items-center ml-16">
            共{showBindType === 1 ? store.UserDetailList.length : userAndDept.deptList.length}条数据
          </div>

        </div>
      </div>
      {showBindModal && (
        <EmployeeOrDepartmentPickerModal
          title='添加部门与员工'
          submitText='提交'
          employees={userAndDept.users as EmployeeOrDepartmentOfRole[]}
          departments={userAndDept.deptList as EmployeeOrDepartmentOfRole[]}
          onSubmit={handleAdd}
          onCancel={() => setShowBindModal(false)}
        />
      )}
    </>
  );
}

export default observer(AssociatedPerson);
