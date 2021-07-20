import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Editor } from 'react-draft-wysiwyg';
import { Radio } from 'antd';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import formFieldWrap from '@c/form-field-wrap';
import SaveButtonGroup from '@flowEditor/components/_common/action-save-button-group';

import UserSelect from '../../components/add-approval-user';
import { WebMessageData } from '../../type';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './index.css';

type Props = {
  onSubmit: (v: WebMessageData) => void;
  onCancel: () => void;
  defaultValue: WebMessageData;
}

const Input = formFieldWrap({ field: <input className='input' /> });
const FieldUserSelect = formFieldWrap({ FieldFC: UserSelect });
const FieldRadio = formFieldWrap({ FieldFC: Radio.Group });

function WebMessage({ defaultValue, onSubmit, onCancel }: Props): JSX.Element {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm();
  const [editorCont, setEditorCont] = useState(defaultValue?.content ?
    EditorState.createWithContent(
      ContentState.createFromBlockArray(
        htmlToDraft(defaultValue.content).contentBlocks),
    ) : EditorState.createEmpty());

  const getEditorCont = (cont: EditorState, asRaw?: boolean) => {
    const raw = convertToRaw(cont.getCurrentContent());
    return asRaw ? raw : draftToHtml(raw);
  };

  const handleSave = (data: WebMessageData): void => {
    onSubmit(data);
  };

  const handleChangeEditor = (editorState: EditorState): void => {
    setEditorCont(editorState);
  };

  const handleCancel = (): void => {
    onCancel();
  };

  useEffect(() => {
    reset(defaultValue);
  }, []);

  return (
    <div className="flex flex-col overflow-auto flex-1 py-24">
      <Controller
        name='recivers'
        control={control}
        rules={{ required: '请选择接收对象' }}
        render={({ field }) => {
          return (
            <FieldUserSelect
              label={<><span className='text-red-600'>*</span>接收对象</>}
              register={field}
              error={errors.recivers}
              value={field.value ? field.value : []}
            />
          );
        }
        }
      />
      <Controller
        name='sort'
        control={control}
        rules={{ required: '请选择消息类型' }}
        render={({ field }) => {
          return (
            <FieldRadio
              label={<><span className='text-red-600'>*</span>消息类型</>}
              className='block'
              error={errors.sort}
              register={field}
              options={[
                { label: '通知公告', value: '2' },
                { label: '系统消息', value: '1' },
              ]}
              value={field.value ? field.value : ''}
            />
          );
        }
        }
      />
      <Input
        label={<><span className='text-red-600'>*</span>标题</>}
        defaultValue={defaultValue?.title || ''}
        placeholder='请输入'
        error={errors.title}
        register={register('title', { required: '请输入标题' })}
      />
      <div className='form-field-label'>消息内容</div>
      <Controller
        name='content'
        control={control}
        render={({ field }) => {
          return (
            <Editor
              wrapperClassName='web-message-editor-wrapper'
              editorClassName='web-message-editor'
              editorState={editorCont}
              onEditorStateChange={(editorState) => {
                handleChangeEditor(editorState);
                field.onChange(getEditorCont(editorState));
              }}
              placeholder='在此输入正文'
              localization={{
                locale: 'zh',
              }}
            />
          );
        }
        }
      />
      <SaveButtonGroup onCancel={handleCancel} onSave={handleSubmit(handleSave)} />
    </div>
  );
}

export default WebMessage;
