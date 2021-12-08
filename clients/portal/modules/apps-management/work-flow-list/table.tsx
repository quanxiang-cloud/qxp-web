import React, { useState, useEffect } from 'react';
import cs from 'classnames';
import moment from 'moment';
import { observer } from 'mobx-react';
import { useQuery, useMutation } from 'react-query';
import { useParams, useHistory } from 'react-router-dom';

import Icon from '@c/icon';
import Table from '@c/table';
import Modal from '@c/modal';
import toast from '@lib/toast';
import ErrorTips from '@c/error-tips';
import Pagination from '@c/pagination';
import TableMoreFilterMenu from '@c/more-menu/table-filter';

import { deleteFlow, getFlowList } from './api';

interface Props {
  type: 'FORM_DATA' | 'FORM_TIME' | '';
  searchInput: string;
}

interface State {
  currentEditWorkFlow: Flow | null,
  currentDeleteWorkFlow: Flow | null,
}

type Model = {
  cell: {
    row: { original: Flow & {creatorName: string} };
    value: React.ReactNode
  }
}

const statusMap = {
  ENABLE: '已发布',
  DISABLE: '草稿',
};

function WorkFlowTable({ type, searchInput }: Props): JSX.Element {
  const { appID } = useParams<{appID: string}>();
  const history = useHistory();
  const [state, setState] = useState<State>({
    currentEditWorkFlow: null,
    currentDeleteWorkFlow: null,
  });
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });
  const { data, isLoading, isError, refetch } = useQuery(
    ['GET_FLOW_LIST', type, pagination, appID],
    () => getFlowList({
      appId: appID,
      page: pagination.current,
      size: pagination.pageSize,
      triggerMode: type ? type : undefined,
    }),
  );
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
  const hasData = !!data?.dataList.length;
  const filteredData = data?.dataList.filter(({ status }) => {
    if (!statusFilter || statusFilter === status) {
      return true;
    }
    return false;
  });
  const columns = [
    {
      Header: '名称',
      accessor: 'name',
      Cell: (model: Model) => {
        return (
          <span
            className="cursor-pointer"
            onClick={() => onRowActionChange('edit', model.cell.row.original)}>
            {model.cell.value}
          </span>
        );
      },
    },
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
      Cell: (model: Model) => {
        const statusColor = model.cell.value === 'ENABLE' ? 'green' : 'yellow';

        return (
          <div className="flex items-center">
            <div
              style={{
                '--status-color': `var(--${statusColor}-600)`,
                '--status-shadow-color': `var(--${statusColor}-400)`,
                boxShadow: `0 0 12px var(--${statusColor}-400)`,
              } as React.CSSProperties}
              className="relative w-8 h-8 rounded-full"
            >
              <div className="status-dot"></div>
            </div>
            <span className="ml-10">{statusMap[model.cell.value as 'ENABLE' | 'DISABLE']}</span>
          </div>
        );
      },
    }, {
      Header: '操作人',
      accessor: 'modifierName',
      Cell: (model: Model) => {
        return model.cell.value ?? model.cell.row.original.creatorName;
      },
    }, {
      Header: '更新时间',
      accessor: 'modifyTime',
      Cell: (model: {
        cell: { value: moment.MomentInput; }; }) => moment(model.cell.value).format('YYYY-MM-DD HH:mm:ss'),
    }, {
      Header: '操作',
      accessor: 'id',
      Cell: (model: Model) => {
        return (
          <>
            <span
              className="text-blue-600 cursor-pointer mr-16"
              onClick={() => onRowActionChange('edit', model.cell.row.original)}
            >
              修改
            </span>
            <span
              className="text-red-600 cursor-pointer"
              onClick={() => onRowActionChange('delete', model.cell.row.original)}
            >
              删除
            </span>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    setStatusFilter('');
  }, [type]);

  useEffect(() => {
    if (state.currentEditWorkFlow) {
      history.push(`/apps/flow/${appID}/${state.currentEditWorkFlow.id}`);
    }
  }, [state.currentEditWorkFlow]);

  useEffect(() => {
    if (state.currentDeleteWorkFlow?.status === 'ENABLE') {
      toast.error('已发布的流程不能删除，需要先下架后再删除');
    }
  }, [state.currentDeleteWorkFlow]);

  function onRowActionChange(key: 'edit' | 'delete', row: Flow): void {
    const actionMap = {
      edit: 'currentEditWorkFlow',
      delete: 'currentDeleteWorkFlow',
    };
    const sk = actionMap[key];
    setState((s) => ({ ...s, [sk]: row }));
  }

  function filterFlowOfName(): Flow[] {
    return filteredData?.filter(({ name }) => {
      if (searchInput) {
        return name.match(searchInput);
      }

      return true;
    }) || [];
  }

  function EmptyTipsRender(): JSX.Element {
    return (
      <div className='app-no-data mt-96 text-12'>
        <img
          className="cursor-pointer"
          src='/dist/images/data_empty.svg'
          onClick={() => history.push(`/apps/flow/new/form-data/${appID}`)}
        />
        <p>
          {!hasData && (
            <>
              暂无工作流。点击
              <span
                onClick={() => history.push(`/apps/flow/new/form-data/${appID}`)}
                className='ml-4 text-blue-600 cursor-pointer'
              >
                新建工作流
              </span>
              ，开始构建工作流
            </>
          )}
          {!filteredData?.length && '无符合筛选状态的工作流'}
          {!filterFlowOfName().length && '无符合筛选名称的工作流'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col flow-table">
      {!isError && (
        <Table<any>
          style={{ maxHeight: 'calc(100vh - 350px)' }}
          rowKey="id"
          data={filterFlowOfName()}
          emptyTips={<EmptyTipsRender />}
          columns={columns}
          loading={isLoading}
          canSetColumnWidth
        />
      )}
      {isError && (
        <ErrorTips desc="something wrong..."/>
      )}
      {!isLoading && hasData && !!filteredData?.length && (
        <Pagination
          {...pagination}
          total={data?.total}
          renderTotalTip={() => `共 ${data?.total || 0} 条数据`}
          onChange={(current, pageSize) => setPagination({ current, pageSize })}
        />
      )}
      {!!state.currentDeleteWorkFlow && state.currentDeleteWorkFlow.status === 'DISABLE' && (
        <Modal
          title="删除工作流"
          onClose={() => {
            setState((s) => ({ ...s, currentDeleteWorkFlow: null }));
          }}
          footerBtns={[
            {
              text: '取消',
              key: 'cancel',
              onClick: () => {
                setState((s) => ({ ...s, currentDeleteWorkFlow: null }));
              },
            },
            {
              text: '确定',
              key: 'confirm',
              modifier: 'primary',
              onClick: () => {
                deleteFlowMutation.mutate(state.currentDeleteWorkFlow?.id as string);
              },
            },
          ]}
        >
          <p className="text-h5 p-20">
            确定要删除工作流
            <span className="font-bold mx-8">
              {state.currentDeleteWorkFlow?.name}
            </span>
            吗？删除后将无法恢复！
          </p>
        </Modal>
      )}
    </div>
  );
}

export default observer(WorkFlowTable);
