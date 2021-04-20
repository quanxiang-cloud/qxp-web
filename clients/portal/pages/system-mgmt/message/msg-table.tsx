import React, { useState, useEffect, useRef } from 'react';
import { Table, Message, Modal as LegoModal } from '@QCFE/lego-ui';
import { inject, observer } from 'mobx-react';
import dayjs from 'dayjs';
import { MsgSendStatus, MsgType } from '@portal/pages/system-mgmt/constants';
import Status from './status';
import Loading from '@c/loading';
import Error from '@c/error';
import MoreMenu from '@c/more-menu';
import SvgIcon from '@c/icon';
import Pagination from '@c/pagination';
import Modal from '@c/modal';
import Button from '@c/button';
import { createMsg, deleteMsgById } from '@portal/api/message-mgmt';
import PreviewModal, { ModalContent } from './preview-modal';
import { getMsgById } from '@portal/api/message-mgmt';
import classnames from 'classnames';
import { useQueryClient } from 'react-query';
import EmptyData from '@c/empty-tips';

import { Content as SendMessage } from '../send-message/index';

import { Data, PageInfo, RequestInfo, MessaeStatus, MessageType } from '../delcare';
import { useRecoilState, useRecoilValue } from 'recoil';

import styles from './index.module.scss';

enum MessageAction {
  delete,
  send,
  modify
}

interface Props {
  className?: string;
  refresh: ()=>void;
}

const EnumStatusLabel: any = {
  [MsgSendStatus.all]: '全部',
  [MsgSendStatus.success]: '已发送',
  [MsgSendStatus.sending]: '发送中',
  [MsgSendStatus.draft]: '草稿',
};

const EnumMessageLabel = {
  [MsgType.all]: '全部',
  [MsgType.system]: '系统消息',
  [MsgType.notify]: '通知公告',
};

const getOptions = (labels: any, keyname?: string )=>{
  const keys = Object.keys(labels);

  return keys.map((key)=>({
    label: labels[key],
    [keyname || 'key']: key,
  }));
};

const EnumStatus = [
  {
    label: '全部',
    key: MsgSendStatus.all,
  },
  {
    label: '已发送',
    key: MsgSendStatus.success,
  }, {
    label: '发送中',
    key: MsgSendStatus.sending,
  },
  {
    label: '草稿',
    key: MsgSendStatus.draft,
  },
];

const EnumMessage = [
  {
    label: '全部',
    key: MsgType.all,
  },
  {
    label: '系统消息',
    key: MsgType.system,
  }, {
    label: '通知公告',
    key: MsgType.notify,
  },
];

const MsgTable = ({ msgMgmt: store, refresh }: Props & Pick<MobxStores, 'msgMgmt' | any>) => {
  const queryClient=useQueryClient();
  const data = useRecoilValue(Data);
  const [pageInfo, setPageInfo] = useRecoilState(PageInfo);

  const { isLoading, isError, isFetching } = useRecoilValue(RequestInfo);

  const [previewInfo, setPreviewInfo] = useState({ visible: false, id: '', title: '', status: MsgSendStatus.all });
  const [previewData, setPreviewData] = useState<any>(null);

  const [modifyModal, setModifyModal] = useState<any>({ visible: false, id: undefined });
  const [modifyData, setModifyData] = useState<any>(null);

  const sendMessageRef = useRef<any>();

  const refreshMsg = () => {
    queryClient.invalidateQueries('msg-mgmt-msg-list');
    queryClient.invalidateQueries('count-unread-msg');
  };

  useEffect(()=>{
    if (!previewInfo.visible || !previewInfo.id) {
      setPreviewData(null);
      return;
    }

    getMsgById(previewInfo.id)
      .then((response: any) => {
        if (response.code == 0) {
          const { recivers } = response.data;
          setPreviewData(Object.assign({}, response.data, { receivers: recivers }));
        } else {
          Message.warning('异常查询');
        }
      });
  }, [previewInfo]);

  useEffect(()=>{
    if (!modifyModal.visible || !modifyModal.id) {
      setPreviewData(null);
      return;
    }

    getMsgById(modifyModal.id)
      .then((response: any) => {
        if (response.code == 0) {
          const { recivers } = response.data;
          setModifyData(Object.assign({}, response.data, { receivers: recivers }));
        } else {
          Message.warning('异常查询');
        }
      });
  }, [modifyModal]);

  const confirmSend = () => {
    const params = {
      template_id: 'quanliang',
      // @ts-ignore
      title: previewData.title || '',
      args: [{
        key: 'code',
        // @ts-ignore
        value: previewData.content || '',
      }],
      // @ts-ignore
      channel: previewData.channel||previewData.chanel, // letter: 站内信，email: 邮件
      // @ts-ignore
      type: previewData.type, // 1. verifycode 2、not verifycode
      // @ts-ignore
      sort: previewData.type,
      // @ts-ignore
      is_send: true, // false: 保存为草稿
      // @ts-ignore
      recivers: previewData.receivers,
      // @ts-ignore
      mes_attachment: previewData.mes_attachment||[],
      //     url: string
      // filename:
    };
    // @ts-ignore
    if (previewData.id) params.id = previewData.id;
    createMsg(params)
      .then((data)=>{
        if (data&&data.code==0) {
          Message.success('操作成功');
          setPreviewInfo({ id: '', visible: false, title: '', status: MsgSendStatus.all });
          refresh();
          refreshMsg();
        } else {
          Message.error('操作失败');
        }
      });
  };

  const handleClose = () => setPreviewInfo({ visible: false, id: '', title: '', status: MsgSendStatus.all });

  const pageChange = (page: number, pageSize: number) => setPageInfo( (_current) =>({ ..._current, current: page, pageSize }));

  const [rowSelectionKyes, setRowSelectionKyes] = useState([]);

  const [modalInfo, setModalInfo] = useState({ visible: false, id: '' });
  const closeModal = () => setModalInfo({ visible: false, id: '' });

  const [status, setStatus] = useRecoilState<MsgSendStatus>(MessaeStatus);
  const [messageType, setMessageType] = useRecoilState(MessageType);

  if (isLoading ) {
    return <Loading/>;
  }

  if (isError) {
    return <Error desc='获取数据失败'/>;
  }

  const rowSelection = {
    selectedRowKeys: rowSelectionKyes,
    getCheckboxProps: (record: any) => ({
      disabled: record.useStatus === -2,
      name: record.id,
    }),
    onChange(e:any) {
      setRowSelectionKyes(e);
    },
  };

  const msgList = data?.data?.messages || [];

  const handleModifyModalClose = () => {
    setModifyModal({ visible: false, id: undefined });
    setModifyData(null);
    refresh();
  };

  const cols = [
    {
      // title: <Select
      //   placeholder={<div className="flex content-center"><div>状态</div><SvgIcon name="filter_alt" /></div>}
      //   className={styles.selects}
      //   value={status}
      //   onChange={setStatus}
      //   options={EnumStatus}
      // />,
      // @ts-ignore
      title:
        <MoreMenu
          value={status}
          targetClass={styles.text_blue}
          optionsWarpClass={styles.menu}
          optionsClass={styles.options}
          onChange={setStatus}
          className="opacity-1"
          menus={EnumStatus}
          suffix={<SvgIcon name="check" style={{ color: 'inherit' }}/>}
        >

          <div className={`flex content-center ${styles.text_blue} pointer`}>
            <div>{EnumStatusLabel[status]}</div>
            <SvgIcon name="filter_alt" className={classnames(styles.text_blue, styles.status_icon)}/>
          </div>
        </MoreMenu>,
      dataIndex: 'status',
      width: 160,
      render: ( _ : any, { status, fail, success }: { status: MsgSendStatus, fail: number, success: number }) => <Status {...{ status, fail, success }}/>,
    },
    {
      // title: <Select
      //   placeholder={<div className="flex content-center"><div>消息</div><SvgIcon name="filter_alt" /></div>}
      //   className={styles.selects}
      //   value={messageType}
      //   onChange={setMessageType}
      //   options={EnumMessage}
      // />,
      // @ts-ignore
      title:
        <MoreMenu
          value={messageType}
          targetClass={styles.text_blue}
          optionsWarpClass={styles.menu}
          optionsClass={styles.options}
          onChange={setMessageType}
          className="opacity-1"
          menus={EnumMessage}
          suffix={<SvgIcon name="check" style={{ color: 'inherit' }}/>}
        >
          <div className={`flex content-center ${styles.text_blue} pointer`}>
            <div>{EnumMessageLabel[messageType]}</div>
            <SvgIcon name="filter_alt" className={classnames(styles.text_blue, styles.status_icon)}/>
          </div>
        </MoreMenu>,
      dataIndex: 'title',
      width: 'auto',
      render: (_: any, { id, title, sort, status } : { status: MsgSendStatus, id: string, title: string, sort: MsgType })=>{
        const handleClick = () => {
          setPreviewInfo({ id, visible: true, title, status });
        };
        return (<PreviewModal handleClick={handleClick} title={(<div>
          {( sort != MsgType.all ) &&(<span
            className={
              classnames(
                styles.msg_type_tip,
                {
                  [styles.msg_type_tip_notice]: sort == MsgType.notify,
                })
            }>{(EnumMessage.find((itm)=>itm.key==sort)||{}).label}</span>)}
          <span className={styles.msg_title} title={title}>{title}</span>
        </div>)} />);
      },
    },
    {
      title: '操作人',
      render: ({ handle_name }: Qxp.QueryMsgResult) => handle_name || <span>无</span>,
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      width: 180,
      render: ( _: any, { updated_at } : Qxp.QueryMsgResult) => {
        return <span>{dayjs(parseInt(String(updated_at * 1000))).format('YYYY-MM-DD HH:mm:ss')}</span>;
      },
    },
    {
      title: '',
      render: (itm: Qxp.QueryMsgResult) => {
        const { status, id } = itm;
        const confirmSend = () => {
          setPreviewInfo({ id, visible: true, title: itm.title, status });
        };

        const confirmDelete = ()=> setModalInfo({ visible: true, id: itm.id });

        const handleModifyModal = () => setModifyModal({ visible: true, id: itm.id });

        if (status !== 1) return null;

        const menus = [
          {
            key: MessageAction.send,
            label: (
              <div className="flex items-center" onClick={confirmSend}>
                <SvgIcon name="send" size={16} className="mr-8" />
                <span className="font-normal">发送&emsp;&emsp;</span>
              </div>
            ),
          },
          {
            key: MessageAction.modify,
            label: (
              <div className="flex items-center" onClick={handleModifyModal}>
                <SvgIcon name="edit" size={16} className="mr-8" />
                <span className="font-normal">修改&emsp;&emsp;</span>
              </div>
            ),
          },
          {
            key: MessageAction.delete,
            label: (
              <div className="flex items-center" onClick={confirmDelete}>
                <SvgIcon name="restore_from_trash" size={16} className="mr-8" />
                <span className="font-normal">删除&emsp;&emsp;</span>
              </div>
            ),
          },
        ];
        return <MoreMenu onChange={console.log} placement="bottom-end" className="opacity-1" menus={menus}/>;
      },
    },
  ];

  const saveDraft = () => {
    const params=sendMessageRef?.current?.saveDraft({ toParams: true });
    params && createMsg(params)
      .then((data)=>{
        if (data&&data.code==0) {
          Message.success('操作成功');
          setPreviewInfo({ id: '', visible: false, title: '', status: MsgSendStatus.all });
          refresh(); // fixme
          refreshMsg();
          handleModifyModalClose();
        } else {
          Message.error('操作失败');
        }
      });
  };

  return (
    <div className={classnames('full-width', styles.tableWrap)}>
      <ModalContent
        visible={previewInfo.visible}
        handleClose={handleClose}
        confirmSend={confirmSend}
        data={previewData}
        status={previewInfo.status}
      />
      <LegoModal
        className={styles.preview_modal}
        title="修改草稿"
        visible={modifyModal.visible}
        onCancel={handleModifyModalClose}
        footer={(<div className={styles.footer}>
          <Button
            onClick={()=>{
              saveDraft();
              // sendMessageRef?.current?.saveDraft && sendMessageRef?.current?.saveDraft();
            }}
            iconName="book"
            className='mr-20'
          >
            存草稿
          </Button>
          <Button
            className="bg-gray-700 mr-20"
            modifier="primary"
            onClick={()=>{
              sendMessageRef?.current?.previewAndPublish && sendMessageRef?.current?.previewAndPublish();
            }}
            iconName="send"
          >
            预览并发送
          </Button>
        </div>)}
      >
        {modifyData &&
        (<SendMessage
          donotShowHeader
          className={styles.draftModal}
          handleClose={handleModifyModalClose}
          modifyData={modifyData}
          ref={sendMessageRef}
          footer={() => null}
        />)}
      </LegoModal>
      <Modal
        title="删除消息"
        visible={modalInfo.visible}
        width={632}
        height={240}
        onClose={closeModal}
        footer={(
          <div className={`modal-card-foot ${styles.modal_card_foot}`}>
            <div className="flex flex-row justify-between items-center">
              <Button
                className="bg-white hover:bg-gray-100 transition cursor-pointer mr-20 mb-0"
                iconName="close"
                onClick={closeModal}
              >
                取消
              </Button>
              <Button
                className="bg-gray-700 hover:bg-gray-900 transition cursor-pointer mb-0"
                modifier="primary"
                iconName="done"
                onClick={()=>{
                  deleteMsgById(modalInfo.id)
                    .then((data)=>{
                      if (data&&data.code==0) {
                        Message.success('操作成功');
                        refresh();
                        refreshMsg();
                        closeModal();
                      } else {
                        Message.error('操作失败');
                      }
                    });
                }}
              >
                确定
              </Button>
            </div>
          </div>
        )}
      >
        <div className={styles.modal_card_content}>确定要删除该条消息吗？删除后不可恢复。</div>
      </Modal>
      <Table
        className='text-14 table-full'
        dataSource={msgList}
        columns={cols}
        rowKey="id"
        // rowSelection={rowSelection}
        emptyText={<EmptyData text='暂无消息数据' className="pt-40" />}
        loading={isLoading}
      />
      {msgList.length > 0 && (<Pagination
        {...pageInfo}
        showSizeChanger
        onChange={pageChange}
        className={'pt-20'}
        renderTotalTip={() => (
          <div className="text-12 text-gray-600">
            共<span className="mx-4">{data?.data?.total || 0}</span>条消息
          </div>
        )}
      />)}
    </div>
  );
};

export default inject('msgMgmt')(observer(MsgTable));
