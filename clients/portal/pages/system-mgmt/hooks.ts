import { useEffect } from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { useQuery } from 'react-query';
import { getMsgList } from '@portal/pages/system-mgmt/api';

import { PageParams, Data, KeyWord, RequestInfo, PageInfo } from './delcare';

export const useInitData = () => {
  const keyword = useRecoilValue(KeyWord);
  const pageParams = useRecoilValue(PageParams);

  const setRequestInfo = useSetRecoilState(RequestInfo);
  const setData = useSetRecoilState(Data);
  const setPageInfo = useSetRecoilState(PageInfo);

  const { isLoading, isError, isFetching, data, refetch } = useQuery(['msg-mgmt-msg-list', keyword, pageParams], () => getMsgList({ ...pageParams, key_word: keyword }));

  useEffect(() => {
    setRequestInfo({ isLoading, isError, isFetching });
  }, [isLoading, isError]);

  useEffect(() => {
    if (!isError) {
      setData(data);
      data && setPageInfo((current) => ({ ...current, total: data.data.total }));
    }
  }, [data, isError]);

  return [refetch];
};
