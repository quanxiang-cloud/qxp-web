import React, { useEffect, useState, useContext, useMemo, useRef } from 'react';
import { usePrevious, useUpdateEffect } from 'react-use';
import { get, isEqual } from 'lodash';
import { useForm, Controller } from 'react-hook-form';
import formFieldWrap from '@c/form-field-wrap';
import { OSS_PUBLIC_BUCKET_NAME, OSS_DOMAIN } from '@c/file-upload/constants';
import SaveButtonGroup from '@flow/content/editor/components/_common/action-save-button-group';
import type {
  SendEmailData,
  Attachment,
} from '@flow/content/editor/type';
import { SYSTEM_FIELDS } from '@c/form-builder/constants';
import FileUploader from '@c/file-upload';

import PersonPicker from '../../components/_common/person-picker';
import { approvePersonEncoder } from '../../components/_common/utils';
import FlowTableContext from '../flow-source-table';
import QuillEditor from './quill-editor';
import { isAdvancedField } from '../utils';

import './index.scss';

type Props = {
  onSubmit: (v: SendEmailData) => void;
  onChange: (v: SendEmailData) => void;
  onCancel: () => void;
  defaultValue: SendEmailData;
}

const Input = formFieldWrap({ field: <input className='input' /> });
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

function SendEmailConfig({ defaultValue, onSubmit, onCancel, onChange }: Props): JSX.Element {
  const approvePersons = approvePersonEncoder(defaultValue);
  const defaultValueEncode = {
    approvePersons,
    content: defaultValue.content,
    templateId: defaultValue.templateId,
    title: defaultValue.title,
    mes_attachment: defaultValue.mes_attachment,
  };
  const editorRef = useRef<any>(null);
  const [editorVal, setEditorVal] = useState(defaultValueEncode.content);
  const [editorSize, setEditorSize] = useState(0);
  const [errorText, setErrorText] = useState('');
  const [files, setFiles] = useState(setFileParams(defaultValueEncode?.mes_attachment));
  const { register, handleSubmit, control, reset, formState: { errors }, watch } = useForm();
  const allFields = watch([
    'content',
    'recivers',
    'title',
    'mes_attachment',
    'type',
    'approvePersons',
    'formulaFields',
    'fieldType',
  ]);
  const previousFields = usePrevious(allFields);
  const { tableSchema } = useContext(FlowTableContext);
  const formulaFields = useMemo(() => tableSchema.filter((schema) => {
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
  const fieldType = useMemo(() => tableSchema.filter((schema) => {
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

  const mesAttachment = useMemo(()=>{
    const domain = `${window.location.protocol}//${OSS_PUBLIC_BUCKET_NAME}.${OSS_DOMAIN}`;
    return files.map(({ name, uid })=>({ file_name: name, file_url: `${domain}/${uid}` }));
  }, [files]);

  const handleSave = (data: any): void => {
    const content = editorRef.current.getInnerHTML();
    const bol = handleValidate();
    if (!bol) return;
    onSubmit({
      ...data,
      content,
      templateId: 'quanliang',
      formulaFields,
      fieldType,
      mes_attachment: mesAttachment });
  };

  const surplusEditor = useMemo(()=>{
    const context = { content: editorVal, mes_attachment: mesAttachment };
    const size = new Blob([JSON.stringify(context)]).size;
    return size;
  }, [editorVal, mesAttachment]);

  function handleValidate(): boolean {
    const _content = editorRef.current.getContent();

    if (_content === '<br>') {
      setErrorText('请输入内容');
      return false;
    }

    if (_content.trim() === '') {
      setErrorText('消息内容不能为空');
      return false;
    }

    if (surplusEditor > 5000) {
      setErrorText('消息内容不能超过5000B');
      return false;
    }

    setErrorText('');
    return true;
  }

  function setFileParams(files?: Attachment[]): QXPUploadFileTask[] {
    if (!files || !files.length) return [];
    return files.map(({ file_name, file_url })=>{
      const isProtocol = file_url.startsWith('http');
      return {
        type: '',
        size: 0,
        name: file_name,
        uid: (isProtocol ? file_url.split('/').slice(-2).join('/') : file_url) as string,
      };
    });
  }

  const handleCancel = (): void => {
    onCancel();
  };

  useEffect(() => {
    reset(defaultValueEncode);
  }, []);

  useEffect(()=>{
    setEditorSize(surplusEditor);
  }, [surplusEditor]);

  const contentVariables = React.useMemo(() => {
    return tableSchema.filter(({ type, componentName }) => {
      return !isAdvancedField(type, componentName);
    }).map((field) => {
      return { label: field.title as string, key: field.id };
    });
  }, [tableSchema]);

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
      <div className="mb-20">
        <label className='form-field-label'>
          <span className="text-red-600">*</span>
          内容
        </label>
        <QuillEditor
          ref={editorRef}
          value={defaultValueEncode?.content || ''}
          contentVariables={contentVariables}
          onChange={setEditorVal}
        >
          <span className='editor-size'>内容大小: <em>{editorSize}</em>/5000B</span>
        </QuillEditor>
        {errorText && <div className="text-14 text-red-500">{errorText}</div>}
      </div>
      <div style={{ display: 'block' }} className='form-field-label'>附件</div>
      <Controller
        name='mes_attachment'
        control={control}
        render={() => {
          return (
            <FileUploader
              multiple={true}
              fileData={files}
              className='px-40 form-upload'
              maxFileSize={20}
              onFileDelete={(val)=>setFiles((list)=>list.filter((item)=>item.name !== val.name))}
              onFileSuccess={(fileDetail: QXPUploadFileTask) => setFiles((list)=>[...list, fileDetail])}
            />
          );
        }
        }
      />
      <SaveButtonGroup onCancel={handleCancel} onSave={handleSubmit(handleSave)} />
    </div>
  );
}

export default SendEmailConfig;
