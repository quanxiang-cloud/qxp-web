import React, { useMemo, useState } from 'react';
import { observer } from 'mobx-react';

import Button from '@c/button';

import EmployeeOrDepartmentPickerModal from '@c/employee-or-department-picker';
import Table from '@c/table';
import Avatar from '@c/avatar';
import RadioButtonGroup from '@c/radio/radio-button-group';

import store from './store';

import './index.scss';

type UserOrDept = {
  id: string,
  ownerID: string,
  type: number,
  ownerName: string,
}

function AssociatedPerson(): JSX.Element {
  const [showBindType, setShowBindType] = useState<number>(1);
  const [showBindModal, setShowBindModal] = useState<boolean>(false);
  const [selectUser, setSelectUser] = useState<string[]>([]);

  const userAndDept = useMemo(() => {
    if (store.currentScopes && store.currentScopes.length) {
      const users: UserOrDept[] = [];
      const deptList: UserOrDept[] = [];
      store.currentScopes.forEach((scope) => {
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
  }, [store.currentScopes]);

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

    const checkedId = scopes && scopes.map((item: any) => item.id);
    const removeList: DeptAndUser[] = store.currentScopes.filter((item: any) => checkedId.indexOf(item.id) === -1) || [];

    const removeIDList = removeList.map((remove)=>{
      return remove.id;
    });

    const checkedId2 = store.currentScopes && store.currentScopes.map((item: any) => item.id);

    const addList: DeptAndUser[] = scopes.filter((item: any) => checkedId2.indexOf(item.id) === -1) || [];
    store.setCurrentScopes(scopes);
    return store.updatePerUser({ add: addList, removes: removeIDList });
  };

  const deletePerGroupUser = (id: string): void=>{
    const newScopes = store.currentScopes?.filter((scope) => scope.id !== id);
    store.setCurrentScopes(newScopes);
    store.updatePerUser({ add: [], removes: [id] });
  };

  const handleBatchRemov = (idList: string[]): void => {
    const newScopes = store.currentScopes?.filter((scope) => !idList.includes(scope.id));
    store.setCurrentScopes(newScopes);
    store.updatePerUser({ add: [], removes: idList });
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
        id: 'name',
        width: 120,
        accessor: (user: any) => (
          <div className='flex items-center'>
            <Avatar username={user.name} size={24}/>
            <span className='ml-4'>{user.name}</span>
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
        accessor: (user: any) => user.departments[0].name,
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

  return (
    <>
      <div className='h-full flex flex-col'>
        <div className='flex items-center justify-between mb-8 access-btn'>
          <div className="flex items-center">
            <Button
              modifier="primary"
              className="ml-2"
              iconName="link"
              onClick={() => setShowBindModal(true)}
            >
                关联员工与部门
            </Button>
            { !!selectUser.length && (
              <Button
                modifier="primary"
                className="ml-16"
                iconName="delete"
                onClick={() => handleBatchRemov(selectUser)}
              >
                批量移除
              </Button>
            )}
          </div>
          <RadioButtonGroup
            radioBtnClass="bg-white text-12"
            onChange={(value) => {
              setShowBindType(value as number);
            }}
            listData={[{
              label: '员工',
              value: 1,
            }, {
              label: '部门',
              value: 2,
            }] as any}
            currentValue={showBindType}
          />
        </div>
        <div className='flex overflow-hidden flex-col justify-between'>
          <div className="flex overflow-y-scroll">
            <Table
              onSelectChange={(selectedKeys: string[]) => setSelectUser(selectedKeys)}
              showCheckbox
              rowKey="id"
              data={showBindType === 1 ? store.UserDetailList : userAndDept.deptList}
              className="rounded-bl-none rounded-br-none text-12"
              columns={columns}
              emptyTips={(
                <div className='flex flex-col justify-center items-center text-12 text-gray-400'>
                  <img src='/dist/images/links.svg' alt="no data" className="mb-8"/>
                  <span className='text-12'>暂无数据，选择
                    <span onClick={() => setShowBindModal(true)} className='text-btn'>&nbsp;关联员工与部门</span>
                  </span>
                </div>
              )}
            />
          </div>
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
