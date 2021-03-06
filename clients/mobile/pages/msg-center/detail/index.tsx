import React, { useEffect, useMemo } from 'react';
import { useQuery, QueryFunctionContext } from 'react-query';
import { useParams } from 'react-router';

import NavPage from '@m/components/nav-page';
import { getMsgById } from '@portal/modules/msg-center/api';
import Loading from '@m/qxp-ui-mobile/loading';
import { Empty } from '@m/qxp-ui-mobile/empty';
import toast from '@lib/toast';
import MessageFileList from '@m/components/message-file-list';

import { getSubtitle, Message } from './utils';

export default function MessageDetail(): JSX.Element {
  const { messageId } = useParams<{ messageId: string }>();

  const { data, isLoading, isError, error, refetch } = useQuery(
    [`get-message-${messageId}`, { id: messageId, read: true }],
    getMsgById as (query: QueryFunctionContext) => Promise<Message>,
  );

  useEffect(() => {
    if (error && isError) {
      toast.error(error);
    }
  }, [error]);

  const subtitle = useMemo(() => getSubtitle(data), [data]);

  return (
    <NavPage title='详情' className='padding-16' absolute>

      {isLoading && <Loading className='pt-16 pb-16'>加载中...</Loading>}

      {!isLoading && isError && (
        <Empty
          onClick={() => refetch()}
          title='消息加载失败'
          content='请点击此处重新加载'
          image='/dist/images/message-details-empty.svg'/>
      )}

      {!isLoading && !isError && data && (
        <>
          <div className='title1 text-black'>{data.title}</div>
          {!!subtitle && (
            <div className='mt-8 body2 text-placeholder'>
              {subtitle}
            </div>
          )}
          <div className='mt-16 text-primary' dangerouslySetInnerHTML={{ __html: data.content }} />
        </>
      )}

      <MessageFileList files={data?.files} className='mt-16' preview/>

    </NavPage>
  );
}
