import React, { useState } from 'react'
import { useQuery, useMutation } from 'react-query'
import { Modal } from '@QCFE/lego-ui'

import { Button } from '@portal/components/Button'
import { Table } from '@portal/components/Table'
import { Loading } from '@portal/components/Loading'
import { EmptyData } from '@portal/components/EmptyData'
import { More } from '@portal/components/More'
import { OwnerSelector } from './OwnerSelector/OwnerSelector'
import {
  getRoleAssociations,
  IOwner,
  updateRoleAssociations,
  IUpdateRoleAssociations,
} from '../../api'

export interface IAssociateDepartmentEmployee {
  id: string | number
  isSuper: boolean
}

export const AssociateDepartmentEmployee = ({ id, isSuper }: IAssociateDepartmentEmployee) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [selectedRows, setSelectedRows] = useState<IOwner[]>([])
  const [showAddModal, setShowAddModal] = useState(false)

  const { data, isLoading, refetch } = useQuery(['getRoleAssociations', id], getRoleAssociations, {
    refetchOnWindowFocus: false,
    cacheTime: -1,
  })
  // @ts-ignore
  const mutation = useMutation((arg: IUpdateRoleAssociations) => updateRoleAssociations(arg), {
    onSuccess: () => refetch(),
  })

  const onAssociate = () => {
    // todo 关联 modal
  }

  if (isLoading) {
    return <Loading desc="加载中..." />
  }

  const rowSelection = {
    selectedRowKeys: selectedKeys,
    onChange: (selectedRowKeys: string[], selectedRowData: IOwner[]) => {
      setSelectedKeys(selectedRowKeys)
      setSelectedRows(selectedRowData)
    },
  }

  const onRowClick = (record: IOwner) => {
    const id = record.ownerID as string
    setSelectedKeys((arr: string[]) => {
      if (arr.includes(id)) {
        return arr.filter((i) => i !== id)
      } else {
        return [...arr, id]
      }
    })
    setSelectedRows((rows: IOwner[]) => {
      if (rows.find((item) => item.id === id)) {
        return rows.filter((i) => i.id !== id)
      } else {
        return [...rows, record]
      }
    })
  }

  const onCancelAssociation = (record: IOwner) => {
    return () => {
      if (selectedRows.length) {
        mutation.mutate({
          roleID: id as string,
          delete: selectedRows.map(({ id }) => id),
        })
      } else {
        mutation.mutate({
          roleID: id as string,
          delete: [record.id],
        })
      }
    }
  }

  return (
    <>
      <Modal
        title="角色关联员工与部门"
        onCancel={() => setShowAddModal(false)}
        onOk={() => {
          console.log('准备提交')
        }}
        visible={showAddModal}
        footer={
          <div className="flex flex-row justify-between items-center">
            <Button
              className="bg-white hover:bg-gray-100 transition cursor-pointer mr-4 mb-0"
              textClassName="text-dark-second ml-2"
              icon={<img src="/dist/images/icon_error.svg" />}
              onClick={() => setShowAddModal(false)}
            >
              取消
            </Button>
            <Button
              className="bg-dark-third hover:bg-gray-900 transition cursor-pointer mb-0"
              textClassName="text-white ml-2"
              icon={<img src="/dist/images/icon_true.svg" />}
              onClick={onAssociate}
            >
              确定关联
            </Button>
          </div>
        }
      >
        <OwnerSelector />
      </Modal>
      {!isSuper && (
        <Button
          className="bg-dark-third hover:bg-gray-900 transition mb-dot-8 cursor-pointer"
          textClassName="text-white ml-2"
          icon={<img src="/dist/images/link.svg" />}
          onClick={() => setShowAddModal(true)}
        >
          关联员工与部门
        </Button>
      )}
      <Table
        rowKey="ownerID"
        dataSource={data?.owners?.map((i) => {
          if (!i.ownerName) {
            i.ownerName = 'test'
          }
          if (!i.phone) {
            i.phone = '19960824973'
          }
          if (!i.email) {
            i.email = 'abc@qq.com'
          }
          if (!i.departmentName) {
            i.departmentName = '后勤部'
          }
          return i
        })}
        columns={[
          {
            title: '名称',
            dataIndex: 'ownerName',
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
          !isSuper
            ? {
                title: '',
                dataIndex: 'ownerID',
                render: (ownerID: string, record: IOwner) => {
                  return (
                    <More<IOwner>
                      actions={[
                        {
                          id: ownerID,
                          iconName: 'linkOff.svg',
                          text: '取消关联',
                          onclick: onCancelAssociation(record),
                        },
                      ]}
                      params={record}
                    />
                  )
                },
              }
            : null,
        ].filter(Boolean)}
        rowSelection={rowSelection}
        emptyText={<EmptyData text="无成员数据" className="py-10" />}
        onRow={(record) => ({
          onClick: () => onRowClick(record),
        })}
      />
    </>
  )
}
