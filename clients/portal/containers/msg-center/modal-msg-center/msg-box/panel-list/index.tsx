import React, { useState, useRef, useMemo, useEffect } from 'react';
import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import { Message, Table } from '@QCFE/lego-ui';
import { useQuery } from 'react-query';
import Loading from '@c/loading';
import Error from '@c/error';
import MsgItem from '@containers/msg-center/msg-item';
import Toolbar from './toolbar';
import { getMessages, deleteMsgByIds, setMsgAsReadByIds, getUnreadMsgCount } from '@portal/api/message-center';
import { MsgType, MsgReadStatus } from '@portal/pages/system-mgmt/constants';
import Pagination from '@c/pagination';
import Modal from '@c/modal';
import Button from '@c/button';

import styles from '../index.module.scss';

interface Props {
  className?: string;
}

const cols = [
  {
    title: '',
    render: (msg: Qxp.MsgItem) => {
      return <MsgItem className={styles.msgItem} {...msg} hideType/>;
    },
  },
];

const urlParse = (_url: string) => {
  const url = window.decodeURIComponent(_url);
  try {
    const paramsStr = url.split('?')[1];

    const keyValList = paramsStr.split('&');

    const param : any = {};

    keyValList.map((itm) => {
      const [key, value] = itm.split('=');

      param[key] = value;
    });

    return param;
  } catch (e) {
    return {};
  }
};

const PanelList = ({ msgCenter }: Props & Pick<MobxStores, 'msgCenter' | any>) => {
  const { paging, selectType, filterCheckUnread }=msgCenter;
  const getQueryParams=()=> {
    const params={
      read_status: filterCheckUnread ? MsgReadStatus.unread : undefined,
      sort: selectType === MsgType.all ? undefined : selectType,
    };
    return { ...params, ...paging };
  };
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const { isLoading, isError, data, isFetching, refetch } = useQuery(['all-messages', getQueryParams()], getMessages, {});
  const { data: unReadData, refetch: unReadRefetch } = useQuery(['unReadMsg', getQueryParams()], getUnreadMsgCount );

  useEffect(()=>{
    setSelectedRows([]);
  }, [isLoading]);

  const [confirmInfo, setConfirmInfo] = useState({
    visible: false,
    title: '',
    content: '',
    cb: ()=>{},
  });

  const toolbarRef = useRef<any>();

  useEffect(()=>{
    const params = urlParse(window.location.href);
    if (params.id) {
      msgCenter.showMessageDetail(params.id);
    }
  }, []);

  useEffect(()=>{
    if (unReadData?.code!=0) return;
    const { type_num } = unReadData.data;
    const announcement = type_num.find((itm: any)=>itm.sort == 2);
    const systemMessage = type_num.find((itm: any)=>itm.sort == 1);
    msgCenter.setUnReadCount({
      announcement: announcement?.total || 0,
      systemMessage: systemMessage?.taotal || 0,
    });
  }, [unReadData]);

  const msgList = useMemo(()=>{
    return data?.data?.mes_list || [];
  }, [data]);

  const canIUseReadBtn = useMemo(()=>{
    return msgList
      .filter((itm: any)=>selectedRows.some((id)=>id==itm.id))
      .filter((itm: any)=>itm.read_status == MsgReadStatus.unread)
      .length > 0;
  }, [selectedRows, msgList]);

  const canIUseDelBtn = useMemo(()=>{
    return selectedRows .length > 0;
  }, [selectedRows]);

  if (isLoading || isFetching) {
    return <Loading/>;
  }
  if (isError) {
    return <Error desc='获取数据失败' />;
  }

  const closeConfirmInfo = () => {
    setConfirmInfo({
      visible: false,
      title: '',
      content: '',
      cb: ()=>{},
    });
  };

  const handleAllReaded = () => {
    setConfirmInfo({
      visible: true,
      title: '标记已读',
      content: '确定要将全部类型的消息标记为已读吗?',
      cb: ()=>{
        setMsgAsReadByIds(msgList.map((itm: any) => itm.id))
          .then((response) => {
            if (response.code == 0) {
              refetch();
              unReadRefetch();
              setConfirmInfo({
                visible: false,
                title: '',
                content: '',
                cb: ()=>{},
              });
            } else {
              Message.warning('操作失败');
            }
          });
      },
    });
  };

  const handleCheckedReaded = () => {
    setConfirmInfo({
      visible: true,
      title: '标记已读',
      content: `确定要将已选中的${selectedRows.length}条消息标记为已读吗?`,
      cb: ()=>{
        setMsgAsReadByIds(selectedRows)
          .then((response) => {
            if (response.code == 0) {
              refetch();
              unReadRefetch();
              setConfirmInfo({
                visible: false,
                title: '',
                content: '',
                cb: ()=>{},
              });
            } else {
              Message.warning('操作失败');
            }
          });
      },
    });
  };

  const handleDeleteMessage = () => {
    setConfirmInfo({
      visible: true,
      title: '标记已读',
      content: `确定要将已选中的${selectedRows.length}条消息删除吗?`,
      cb: ()=>{
        deleteMsgByIds(selectedRows)
          .then((response) => {
            if (response.code == 0) {
              refetch();
              unReadRefetch();
              setConfirmInfo({
                visible: false,
                title: '',
                content: '',
                cb: ()=>{},
              });
            } else {
              Message.warning('操作失败');
            }
          });
      },
    });
  };

  const rowSelection = {
    selectedRowKeys: selectedRows,
    getCheckboxProps: (record: any) => ({
      disabled: record.useStatus === -2,
      name: record.id,
    }),
    onChange(keys: any) {
      setSelectedRows(keys);
      if (keys.length == msgList.length) {
        toolbarRef.current.allcheck(true);
      } else {
        toolbarRef.current.allcheck(false);
      }
    },
  };

  const setAllChecked = ()=>{
    setSelectedRows(msgList.map((itm: any)=>itm.id));
  };

  const setAllUnchecked = ()=> setSelectedRows([]);

  const renderTable = () => {
    return (
      <div className={styles.message_list_warp}>
        <div className={styles.message_list}>
          <Toolbar ref={toolbarRef} {...{ setAllChecked, setAllUnchecked, handleAllReaded, handleCheckedReaded, selectedRows, canIUseReadBtn, canIUseDelBtn, handleDeleteMessage }} />
          <Table
            onRow={(record)=>({
              onClick() {
                msgCenter.showMessageDetail(record.id);
              },
            })}
            className={classNames('text-14 table-full', styles.table)}
            rowKey='id'
            rowSelection={rowSelection}
            columns={cols}
            dataSource={msgList}
          />
        </div>
        <div>
          <Pagination
            pageSize={paging.limit}
            pageNumber={paging.page}
            total={data?.data?.total||0}
            onChange={msgCenter.pageChange}
            showSizeChanger
          />
        </div>
        <Modal
          visible={confirmInfo.visible}
          width={632}
          height={240}
          className={styles.confirm_modal}
          title={confirmInfo.title}
          onClose={closeConfirmInfo}
          footer={(
            <div className={`modal-card-foot ${styles.modal_card_foot}`}>
              <div className="flex flex-row justify-between items-center">
                <Button
                  className="bg-white hover:bg-gray-100 transition cursor-pointer mr-20 mb-0"
                  iconName="close"
                  onClick={closeConfirmInfo}
                >
                    取消
                </Button>
                <Button
                  className="bg-gray-700 hover:bg-gray-900 transition cursor-pointer mb-0"
                  modifier="primary"
                  iconName="done"
                  onClick={confirmInfo.cb}
                >
                    确定
                </Button>
              </div>
            </div>
          )}
        >
          <div className={styles.content}>{confirmInfo.content}</div>
        </Modal>
      </div>
    );
  };

  return (
    <div className={styles.listPanel}>
      {msgList.length ? renderTable() : <div className={styles.noMsg}/>}
    </div>
  );
};

export default inject('msgCenter')(observer(PanelList));
