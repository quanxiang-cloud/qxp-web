import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { observer } from 'mobx-react';
import { useQuery, useMutation } from 'react-query';
import { useParams, useHistory } from 'react-router-dom';

import Table from '@c/table';
import Modal from '@c/modal';
import toast from '@lib/toast';
import ErrorTips from '@c/error-tips';

import { deletePipelineFlow, getPipelineFlowList, getUserDetail } from './api';

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
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [users, setUsers] = useState<any>();

  const { data, isLoading, isError, refetch }: any = useQuery(
    ['GET_FLOW_LIST', type, currentPageNumber, appID],
    () => getPipelineFlowList({
      appId: appID,
      page: currentPageNumber,
      size: 500,
      triggerMode: type ? type : undefined,
    }),
  );

  useEffect(()=>{
    const { pipeline_outline } = data || {} as any;
    const creatorIDs = pipeline_outline?.map((item: any)=>item?.creatorID) || [];
    creatorIDs?.length && getUserDetail(creatorIDs).then((res: any)=>{
      const { users } = res || {};
      setUsers(users);
    });
  }, [data]);

  const deleteFlowMutation = useMutation('DELETE_FLOW', deletePipelineFlow, {
    onSuccess: (ok) => {
      // if (!ok) {
      //   return;
      // }
      refetch();
      setState((s) => ({ ...s, currentDeleteWorkFlow: null }));
    },
    onError: (err: Error | string) => {
      toast.error(typeof err === 'string' ? err : err.message);
    },
  });

  const hasData = !!data?.pipeline_outline?.length;
  const filteredData = data?.pipeline_outline?.filter(({ status }: any) => {
    if (!statusFilter || statusFilter === status) {
      return true;
    }
    return false;
  });
  const columns = [
    {
      Header: '名称',
      accessor: 'displayName',
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
      Header: '操作人',
      accessor: 'creatorID',
      Cell: (model: Model) => {
        return (
          <span
            className="cursor-pointer"
            onClick={() => onRowActionChange('edit', model.cell.row.original)}>
            {users?.find((item: any)=>item.id === model.cell.value)?.name }
          </span>
        );
      },
    },
    {
      Header: '创建时间',
      accessor: 'createdAt',
      Cell: (model: {
        cell: { value: moment.MomentInput; }; }) => moment(model.cell.value * 1000).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      Header: '更新时间',
      accessor: 'updatedAt',
      Cell: (model: {
        cell: { value: moment.MomentInput; }; }) => model.cell.value ?
        moment(model.cell.value * 1000).format('YYYY-MM-DD HH:mm:ss') :
        '',
    },
    {
      Header: '操作',
      accessor: 'name',
      Cell: (model: Model) => {
        return (
          <>
            <span
              className="text-blue-600 cursor-pointer mr-16"
              onClick={() => onRowActionChange('edit', model.cell.row.original)}
            >
              修改
            </span>
            {/* <span
              className="text-red-600 cursor-pointer"
              onClick={() => onRowActionChange('delete', model.cell.row.original)}
            >
              删除
            </span> */}
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
      history.push(`/apps/flow/${appID}/${state.currentEditWorkFlow?.name}`);
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
    return filteredData?.filter(({ name }: any) => {
      if (searchInput) {
        return name.indexOf(searchInput) !== -1;
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
    <>
      {!isError && (
        <div className='flex-1 flex flex-col flow-table overflow-hidden'>
          <Table<any>
            rowKey="pid"
            data={filterFlowOfName()}
            emptyTips={<EmptyTipsRender />}
            columns={columns}
            loading={isLoading}
            canSetColumnWidth
          />
        </div>
      )}
      {isError && (
        <ErrorTips desc="something wrong..."/>
      )}
      {!!state.currentDeleteWorkFlow &&
      // state.currentDeleteWorkFlow.status === 'DISABLE' &&
      (
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
                deleteFlowMutation.mutate(state.currentDeleteWorkFlow?.pid as string);
                setState((s) => ({ ...s, currentDeleteWorkFlow: null }));
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
    </>
  );
}

export default observer(WorkFlowTable);
