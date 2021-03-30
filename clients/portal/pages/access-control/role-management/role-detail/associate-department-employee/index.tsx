import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from 'react-query';
import { Modal } from '@QCFE/lego-ui';

import Button from '@c/button';
import Table from '@c/table2';
import Loading from '@c/loading2';
import EmptyData from '@c/empty-data';
import More from '@c/more';
import Pagination from '@c/pagination2';
import Authorized from '@clients/common/component/authorized';
import {
  getRoleAssociations,
  IOwner,
  updateRoleAssociations,
  IUpdateRoleAssociations,
} from '@net/role-management';

import { OwnerSelector } from './owner-selector';

export interface Props {
  id: string | number;
  isSuper: boolean;
}

export default function AssociateDepartmentEmployee({ id, isSuper }: Props) {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [_, setSelectedRows] = useState<IOwner[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [pagination, setPagination] = useState<{
    total: number;
    current: number;
    pageSize: number;
  }>({
    total: 0,
    current: 1,
    pageSize: 10,
  });
  const selectorRef = useRef<() => IOwner[]>();

  const { data, isLoading, refetch } = useQuery(
    [
      'GET_ROLE_ASSOCIATIONS',
      {
        roleID: id,
        page: pagination.current,
        limit: pagination.pageSize,
      },
    ],
    getRoleAssociations,
    {
      refetchOnWindowFocus: false,
      cacheTime: -1,
    },
  );

  const {
    data: allData,
    isLoading: isAllLoading,
    isError: isAllError,
    refetch: refetchAll,
  } = useQuery(
    [
      'GET_ROLE_ASSOCIATIONS_ALL',
      {
        roleID: id,
      },
    ],
    getRoleAssociations,
    {
      refetchOnWindowFocus: false,
      cacheTime: -1,
    },
  );

  useEffect(() => {
    setPagination((p) => ({ ...p, total: data?.total || 0 }));
  }, [data]);

  // @ts-ignore
  const mutation = useMutation(
    (arg: IUpdateRoleAssociations) => updateRoleAssociations(arg), {
      onSuccess: () => {
        setShowAddModal(false);
        refetch();
        refetchAll();
      },
    });

  const onAssociate = () => {
    if (selectorRef.current) {
      const currentOwners = selectorRef.current();
      const deletes = allData?.owners.filter((owner) => {
        return !currentOwners.find((o) => o.ownerID === owner.ownerID);
      });
      const adds = currentOwners.filter((cowner) => {
        return !allData?.owners.find((o) => o.ownerID === cowner.ownerID);
      });
      mutation.mutate({
        roleID: id as string,
        add: adds.map(({ type, ownerID }) => ({ type: type as (1 | 2), ownerID })),
        delete: deletes?.map(({ id }) => id),
      });
    }
  };

  const onCancelAssociation = (record: IOwner) => {
    setSelectedRows((rows) => {
      if (rows.length) {
        mutation.mutate({
          roleID: id as string,
          delete: rows.map(({ id }) => id),
        });
      } else {
        mutation.mutate({
          roleID: id as string,
          delete: [record.id],
        });
      }
      return rows;
    });
  };

  const rowSelection = {
    selectedRowKeys: selectedKeys,
    onChange: (selectedRowKeys: string[], selectedRowData: IOwner[]) => {
      setSelectedKeys(selectedRowKeys);
      setSelectedRows(selectedRowData);
    },
  };

  const onRowClick = (record: IOwner) => {
    const id = record.ownerID as string;
    setSelectedKeys((arr: string[]) => {
      if (arr.includes(id)) {
        return arr.filter((i) => i !== id);
      } else {
        return [...arr, id];
      }
    });
    setSelectedRows((rows: IOwner[]) => {
      if (rows.find((item) => item.id === id)) {
        return rows.filter((i) => i.id !== id);
      } else {
        return [...rows, record];
      }
    });
  };

  if (isLoading || isAllLoading || isAllError) {
    return <Loading desc="加载中..." />;
  }

  return (
    <>
      <Modal
        title="角色关联员工与部门"
        onCancel={() => setShowAddModal(false)}
        className="owner-bind-modal"
        visible={showAddModal}
        footer={
          <div className="flex flex-row justify-between items-center">
            <Button
              className="bg-white hover:bg-gray-100 transition cursor-pointer mr-20 mb-0"
              textClassName="text-gray-600 ml-2"
              icon={<img src="/dist/images/icon_error.svg" />}
              onClick={() => setShowAddModal(false)}
            >
              取消
            </Button>
            <Button
              className="bg-gray-700 hover:bg-gray-900 transition cursor-pointer mb-0"
              textClassName="text-white ml-2"
              icon={<img src="/dist/images/icon_true.svg" />}
              onClick={onAssociate}
            >
              确定关联
            </Button>
          </div>
        }
      >
        <OwnerSelector defaultEmployees={allData?.owners} refs={selectorRef} />
      </Modal>
      {!isSuper && (
        <Authorized authority={['accessControl/role/manage']}>
          <Button
            className="bg-gray-700 hover:bg-gray-900 transition mb-16 cursor-pointer"
            textClassName="text-white ml-2"
            icon={<img src="/dist/images/link.svg" />}
            onClick={() => setShowAddModal(true)}
          >
            关联员工与部门
          </Button>
        </Authorized>
      )}
      <div
        className="overflow-scroll w-full pb-6 rounded-12"
        style={{ height: 'calc(100% - 42px)' }}
      >
        <Table
          rowKey="ownerID"
          dataSource={data?.owners || []}
          className="rounded-bl-none rounded-br-none"
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
            !isSuper ?
              {
                title: '',
                dataIndex: 'ownerID',
                render: (ownerID: string, record: IOwner) => {
                  return (
                    <More<IOwner>
                      items={[
                        {
                          id: ownerID,
                          iconName: '/dist/images/linkOff.svg',
                          text: '取消关联',
                          onclick: () => onCancelAssociation(record),
                        },
                      ]}
                      params={record}
                      className="flex items-center justify-center"
                      contentClassName="w-48"
                      contentItemClassName="justify-center"
                    />
                  );
                },
              } :
              null,
          ].filter(Boolean)}
          rowSelection={rowSelection}
          emptyText={<EmptyData text="无成员数据" className="py-10" />}
          onRow={(record) => ({
            onClick: () => onRowClick(record),
          })}
        />
        {!isSuper && (
          <Pagination
            type="simple"
            pageSize={pagination.pageSize}
            total={pagination.total}
            current={pagination.current}
            prefix={
              <span className="text-12 text-gray-400">{`共 ${pagination.total} 个员工`}</span>
            }
            onShowSizeChange={(pageSize) => setPagination((p) => ({ ...p, pageSize }))}
            onChange={(current) => setPagination((p) => ({ ...p, current }))}
            className="rounded-bl-12 rounded-br-12 pagination-border"
          />
        )}
      </div>
    </>
  );
}
