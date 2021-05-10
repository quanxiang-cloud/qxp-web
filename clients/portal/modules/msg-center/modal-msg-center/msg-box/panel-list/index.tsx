import React, { useState, useRef, useMemo, useEffect } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { Message, Table } from '@QCFE/lego-ui';
import { useMutation, useQuery } from 'react-query';
import { get } from 'lodash';
import Loading from '@c/loading';
import Error from '@c/error';
import MsgItem from '@portal/modules/msg-center/msg-item';
import Toolbar from './toolbar';
import {
  getMessageList,
  deleteMsgByIds,
  setMsgAsReadByIds,
  getUnreadMsgCount,
  setAllMsgAdRead,
} from '@portal/modules/msg-center/api';
import { MsgType, MsgReadStatus } from '@portal/modules/system-mgmt/constants';
import Pagination from '@c/pagination';
import Modal from '@c/modal';
import { useRouting } from '../../../hooks';
import NoMsg from '../no-msg';
import msgCenter from '@portal/stores/msg-center';
import styles from '../index.module.scss';

const PanelList = () => {
  const { paging, selectType, filterCheckUnread } = msgCenter;
  const queryPage = useRouting();
  const getQueryParams = () => {
    const params = {
      read_status: filterCheckUnread ? MsgReadStatus.unread : undefined,
      sort: selectType === MsgType.all ? undefined : selectType,
    };
    return { ...params, ...paging };
  };
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const { isLoading,
    isError,
    data,
    isFetching,
    refetch,
  } = useQuery(
    ['all-messages', getQueryParams()],
    getMessageList, {}
  );
  const { data: countUnreadMsg,
    refetch: unReadRefetch,
  } = useQuery(
    'count-unread-msg',
    getUnreadMsgCount
  );

  const [confirmInfo, setConfirmInfo] = useState({
    visible: false,
    title: '',
    content: '',
    cb: () => { },
  });

  const toolbarRef = useRef<any>();

  const msgList = useMemo(() => {
    msgCenter.setUnreadTypeCounts(get(countUnreadMsg, 'data.type_num', []));
    return data?.data?.mes_list || [];
  }, [data]);

  const msgTotal = useMemo(() => {
    return data?.data?.total || 0;
  }, [data]);

  const canIUseReadBtn = useMemo(() => {
    return msgList
      .filter((itm: any) => selectedRows.some((id) => id == itm.id))
      .filter((itm: any) => itm.read_status == MsgReadStatus.unread)
      .length > 0;
  }, [selectedRows, msgList]);

  const canIUseDelBtn = useMemo(() => {
    return selectedRows.length > 0;
  }, [selectedRows]);

  const deleteMsgMutation = useMutation(deleteMsgByIds, {
    onSuccess: () => {
      closeConfirmInfo();
      msgCenter.reset();
      queryPage('', { id: undefined });
      refetch();
      unReadRefetch();
      // console.log('msgList: ', msgList, ', msgTotal: ', msgTotal);
      // console.log('success data: ', data);
    },
    onError: (err: Error) => {
      Message.warning(`删除失败: ${err.message}`);
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
    return <Error desc='获取数据失败' />;
  }

  const closeConfirmInfo = () => {
    setConfirmInfo({
      visible: false,
      title: '',
      content: '',
      cb: () => { },
    });
  };

  const handleAllReaded = () => {
    setConfirmInfo({
      visible: true,
      title: '全部已读',
      content: '确定要将全部类型的消息标记为已读吗?',
      cb: () => {
        setAllMsgAdRead()
          .then(() => {
            refetch();
            unReadRefetch();
            closeConfirmInfo();
            msgCenter.reset();
            queryPage('', { id: undefined });
          });
      },
    });
  };

  const handleCheckedReaded = () => {
    setConfirmInfo({
      visible: true,
      title: '标记已读',
      content: `确定要将已选中的${selectedRows.length}条消息标记为已读吗?`,
      cb: () => {
        setMsgAsReadByIds(selectedRows)
          .then(() => {
            refetch();
            unReadRefetch();
            setSelectedRows((rows) => {
              return rows.filter((id) => !selectedRows.includes(id));
            });
            closeConfirmInfo();
          });
      },
    });
  };

  const handleDeleteMessage = () => {
    setConfirmInfo({
      visible: true,
      title: '删除消息',
      content: `确定要将已选中的${selectedRows.length}条消息删除吗?`,
      cb: () => {
        deleteMsgMutation.mutate(selectedRows);
      },
    });
  };

  const rowSelection = {
    selectedRowKeys: selectedRows,
    getCheckboxProps: (record: any) => ({
      // disabled: record.read_status === MsgReadStatus.read,
      name: record.id,
    }),
    onChange(keys: any) {
      setSelectedRows(keys);
      // todo
      if (keys.length == msgList.length) {
        toolbarRef.current.allcheck(true);
        toolbarRef.current.interm(false);
      } else if (keys.length > 0) {
        toolbarRef.current.allcheck(false);
        toolbarRef.current.interm(true);
      } else {
        toolbarRef.current.allcheck(false);
        toolbarRef.current.interm(false);
      }
    },
  };

  const setAllChecked = () => {
    setSelectedRows(msgList.map((itm: any) => itm.id));
  };

  const setAllUnchecked = () => setSelectedRows([]);

  const renderTable = () => {
    const toolbarOptions = {
      setAllChecked,
      setAllUnchecked,
      handleAllReaded,
      handleCheckedReaded,
      selectedRows,
      canIUseReadBtn,
      canIUseDelBtn,
      handleDeleteMessage,
    };

    return (
      <div className={styles.message_list_warp}>
        <div className={styles.message_list}>
          <Toolbar ref={toolbarRef} {...toolbarOptions} />
          <Table
            className={cs('text-14 table-full', styles.table)}
            rowKey='id'
            rowSelection={rowSelection}
            columns={[
              {
                title: '',
                render: (msg: Qxp.MsgItem) => (
                  <MsgItem
                    className={styles.msgItem}
                    {...msg}
                    hideType
                  />
                ),
              },
            ]}
            dataSource={msgList}
          />
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
        {confirmInfo.visible && (
          <Modal
            title={confirmInfo.title}
            onClose={closeConfirmInfo}
            onConfirm={confirmInfo.cb}
          >
            <div className={styles.content}>{confirmInfo.content}</div>
          </Modal>
        )}
      </div>
    );
  };

  return (
    <div className={styles.listPanel}>
      {msgList.length ? renderTable() : <NoMsg tips='暂无消息' />}
    </div>
  );
};

export default observer(PanelList);
