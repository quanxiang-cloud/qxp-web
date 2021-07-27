import React, { useEffect, useState, useContext } from 'react';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { useUpdateEffect, usePrevious } from 'react-use';
import { useQuery } from 'react-query';
import { isEqual } from 'lodash';
import { Upload } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import {
  EditorState,
  convertToRaw,
  ContentState,
  Modifier,
  SelectionState,
} from 'draft-js';

import MoreMenu from '@c/more-menu';
import { getFormFieldSchema } from '@flowEditor/forms/api';
import FlowContext from '@flow/flow-context';
import formFieldWrap from '@c/form-field-wrap';
import useObservable from '@lib/hooks/use-observable';
import store from '@flowEditor/store';
import Button from '@c/button';
import { Editor } from 'react-draft-wysiwyg';
import SaveButtonGroup from '@flowEditor/components/_common/action-save-button-group';
import type { StoreValue, CurrentElement, FormDataData, SendEmailData, Attachment } from '@flowEditor/type';

import UserSelect from '../../components/add-approval-user';
import './index.scss';

type Props = {
  onSubmit: (v: SendEmailData) => void;
  onChange: (v: SendEmailData) => void;
  onCancel: () => void;
  defaultValue: SendEmailData;
}

type FieldOPType = {
  onChange: (editorCont: EditorState) => void;
  editorState: EditorState;
  options: { label: string | React.ReactNode, key: string }[];
}

const props = {
  name: 'file',
  action: '/api/v1/fileserver/uploadFile',
  headers: {
    'X-Proxy': 'API',
  },
};

const Input = formFieldWrap({ field: <input className='input' /> });
const FieldEditor = formFieldWrap({ FieldFC: Editor });

const FieldUserSelect = formFieldWrap({ FieldFC: UserSelect });

function FieldOption({ onChange, editorState, options }: FieldOPType): JSX.Element {
  const insertText = (text: string, hasSpacing = true): void => {
    let contentState = editorState.getCurrentContent();
    let selection = editorState.getSelection();
    let textTmp = '${' + text + '}';
    if (hasSpacing) {
      textTmp += ' ';
    }

    if (selection.isCollapsed()) {
      contentState = Modifier.insertText(contentState, selection, textTmp);
    } else {
      contentState = Modifier.replaceText(contentState, selection, textTmp);
    }

    let newEditorState = EditorState.set(editorState, { currentContent: contentState });
    selection = selection.merge({
      anchorOffset: selection.getAnchorOffset() + textTmp.length,
      focusOffset: selection.getFocusOffset() + textTmp.length,
    }) as SelectionState;

    newEditorState = EditorState.forceSelection(newEditorState, selection);
    onChange(newEditorState);
  };

  return (
    <MoreMenu
      menus={options}
      onMenuClick={(menuKey) => {
        insertText(menuKey);
      }}
    >
      <div className='rdw-option-wrapper'>表单字段选择</div>
    </MoreMenu>
  );
}

function SendEmailConfig({ defaultValue, onSubmit, onCancel, onChange }: Props): JSX.Element {
  const { register, handleSubmit, control, reset, formState: { errors }, watch } = useForm();
  const { appID } = useContext(FlowContext);
  const [editorCont, setEditorCont] = useState(defaultValue?.content ?
    EditorState.createWithContent(
      ContentState.createFromBlockArray(
        htmlToDraft(defaultValue.content).contentBlocks),
    ) : EditorState.createEmpty());
  const { elements = [] } = useObservable<StoreValue>(store);
  const formDataElement = elements?.find(({ type }) => type === 'formData') as CurrentElement;
  const workFormValue = (formDataElement?.data?.businessData as FormDataData)?.form?.value;

  const allFields = watch(['content', 'recivers', 'title', 'mes_attachment']);
  const previousFields = usePrevious(allFields);
  useUpdateEffect(() => {
    const value = {
      content: allFields[0],
      recivers: allFields[1],
      title: allFields[2],
      mes_attachment: allFields[3],
      templateId: 'quanliang',
    } as SendEmailData;
    if (!isEqual(allFields, previousFields)) {
      onChange(value);
    }
  }, [allFields]);

  const { data: schema = {} } = useQuery(
    ['GET_WORK_FORM_FIELD_SCHEMA', workFormValue, appID],
    getFormFieldSchema, {
      enabled: !!workFormValue && !!appID,
    },
  );

  const getEditorCont = (cont: EditorState, asRaw?: boolean): any => {
    const raw = convertToRaw(cont.getCurrentContent());
    return asRaw ? raw : draftToHtml(raw);
  };

  const handleSave = (data: SendEmailData): void => {
    onSubmit({ ...data, templateId: 'quanliang' });
  };
  const handleChangeEditor = (editorCont: EditorState): void => {
    setEditorCont(editorCont);
  };

  const handleCancel = (): void => {
    onCancel();
  };

  useEffect(() => {
    reset(defaultValue);
  }, []);

  const fieldOption = React.useMemo(() => {
    return Object.entries(schema?.properties || {}).filter(([key]) => {
      return key !== '_id';
    }).map(([key, filedSchema]) => {
      return { label: filedSchema.title, key };
    });
  }, [schema]);

  return (
    <div className="flex flex-col overflow-auto flex-1 py-24">
      {/* <Controller
        name='qd'
        control={control}
        defaultValue='issuing'
        rules={{ required: '请选择发送渠道' }}
        render={({ field }) => {
          return (
            <FieldSelect
              disabled
              label={<><span className='text-red-600'>*</span>发送渠道</>}
              register={field}
              options={[{ label: '由青云代发', value: 'issuing' }]}
            />
          );
        }
        }
      /> */}
      <Controller
        name='recivers'
        control={control}
        rules={{ required: '请选择接收对象' }}
        render={({ field }) => {
          return (
            <FieldUserSelect
              label={<><span className='text-red-600'>*</span>接收对象</>}
              error={errors.recivers}
              register={field}
              value={field.value ? field.value : []}
            />
          );
        }
        }
      />
      <Input
        label={<><span className='text-red-600'>*</span>主题</>}
        placeholder='请输入'
        defaultValue={defaultValue?.title || ''}
        error={errors.title}
        register={register('title', { required: '请输入主题' })}
      />
      <Controller
        name='content'
        control={control}
        rules={{ required: '请填写邮件正文' }}
        render={({ field }) => {
          return (
            <FieldEditor
              label={<><span className='text-red-600'>*</span>正文</>}
              wrapperClassName='web-message-editor-wrapper'
              editorClassName='web-message-editor'
              placeholder='在此输入正文'
              editorState={editorCont}
              toolbarCustomButtons={[
                <FieldOption
                  key='fieldOption'
                  options={fieldOption}
                  onChange={handleChangeEditor}
                  editorState={editorCont}
                />,
              ]}
              localization={{
                locale: 'zh',
              }}
              register={{}}
              onEditorStateChange={(_editorCont: EditorState) => {
                handleChangeEditor(_editorCont);
                field.onChange(getEditorCont(_editorCont));
              }}
              error={errors.content}
            />
          );
        }
        }
      />
      <div style={{ display: 'block' }} className='form-field-label'>附件</div>
      <Controller
        name='mes_attachment'
        control={control}
        render={({ field }) => {
          return (
            <Upload
              {...props}
              defaultFileList={
                (defaultValue?.mes_attachment || []).map(({ file_name, file_url }: Attachment) => {
                  return {
                    uid: file_url,
                    name: file_name,
                    status: 'done',
                    url: file_url,
                  };
                })
              }
              onChange={(info) => {
                field.onChange(info.fileList.filter(({ status }) => {
                  return status === 'done';
                }).map(({ name, response }) => {
                  return {
                    file_name: name,
                    file_url: response.data.url,
                  };
                }));
              }}>
              <Button className='block'>上传</Button>
            </Upload>
          );
        }
        }
      />
      <SaveButtonGroup onCancel={handleCancel} onSave={handleSubmit(handleSave)} />
    </div>
  );
}

export default SendEmailConfig;
