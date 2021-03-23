import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from 'react-query';
import { Modal } from '@QCFE/lego-ui';

import { Button } from '@portal/components/button';
import { Table } from '@portal/components/table2';
import { Loading } from '@portal/components/loading2';
import { EmptyData } from '@portal/components/empty-data';
import { More } from '@portal/components/more';
import { Pagination } from '@portal/components/pagination2';
import { OwnerSelector } from './owner-selector';
import {
  getRoleAssociations,
  IOwner,
  updateRoleAssociations,
  IUpdateRoleAssociations,
} from '../../api';

export interface IAssociateDepartmentEmployee {
  id: string | number;
  isSuper: boolean;
}

export const AssociateDepartmentEmployee = ({ id, isSuper }: IAssociateDepartmentEmployee) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<IOwner[]>([]);
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
      'getRoleAssociations',
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

  useEffect(() => {
    setPagination((p) => ({ ...p, total: data?.total || 0 }));
  }, [data]);

  // @ts-ignore
  const mutation = useMutation(
    (arg: IUpdateRoleAssociations) => updateRoleAssociations(arg), {
      onSuccess: () => {
        setShowAddModal(false);
        refetch();
      },
    });

  const onAssociate = () => {
    if (selectorRef.current) {
      const currentOwners = selectorRef.current();
      const deletes = data?.owners.filter((owner) => {
        return !currentOwners.find((o) => o.ownerID === owner.ownerID);
      });
      const adds = currentOwners.filter((cowner) => {
        return !data?.owners.find((o) => o.ownerID === cowner.ownerID);
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

  if (isLoading) {
    return <Loading desc="加载中..." />;
  }

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
              className="bg-white hover:bg-gray-100 transition cursor-pointer mr-8 mb-0"
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
        <OwnerSelector defaultEmployees={data?.owners} refs={selectorRef} />
      </Modal>
      {!isSuper && (
        <Button
          className="bg-gray-700 hover:bg-gray-900 transition mb-dot-8 cursor-pointer"
          textClassName="text-white ml-2"
          icon={<img src="/dist/images/link.svg" />}
          onClick={() => setShowAddModal(true)}
        >
          关联员工与部门
        </Button>
      )}
      <div
        className="overflow-scroll w-full pb-6"
        style={{ height: 'calc(100% - 32px)' }}
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
              <span className="text-1-dot-2 text-gray-400">{`共 ${pagination.total} 个员工`}</span>
            }
            onShowSizeChange={(pageSize) => setPagination((p) => ({ ...p, pageSize }))}
            onChange={(current) => setPagination((p) => ({ ...p, current }))}
          />
        )}
      </div>
    </>
  );
};
