import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { Loading } from '@QCFE/lego-ui'

import { Button } from '@portal/components/Button'
import { Table } from '@portal/components/Table'
import { getRoleAssociations, IOwner } from '../api'
import { EmptyData } from '@portal/components/emptyData'

export interface IAssociateDepartmentEmployee {
  id: string | number
}

export const AssociateDepartmentEmployee = ({ id }: IAssociateDepartmentEmployee) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  const { data, isLoading } = useQuery(['getRoleAssociations', id], getRoleAssociations, {
    refetchOnWindowFocus: false,
    cacheTime: -1,
  })

  const onClick = () => {
    // todo 关联 modal
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loading />
      </div>
    )
  }

  const rowSelection = {
    selectedRowKeys: selectedKeys,
    onChange: (selectedRowKeys: string[], selectedRows: IOwner[]) => {
      setSelectedKeys(selectedKeys)
      console.log('selectedRowKeys:', selectedRowKeys, 'selectedRows: ', selectedRows)
    },
    // getCheckboxProps: (record: IOwner) => ({
    //   disabled: record.status === 'deprecated',
    //   name: record.image_id,
    // }),
  }

  return (
    <>
      <Button
        className="bg-dark-third hover:bg-gray-900 transition mb-dot-8"
        textClassName="text-white ml-2"
        icon={<img src="/dist/images/link.svg" />}
        onClick={onClick}
      >
        关联员工与部门
      </Button>
      <Table
        rowKey="ownerID"
        dataSource={data?.owners.filter((i) => !!i.ownerName)}
        columns={[
          {
            title: '名称',
            dataIndex: 'ownerName',
          },
          {
            title: '手机号',
            dataIndex: 'mobile',
          },
          {
            title: '邮箱',
            dataIndex: 'email',
          },
          {
            title: '部门',
            dataIndex: 'department',
          },
        ]}
        rowSelection={rowSelection}
        emptyText={<EmptyData text="无成员数据" className="py-10" />}
      />
    </>
  )
}
