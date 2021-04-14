import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import ReactDom from 'react-dom';
import classNames from 'classnames';
import { get } from 'lodash';
import { toJS } from 'mobx';
import { useMutation, useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';
import { Form, Field, Label, Control, Radio, RadioGroup, Message, Upload, Modal } from '@QCFE/lego-ui';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { MsgType } from '@portal/const/message';
import Button from '@c/button';
import Icon from '@c/icon';
import Container from '../container';
import editorToolbarOptions from './editor-toolbar';
import ModalSelectReceiver from './dialog-select-receiver';
import PreviewMsg from './preview-msg';
import { usePortalGlobalValue } from '@portal/states_to_be_delete/portal';
import { createMsg } from '@lib/requests/message-mgmt';
import Filelist from './filelist';

import styles from './index.module.scss';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useMemo } from 'react';

const { TextField } = Form;

const noop = () => {};

interface Props {
  className?: string;
}

interface FileInfo {
  url: string
  filename: string
}

const SendMessage = (props: Props) => {
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
  type?: MsgType
  title?: string
  content?: any
  receivers?: Array<object>,
  mes_attachment?: Array<FileInfo> | null
}

interface ContentProps {
  donotShowHeader?: boolean
  footer?: () => JSX.Element | null
  modifyData?: data
  handleClose?: () => void
}

export const Content = forwardRef(({ donotShowHeader, footer, modifyData, handleClose }: ContentProps, ref ) => {
  
  const [msgType, setMsgType] = useState( modifyData?.type || MsgType.notify );
  const [title, setTitle] = useState( modifyData?.title || '' );
  const [prevData, setPrevData] = useState<Qxp.DraftData | null>(null);

  const [editorCont, setEditorCont] = useState( modifyData?.content ? EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(modifyData.content).contentBlocks)) : EditorState.createEmpty());

  const [openReceiverModal, setOpenReceiverModal] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);

  const [_chosenDepOrPerson, setChosenDepOrPerson] = useState( modifyData?.receivers || [] ); // 已选中的员工或部门
  const [{ userInfo }] = usePortalGlobalValue();
  // @ts-ignore
  const [files, setFiles] = useState<Array<FileInfo>>( (modifyData?.mes_attachment || []).map((itm)=>({ filename: itm.file_name, fileurl: itm.file_url })) );
  const chosenDepOrPerson = useMemo(()=>{
    // @ts-ignore
    return _chosenDepOrPerson.map(({ id, type, ownerName, departmentName }) => ({ id, type, name: ownerName || departmentName }))
  },[_chosenDepOrPerson]) 
  const [dom, setDom] = useState<Element|null>(null);

  const deleteFiles = (idx: number) => {
    setFiles(current => current.filter((_, key) => key!=idx ))
  }

  useEffect(()=>{
    setDom(document.getElementById('rdw-wrapper-8888'));
  }, []);

  const addFile = (fileUrl: FileInfo) => setFiles((currentFiles) => ([...currentFiles, fileUrl]));

  const roleId = get(userInfo, 'roles[0].roleID', '3'); // fixme

  const queryClient = useQueryClient();
  const history = useHistory();

  // mutation create msg
  const createMsgMutation = useMutation(createMsg, {
    onSuccess: (data: any) => {
      if (data && data.code === 0) {
        Message.success('操作成功');
        queryClient.invalidateQueries('msg-mgmt-msg-list');
        handleClose && handleClose();
        setOpenPreviewModal(false)
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

  const chooseReceiver = (data: any) => {
    const receivers = [].concat(data).map((d) => toJS(d));
    if (!receivers.length) {
      Message.warning('请至少选择一个员工或部门');
      return;
    }
    setOpenReceiverModal(false);
    // console.log('receivers: ', receivers);
    // @ts-ignore
    setChosenDepOrPerson(receivers);
  };


  const removeReceiver = (key: number) => {
    // @ts-ignore
    setChosenDepOrPerson(current => current.filter((_,idx)=>idx!=key));
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
    }
    // @ts-ignore
    if(modifyData) params.id = modifyData.id

    createMsgMutation.mutate(params);
  };

  const saveDraft = () => {
    const formData = validateForm();
    if (formData) {
      createMsgMutation.mutate({
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
      });
    }
  };

  // @ts-ignore
  const handleFileSuccessUpload = (response) => {
    if (response.code == 200) {
      addFile({
        filename: response.data.filename,
        url: response.data.url,
      });
    } else {
      Message.warning('上传失败');
    }
  };

  useImperativeHandle(ref, ()=>{
    return {
      saveDraft, previewAndPublish,
    };
  });

  return (<div className="full-width">
    <div className={styles.panel}>
      {!donotShowHeader&&(<div className={styles.header}>
        <div className={styles.title}>发送消息</div>
      </div>)}
      <div className={styles.body}>
        <Form onSubmit={noop}>
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
            <Label>内容:</Label>
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
          {dom && ReactDom.createPortal(
            <div className={styles.upload_warp}>
              <Filelist candownload deleteFiles={deleteFiles} files={files.map((itm)=>({ file_url: itm.url, file_name: itm.filename }))} />
              <Upload headers={{'X-Proxy':'API'}} onSuccess={handleFileSuccessUpload} multiple action="/api/v1/fileserver/uploadFile">
                <div className={`${styles.upload} flex align-center`}>
                  <Icon name="attachment" />
                  <div>上传附件</div>
                </div>
              </Upload>
            </div>,
            dom
          )}

        </Form>

        <div className={styles.chosenPersons}>
          {chosenDepOrPerson.map(({ id, name, type }: Qxp.MsgReceiver,key) => {
            return (
              <span className={classNames(styles.person, {
                [styles.isDep]: type === 2,
                [styles.isPerson]: type === 1,
              })} key={id}>
                <span>{name}</span>
                <Icon name='close' className={styles.close} onClick={() => removeReceiver(key)} />
              </span>
            );
          })}
        </div>
      </div>
      { footer ? footer() : (<div className={styles.footer}>
        <Button
          onClick={saveDraft}
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
    <ModalSelectReceiver
      onOk={chooseReceiver}
      onCancel={() => setOpenReceiverModal(false)}
      visible={openReceiverModal}
      roleID={roleId}
      // @ts-ignore
      picked={_chosenDepOrPerson}
    />
    <Modal
      visible={openPreviewModal}
      className={`${styles.previewModal} ddddd`}
      title='消息预览并发送'
      width={960}
      onCancel={() => setOpenPreviewModal(false)}
      footer={(
        <div className="flex flex-row justify-between items-center">
          <Button
            className="bg-white hover:bg-gray-100 transition cursor-pointer mr-20 mb-0"
            iconName="close"
            onClick={() => setOpenPreviewModal(false)}
          >
            取消
          </Button>
          <Button
            className="bg-gray-700 hover:bg-gray-900 transition cursor-pointer mb-0"
            modifier="primary"
            iconName="done"
            onClick={()=>confirmSend(true)}
          >
            确定发送
          </Button>
        </div>
      )}
    >
      <PreviewMsg prevData={prevData}/>
    </Modal>
  </div>);
});

export default SendMessage;
