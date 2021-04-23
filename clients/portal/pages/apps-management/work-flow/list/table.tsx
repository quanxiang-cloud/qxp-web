import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'react-query';

import Table, { Column } from '@c/qxp-table';
import { uuid } from '@lib/utils';
import More from '@c/more';
import Icon from '@c/icon';
import ModalConfirm from '@c/modal-confirm';
import Error from '@c/error';
import notify from '@lib/notify';

import { getFlowList, deleteFlow } from './api';

interface Props {
  type: 'FORM_DATA' | 'FORM_TIME' | '';
}
interface State {
  currentEditWorkFlow: Flow | null,
  currentDeleteWorkFlow: Flow | null,
}

const statusMap = {
  ENABLE: '已发布',
  DISABLE: '草稿',
};

export default function WorkFlowTable({ type }: Props) {
  const [state, setState] = useState<State>({
    currentEditWorkFlow: null,
    currentDeleteWorkFlow: null,
  });
  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
  const { data, isLoading, isError, refetch } = useQuery(['GET_FLOW_LIST', type], getFlowList, {
    cacheTime: -1,
    refetchOnWindowFocus: false,
  });
  const deleteFlowMutation = useMutation('DELETE_FLOW', deleteFlow, {
    onSuccess: (ok) => {
      if (!ok) {
        return;
      }
      refetch();
      setState((s) => ({ ...s, currentDeleteWorkFlow: null }));
    },
    onError: (err: Error | string) => {
      notify.error(typeof err === 'string' ? err : err.message);
    },
  });

  useEffect(() => {
    setIsDeleteConfirm(!!state.currentDeleteWorkFlow);
  }, [state]);

  const columns: Column<Flow>[] = [{
    title: (
      <div className="flex items-center cursor-pointer">
        <span className="mr-4">状态</span>
        <Icon name="funnel" />
      </div>
    ),
    dataIndex: 'status',
    render: (data, row) => {
      return (
        <div className="flex items-center">
          <Icon name={data === 'ENABLE' ? 'status-success' : 'status-default'} size={8}/>
          <span className="ml-10">{statusMap[row.status]}</span>
        </div>
      );
    },
  }, {
    title: '名称',
    dataIndex: 'name',
  }, {
    title: '操作人',
    dataIndex: 'modifierName',
  }, {
    title: '更新时间',
    dataIndex: 'modifyTime',
  }, {
    render: (_, row) => {
      return (
        <More
          items={[{
            id: uuid(),
            iconName: 'edit',
            text: '修改',
            onclick: () => setState((s) => ({ ...s, currentEditWorkFlow: row })),
          }, {
            id: uuid(),
            iconName: 'delete',
            text: '删除',
            onclick: () => setState((s) => ({ ...s, currentDeleteWorkFlow: row })),
          }, {
            id: uuid(),
            iconName: 'eye-open',
            text: '查看',
            onclick: () => {/* todo */},
          }]}
        />
      );
    },
  }];

  return (
    <div className="mt-32 flex flex-col flex-1">
      {!isError && (
        <Table<Flow>
          dataSource={data?.dataList}
          columns={columns}
          loading={isLoading}
        />
      )}
      {isError && (
        <Error desc="something wrong..."/>
      )}
      {isDeleteConfirm && (
        <ModalConfirm
          title="删除工作流"
          onSubmit={() => {
            deleteFlowMutation.mutate(state.currentDeleteWorkFlow?.id as string);
          }}
          onCancel={() => {
            setState((s) => ({ ...s, currentDeleteWorkFlow: null }));
          }}
        >
          <p className="text-h5">
            确定要删除工作流
            <span className="font-bold mx-8">
              {state.currentDeleteWorkFlow?.name}
            </span>
            吗？删除后将无法恢复！
          </p>
        </ModalConfirm>
      )}
    </div>
  );
}
