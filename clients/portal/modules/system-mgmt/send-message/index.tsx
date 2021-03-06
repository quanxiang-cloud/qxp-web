import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import cs from 'classnames';
import { debounce } from 'lodash';
import { useMutation, useQueryClient } from 'react-query';
import { Form, Input } from 'antd';

import Button from '@c/button';
import Modal from '@c/modal';
import toast from '@lib/toast';
import { createMsg } from '@portal/modules/system-mgmt/api';
import { MsgType } from '@portal/modules/system-mgmt/constants';

import RadioField from './radio-field';
import EditorField, { RefProps } from './editor-field';
import ButtonField, { CheckedInfo } from './button-field';
import Container from '../container';
import PreviewMsg from './preview-msg';

import styles from './index.module.scss';

export type FileInfo = {
  uid: string;
  url: string;
  filename: string;
  status?: 'success' | 'active' | 'exception';
  showProgress?: boolean;
  percentage?: number;
}

const SendMessage = (): JSX.Element => {
  useEffect(() => {
    document.title = '消息管理 - 发送消息';
  }, []);

  return (
    <Container
      hideInfoCard
      asModalPage
      className={styles.wrap}
      pageName='发送消息'
      style={{
        height: 'calc(100vh - 62px)',
      }}
    >
      <Content />
    </Container>
  );
};

interface ModifyConfig {
  id?: string
  types?: MsgType
  title?: string
  content?: any
  receivers?: any[], // fixme: typo
  files?: Array<QXPUploadFileBaseProps> | null
}

interface ContentProps {
  donotShowHeader?: boolean
  footer?: () => JSX.Element | null
  modifyData?: ModifyConfig
  handleClose?: () => void
  editMode?: boolean
  className?: string
}

function ContentWithoutRef({
  className,
  donotShowHeader,
  footer,
  modifyData,
  handleClose,
}: ContentProps, ref: React.Ref<unknown> | undefined): JSX.Element {
  const [form] = Form.useForm();
  const [prevData, setPrevData] = useState<Qxp.DraftData | null>(null);
  const [confirmStatus, setConfirmStatus] = useState<'draft' | 'browse' | 'send'>('draft');
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [errorText, setErrorText] = useState('');

  const queryClient = useQueryClient();
  const history = useHistory();
  const contentRef = useRef<RefProps>(null);

  // mutation create msg
  const createMsgMutation = useMutation(createMsg, {
    onSuccess: (data: any) => {
      if (data) {
        toast.success('操作成功');
        // todo: prefix all msg related query keys
        queryClient.invalidateQueries('msg-mgmt-msg-list');
        queryClient.invalidateQueries('count-unread-msg');
        handleClose && handleClose();
        setOpenPreviewModal(false);
        setTimeout(() => {
          history.push('/system/message');
        }, 500);
      } else {
        toast.error('操作失败');
      }
      setOpenPreviewModal(false);
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  function byteCount(s: string): number {
    return encodeURI(s).split(/%..|./).length - 1;
  }

  const getCurrentFiles = (): QXPUploadFileBaseProps[] => {
    const { args } = form.getFieldsValue();
    return [...args.files];
  };

  useImperativeHandle(ref, () => {
    return {
      saveDraft: () => handleSubmit('draft'),
      previewAndPublish: handlePreviewAndPublish,
      getCurrentFiles,
    };
  });

  function handleSubmit(val: 'draft' | 'browse' | 'send'): void {
    setConfirmStatus(val);
    form.submit();
  }

  function handleFinishFailed(errors: any): void {
    const { errorFields = [] } = errors;
    const msg = errorFields.length && errorFields[0].errors[0];
    toast.error(msg || '');
  }

  function handleValidate(): boolean {
    const { content } = contentRef.current?.getValue() || { };
    const _content = content?.trim() || '';

    if (_content === '<br>') {
      setErrorText('请输入内容');
      toast.error('请输入内容');
      return false;
    }

    if (!_content) {
      setErrorText('消息内容不能为空');
      toast.error('消息内容不能为空');
      return false;
    }

    if (byteCount(_content) > 10240) {
      setErrorText('消息内容文本过长，请修改，或使用附件进行发送。');
      toast.error('消息内容文本过长，请修改，或使用附件进行发送。');
      return false;
    }

    setErrorText('');
    return true;
  }

  function handleReceivers(receivers: CheckedInfo[]): { id: string, type: '1 | 2', name: string }[] {
    let newRecovers: any[] = [];
    newRecovers = receivers.map(({ id, name, ownerName, departmentName, type }) => {
      return {
        id,
        type,
        name: name || ownerName || departmentName,
      };
    });
    return newRecovers;
  }

  function handleFinish(values: any): void {
    const bol = handleValidate();
    if (!bol) return;

    const { title, type, receivers } = values;
    const args = contentRef.current?.getValue();
    if (confirmStatus === 'browse') {
      const _currDate = Math.floor(new Date().getTime() / 1000);
      const formData: any = {
        title,
        content: args?.content || '',
        receivers: handleReceivers(receivers),
        type,
        updateAt: _currDate,
        files: (args?.files || []).map((itm: QXPUploadFileBaseProps) => {
          return {
            fileName: itm.name,
            url: itm.uid,
          };
        }).filter(Boolean),
      };
      setPrevData(formData);
      setConfirmStatus('browse');
      setOpenPreviewModal(true);
      return;
    }

    const isSend = confirmStatus === 'draft' ? false : true;
    const params: any = {
      web: {
        title: title,
        isSend: isSend, // false: 保存为草稿
        receivers: handleReceivers(receivers),
        id: '',
        types: type,
        contents: {
          content: args?.content || '',
        },
        files: (args?.files || []).map((itm: QXPUploadFileBaseProps) => {
          return {
            fileName: itm.name,
            url: itm.uid,
          };
        }).filter(Boolean),
      },
    };

    if (modifyData) params.web.id = modifyData.id;

    createMsgMutation.mutate(params);
  }

  function handlePreviewAndPublish(): void {
    setConfirmStatus('browse');
    form.submit();
  }

  return (
    <div
      className={cs('w-full overflow-hidden', className)}
      style={{ height: 'calc(100% - 24px)' }}
    >
      <div className={styles.panel}>
        {!donotShowHeader && (<div className={styles.header}>
          <div className={styles.title}>发送消息</div>
        </div>)}
        <div
          className={cs('send-msg-body', styles.body)}
          style={{ height: 'calc(100% - 56px)' }}
        >
          <div className='h-full overflow-auto w-full' style={{ height: 'calc(100% - 64px)' }}>
            <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 16 }}
              form={form}
              onFinish={handleFinish}
              onFinishFailed={handleFinishFailed}
              initialValues={{
                type: modifyData?.types || MsgType.notify,
                title: modifyData?.title,
                args: {
                  content: modifyData?.content,
                  files: modifyData?.files,
                },
                receivers: modifyData?.receivers,
              }}
            >
              <Form.Item
                name='type'
                label="消息类型"
                rules={[
                  { required: true, message: '请选择消息类型' },
                ]}
              >
                <RadioField />
              </Form.Item>
              <Form.Item
                name="title"
                label="标题"
                extra="不超过 50 个字符。"
                rules={[
                  { required: true, message: '请输入消息标题' },
                  { type: 'string', max: 50, message: '不超过 50 个字符' },
                ]}
              >
                <Input placeholder="请输入消息标题" />
              </Form.Item>
              <Form.Item
                name="receivers"
                label="发送至"
                rules={[
                  { required: true, message: '请选择人员' },
                ]}
              >
                <ButtonField />
              </Form.Item>
            </Form>
            <div className="mb-20 flex">
              <div className="w-2/12 text-right">
                <label className={styles.formLabel}>内容：</label>
              </div>
              <div className="w-8/12">
                <EditorField
                  ref={contentRef}
                  value={{
                    content: modifyData?.content || '',
                    files: modifyData?.files || [],
                  }} />
                {errorText && <div className="text-14 text-red-500">{errorText}</div>}
              </div>
            </div>
          </div>
          {footer ? footer() : (<div className={styles.footer}>
            <Button
              onClick={debounce(() => handleSubmit('draft'), 1000)}
              iconName="book"
              className='mr-20'
            >
              存草稿
            </Button>
            <Button
              className="bg-gray-700 mr-20"
              modifier="primary"
              onClick={handlePreviewAndPublish}
              iconName="send"
            >
              预览并发送
            </Button>
          </div>)}
        </div>
      </div>
      {openPreviewModal && (<Modal
        title='消息预览并发送'
        width={960}
        onClose={() => setOpenPreviewModal(false)}
        footerBtns={[
          {
            text: '取消',
            key: 'cancel',
            iconName: 'close',
            onClick: () => setOpenPreviewModal(false),
          },
          {
            text: '确定发送',
            key: 'confirm',
            iconName: 'done',
            modifier: 'primary',
            onClick: debounce(() => handleSubmit('send'), 1000),
          },
        ]}
      >
        <PreviewMsg
          className="p-20"
          prevData={prevData} isPreview canMultiDownload={false}
          canDownload={false} />
      </Modal>)}
    </div>
  );
}
export const Content = forwardRef(ContentWithoutRef);

export default SendMessage;
