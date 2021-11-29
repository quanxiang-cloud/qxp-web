import React, { useEffect, useState, useContext, useMemo } from 'react';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { usePrevious, useUpdateEffect } from 'react-use';
import { useQuery } from 'react-query';
import { get, isEqual } from 'lodash';
import { Upload } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import {
  EditorState,
  convertToRaw,
  ContentState,
  Modifier,
  SelectionState,
} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';

import MoreMenu from '@c/more-menu';
import { getFormFieldSchema } from '@flow/content/editor/forms/api';
import FlowContext from '@flow/flow-context';
import formFieldWrap from '@c/form-field-wrap';
import useObservable from '@lib/hooks/use-observable';
import store from '@flow/content/editor/store';
import Button from '@c/button';
import SaveButtonGroup from '@flow/content/editor/components/_common/action-save-button-group';
import type {
  StoreValue,
  CurrentElement,
  FormDataData,
  SendEmailData,
  Attachment,
} from '@flow/content/editor/type';
import schemaToFields from '@lib/schema-convert';
import { SYSTEM_FIELDS } from '@c/form-builder/constants';

import PersonPicker from '../../components/_common/person-picker';
import { approvePersonEncoder } from '../../components/_common/utils';
import FlowTableContext from '../flow-source-table';

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
const LablePathMap = {
  // AssociatedRecords: '', // string[]
  UserPicker: '[].label', // {label, value}[]
  OrganizationPicker: '[].label',
  FileUpload: '[].label',
  ImageUpload: '[].label',
  CascadeSelector: 'label',
  AssociatedData: 'label',
};
const VerCompontType = ['fileupload', 'datepicker'];

function getFieldLabelPath(fieldSchema?: ISchema): string {
  if (!fieldSchema) {
    return '';
  }
  return get(LablePathMap, fieldSchema['x-component'] || '', '');
}

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
  const approvePersons = approvePersonEncoder(defaultValue);
  const defaultValueEncode = {
    approvePersons,
    content: defaultValue.content,
    templateId: defaultValue.templateId,
    title: defaultValue.title,
    mes_attachment: defaultValue.mes_attachment,
  };
  const { register, handleSubmit, control, reset, formState: { errors }, watch } = useForm();
  const { appID } = useContext(FlowContext);
  const [editorCont, setEditorCont] = useState(defaultValueEncode?.content ?
    EditorState.createWithContent(
      ContentState.createFromBlockArray(
        htmlToDraft(defaultValueEncode.content).contentBlocks),
    ) : EditorState.createEmpty());
  const { elements = [] } = useObservable<StoreValue>(store);
  const formDataElement = elements?.find(({ type }) => type === 'formData') as CurrentElement;
  const workFormValue = (formDataElement?.data?.businessData as FormDataData)?.form?.value;
  const allFields = watch(
    ['content', 'recivers', 'title', 'mes_attachment', 'type', 'approvePersons', 'formulaFields',
      'fieldType'],
  );
  const previousFields = usePrevious(allFields);
  const { tableSchema } = useContext(FlowTableContext);
  const formulaFields = useMemo(()=> tableSchema.filter((schema) => {
    return !SYSTEM_FIELDS.includes(schema.fieldName);
  }).reduce((acc: Record<string, string>, field) => {
    const labelPath = getFieldLabelPath(field);
    if (labelPath) {
      const { fieldName } = field;
      acc[fieldName] = [fieldName, labelPath].join('.');
    }
    return acc;
  }, {}), [tableSchema]);

  // This field is required by the backend
  const fieldType = useMemo(()=> tableSchema.filter((schema) => {
    return !SYSTEM_FIELDS.includes(schema.fieldName);
  }).reduce((acc: Record<string, string>, field) => {
    if (VerCompontType.includes(field.componentName)) {
      const { fieldName } = field;
      acc[fieldName] = field.componentName;
    }
    return acc;
  }, {}), [tableSchema]);

  useUpdateEffect(() => {
    const value = {
      content: allFields[0],
      recivers: allFields[1],
      title: allFields[2],
      mes_attachment: allFields[3],
      type: allFields[4],
      templateId: 'quanliang',
      approvePersons: allFields[5],
      formulaFields: allFields[6],
      fieldType: allFields[7],
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
    onSubmit({ ...data, templateId: 'quanliang', formulaFields, fieldType });
  };
  const handleChangeEditor = (editorCont: EditorState): void => {
    setEditorCont(editorCont);
  };

  const handleCancel = (): void => {
    onCancel();
  };

  useEffect(() => {
    reset(defaultValueEncode);
  }, []);

  const fieldOption = React.useMemo(() => {
    return schemaToFields(schema).filter((field) => field.id !== '_id').map((field) => {
      return { label: field.title, key: field.id };
    });
  }, [schema]);

  return (
    <div className="flex flex-col overflow-auto flex-1 py-24">
      <Controller
        name='approvePersons'
        control={control}
        rules={{ required: '请选择接收对象' }}
        defaultValue={approvePersons}
        render={({ field }) => {
          return (
            <PersonPicker
              typeText='接收对象'
              value={field.value}
              onChange={field.onChange}
            />
          );
        }}
      />
      <Input
        label={<><span className='text-red-600'>*</span>主题</>}
        placeholder='请输入'
        defaultValue={defaultValueEncode?.title || ''}
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
                (defaultValueEncode?.mes_attachment || []).map(({ file_name, file_url }: Attachment) => {
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
