import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'react-query';
import cs from 'classnames';
import { Link } from 'react-router-dom';

import Table from '@c/table';
import ModalConfirm from '@c/modal-confirm';
import Error from '@c/error';
import toast from '@lib/toast';
import TableMoreFilterMenu from '@c/more-menu/table-filter';
import TableMoreActionMenu from '@c/more-menu/table-action';
import Icon from '@c/icon';
import Pagination from '@c/pagination';

import { getFlowList, deleteFlow } from './api';

interface Props {
  type: 'FORM_DATA' | 'FORM_TIME' | '';
}
interface State {
  currentEditWorkFlow: Flow | null,
  currentDeleteWorkFlow: Flow | null,
  currentSeeWorkFlow: Flow | null,
}

const statusMap = {
  ENABLE: '已发布',
  DISABLE: '草稿',
};

export default function WorkFlowTable({ type }: Props) {
  const [state, setState] = useState<State>({
    currentEditWorkFlow: null,
    currentDeleteWorkFlow: null,
    currentSeeWorkFlow: null,
  });
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });
  const { data, isLoading, isError, refetch } = useQuery(
    ['GET_FLOW_LIST', type, pagination],
    getFlowList, {
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
      toast.error(typeof err === 'string' ? err : err.message);
    },
  });

  useEffect(() => {
    setStatusFilter('');
  }, [type]);

  function onRowActionChange(key: 'edit' | 'delete' | 'see', row: Flow) {
    const actionMap = {
      edit: 'currentEditWorkFlow',
      delete: 'currentDeleteWorkFlow',
      see: 'currentSeeWorkFlow',
    };
    const sk = actionMap[key];
    setState((s) => ({ ...s, [sk]: row }));
  }

  const columns = [
    {
      accessor: 'status',
      Header: () => {
        return (
          <TableMoreFilterMenu
            menus={[
              { key: 'ENABLE', label: '已发布' },
              { key: 'DISABLE', label: '草稿' },
            ]}
            checkedKey={statusFilter}
            onChange={setStatusFilter}
          >
            <div className={cs('flex items-center cursor-pointer', {
              'pointer-events-none': !data?.dataList.length,
            })}>
              <span className="mr-4">状态</span>
              <Icon name="funnel" />
            </div>
          </TableMoreFilterMenu>
        );
      },
      Cell: (model: any) => {
        return (
          <div className="flex items-center">
            <Icon
              name={model.cell.value === 'ENABLE' ? 'status-success' : 'status-default'}
              size={8}
            />
            <span className="ml-10">{statusMap[model.cell.value as 'ENABLE' | 'DISABLE']}</span>
          </div>
        );
      },
    },
    {
      Header: '名称',
      accessor: 'name',
    }, {
      Header: '操作人',
      accessor: 'modifierName',
    }, {
      Header: '更新时间',
      accessor: 'modifyTime',
    }, {
      accessor: 'id',
      Cell: (model: any) => {
        return (
          <TableMoreActionMenu
            menus={[
              { key: 'edit', label: '修改', iconName: 'edit' },
              { key: 'delete', label: '删除', iconName: 'delete' },
              { key: 'see', label: '查看', iconName: 'eye-open' },
            ]}
            onChange={(key) => onRowActionChange(key, model.cell.row.original)}
          >
            <Icon
              changeable
              clickable
              name="more_horiz"
            />
          </TableMoreActionMenu>
        );
      },
    },
  ];

  const filteredData = data?.dataList.filter(({ status }) => {
    if (!statusFilter || statusFilter === status) {
      return true;
    }
    return false;
  });
  const hasData = !!data?.dataList.length;
  const hasFilteredData = !!filteredData?.length;

  return (
    <div className="mt-32 flex flex-col flex-1">
      {!isError && (
        <Table
          rowKey="id"
          data={filteredData || []}
          // @ts-ignore
          columns={columns}
          loading={isLoading}
        />
      )}
      {isError && (
        <Error desc="something wrong..."/>
      )}
      {!hasData && !isLoading && (
        <div className="mt-72 mb-16 flex flex-col items-center">
          <Icon name="workflow-list-empty" size={120} />
          <p className="text-caption">
            暂无工作流。点击 <Link to="/apps/flow/new/form-data" className="text-blue-600">新建工作流</Link>，开始构建工作流
          </p>
        </div>
      )}
      {hasData && !hasFilteredData && !isLoading && (
        <div className="mt-72 mb-16 flex flex-col items-center">
          <Icon name="workflow-list-empty" size={120} />
          <p className="text-caption">
            无符合筛选状态的工作流
          </p>
        </div>
      )}
      {!isLoading && hasData && hasFilteredData && (
        <Pagination
          {...pagination}
          total={data?.total}
          renderTotalTip={(total) => `共 ${total} 条数据`}
          onChange={(current, pageSize) => setPagination({ current, pageSize })}
        />
      )}
      {!!state.currentDeleteWorkFlow && (
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
