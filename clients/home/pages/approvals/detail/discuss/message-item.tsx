import React from 'react';
import classnames from 'classnames';

import Avatar from '@c/avatar';
import Icon from '@c/icon';
import { handleTimeFormat } from '@lib/utils';

import { CommentItem, FileItem } from './index';

interface Props {
  isOwn?: boolean;
  messageData: CommentItem;
}

export default function MessageItem({ isOwn, messageData }: Props): JSX.Element {
  const _user = messageData.creatorName.substring(messageData.creatorName.length - 1);

  function downFile(url: string, fileName: string): void {
    window.open(url, '_blank');
  }

  return (
    <div className="flex w-full mb-20">
      <Avatar username={_user} />
      <div className="ml-8 w-full">
        <div className="h-24 flex justify-between">
          <span className="text-h6-bold">{messageData.creatorName} {isOwn && <>（我）</>}</span>
          <div className='text-12 text-gray-400'>{handleTimeFormat(messageData.createTime)}</div>
        </div>
        <div className={classnames('mt-8  px-16 py-8 corner-2-8-8-8 text-12 inline-block',
          isOwn ? 'text-white bg-gray-500' : 'text-gray-600 bg-white',
        )}>
          {messageData.content}
        </div>
        <div className="flex flex-col">
          {
            messageData.attachments && messageData.attachments.map((file: FileItem) => {
              return (
                <div key={file.id} className="custom-file px-8 py-4 mt-8 flex items-center
            justify-between bg-white corner-0-4-4-4">
                  <div className="flex items-center">
                    <div className="w-16 h-16 flex items-center justify-center bg-blue-600 corner-4-0-4-4">
                      <Icon name="insert_drive_file" type="light" size={12} />
                    </div>
                    <div className="ml-8 text-gray-900 text-12">{file.attachmentName}</div>
                  </div>
                  <div className="down-icon w-16 h-16 flex items-center justify-center">
                    <Icon name="get_app"
                      onClick={() => downFile(file.attachmentUrl, file.attachmentName)} size={16} />
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    </div>
  );
}
