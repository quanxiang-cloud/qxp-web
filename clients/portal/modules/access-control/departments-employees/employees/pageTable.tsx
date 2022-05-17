import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { UnionColumn } from 'react-table';

import Table from '@c/table';
import EmptyTips from '@c/empty-tips';
import Pagination from '@c/pagination';
import MoreMenu from '@c/more-menu';
import { getTwoDimenArrayHead } from '@lib/utils';

import { EmployeesActions, KeyToModalTypeMap } from '../constant';
import store from './store';
import useEmployeesColumns from '../hooks/useEmployeeColumn';

function PageTable(): JSX.Element {
  const { EmployeesColumns, filterUserInfo } = useEmployeesColumns();

  useEffect(() => {
    store.setFilterUserInfo(filterUserInfo);
  }, [filterUserInfo]);

  const columns: UnionColumn<Employee>[] = [...EmployeesColumns];

  if (window.ADMIN_USER_FUNC_TAGS.includes('accessControl/mailList/manage')) {
    columns.push({
      Header: '操作',
      id: 'action',
      fixed: true,
      width: 60,
      accessor: (record: Employee) => {
        const dep = getTwoDimenArrayHead(record.departments);
        const isDEPLeader = dep?.attr === '1' ? 1 : -1;
        const menu = EmployeesActions.filter((menu) => {
          return menu.authority.includes(record?.useStatus || 0) &&
            menu.leader.includes(isDEPLeader || 0);
        });
        return (
          <MoreMenu
            menus={menu}
            placement="bottom-end"
            className="opacity-1"
            onMenuClick={(key): void => {
              store.setCurrentUser(record);
              store.setModalType(KeyToModalTypeMap[key]);
            }}
          />
        );
      },
    });
  }

  return (
    <>
      <div
        className="qxp-table flex w-full border-b  mt-16 px-20"
        style={{ height: 'calc(100% - 92px)' }}
      >
        <Table
          showCheckbox
          className="text-14 h-full"
          data={store.employeesList?.users || []}
          onSelectChange={(selectedKeys, selectedRows) => store.changeSelect(selectedRows)}
          columns={columns}
          emptyTips={(
            <EmptyTips text="无成员数据" className="py-32" />
          )}
          rowKey="id"
          initialSelectedRowKeys={store.selectedUserIds}
          loading={store.loading}
        />
      </div>
      {
        (store.employeesList?.users && store.employeesList?.users.length > 0) && (
          <Pagination
            current={store.page}
            total={store.employeesList?.total || 0}
            pageSize={store.pageSize}
            onChange={(current, pageSize) => store.changePage(current, pageSize)}
            renderTotalTip={() => (
              <div className="text-12 text-gray-600">
                共<span className="mx-4">{store.employeesList?.total || 0}</span>条数据
              </div>
            )}
          />
        )
      }
    </>
  );
}

export default observer(PageTable);
