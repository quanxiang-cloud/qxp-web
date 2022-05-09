import React, { useMemo, useState } from 'react';
import { UnionColumn, UseFiltersColumnProps, Row } from 'react-table';

import { getTwoDimenArrayHead } from '@lib/utils';
import { CheckboxValueType } from '@c/checkbox/checkbox-group';

import UserCell from '../table-column/user-cell';
import StatusCell from '../table-column/status-cell';
import RadioFilter from '../table-column/radio-filter';
import SearchFilter from '../table-column/search-filter';
import { UserInfo } from '../type';

type UseEmployeesColumns = {
  EmployeesColumns: UnionColumn<Employee>[];
  filterUserInfo: UserInfo;
}

export default function useEmployeesColumns(): UseEmployeesColumns {
  const [filterUserInfo, setFilterUserInfo] = useState<UserInfo>({});

  function columnFilter<T extends Employee>(
    rows: Array<Row<T>>,
    columnIds: string[],
    filterValue: CheckboxValueType[],
  ): Array<Row<T>> {
    setFilterUserInfo({ ...filterUserInfo, [columnIds[0]]: filterValue });
    return rows;
  }

  const EmployeesColumns: UnionColumn<Employee>[] = useMemo(() => {
    return [
      {
        Header: '姓名',
        id: 'name',
        fixed: true,
        width: 120,
        accessor: (record: Employee) => <UserCell user={record} />,
        Filter: ({ column }: { column: UseFiltersColumnProps<Employee> }) => <SearchFilter column={column} />,
        filter: columnFilter,
      },
      {
        Header: '状态',
        id: 'useStatus',
        accessor: (record: Employee) => <StatusCell user={record} />,
        Filter: ({ column }: { column: UseFiltersColumnProps<Employee> }) => (
          <RadioFilter
            column={column}
            options={[
              { value: 1, label: '正常' },
              { value: -1, label: '已删除' },
              { value: -2, label: '已禁用' },
            ]}
          />
        ),
        filter: columnFilter,
      },
      {
        Header: '手机号',
        id: 'phone',
        accessor: 'phone',
        Filter: ({ column }: { column: UseFiltersColumnProps<Employee> }) => <SearchFilter column={column} />,
        filter: columnFilter,
      },
      {
        Header: '邮箱',
        id: 'email',
        accessor: 'email',
        Filter: ({ column }: { column: UseFiltersColumnProps<Employee> }) => <SearchFilter column={column} />,
        filter: columnFilter,
      },
      {
        Header: '部门',
        id: 'dep',
        accessor: ({ departments }: Employee) => {
          return getTwoDimenArrayHead(departments)?.name;
        },
      },
      {
        Header: '岗位',
        id: 'position',
        accessor: 'position',
        Filter: ({ column }: { column: UseFiltersColumnProps<Employee> }) => <SearchFilter column={column} />,
        filter: columnFilter,
      },
      {
        Header: '直属上级',
        id: 'leaderName',
        accessor: ({ leaders }: Employee) => {
          return getTwoDimenArrayHead(leaders)?.name;
        },
      },
    ];
  }, []);
  return { EmployeesColumns, filterUserInfo };
}
