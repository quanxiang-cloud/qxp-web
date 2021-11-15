import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useMutation, useQuery } from 'react-query';
import { observer } from 'mobx-react';
import { get } from 'lodash';

import Loading from '@c/loading';
import ErrorTips from '@c/error-tips';
import Modal from '@c/modal';
import toast from '@lib/toast';
import {
  getMessageList,
  deleteMsgByIds,
  setMsgAsReadByIds,
  getUnreadMsgCount,
  setAllMsgAdRead,
} from '@portal/modules/msg-center/api';
import { MsgType, MsgReadStatus } from '@portal/modules/system-mgmt/constants';
import Pagination from '@c/pagination';
import msgCenter from '@portal/stores/msg-center';

import Toolbar from './toolbar';
import MsgItem from './msg-item';
import NoMsg from '../no-msg';
import { useRouting } from '../../../hooks';

export type MsgInfo = {
  id: string;
  title: string;
  read_status: MsgReadStatus.unread | MsgReadStatus.read | MsgReadStatus. all,
  sort: MsgType.all | MsgType.notify | MsgType.system,
  updated_at: number;
}

function PanelList(): JSX.Element {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const { paging, selectType, filterCheckUnread } = msgCenter;
  const queryPage = useRouting();
  const toolbarRef = useRef<any>();
  const getQueryParams = (): any => {
    const params = {
      read_status: filterCheckUnread ? MsgReadStatus.unread : undefined,
      sort: selectType === MsgType.all ? undefined : selectType,
    };
    return { ...params, ...paging };
  };

  const { isLoading,
    isError,
    data,
    isFetching,
    refetch,
  } = useQuery(
    ['all-messages', getQueryParams()],
    getMessageList, {},
  );

  const { data: countUnreadMsg,
    refetch: unReadRefetch,
  } = useQuery(
    'count-unread-msg',
    getUnreadMsgCount,
  );
  const msgList = useMemo(() => {
    msgCenter.setUnreadTypeCounts(get(countUnreadMsg, 'type_num', []));
    return data?.mes_list || [];
  }, [data]);

  const msgTotal = useMemo(() => {
    return data?.total || 0;
  }, [data]);

  const canIUseReadBtn = useMemo(() => {
    return msgList
      .filter((itm: any) => selectedRows.some((id) => id === itm.id))
      .filter((itm: any) => itm.read_status === MsgReadStatus.unread)
      .length > 0;
  }, [selectedRows, msgList]);

  const canIUseDelBtn = useMemo(() => {
    return selectedRows.length > 0;
  }, [selectedRows]);

  const deleteMsgMutation = useMutation(deleteMsgByIds, {
    onSuccess: () => {
      msgCenter.reset();
      queryPage('', { id: undefined });
      refetch();
      unReadRefetch();
    },
    onError: (err: Error) => {
      toast.error(`删除失败: ${err.message}`);
    },
  });

  useEffect(() => {
    setSelectedRows([]);
  }, [isLoading]);

  useEffect(() => {
    if (!msgList.length && msgTotal > 0) {
      const curPage = paging.page;
      if (curPage > 0) {
        msgCenter.setPaging({ page: curPage - 1 });
        refetch();
      }
    }
  }, [msgList, msgTotal]);

  if (isLoading || isFetching) {
    return <Loading />;
  }
  if (isError) {
    return <ErrorTips desc='获取数据失败' />;
  }

  function handleAllReaded(): void {
    const allReadedModal = Modal.open({
      title: '全部已读',
      content: (<p className="p-20">确定要将全部类型的消息标记为已读吗?</p>),
      onConfirm: () => {
        setAllMsgAdRead()
          .then(() => {
            refetch();
            unReadRefetch();
            msgCenter.reset();
            queryPage('', { id: undefined });
            allReadedModal.close();
          });
      },
    });
  }

  function handleCheckedReaded(title?: string, id?: string): void {
    const checkedReadedModal = Modal.open({
      title: '标记已读',
      content: (
        <p
          className="p-20">
          {id ? `确定要将${title}信息标记为已读?` : `确定要将已选中的${selectedRows.length}条消息标记为已读吗?`}
        </p>),
      onConfirm: () => {
        setMsgAsReadByIds(id ? [id] : selectedRows)
          .then(() => {
            refetch();
            unReadRefetch();
            checkedReadedModal.close();
            setSelectedRows((rows) => {
              return rows.filter((id) => !selectedRows.includes(id));
            });
          });
      },
    });
  }

  function handleDeleteMessage(title?: string, id?: string): void {
    const deleteMessageModal = Modal.open({
      title: '删除消息',
      content: (
        <p className="p-20">
          {id ? `确定要将${title}信息删除?` : `确定要将已选中的${selectedRows.length}条消息删除吗?`}
        </p>
      ),
      onConfirm: () => {
        deleteMsgMutation.mutate(id ? [id] : selectedRows);
        deleteMessageModal.close();
      },
    });
  }

  function handleAllChecked(): void {
    setSelectedRows(msgList.map((itm: any) => itm.id));
  }

  function handleAllUnchecked(): void {
    setSelectedRows([]);
  }

  function handleCheckboxChange(e: any, id: string): void {
    let _selectRows = [...selectedRows];
    if (e.target.checked) {
      _selectRows.push(id);
    } else {
      _selectRows = _selectRows.filter((row) => row !== id);
    }
    if (_selectRows.length === msgList.length) {
      toolbarRef.current.setIndeterminate(false);
      toolbarRef.current.setCheckedAll(true);
    } else if (_selectRows.length > 0) {
      toolbarRef.current.setIndeterminate(true);
      toolbarRef.current.setCheckedAll(false);
    } else {
      toolbarRef.current.setIndeterminate(false);
      toolbarRef.current.setCheckedAll(false);
    }

    setSelectedRows(_selectRows);
  }

  function renderTable(): JSX.Element {
    const toolbarOptions = {
      canIUseReadBtn,
      canIUseDelBtn,
      handleAllChecked,
      handleAllUnchecked,
      handleAllReaded,
      handleCheckedReaded,
      handleDeleteMessage,
    };
    return (
      <div className="flex flex-col w-full h-full">
        <div className="flex-1 mb-12">
          <Toolbar ref={toolbarRef} {...toolbarOptions} />
          <ul className="flex flex-col items-center">
            {
              msgList.map((msg: MsgInfo) => {
                return (
                  <MsgItem
                    key={msg.id}
                    msgData={msg}
                    selectedRows={selectedRows}
                    handleCheckboxChange={handleCheckboxChange}
                    handleDeleteMessage={handleDeleteMessage}
                    handleCheckedReaded={handleCheckedReaded}
                  />
                );
              })
            }
          </ul>
        </div>
        <div>
          <Pagination
            pageSize={paging.limit}
            current={paging.page}
            total={msgTotal}
            onChange={(page, limit) => msgCenter.setPaging({ page, limit })}
            showSizeChanger
          />
        </div>
      </div>
    );
  }

  return (
    <div className="px-16 py-20 nav-card-header border-r border-gray-200">
      {msgList.length ? renderTable() : <NoMsg tips='暂无消息' />}
    </div>
  );
}

export default observer(PanelList);
