import React, { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';
import { debounce } from 'lodash';
import cs from 'classnames';

import msgMgmt from '@portal/stores/msg-mgmt';
import { MsgSendStatus, MsgType } from '@portal/modules/system-mgmt/constants';
import Loading from '@c/loading';
import ErrorTips from '@c/error-tips';
import MoreMenu, { MenuItem } from '@c/more-menu';
import Authorized from '@c/authorized';
import SvgIcon from '@c/icon';
import Pagination from '@c/pagination';
import Modal from '@c/modal';
import { createMsg, deleteMsgById } from '@portal/modules/system-mgmt/api';
import PreviewModal from './preview-modal';
import { getMsgById } from '@portal/modules/system-mgmt/api';
import { useQueryClient } from 'react-query';
import EmptyTips from '@c/empty-tips';
import Select from '@c/select';
import Table from '@c/table';
import toast from '@lib/toast';

import Status from './status';
import { ModalContent } from './preview-modal';
import { Content as SendMessage } from '../send-message/index';

import styles from './index.module.scss';

enum MessageAction {
  delete,
  send,
  modify
}

interface Props {
  className?: string;
  refresh: () => void;
}

const EnumStatusLabel = {
  [MsgSendStatus.all]: '全部状态',
  [MsgSendStatus.success]: '已发送',
  [MsgSendStatus.sending]: '发送中',
  [MsgSendStatus.draft]: '草稿',
};

const EnumMessageLabel = {
  [MsgType.all]: '全部消息类型',
  [MsgType.system]: '系统消息',
  [MsgType.notify]: '通知公告',
};

const MessageStatus = [
  {
    value: MsgSendStatus.all,
    label: '全部状态',
  },
  {
    value: MsgSendStatus.success,
    label: '已发送',
  }, {
    value: MsgSendStatus.sending,
    label: '发送中',
  },
  {
    value: MsgSendStatus.draft,
    label: '草稿',
  },
];

const EnumMessage = [
  {
    label: '全部消息类型',
    value: MsgType.all,
  },
  {
    label: '系统消息',
    value: MsgType.system,
  }, {
    label: '通知公告',
    value: MsgType.notify,
  },
];

const MsgTable = ({ refresh }: Props): JSX.Element => {
  const {
    data,
    pageInfo,
    requestInfo,
    messageStatus: status,
    messageType,
    setPageInfo,
    setMessageType,
    setMessageStatus: setStatus,
  } = msgMgmt;
  const history = useHistory();
  const queryClient = useQueryClient();

  const [previewInfo, setPreviewInfo] = useState({
    visible: false, id: '', title: '', status: MsgSendStatus.all,
  });
  const [previewData, setPreviewData] = useState<any>(null);
  const [modifyModal, setModifyModal] = useState<any>({ visible: false, id: undefined });
  const [modifyData, setModifyData] = useState<any>(null);
  const sendMessageRef = useRef<any>();
  const delMsgIdRef = useRef<any>('');

  const openMsgDelModal = (): void => {
    const msgDelModal = Modal.open({
      title: '删除消息',
      content: (<p className="p-20">确定要删除该条消息吗？删除后不可恢复。</p>),
      onConfirm: () => {
        deleteMsgById(delMsgIdRef.current)
          .then(() => {
            toast.success('操作成功');
            refresh();
            refreshMsg();
            closeModal();
            msgDelModal.close();
          })
          .catch(() => {
            toast.error('操作失败');
          });
      },
      onCancel: closeModal,
    });
  };

  const closeModal = (): void => {
    delMsgIdRef.current = '';
  };

  const { isLoading, isError } = requestInfo;

  const refreshMsg = (): void => {
    queryClient.invalidateQueries('msg-mgmt-msg-list');
    queryClient.invalidateQueries('count-unread-msg');
  };

  useEffect(() => {
    if (!previewInfo.visible || !previewInfo.id) {
      setPreviewData(null);
      return;
    }

    getMsgById(previewInfo.id)
      .then((response) => {
        const { recivers } = response;
        setPreviewData(Object.assign({}, response, { receivers: recivers }));
      }).catch(() => {
        toast.error('异常查询');
      });
  }, [previewInfo]);

  useEffect(() => {
    if (!modifyModal.visible || !modifyModal.id) {
      setPreviewData(null);
      return;
    }

    getMsgById(modifyModal.id)
      .then((response: any) => {
        const { recivers } = response;
        setModifyData(Object.assign({}, response, { receivers: recivers }));
      }).catch(() => {
        toast.error('异常查询');
      });
  }, [modifyModal]);

  useEffect(() => {
    return () => {
      delMsgIdRef.current = null;
    };
  }, []);

  const confirmSend = (): void => {
    const params = {
      template_id: 'quanliang',
      title: previewData.title || '',
      args: [{
        key: 'code',
        value: previewData.content || '',
      }],
      channel: previewData.channel || previewData.chanel, // letter: 站内信，email: 邮件
      type: previewData.type, // 1. verifycode 2、not verifycode
      sort: previewData.type,
      is_send: true, // false: 保存为草稿
      recivers: previewData.receivers,
      mes_attachment: previewData.mes_attachment || [],
      //     url: string
      // filename:
    };
    // @ts-ignore
    if (previewData.id) params.id = previewData.id;
    createMsg(params)
      .then((data) => {
        if (data) {
          toast.success('操作成功');
          setPreviewInfo({ id: '', visible: false, title: '', status: MsgSendStatus.all });
          refresh();
          refreshMsg();
        } else {
          toast.error('操作失败');
        }
      });
  };

  const handleClose = (): void => setPreviewInfo(
    {
      visible: false, id: '', title: '', status: MsgSendStatus.all,
    });

  const pageChange = (page: number, pageSize: number): void => setPageInfo(
    { ...pageInfo, current: page, pageSize },
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorTips desc='获取数据失败' />;
  }

  const msgList = data?.messages || [];

  const handleModifyModalClose = (): void => {
    setModifyModal({ visible: false, id: undefined });
    setModifyData(null);
    refresh();
  };

  const cols = [
    {
      Header: (
        <Select
          value={status}
          defaultValue={status}
          options={MessageStatus}
          onChange={setStatus}
        >
          <div
            className={`flex content-center items-center ${EnumStatusLabel[status] !== '全部状态' ? styles.text_blue : ''} pointer`}
          >
            <div>{EnumStatusLabel[status]}</div>
            <SvgIcon
              name="filter_alt"
              className={cs(EnumStatusLabel[status] !== '全部状态' ? styles.text_blue : '', styles.status_icon)}
            />
          </div>
        </Select>
      ),
      id: 'status',
      width: 160,
      accessor: ({ status, fail, success }: {
        status: MsgSendStatus,
        fail: number, success: number
      }) => (
        <Status {...{ status, fail, success }
        } />
      ),
    },
    {
      Header: (
        <Select
          value={messageType}
          defaultValue={messageType}
          options={EnumMessage}
          onChange={setMessageType}
        >
          <div
            className={`flex content-center items-center ${EnumMessageLabel[messageType] !== '全部消息类型' ? styles.text_blue : ''} pointer`}
          >
            <div>{EnumMessageLabel[messageType]}</div>
            <SvgIcon
              name="filter_alt"
              className={cs(EnumMessageLabel[messageType] !== '全部消息类型' ? styles.text_blue : '', styles.status_icon)} />
          </div>
        </Select>
      ),
      id: 'title',
      width: 'auto',
      accessor: ({ id, title, sort }: {
        status: MsgSendStatus, id: string, title: string, sort: MsgType
      }) => {
        const handleClick = (): void=> {
          history.push(`/system/message/details/${id}`);
        };
        return (
          <PreviewModal handleClick={handleClick} title={(<div>
            {(sort !== MsgType.all) && (<span
              className={
                cs(
                  styles.msg_type_tip,
                  {
                    [styles.msg_type_tip_notice]: sort === MsgType.notify,
                  })
              }>{(EnumMessage.find((itm) => itm.value === sort) || {}).label}</span>)}
            <span className={cs('message_name', styles.msg_title)} title={title}>{title}</span>
          </div>)} />
        );
      },
    },
    {
      Header: '操作人',
      id: '操作人',
      accessor: ({ handle_name }: Qxp.QueryMsgResult) => handle_name || <span>无</span>,
    },
    {
      Header: '更新时间',
      id: 'updated_at',
      width: 180,
      accessor: ({ updated_at }: Qxp.QueryMsgResult) => {
        return (
          <span>
            {dayjs(parseInt(String(updated_at * 1000)))
              .format('YYYY-MM-DD HH:mm:ss')}
          </span>
        );
      },
    },
    {
      Header: '',
      id: 'updated_ats',
      accessor: (itm: Qxp.QueryMsgResult) => {
        const { status, id } = itm;
        const confirmSend = (): void => {
          setPreviewInfo({ id, visible: true, title: itm.title, status });
        };

        const confirmDelete = (): void => {
          delMsgIdRef.current = itm.id;
          openMsgDelModal();
        };

        const handleModifyModal = (): void => setModifyModal({ visible: true, id: itm.id });

        if (status !== 1) return null;

        const menus: MenuItem<MessageAction>[] = [
          {
            key: MessageAction.send,
            label: (
              <div className="flex items-center">
                <SvgIcon name="send" size={16} className="mr-8" />
                <span className="font-normal">发送&emsp;&emsp;</span>
              </div>
            ),
          },
          {
            key: MessageAction.modify,
            label: (
              <div className="flex items-center">
                <SvgIcon name="edit" size={16} className="mr-8" />
                <span className="font-normal">修改&emsp;&emsp;</span>
              </div>
            ),
          },
          {
            key: MessageAction.delete,
            label: (
              <div className="flex items-center">
                <SvgIcon name="restore_from_trash" size={16} className="mr-8" />
                <span className="font-normal">删除&emsp;&emsp;</span>
              </div>
            ),
          },
        ];
        return (
          <Authorized authority={['system/mangage']}>
            <MoreMenu
              placement="bottom-end"
              className="opacity-1"
              menus={menus}
              onMenuClick={(key: MessageAction) => {
                switch (key) {
                case MessageAction.send:
                  confirmSend();
                  break;
                case MessageAction.modify:
                  handleModifyModal();
                  break;
                case MessageAction.delete:
                  confirmDelete();
                  break;
                default:
                  break;
                }
              }}
            />
          </Authorized>
        );
      },
    },
  ];

  const saveDraft = (): void => {
    const params = sendMessageRef?.current?.saveDraft({ toParams: true });
    params && createMsg(params)
      .then((data) => {
        if (data) {
          toast.success('操作成功');
          setPreviewInfo({ id: '', visible: false, title: '', status: MsgSendStatus.all });
          refresh(); // fixme
          refreshMsg();
          handleModifyModalClose();
        } else {
          toast.error('操作失败');
        }
      }).catch((err: Error) => toast.error(err.message));
  };

  return (
    <>
      <div className={cs('w-full flex', styles.tableWrap)}>
        <Table
          className={cs('massage_table text-14', styles.massage_table)}
          data={msgList}
          // @ts-ignore
          columns={cols}
          rowKey="id"
          emptyTips={<EmptyTips text='暂无消息数据' className="pt-40" />}
          loading={isLoading}
        />
      </div>
      {msgList.length > 0 && (<Pagination
        {...pageInfo}
        showSizeChanger
        onChange={pageChange}
        className={'pt-10'}
        renderTotalTip={() => (
          <div className="text-12 text-gray-600">
            共<span className="mx-4">{data?.total || 0}</span>条消息
          </div>
        )}
      />)}

      {previewInfo.visible && (<ModalContent
        handleClose={handleClose}
        confirmSend={debounce(confirmSend, 1000)}
        data={previewData}
        status={previewInfo.status}
      />)}
      {modifyModal.visible &&
        (<Modal
          width={1324}
          title="修改草稿"
          onClose={handleModifyModalClose}
          footerBtns={[
            {
              text: '存草稿',
              key: 'save',
              iconName: 'book',
              onClick: debounce(saveDraft, 1000, { leading: true }),
            },
            {
              text: '预览并发送',
              key: 'send',
              iconName: 'send',
              modifier: 'primary',
              onClick: () => {
                sendMessageRef?.current?.previewAndPublish && sendMessageRef?.current?.previewAndPublish();
              },
            },
          ]}
        >
          {modifyData &&
            (<SendMessage
              donotShowHeader
              className={cs(styles.draftModal, 'p-20') }
              handleClose={handleModifyModalClose}
              modifyData={modifyData}
              ref={sendMessageRef}
              footer={() => null}
            />)}
        </Modal>)
      }
    </>
  );
};

export default observer(MsgTable);
