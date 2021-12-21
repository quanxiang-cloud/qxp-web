import { useEffect } from 'react';
import { useQuery } from 'react-query';

import msgMgmt from '@portal/stores/msg-mgmt';
import { getMsgList } from '@portal/modules/system-mgmt/api';

export const useMsgInitData = () => {
  const {
    keyword,
    pageParams,
    pageInfo,
    setRequestInfo,
    setData,
    setPageInfo,
  } = msgMgmt;

  const {
    isLoading,
    isError,
    isFetching,
    data,
    refetch,
  } = useQuery(['msg-mgmt-msg-list', keyword, pageParams], () => {
    // return getMsgList({ ...pageParams, key_word: keyword });
    return getMsgList({ ...pageParams, key: keyword });
  });

  useEffect(() => {
    setRequestInfo({ isLoading, isError, isFetching });
  }, [isLoading, isError]);

  useEffect(() => {
    if (!isError && data) {
      setData(data);
      data && setPageInfo({ ...pageInfo, total: data.total });
    }
  }, [data, isError]);

  return [refetch];
};
