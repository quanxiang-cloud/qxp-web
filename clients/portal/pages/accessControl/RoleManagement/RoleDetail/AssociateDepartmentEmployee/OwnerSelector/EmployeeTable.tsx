import React, { useState } from 'react'

import { Table } from '@portal/components/Table'
import { range } from '@assets/lib/f'
import { EmptyData } from '@portal/components/EmptyData'

export const EmployeeTable = <
  T extends {
    id: string
    username: string
    phone: string
    email: string
    departmentName: string
  }
>() => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [selectedRows, setSelectedRows] = useState<T[]>([])

  const getDateSource = () => {
    return range(0, 7).map((i) => ({
      id: `${i}`,
      username: 'Jordan',
      phone: '19960824973',
      email: 'marvin@qq.com',
      departmentName: '质量保证部',
    }))
  }

  const onRowClick = (record: T) => {
    const id = record.id as string
    setSelectedKeys((arr: string[]) => {
      if (arr.includes(id)) {
        return arr.filter((i) => i !== id)
      } else {
        return [...arr, id]
      }
    })
    setSelectedRows((rows: T[]) => {
      if (rows.find((item) => item.id === id)) {
        return rows.filter((i) => i.id !== id)
      } else {
        return [...rows, record]
      }
    })
  }

  return (
    <>
      <Table
        onRow={(record: T) => {
          return {
            onClick: () => onRowClick(record),
          }
        }}
        emptyText={<EmptyData text="无成员数据" className="py-10" />}
        rowKey="id"
        dataSource={getDateSource()}
        columns={[
          {
            title: '员工姓名',
            dataIndex: 'username',
          },
          {
            title: '手机号',
            dataIndex: 'phone',
          },
          {
            title: '邮箱',
            dataIndex: 'email',
          },
          {
            title: '部门',
            dataIndex: 'departmentName',
          },
        ]}
        pagination={{ current: 1, total: 10, pageSize: 20 }}
        rowSelection={{
          selectedRowKeys: selectedKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            setSelectedKeys(selectedRowKeys)
            setSelectedRows(selectedRows)
          },
        }}
      />
    </>
  )
}
