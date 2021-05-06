import { useEffect } from 'react';
import msgMgmt from '@portal/stores/msg-mgmt';
import { useQuery } from 'react-query';
import { getMsgList } from '@portal/modules/system-mgmt/api';

export const useInitData = () => {
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
  } = useQuery([
    'msg-mgmt-msg-list',
    keyword,
    pageParams,
  ], () => getMsgList({ ...pageParams, key_word: keyword }));

  useEffect(() => {
    setRequestInfo({ isLoading, isError, isFetching });
  }, [isLoading, isError]);

  useEffect(() => {
    if (!isError) {
      setData(data);
      data && setPageInfo({ ...pageInfo, total: data.data.total });
    }
  }, [data, isError]);

  return [refetch];
};
