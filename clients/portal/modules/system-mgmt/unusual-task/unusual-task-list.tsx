import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';
import dayjs from 'dayjs';

import Table from '@c/table';
import Search from '@c/search';
import EmptyTips from '@c/empty-tips';
import Pagination from '@c/pagination';
import Icon from '@c/icon';

import { getAbnormalTask } from './api';

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

  function goUnusualTaskDetail(id: string): void {
    history.push(`/system/unusual/detail/${id}`);
  }

  const cols = [
    {
      Header: '工作流程名称',
      id: 'name',
      width: 'auto',
      accessor: ({ taskName, id }: UnusualTaskItem) => (
        <span onClick={() => goUnusualTaskDetail(id)}>{taskName ? taskName : '无'}</span>
      ),
    },
    {
      Header: '所属应用',
      id: 'app',
      width: 'auto',
      accessor: ({ app }: any) => (
        <span>{app ? app : '无'}</span>
      ),
    },
    {
      Header: '发起人',
      id: 'user',
      width: 'auto',
      accessor: ({ user }: any) => (
        <span>{user ? user : '无'}</span>
      ),
    },
    {
      Header: '发起时间',
      id: 'time',
      width: 'auto',
      accessor: ({ modifyTime }: UnusualTaskItem) => (
        <span>{modifyTime ? dayjs(modifyTime).format('YYYY-MM-DD HH:mm') : '-'}</span>
      ),
    },
    {
      Header: '当前节点',
      id: 'current',
      width: 'auto',
      accessor: ({ current }: any) => (
        <span>{current ? current : '无'}</span>
      ),
    },
    {
      Header: '异常原因',
      id: 'reason',
      width: 'auto',
      accessor: ({ reason }: any) => (
        <span>{reason ? reason : '无'}</span>
      ),
    },
    {
      Header: '流程状态',
      id: 'status',
      width: 'auto',
      accessor: ({ status }: any) => (
        <span>{status ? status : '无'}</span>
      ),
    },
    {
      Header: '处理状态',
      id: 'handle',
      width: 'auto',
      accessor: ({ handle }: any) => (
        <span>{handle ? handle : '无'}</span>
      ),
    },
    {
      Header: '操作',
      id: '',
      width: 'auto',
      accessor: ({ app }: any) => {
        return (
          <div className="flex">
            <div className="flex items-center">
              <Icon name="send" size={16} className="mr-8" />
              <span className="font-normal">处理&emsp;&emsp;</span>
            </div>
            <div className="flex items-center">
              <Icon name="send" size={16} className="mr-8" />
              <span className="font-normal">查看&emsp;&emsp;</span>
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
