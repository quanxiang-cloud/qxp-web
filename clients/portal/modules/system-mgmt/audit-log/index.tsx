import React, { useEffect, useRef, useState, useCallback } from 'react';
import { observer } from 'mobx-react';
import { useQuery } from 'react-query';

import TextHeader from '@c/text-header';
import ErrorTips from '@c/error-tips';
import Search from '@c/search';
import { DatePicker } from 'antd';
import zhCN from 'antd/lib/date-picker/locale/zh_CN';

import LogTable from './log-table';
import Container from '../container';
import { getLogList } from '../api';
import auditLog from './store';

import './index.scss';

const useDebounceState = (defaultState: any, timer: number, cb?: (params: any) => void): any[] => {
  const [state, setState] = useState(defaultState);

  const ref = useRef<number>();

  const f = useCallback((newState) => {
    clearTimeout(ref.current);
    ref.current = window.setTimeout(() => {
      setState(newState);
      cb && cb(newState);
    }, timer);
  }, [setState, cb]);

  useEffect(() => {
    return () => clearTimeout(ref.current);
  }, []);

  return [state, f];
};

export const useLogInitData = () => {
  const {
    userName,
    logPageParams,
    logPageInfo,
    setLogRequestInfo,
    setAuditLogData,
    setLogPageInfo,
  } = auditLog;

  const {
    isLoading,
    isError,
    isFetching,
    data,
    refetch,
  } = useQuery(['system-audit-log-list', userName, logPageParams], () => {
    return getLogList({ ...logPageParams, userName });
  });
  useEffect(() => {
    setLogRequestInfo({ isLoading, isError, isFetching });
  }, [isLoading, isError]);

  useEffect(() => {
    if (!isError && data) {
      setAuditLogData(data);
      data && setLogPageInfo({ ...logPageInfo, total: data.total });
    }
  }, [data, isError]);

  return [refetch];
};

const AuditLogPage = (): JSX.Element => {
  const {
    userName: inputValue,
    logPageInfo,
    setUserName: setInputValue,
    setOperationTimeBegin,
    setOperationTimeEnd,
    setLogPageInfo,
  } = auditLog;

  const [refresh] = useLogInitData();

  const [_, searchValueChange] = useDebounceState(inputValue, 500, (newValue) => {
    setInputValue(newValue.trim());
    setLogPageInfo({ ...logPageInfo, current: 1 });
  });

  const getUnixTimestamp = (string: string | number | Date): number => {
    return Math.round(new Date(string).getTime() / 1000);
  };

  useEffect(() => {
    document.title = '???????????? - ????????????';
  }, []);

  if (!window.ADMIN_USER_FUNC_TAGS.includes('platform')) {
    return (
      <ErrorTips
        style={{ marginTop: '200px' }}
        desc="???????????????, ??????????????????..."
      />
    );
  }

  return (
    <Container>
      <div className="h-full flex flex-col flex-grow overflow-hidden pb-20">
        <TextHeader
          title="????????????"
          desc="???????????????????????????"
          // action="???? ??????????????????"
          className="bg-gray-1000 px-20 py-16 header-background-image"
          itemTitleClassName="text-h5"
        />
        <div className="flex flex-col flex-grow overflow-hidden">
          <div className='w-full flex align-center ml-20 mt-20'>

            <div className="log-date-picker">
              <span>???????????????</span>
              <DatePicker
                locale={zhCN}
                onChange={(date, dateString) => {
                  setOperationTimeBegin(getUnixTimestamp(dateString));
                }}
              />
              <span className="mx-10">-</span>
              <DatePicker
                locale={zhCN}
                onChange={(date, dateString) => {
                  setOperationTimeEnd(getUnixTimestamp(dateString));
                }}
              />
            </div>
            <Search
              placeholder="?????????????????????"
              value={inputValue}
              onChange={searchValueChange}
              className="search-log ml-10"
            />
          </div>
          <LogTable />
        </div>
      </div>
    </Container>
  );
};

export default observer(AuditLogPage);
