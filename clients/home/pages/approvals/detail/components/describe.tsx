import React from 'react';

import Icon from '@c/icon';

type DescribeInfo = {
  username?: string;
  detail?: string;
  backOffInfo?: string; // 回退
  sendBack?: string; // 打回从填
}

interface Props {
  describeInfo: DescribeInfo;
}

export default function details({ describeInfo }: Props) {
  const { username, detail, backOffInfo, sendBack } = describeInfo;
  return (username || detail || backOffInfo || sendBack) ? (
    <div className="mt-8 bg-white px-16 py-8 corner-2-8-8-8">
      {
        username && (
          <div className="flex">
            <div className="h-20 flex justify-center items-center"><Icon name="person" /></div>
            <div className="text-gray-600 ml-4 text-12">{username}</div>
          </div>
        )
      }
      {
        backOffInfo && (
          <div className="flex">
            <div className="h-20 flex justify-center items-center">
              <Icon name="subdirectory_arrow_left" />
            </div>
            <div className="text-gray-600 ml-4 text-12">{backOffInfo}</div>
          </div>
        )
      }
      {
        sendBack && (
          <div className="flex">
            <div className="h-20 flex justify-center items-center">
              <Icon name="settings_backup_restore" />
            </div>
            <div className="text-gray-600 ml-4 text-12">{sendBack}</div>
          </div>
        )
      }
      {
        detail && (
          <div className="flex">
            <div className="h-20 flex justify-center items-center"><Icon name="rate_review" /></div>
            <div className="text-gray-600 ml-4 text-12">{detail}</div>
          </div>
        )
      }
    </div>
  ) : <div></div>;
}
