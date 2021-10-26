import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';
import dayjs from 'dayjs';
import cs from 'classnames';

import Table from '@c/table';
import Select from '@c/select';
import Search from '@c/search';
import Icon from '@c/icon';
import EmptyTips from '@c/empty-tips';
import Pagination from '@c/pagination';
import Authorized from '@c/authorized';

import { getAbnormalTask, getAppList } from './api';

import './index.scss';

type UnusualTAskPageParams ={
  size: number;
  page: number;
  keyword: string;
  total: number;
  status?: number;
  instanceStatus?: string;
  appId?: string;
}

const instanceStatus = [
  {
    value: 'all',
    label: '全部',
  }, {
    value: 'REVIEW',
    label: '待审批',
  }, {
    value: 'IN_REVIEW',
    label: '审批中',
  }, {
    value: 'SEND_BACK',
    label: '待补充',
  }, {
    value: 'AGREE',
    label: '通过',
  }, {
    value: 'REFUSE',
    label: '拒绝',
  }, {
    value: 'CANCEL',
    label: '撤销',
  }, {
    value: 'ABANDON',
    label: '作废',
  }, {
    value: 'ABEND',
    label: '异常结束',
  },
];

const taskHandleStatus = [
  {
    value: -1,
    label: '全部',
  }, {
    value: 0,
    label: '待处理',
  }, {
    value: 1,
    label: '已处理',
  }, {
    value: 2,
    label: '系统自动处理',
  },
];

const enumInstanceStatusLabel = {
  all: '全部',
  REVIEW: '待审批',
  IN_REVIEW: '审批中',
  SEND_BACK: '待补充',
  AGREE: '通过',
  REFUSE: '拒绝',
  CANCEL: '撤销',
  ABANDON: '作废',
  ABEND: '异常结束',
};

const enumStatusLabel = {
  0: '待处理',
  1: '已处理',
  2: '系统自动处理',
};

const handleStatusColor = {
  0: 'red',
  1: 'blue',
  2: 'green',
};

const initPageParams = { page: 1, size: 10, keyword: '', total: 0 };

function UnusualTaskTable(): JSX.Element {
  const [taskList, setTaskList] = useState<UnusualTaskItem[]>([]);
  const [pageParams, setPageParams] = useState<UnusualTAskPageParams>(initPageParams);
  const [appOptions, setAppOptions] = useState<{value: string, label: string}[]>([]);
  const history = useHistory();

  const { data: taskData, isLoading } = useQuery(
    ['GET_UNUSUAL_TASK', pageParams],
    () => getAbnormalTask(pageParams),
    {
      refetchOnWindowFocus: false,
    },
  );

  const { data: allAppList } = useQuery(['GET_APP_DATA'], getAppList);

  useEffect(() => {
    if (taskData) {
      setTaskList(taskData.dataList || []);
      setPageParams({ ...pageParams, total: taskData.total });
    }
  }, [taskData]);

  useEffect(() => {
    if (allAppList) {
      const initAppOptions = [{ value: 'all', label: '全部' }];
      allAppList?.data.map((appListItem) => {
        initAppOptions.push({
          value: appListItem.id,
          label: appListItem.appName,
        });
      });
      setAppOptions(initAppOptions);
    }
  }, [allAppList]);

  function searchChangeHandle(val: string): void {
    setPageParams({ ...pageParams, keyword: val });
  }

  function pageChange(current: number, pageSize: number): void {
    setPageParams({ ...pageParams, page: current, size: pageSize });
  }

  function goUnusualTaskDetail(data: UnusualTaskItem, status: 0 | 1): void {
    const { id, processInstanceId, taskId, flowInstanceId } = data;
    history.push(`/system/unusual/detail/${id}/${status}/${processInstanceId}/${taskId}/${flowInstanceId}`);
  }

  const cols = [
    {
      Header: '工作流名称',
      id: 'instanceName',
      width: 'auto',
      accessor: ({ instanceName }: UnusualTaskItem) => <span>{instanceName ? instanceName : '-'}</span>,
    },
    {
      Header: '当前节点',
      id: 'taskName',
      width: 'auto',
      accessor: ({ taskName }: UnusualTaskItem) => (
        <span className='current_node font-semibold'>{taskName ? taskName : '-'}</span>
      ),
    },
    {
      Header: (
        <Select
          defaultValue={-1}
          options={taskHandleStatus}
          onChange={(value) => setPageParams({ ...pageParams, page: 1, status: value })}
        >
          <div className='flex content-center items-center pointer'>
            <div>处理状态</div>
            <Icon name="filter_alt" className='ml-8'/>
          </div>
        </Select>
      ),
      id: 'status',
      width: '132',
      icon: 'filter',
      accessor: ({ status }: UnusualTaskItem) => (
        <span
          className={cs('px-8 py-4 corner-4-0-4-0', {
            red_theme: handleStatusColor[status] === 'red',
            blue_theme: handleStatusColor[status] === 'blue',
            green_theme: handleStatusColor[status] === 'green',
          })}
        >
          {enumStatusLabel[status]}
        </span>
      ),
    },
    {
      Header: (
        <Select
          defaultValue='all'
          options={instanceStatus}
          onChange={(value) => {
            setPageParams({ ...pageParams, page: 1, instanceStatus: value === 'all' ? undefined : value });
          }}
        >
          <div
            className='flex content-center items-center pointer'
          >
            <div>流程状态</div>
            <Icon name="filter_alt" className='ml-8'/>
          </div>
        </Select>
      ),
      id: 'instanceStatus',
      width: '111',
      accessor: ({ instanceStatus }: UnusualTaskItem) => (
        <span>{enumInstanceStatusLabel[instanceStatus]}</span>
      ),
    },
    {
      Header: (
        <Select
          defaultValue='all'
          options={appOptions}
          onChange={(value) => {
            setPageParams({ ...pageParams, page: 1, appId: value === 'all' ? undefined : value });
          }}
        >
          <div className='flex content-center items-center pointer'>
            <div>所属应用</div>
            <Icon name="filter_alt" className='ml-8'/>
          </div>
        </Select>
      ),
      id: 'appName',
      width: '111',
      accessor: ({ appName }: UnusualTaskItem) => <span>{appName ? appName : '-'}</span>,
    },
    {
      Header: '发起人',
      id: 'applyUserName',
      width: 'auto',
      accessor: ({ applyUserName }: UnusualTaskItem) => <span>{applyUserName ? applyUserName : '-'}</span>,
    },
    {
      Header: '发起时间',
      id: 'instanceCreateTime',
      width: '120',
      accessor: ({ instanceCreateTime }: UnusualTaskItem) => (
        <>
          <div>{instanceCreateTime ? dayjs(instanceCreateTime).format('YYYY-MM-DD') : '-'}</div>
          <div>{instanceCreateTime ? dayjs(instanceCreateTime).format('HH:mm') : '-'}</div>
        </>
      ),
    },
    {
      Header: '异常原因',
      id: 'reason',
      width: 'auto',
      accessor: ({ reason }: UnusualTaskItem) => <span>{reason ? reason : '-'}</span>,
    },
    {
      Header: '操作',
      id: '',
      width: 'auto',
      accessor: (item: UnusualTaskItem) => {
        return (
          <div className="flex">
            <Authorized authority={['abnormalFlow/dispose']}>
              {
                item.status === 0 && (<div className="flex items-center">
                  <span
                    className="font-normal high-light cursor-pointer mr-16"
                    onClick={() => goUnusualTaskDetail(item, 0)}
                  >
                    处理
                  </span>
                </div>)
              }
            </Authorized>
            <Authorized authority={['abnormalFlow/read']}>
              <div className="flex items-center">
                <span
                  className="font-normal high-light cursor-pointer"
                  onClick={() => goUnusualTaskDetail(item, 1)}
                >
                  查看
                </span>
              </div>
            </Authorized>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col flex-grow overflow-hidden">
      <div className='w-full flex align-center ml-16 mt-16'>
        <Search
          placeholder="搜索工作流名称..."
          value={pageParams.keyword}
          onChange={searchChangeHandle}
          className="search_unusual"
        />
      </div>
      <div
        style={{ height: 'calc(100vh - 228px)' }}
        className='unusual-table-wrap overflow-auto flex w-full mt-8 px-16'
      >
        <Table
          className='unusual_table text-14 h-full'
          data={taskList}
          columns={cols}
          rowKey="id"
          emptyTips={<EmptyTips text='暂无异常任务' className="pt-40" />}
          loading={isLoading}
        />
      </div>
      {taskList.length > 0 && (
        <Pagination
          current={pageParams.page}
          pageSize={pageParams.size}
          total={pageParams.total}
          showSizeChanger
          onChange={pageChange}
          className={'pt-10'}
          renderTotalTip={() => (
            <div className="text-12 text-gray-600">
              共<span className="mx-4">{pageParams.total}</span>条数据
            </div>
          )}
        />
      )}
    </div>
  );
}

export default UnusualTaskTable;
