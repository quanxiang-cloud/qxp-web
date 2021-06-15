import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'react-query';
import cs from 'classnames';
import { Link, useParams, useHistory } from 'react-router-dom';
import moment from 'moment';

import Table from '@c/table';
import Modal from '@c/modal';
import ErrorTips from '@c/error-tips';
import toast from '@lib/toast';
import TableMoreFilterMenu from '@c/more-menu/table-filter';
import MoreMenu from '@c/more-menu';
import Icon from '@c/icon';
import Pagination from '@c/pagination';

import { deleteFlow, getFlowList } from './api';

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

export default function WorkFlowTable({ type }: Props): JSX.Element {
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

  useEffect(() => {
    setStatusFilter('');
  }, [type]);

  useEffect(() => {
    if (state.currentEditWorkFlow) {
      history.push(`/apps/flow/${appID}/${state.currentEditWorkFlow.id}`);
    }
  }, [state.currentEditWorkFlow]);

  function onRowActionChange(key: 'edit' | 'delete', row: Flow): void {
    const actionMap = {
      edit: 'currentEditWorkFlow',
      delete: 'currentDeleteWorkFlow',
    };
    const sk = actionMap[key];
    setState((s) => ({ ...s, [sk]: row }));
  }

  const columns = [
    {
      Header: '名称',
      accessor: 'name',
      Cell: (model: any) => {
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
    }, {
      Header: '操作人',
      accessor: 'modifierName',
      Cell: (model: any) => {
        return model.cell.value ?? model.cell.row.original.creatorName;
      },
    }, {
      Header: '更新时间',
      accessor: 'modifyTime',
      Cell: (model: any) => moment(model.cell.value).format('YYYY-MM-DD HH:mm:ss'),
    }, {
      accessor: 'id',
      Cell: (model: any) => {
        return (
          <MoreMenu
            menus={[
              { key: 'edit', label: (<span><Icon name="edit" className="mr-6"/>修改</span>) },
              { key: 'delete', label: (<span><Icon name="delete" className="mr-6"/>删除</span>) },
            ]}
            onMenuClick={(key) => onRowActionChange(key, model.cell.row.original)}
          >
            <Icon
              changeable
              clickable
              name="more_horiz"
            />
          </MoreMenu>
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
        <Table<any>
          style={{ maxHeight: 'calc(100vh - 350px)' }}
          rowKey="id"
          data={filteredData || []}
          columns={columns}
          loading={isLoading}
        />
      )}
      {isError && (
        <ErrorTips desc="something wrong..."/>
      )}
      {!hasData && !isLoading && !isError && (
        <div className="mt-72 mb-16 flex flex-col items-center">
          <Icon name="workflow-list-empty" size={120} />
          <p className="text-caption">
            暂无工作流。点击
            <Link
              to={`/apps/flow/new/form-data/${appID}`}
              className="text-blue-600">
                新建工作流
            </Link>，开始构建工作流
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
          renderTotalTip={() => `共 ${data?.total || 0} 条数据`}
          onChange={(current, pageSize) => setPagination({ current, pageSize })}
        />
      )}
      {!!state.currentDeleteWorkFlow && (
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
          <p className="text-h5">
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
