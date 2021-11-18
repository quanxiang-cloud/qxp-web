import React from 'react';
import dayjs from 'dayjs';
import { observer } from 'mobx-react';
import cs from 'classnames';

import auditLog from '@portal/modules/system-mgmt/audit-log/store';
import Loading from '@c/loading';
import ErrorTips from '@c/error-tips';
import Pagination from '@c/pagination';
import EmptyTips from '@c/empty-tips';
import Table from '@c/table';

interface Props {
  className?: string;
}

const LogTable = ({ className }: Props) => {
  const {
    data,
    logPageInfo,
    logRequestInfo,
    setLogPageInfo,
  } = auditLog;
  const { isLoading, isError } = logRequestInfo;

  const pageChange = (page: number, pageSize: number) => setLogPageInfo(
    { ...logPageInfo, current: page, pageSize },
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorTips desc='获取数据失败' />;
  }

  const logList = data?.audit || [];

  const cols = [
    {
      Header: '操作人',
      id: 'userName',
      width: 'auto',
      accessor: ({ userName }: QueryAuditLogResult) => (
        <span>{userName ? userName : '无'}</span>
      ),
    },
    {
      Header: '操作时间',
      id: 'operationTime',
      width: 'auto',
      accessor: ({ operationTime }: QueryAuditLogResult) => (
        <span>
          {dayjs(operationTime)
            .format('YYYY-MM-DD HH:mm:ss')}
        </span>
      ),
    },
    {
      Header: '操作类型',
      id: 'operationType',
      width: 'auto',
      accessor: ({ operationType }: QueryAuditLogResult) => (
        <span>{operationType}</span>
      ),
    },
    {
      Header: 'IP地址',
      id: 'ip',
      width: 'auto',
      accessor: ({ geo }: QueryAuditLogResult) => (
        <span>{geo.ip ? geo.ip : '无'}</span>
      ),
    },
    {
      Header: '日志内容',
      id: 'detail',
      width: 'auto',
      accessor: ({ detail }: QueryAuditLogResult): JSX.Element => {
        return <span>{detail ? detail : '无'}</span>;
      },
    },
    {
      Header: '地理位置',
      id: 'geo',
      width: 'auto',
      accessor: ({ geo }: QueryAuditLogResult) => {
        const { country, province, city } = geo;
        return (
          <span>{city ? `${country}-${province}-${city}市` : '无'}</span>
        );
      },
    },
    {
      Header: '精确位置',
      id: 'location',
      width: 'auto',
      accessor: ({ geo }: any) => {
        const { location } = geo;
        const { accuracyRadius, latitude, longitude, timeZone } = location;
        return (
          <span>{
            latitude ? `经度:${longitude} 纬度:${latitude} 精确半径:${accuracyRadius} 时区:${timeZone}` :
              '无'}
          </span>
        );
      },
    },
  ];

  return (
    <>
      <div
        className={cs('log-table-wrap flex w-full mt-16 px-20', className)}
      >
        <Table
          className='text-14 h-full'
          data={logList}
          columns={cols}
          rowKey="createAt"
          emptyTips={<EmptyTips text='暂无日志数据' className="pt-40" />}
          loading={isLoading}
        />
      </div>
      {logList.length > 0 && (
        <Pagination
          {...logPageInfo}
          showSizeChanger
          onChange={pageChange}
          className={'pt-10'}
          renderTotalTip={() => (
            <div className="text-12 text-gray-600">
              共<span className="mx-4">{data?.total || 0}</span>条日志
            </div>
          )}
        />)}
    </>
  );
};

export default observer(LogTable);
