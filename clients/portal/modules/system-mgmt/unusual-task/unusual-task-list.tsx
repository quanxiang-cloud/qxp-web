import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';
import dayjs from 'dayjs';

import Table from '@c/table';
import Search from '@c/search';
import EmptyTips from '@c/empty-tips';
import Pagination from '@c/pagination';

import { getAbnormalTask } from './api';

const InstanceStatus: Record<FlowStatus, string> = {
  SUBMIT: '提交',
  RE_SUBMIT: '再次提交',
  CANCEL: '撤回',
  AGREE: '通过',
  REFUSE: '拒绝',
  FILL_IN: '完成填写',
  DELIVER: '转交',
  STEP_BACK: '回退',
  SEND_BACK: '打回重填',
  CC: '抄送',
  ADD_SIGN: '加签',
  READ: '邀请阅示',
  REVIEW: '待处理',
  IN_REVIEW: '审批中',
  AUTO_REVIEW: '自动审批',
  AUTO_SKIP: '跳过',
  ABANDON: '已作废',
};

const HandleStatus: Record<0 | 1 | 2, {color: string, value: string}> = {
  0: { color: 'red', value: '未处理' },
  1: { color: 'blue', value: '已处理' },
  2: { color: 'green', value: '已处系统自动处理理' },
};

const initSearch = { page: 1, limit: 10, total: 0, keyword: '' };

function UnusualTaskTable(): JSX.Element {
  const [taskList, setTaskList] = useState<UnusualTaskItem[]>([]);
  const [pageParams, setPageParams] = React.useState(initSearch);
  const history = useHistory();

  const { data: taskData, isLoading } = useQuery(
    ['GET_UNUSUAL_TASK', pageParams],
    () => getAbnormalTask(pageParams),
    {
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    if (taskData) {
      setTaskList(taskData.dataList || []);
      setPageParams({
        ...pageParams,
        total: taskData.total,
      });
    }
  }, [taskData]);

  const searchChangeHandle = (val: string): void => {
    setPageParams({
      ...pageParams,
      keyword: val,
    });
  };

  function pageChange(current: number, pageSize: number): void {
    setPageParams({ ...pageParams, page: current, limit: pageSize });
  }

  function goUnusualTaskDetail(data: UnusualTaskItem, status: 0 | 1): void {
    const { id, processInstanceId, taskId } = data;
    history.push(`/system/unusual/detail/${id}/${status}/${processInstanceId}/${taskId}`);
  }

  const cols = [
    {
      Header: '工作流程名称',
      id: 'instanceName',
      width: 'auto',
      accessor: ({ instanceName, id }: UnusualTaskItem) => (
        <span>{instanceName ? instanceName : '-'}</span>
      ),
    },
    {
      Header: '所属应用',
      id: 'appName',
      width: 'auto',
      accessor: ({ appName }: UnusualTaskItem) => (
        <span>{appName ? appName : '-'}</span>
      ),
    },
    {
      Header: '发起人',
      id: 'applyUserName',
      width: 'auto',
      accessor: ({ applyUserName }: UnusualTaskItem) => (
        <span>{applyUserName ? applyUserName : '-'}</span>
      ),
    },
    {
      Header: '发起时间',
      id: 'instanceCreateTime',
      width: 'auto',
      accessor: ({ instanceCreateTime }: UnusualTaskItem) => (
        <span>{instanceCreateTime ? dayjs(instanceCreateTime).format('YYYY-MM-DD HH:mm') : '-'}</span>
      ),
    },
    {
      Header: '当前节点',
      id: 'taskName',
      width: 'auto',
      accessor: ({ taskName }: UnusualTaskItem) => (
        <span>{taskName ? taskName : '-'}</span>
      ),
    },
    {
      Header: '异常原因',
      id: 'reason',
      width: 'auto',
      accessor: ({ reason }: UnusualTaskItem) => (
        <span>{reason ? reason : '-'}</span>
      ),
    },
    {
      Header: '流程状态',
      id: 'instanceStatus',
      width: 'auto',
      accessor: ({ instanceStatus }: UnusualTaskItem) => (
        <span>{InstanceStatus[instanceStatus]}</span>
      ),
    },
    {
      Header: '处理状态',
      id: 'status',
      width: 'auto',
      accessor: ({ status }: UnusualTaskItem) => {
        const statusInfo = HandleStatus[status];
        return (
          <span style={{ color: statusInfo.color }}>{statusInfo.value}</span>
        );
      },
    },
    {
      Header: '操作',
      id: '',
      width: 'auto',
      accessor: (item: UnusualTaskItem) => {
        return (
          <div className="flex">
            {
              item.status === 0 && (<div className="flex items-center">
                <span
                  className="font-normal text-blue-600 cursor-pointer"
                  onClick={() => goUnusualTaskDetail(item, 0)}
                >处理&emsp;&emsp;</span>
              </div>)
            }
            <div className="flex items-center">
              <span
                className="font-normal text-blue-900 cursor-pointer"
                onClick={() => goUnusualTaskDetail(item, 1)}
              >查看&emsp;&emsp;</span>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col flex-grow overflow-hidden">
      <div className='w-full flex align-center ml-20 mt-20'>
        <div className="log-date-picker">
          <span>工作流名称：</span>
        </div>
        <Search
          placeholder="输入关键字"
          value={pageParams.keyword}
          onChange={searchChangeHandle}
          className="search-log ml-10 bg-gray-100"
        />
      </div>
      <div
        className='log-table-wrap flex w-full mt-16 px-20'
        style={{ height: 'calc(100% - 142px)' }}
      >
        <Table
          className='text-14 h-full'
          data={taskList}
          columns={cols}
          rowKey="id"
          emptyTips={<EmptyTips text='暂无日志数据' className="pt-40" />}
          loading={isLoading}
        />
      </div>
      {taskList.length > 0 && (
        <Pagination
          current={pageParams.page}
          pageSize={pageParams.limit}
          total={pageParams.total}
          showSizeChanger
          onChange={pageChange}
          className={'pt-10'}
          renderTotalTip={() => (
            <div className="text-12 text-gray-600">
              共<span className="mx-4">{pageParams.total || 0}</span>条
            </div>
          )}
        />)}
    </div>
  );
}

export default UnusualTaskTable;
