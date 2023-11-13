import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { observer } from 'mobx-react';
import cs from 'classnames';

import PullRefresh from '@m/qxp-ui-mobile/pull-refresh';
import Loading from '@m/qxp-ui-mobile/loading';
import { Empty } from '@m/qxp-ui-mobile/empty';
import TopicNameRow from '@m/components/flow/topic-name-row';
import { ApprovalDetailParams } from '@m/pages/new-approvals/types';
import FileList from '@m/components/file-list';
import TopicTextArea from '@m/components/flow/topic-text-area';

import store from './store';

import './index.scss';

export interface ApprovalsTopicTabProps {
  height: string;
  active: boolean;
}

function ApprovalsTopicTab(props: ApprovalsTopicTabProps): JSX.Element {
  const { processInstanceID, taskID } = useParams<ApprovalDetailParams>();

  useEffect(() => {
    if (props.active) {
      // Todo: check comments inited
      init();
    }
  }, [props.active]);

  function init(): Promise<void> {
    return store.updateComments(processInstanceID, taskID);
  }

  return (
    <div style={{ height: props.height }} className='bg-app flex flex-col'>
      {!store.inited && store.loading && <Loading className='pt-16 pb-16'>加载中...</Loading>}
      {store.inited && (
        <>
          <PullRefresh onRefresh={init} className='flex-1'>
            <div className='h-full overflow-scroll'>
              {!store.comments.length && (
                <Empty content='暂无讨论数据' image='/dist/images/mobile/topic_empty.svg'/>
              )}
              {!!store.comments.length && store.comments.map((item, index) => {
                const isUserSelf = window.USER?.id === item.commentUserId;
                const files: QXPUploadFileTask[] | undefined = item.attachments
                  ?.filter((attach) => !attach.isDeleted)
                  ?.map((attach) => ({
                    name: attach.attachmentName ?? '',
                    uid: attach.attachmentUrl ?? '',
                    type: '',
                    size: 0,
                    state: 'success',
                  }));
                return (
                  <div className='pl-12 pr-12 pt-12 pb-6' key={item.id || index}>
                    <TopicNameRow
                      creatorName={item.creatorName}
                      creatorAvatar={item.creatorAvatar}
                      creatorId={item.creatorId}
                      modifyTime={item.modifyTime}
                      isSelf={isUserSelf}
                    />
                    {!!item.content && (
                      <div className={cs(
                        'pt-8 pb-8 pl-16 pr-16 radius-2-8-8-8 mt-8 ml-32 inline-block',
                        `topic-content-wrapper__${isUserSelf ? 'mine' : 'not_mine'}`,
                        { 'mb-4': files?.length },
                      )}>
                        {item.content}
                      </div>
                    )}
                    {!!files?.length && (
                      <FileList
                        files={files}
                        className='bg-white body1 text-primary'
                        rightIcon='download'
                        canDownload
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </PullRefresh>
          <TopicTextArea />
        </>
      )}
    </div>
  );
}

export default observer(ApprovalsTopicTab);
