import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { observer } from 'mobx-react';
import dayjs from 'dayjs';
import cs from 'classnames';

import Checkbox from '@c/checkbox';
import Icon from '@c/icon';
import MoreMenu from '@c/more-menu';
import toast from '@lib/toast';
import msgCenter from '@portal/stores/msg-center';
import { getMsgById } from '@portal/modules/msg-center/api';
import { getQuery } from '@portal/utils';
import { MsgReadStatus } from '@portal/modules/system-mgmt/constants';
import { useRouting } from '@portal/modules/msg-center/hooks';

import { MsgInfo } from '.';

interface Props {
  msgData: MsgInfo;
  selectedRows: string[];
  handleCheckboxChange: (e: any, id: string) => void;
  handleDeleteMessage: (title?: string, id?: string) => void;
  handleCheckedReaded: (title?: string, id?: string) => void;
}

function MsgItem({
  msgData,
  selectedRows,
  handleCheckboxChange,
  handleDeleteMessage,
  handleCheckedReaded,
}: Props): JSX.Element {
  const [read, setRead] = useState(msgData.read_status);
  const queryClient = useQueryClient();
  const queryPage = useRouting();
  const msgId = getQuery('id') || msgCenter.curMsgId || '';

  useEffect(()=> {
    if (msgId === msgData.id) {
      msgCenter.setCurMsgId(msgId);
      readMsg.mutate({
        queryKey: ['', {
          id: msgData.id,
          read: true,
        }],
      });
    }
  }, []);

  const readMsg = useMutation(getMsgById, {
    onMutate: ()=> {
      msgCenter.setLoadingDetail(true);
    },
    onSuccess: (data: any) => {
      msgCenter.setLoadingDetail(false);
      msgCenter.setDetail(data);
      if (msgData.read_status === MsgReadStatus.unread) {
        setRead(MsgReadStatus.read);
        queryClient.invalidateQueries('count-unread-msg');
      }
    },
    onError: (err: Error) => {
      msgCenter.setLoadingDetail(false);
      toast.error(err.message);
    },
  });

  function handleCheckedRow(): void {
    if (msgData.id !== msgCenter.curMsgId) {
      msgCenter.setCurMsgId(msgData.id);
      queryPage('', { id: msgData.id });

      readMsg.mutate({
        queryKey: ['', {
          id: msgData.id,
          read: true,
        }],
      });
    }
  }

  const menus = [
    {
      key: 'delete',
      label: (
        <div className="flex items-center">
          <Icon name="restore_from_trash" size={16} className="mr-8" />
          <span className="font-normal">删除&emsp;&emsp;</span>
        </div>

      ),
    },
    {
      key: 'remark',
      label: (
        <div className="flex items-center" >
          <Icon name="done_all" size={16} className="mr-8" />
          <span className="font-normal">标记为已读&emsp;&emsp;</span>
        </div>
      ),
    },
  ];

  return (
    <li
      key={msgData.id}
      className={cs('p-8 w-full flex items-center nav-card-header cursor-pointer hover:bg-blue-100', {
        'bg-gray-100': selectedRows.includes(msgData.id),
        'bg-blue-100': msgId === msgData.id,
      })}
      onClick={() => handleCheckedRow()}
    >
      <Checkbox
        checked={selectedRows.includes(msgData.id)}
        onChange={(e) => handleCheckboxChange(e, msgData.id)}
      />
      <div className="ml-16 mr-8 relative">
        {read === MsgReadStatus.unread && (
          <div className="w-6 h-6 bg-red-500 rounded-full absolute bottom-8 right-0"></div>
        )}
      </div>
      <div className="flex-1">
        <div
          className={cs('whitespace-nowrap overflow-ellipsis overflow-hidden', {
            'text-gray-600': read === MsgReadStatus.read,
            'text-gray-900': read === MsgReadStatus.unread,
          })}
          style={{ maxWidth: 300 }}
        >
          {msgData.title}
        </div>
        <div className="text-12 text-gray-400">
          {dayjs(parseInt(String(msgData.updated_at * 1000))).format('YYYY-MM-DD HH:mm')}
        </div>
      </div>
      <MoreMenu
        menus={menus}
        onMenuClick={(menuKey) => {
          if (menuKey === 'delete') {
            handleDeleteMessage(msgData.title, msgData.id);
            return;
          }
          if (menuKey === 'remark') {
            handleCheckedReaded(msgData.title, msgData.id);
            return;
          }
        }}
      />
    </li>
  );
}

export default observer(MsgItem);
