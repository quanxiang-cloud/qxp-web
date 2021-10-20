import React, { useRef, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router';

import toast from '@lib/toast';
import Loading from '@c/loading';
import ErrorTips from '@c/error-tips';
import { FileInfo } from '@c/filelist';
import FileUpload from '@c/upload';

import MessageItem from './message-item';
import * as apis from '../../api';

export type FileItem = {
  attachmentName: string;
  attachmentUrl: string;
  id: string;
}

export type CommentItem = {
  commentUserId: string;
  content: string;
  createTime: string;
  creatorAvatar: string;
  creatorName: string;
  flowInstanceId: string;
  id: string;
  isDeleted: number;
  modifierId: string;
  modifyTime: string;
  attachments?: FileItem[];
}

export default function Discuss(): JSX.Element {
  const [file, setFile] = useState<Array<FileInfo>>(([]).map((itm: FileInfo) => ({
    filename: itm.filename,
    url: itm.url,
    status: 'success',
  })));
  const [inputValue, setInputValue] = useState('');
  const { processInstanceID, taskID } = useParams<{ processInstanceID: string; taskID: string }>();
  const queryClient = useQueryClient();
  const userinfo = window.USER;
  const fileRef = useRef(null);

  const showFiles = (f:Array<FileInfo>) => {
    setFile(f);
  };

  const {
    isLoading, data: commentsData, isError,
  } = useQuery<any, Error>(
    [processInstanceID, taskID, 'GET_COMMENTS'],
    () => apis.getComments(processInstanceID, taskID),
  );

  function inputChange(event: React.ChangeEvent<HTMLTextAreaElement>): void {
    event.target.scrollTop = 0;
    event.target.style.height = event.target.scrollHeight + 'px';
    event.target.style.overflowY = 'hidden';
    if (event.target.offsetHeight >= 110) {
      event.target.style.overflowY = 'auto';
    }
    setInputValue(event.target.value);
  }

  function handleSend(): void {
    if (inputValue === '') {
      toast.error('请输入内容');
      return;
    }
    const params = {
      flowInstanceId: processInstanceID,
      taskId: taskID,
      content: inputValue,
      commentUserId: userinfo.id,
      attachments: file.map((itm)=>{
        return {
          attachmentName: itm.filename,
          attachmentUrl: itm.url,
        };
      }).filter(Boolean),
    };
    apis.addComment(params).then(() => {
      try {
        toast.success('发送成功');
        setInputValue('');
        queryClient.invalidateQueries([processInstanceID, taskID, 'GET_COMMENTS']);
      } catch {
        toast.error('发送失败');
      }
    });
    if (fileRef.current) {
      // @ts-ignore
      fileRef.current.emptyFiles();
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>): void {
    if (event.keyCode === 13) {
      event.preventDefault();
      handleSend();
    }
  }

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorTips desc='获取数据失败' />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto mb-16 pr-5">
        {
          commentsData.map((msg: CommentItem) => {
            return (
              <MessageItem
                key={msg.id}
                isOwn={msg.commentUserId === userinfo.id}
                messageData={msg}
              />
            );
          })
        }
      </div>
      <div className="py-12 bg-gray-100 corner-2-8-8-8 send-message-box-shadow">
        <div>
          <textarea
            style={{
              maxHeight: 110,
              minHeight: 45,
              height: 45,
              padding: '12px 16px',
              borderRadius: '2px 8px 8px 8px',
            }}
            maxLength={200}
            onChange={inputChange}
            value={inputValue}
            onKeyDown={(e) => handleKeyDown(e)}
            placeholder="发表评论（Enter 快速发送）"
            className="w-full focus:outline-none"
          />
        </div>
        <FileUpload
          showFiles={showFiles}
          addSend={
            (<div className="flex items-center">
              <span className="text-12 text-gray-400 mr-8">{inputValue.length}/200</span>
              <div className="text-blue-600 cursor-pointer" onClick={handleSend}>发送</div>
            </div>)}
          ref={fileRef} />
      </div>
    </div>
  );
}
