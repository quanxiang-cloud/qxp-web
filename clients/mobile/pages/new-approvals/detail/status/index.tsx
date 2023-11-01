import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useParams } from 'react-router';

import { ApprovalDetailParams } from '@m/pages/new-approvals/types';
import Loading from '@m/qxp-ui-mobile/loading';
import { Empty } from '@m/qxp-ui-mobile/empty';
import AvatarNameRow from '@m/components/flow/avatar-name-row';
import UserList from '@m/components/flow/user-list';
import Describe from '@m/components/flow/describe';
import StatusWarning from '@m/components/flow/status-warning';
import TimelineDot from '@m/components/flow/timeline-dot';

import store from './store';
import './index.scss';

export interface ApprovalsStatusTabProps {
  height: string;
  active: boolean;
}

function ApprovalsStatusTab(props: ApprovalsStatusTabProps): JSX.Element {
  const { processInstanceID } = useParams<ApprovalDetailParams>();

  useEffect(() => {
    if (props.active && !store.statusDataList.length) {
      init();
    }
  }, [props.active]);

  function init(): void {
    store.processHistories(processInstanceID);
  }

  return (
    <div style={{ height: props.height }} className='status-container box-border bg-app'>
      {store.loading && <Loading>加载中...</Loading>}
      {!store.loading && store.error && (
        <Empty
          onClick={init}
          title='加载失败'
          content='请点击此处重新加载'
          image='/dist/images/no-approval-task.svg'/>
      )}

      {!store.loading && !store.error && !store.statusDataList.length && (
        <Empty
          onClick={init}
          title='暂无动态'
          content='此流程暂无动态'
          image='/dist/images/no-approval-task.svg'/>
      )}

      {!store.loading && !store.error && !!store.statusDataList.length &&
        store.statusDataList.map((item, index) => {
          return (
            <div key={item.id || index} className={`status-item-wrapper ${index > 0 ? 'mt-16' : ''}`}>
              {!!item.avatarNameRow && <AvatarNameRow {...item.avatarNameRow}/>}
              {!!item.userList && <UserList {...item.userList} className='mt-8 ml-48'/>}
              {!!item.describes?.length && <Describe describes={item.describes} className='mt-8 ml-48'/>}
              {!!item.warning && <StatusWarning text={item.warning} className='mt-8 ml-48'/>}
              {!!item.time && <div className='body2 text-placeholder mt-8 ml-48'>{item.time}</div>}
              <TimelineDot className='timeline-status-dot' status={item.timeline}/>
              {index < store.statusDataList.length - 1 && <div className='timeline-line'/>}
            </div>
          );
        })
      }

      <div className='flow-status-bottom'/>
    </div>
  );
}

export default observer(ApprovalsStatusTab);
