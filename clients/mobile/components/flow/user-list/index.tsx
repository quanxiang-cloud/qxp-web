import React from 'react';
import cs from 'classnames';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';

import { Props } from '@m/qxp-ui-mobile';
import Avatar from '@m/qxp-ui-mobile/avatar';
import { UserListModel } from '@m/pages/approvals/detail/status/utils';
import Icon from '@m/qxp-ui-mobile/icon';
import store from '@m/pages/approvals/detail/status/store';
import { ApprovalDetailParams } from '@m/pages/approvals/types';
import { approvalStatusPath } from '@m/constant';

import './index.scss';

export type UserListProps = UserListModel & Props;

export default function UserList(props: UserListProps): JSX.Element {
  const history = useHistory();
  const { processInstanceID, taskID, type } = useParams<ApprovalDetailParams>();

  return (
    <div
      className={cs('flex justify-center items-center pointer user-list-wrapper', props.className)}
      onClick={() => {
        store.setHistory(props.history);
        const statusPath = approvalStatusPath.replace(
          ':processInstanceID/:taskID/:type',
          `${processInstanceID}/${taskID}/${type}`,
        );
        history.push(`${statusPath}?id=${props.history.id || '0'}`);
      }}
    >
      <div className='user-list-avatar-wrapper'>
        {props.operationRecords.map((item, index) => {
          return (
            <Avatar size='.27rem' name={item.creatorName} key={item.creatorId + index} className='mr-4' />
          );
        })}
      </div>

      <Icon name='chevron_right' size='.16rem' style={{ color: '--gray-600' }}/>

    </div>
  );
}
