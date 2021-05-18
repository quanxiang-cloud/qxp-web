import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import ReactDom from 'react-dom';
import cs from 'classnames';
import { debounce } from 'lodash';
import { toJS } from 'mobx';
import { useMutation, useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';
import { Form, Field, Label, Control, Radio, RadioGroup, Message, Upload } from '@QCFE/lego-ui';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { MsgType } from '@portal/modules/system-mgmt/constants';
import Button from '@c/button';
import Icon from '@c/icon';
import Modal from '@c/modal';
import Container from '../container';
import editorToolbarOptions from './editor-toolbar';
import PreviewMsg from './preview-msg';
import { createMsg } from '@portal/modules/system-mgmt/api';
import Filelist from './filelist';
import ModalSelectReceiver from '@c/employee-or-department-picker';

import styles from './index.module.scss';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useMemo } from 'react';

const { TextField } = Form;

interface FileInfo {
  url: string;
  filename: string;
  status?: 'success' | 'active' | 'exception';
  showProgress?: boolean;
  percentage?: number;
}

const SendMessage = () => {
  useEffect(() => {
    document.title = '消息管理 - 发送消息';
  }, []);

  return (
    <Container
      hideInfoCard
      asModalPage
      className={styles.wrap}
    >
      <Content />
    </Container>
  );
};

interface data {
  id?: string
  sort?: MsgType
  title?: string
  content?: any
  recivers?: Array<object>, // fixme: typo
  mes_attachment?: Array<FileInfo> | null
}

interface ContentProps {
  donotShowHeader?: boolean
  footer?: () => JSX.Element | null
  modifyData?: data
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
}: ContentProps, ref: React.Ref<unknown> | undefined ) {
  const [msgType, setMsgType] = useState( modifyData?.sort || MsgType.notify );
  const [title, setTitle] = useState( modifyData?.title || '' );
  const [prevData, setPrevData] = useState<Qxp.DraftData | null>(null);

  const [editorCont, setEditorCont] = useState( modifyData?.content ?
    EditorState.createWithContent(
      ContentState.createFromBlockArray(
        htmlToDraft(modifyData.content).contentBlocks)
    ) : EditorState.createEmpty());

  const [openReceiverModal, setOpenReceiverModal] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);

  const [_chosenDepOrPerson, setChosenDepOrPerson] = useState( modifyData?.recivers || [] ); // 已选中的员工或部门
  // @ts-ignore
  // eslint-disable-next-line max-len
  const [files, setFiles] = useState<Array<FileInfo>>((modifyData?.mes_attachment || []).map((itm: {file_name: string, file_url: string}) => ({
    filename: itm.file_name,
    url: itm.file_url,
    status: 'success',
  })));
  const chosenDepOrPerson = useMemo(()=>{
    // @ts-ignore
    return _chosenDepOrPerson.map(({ id, type, name, ownerName, departmentName }) => (
      { id, type, name: name || ownerName || departmentName }
    ));
  }, [_chosenDepOrPerson]);
  const [dom, setDom] = useState<Element|null>(null);

  const deleteFiles = (name: string) => {
    setFiles((curFiles) => curFiles.filter((file) => file.filename !== name ));
  };

  useEffect(()=>{
    setDom(document.getElementById('rdw-wrapper-8888'));
  }, []);

  const addFile = (file: FileInfo) => setFiles((currentFiles) => ([...currentFiles, file]));
  const updateFile = (name: string, data: Partial<FileInfo>)=> {
    setFiles((currentFiles) => {
      const curFile = currentFiles.find((f) => f.filename === name);
      Object.assign(curFile, data);
      return [...currentFiles];
    });
  };

  const queryClient = useQueryClient();
  const history = useHistory();

  // mutation create msg
  const createMsgMutation = useMutation(createMsg, {
    onSuccess: (data: any) => {
      if (data) {
        Message.success('操作成功');
        // todo: prefix all msg related query keys
        queryClient.invalidateQueries('msg-mgmt-msg-list');
        queryClient.invalidateQueries('count-unread-msg');
        handleClose && handleClose();
        setOpenPreviewModal(false);
        setTimeout(()=> {
          history.push('/system/message');
        }, 500);
      } else {
        Message.error('操作失败');
      }
      setOpenPreviewModal(false);
    },
    onError: (err: Error) => {
      Message.error(err.message);
    },
  });

  const handleChangeEditor = (editorState: EditorState) => {
    setEditorCont(editorState);
  };

  const getEditorCont = (cont: EditorState, asRaw?: boolean) => {
    const raw = convertToRaw(cont.getCurrentContent());
    // console.log('raw: ', raw);
    // console.log('html: ', draftToHtml(raw))
    return asRaw ? raw : draftToHtml(raw);
  };

  const isEditorEmpty = () => {
    const rawCont = getEditorCont(editorCont, true);
    return !rawCont.blocks.some((v: any) => !!String(v.text).trim());
  };

  const chooseReceiver = (departments: any[], employees: any[]) => {
    const receivers = [...departments, ...employees].map((d) => toJS(d));
    if (!receivers.length) {
      Message.warning('请至少选择一个员工或部门');
      return Promise.reject(false);
    }
    setOpenReceiverModal(false);
    // console.log('receivers: ', receivers);
    // @ts-ignore
    setChosenDepOrPerson(receivers);
    return Promise.resolve(true);
  };

  const removeReceiver = (key: number) => {
    // @ts-ignore
    setChosenDepOrPerson((current) => current.filter((_, idx)=>idx != key));
  };

  const validateForm = () => {
    if (!title) {
      Message.warning('请输入消息标题');
      return;
    }
    if (isEditorEmpty()) {
      Message.warning('消息内容不能为空');
      return;
    }
    if (!chosenDepOrPerson.length) {
      Message.warning('请选择发送人');
      return;
    }
    const formData = {
      type: msgType,
      title: title,
      content: getEditorCont(editorCont),
      receivers: chosenDepOrPerson,
    };

    // console.log('form data: ', formData);
    return formData;
  };

  const previewAndPublish = () => {
    const validata = validateForm();
    if (!validata) return;
    const formData = Object.assign({}, validata, { mes_attachment: files.map((itm)=>{
      return {
        file_name: itm.filename,
        file_url: itm.url,
      };
    }).filter(Boolean) });
    if (formData) {
      // @ts-ignore
      setPrevData(formData);
      setOpenPreviewModal(true);
    }
  };

  const confirmSend = (send = true) => {
    const params = {
      template_id: 'quanliang',
      // @ts-ignore
      title: prevData.title || '',
      args: [{
        key: 'code',
        value: prevData?.content || '',
      }],
      channel: 'letter', // letter: 站内信，email: 邮件
      type: 2, // 1. verifycode 2、not verifycode
      // @ts-ignore
      sort: prevData.type,
      is_send: send, // false: 保存为草稿
      // @ts-ignore
      recivers: prevData.receivers,
      mes_attachment: files.map((itm)=>{
        return {
          file_name: itm.filename,
          file_url: itm.url,
        };
      }).filter(Boolean),
      //     url: string
      // filename:
    };
    // @ts-ignore
    if (modifyData) params.id = modifyData.id;

    createMsgMutation.mutate(params);
  };

  const saveDraft = (options?: {toParams?: boolean}) => {
    const formData = validateForm();
    if (formData) {
      const params = {
        id: modifyData?.id,
        template_id: 'quanliang',
        // @ts-ignore
        title: formData.title || '',
        args: [{
          key: 'code',
          value: formData?.content || '',
        }],
        channel: 'letter', // letter: 站内信，email: 邮件
        type: 2, // 1. verifycode 2、not verifycode
        // @ts-ignore
        sort: formData.type,
        is_send: false, // false: 保存为草稿
        // @ts-ignore
        recivers: formData.receivers,
        mes_attachment: files.map((itm)=>{
          return {
            file_name: itm.filename,
            file_url: itm.url,
          };
        }).filter(Boolean),
      };
      if (options?.toParams) {
        return params;
      }
      // @ts-ignore
      createMsgMutation.mutate(params);
    }
  };

  const getCurrentFiles = ()=> {
    return [...files];
  };

  // @ts-ignore
  const handleFileSuccessUpload = (res) => {
    if (res.code == 200) {
      updateFile(res.data.filename, {
        filename: res.data.filename,
        url: res.data.url,
        percentage: 100,
        status: 'success',
        showProgress: false,
      });
    } else {
      Message.warning('上传失败');
    }
  };

  useImperativeHandle(ref, ()=>{
    return {
      saveDraft,
      previewAndPublish,
      getCurrentFiles,
    };
  });

  return (
    <div className={cs('w-full', className)}>
      <div className={styles.panel}>
        {!donotShowHeader && (<div className={styles.header}>
          <div className={styles.title}>发送消息</div>
        </div>)}
        <div className={cs('send-msg-body', styles.body)}>
          <Form>
            <Field>
              <Label>消息类型:</Label>
              <Control>
                <RadioGroup name='type' value={msgType} onChange={setMsgType}>
                  <Radio value={MsgType.notify}>通知公告</Radio>
                  <Radio value={MsgType.system}>系统消息</Radio>
                </RadioGroup>
              </Control>
            </Field>
            <TextField
            // @ts-ignore
              validateOnBlur
              validateOnChange
              name="title"
              label="标题:"
              placeholder="请输入消息标题"
              help='不超过 50 个字符。'
              maxLength={50}
              value={title}
              onChange={setTitle}
              schemas={[
                {
                  rule: { required: true },
                  help: '标题不能为空 ',
                },
              ]}
            />
            <Field>
              <Label className={styles.labelCont}>内容:</Label>
              <Control>
                <Editor
                  wrapperId={8888}
                  editorState={editorCont}
                  wrapperClassName={styles.editorWrap}
                  editorClassName={styles.editor}
                  onEditorStateChange={handleChangeEditor}
                  // onContentStateChange={handleChangeEditor}
                  toolbar={editorToolbarOptions}
                  placeholder='在此输入正文'
                  localization={{
                    locale: 'zh',
                  }}
                />
              </Control>
            </Field>
            <Field>
              <Label>发送至:</Label>
              <Control>
                <Button
                  onClick={() => setOpenReceiverModal(true)}
                  iconName="add"
                >
                选择
                </Button>
              </Control>
            </Field>
          </Form>

          {dom && ReactDom.createPortal(
            <div className={styles.upload_warp}>
              <Filelist
                candownload
                deleteFiles={deleteFiles}
                files={files.map((itm) => ({
                  file_url: itm.url,
                  file_name: itm.filename,
                  percent: itm.percentage,
                  showProgress: itm.showProgress,
                  status: itm.status,
                }))}
              />
              <Upload
                headers={{ 'X-Proxy': 'API' }}
                multiple
                action="/api/v1/fileserver/uploadFile"
                beforeUpload={(file)=> {
                  if (file.size > 1024 * 1024 * 5) {
                    Message.error('文件大小不能超过5M');
                    return false;
                  }
                  if (files.find((f) => f.filename === file.name)) {
                    Message.warning('文件已存在，请勿重复上传');
                    return false;
                  }
                  return true;
                }}
                onStart={(file)=> {
                  addFile({
                    filename: file.name,
                    url: '',
                    percentage: 0,
                    showProgress: true,
                    status: 'active',
                  });
                }}
                onProgress={(step, file)=> {
                  // @ts-ignore
                  const percent = typeof step.percent === 'number' ? Math.round(step.percent) : 0;
                  updateFile(file.name, {
                    percentage: percent,
                    showProgress: true,
                  });
                }}
                onSuccess={handleFileSuccessUpload}
                onError={(err)=> Message.error(err.message)}
              >
                <div className={`${styles.upload} flex align-center`}>
                  <Icon name="attachment" />
                  <div>上传附件</div>
                </div>
              </Upload>
            </div>,
            dom
          )}

          <div className={styles.chosenPersons}>
            {/* @ts-ignore */}
            {chosenDepOrPerson.map(({ id, name, type }: Qxp.MsgReceiver, key) => {
              return (
                <span className={cs(styles.person, {
                  [styles.isDep]: type === 2,
                  [styles.isPerson]: type === 1,
                })} key={id}>
                  <span>{name}</span>
                  <Icon name='close' className={styles.close} onClick={() => removeReceiver(key)} />
                </span>
              );
            })}
          </div>
          { footer ? footer() : (<div className={styles.footer}>
            <Button
              // @ts-ignore
              onClick={debounce(saveDraft, 1000)}
              iconName="book"
              className='mr-20'
            >
            存草稿
            </Button>
            <Button
              className="bg-gray-700 mr-20"
              modifier="primary"
              onClick={previewAndPublish}
              iconName="send"
            >
            预览并发送
            </Button>
          </div>)}
        </div>
      </div>

      {openReceiverModal && (
        <ModalSelectReceiver
          onSubmit={chooseReceiver}
          onCancel={() => setOpenReceiverModal(false)}
          title="选择员工或部门"
          submitText="确定选择"
          // @ts-ignore
          departments={_chosenDepOrPerson.filter((itm)=>itm.type == 2)}
          // @ts-ignore
          employees={_chosenDepOrPerson.filter((itm)=>itm.type == 1)}
        />
      )}
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
            onClick: debounce(()=>confirmSend(true), 1000),
          },
        ]}
      >
        <PreviewMsg prevData={prevData} isPreview canMultiDownload={false} canDownload={false}/>
      </Modal>)}
    </div>);
}
export const Content = forwardRef(ContentWithoutRef);

export default SendMessage;
