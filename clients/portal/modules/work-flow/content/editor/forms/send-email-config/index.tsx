import React, { useEffect, useState, useContext, useMemo, useRef } from 'react';
import { usePrevious, useUpdateEffect } from 'react-use';
import { useQuery } from 'react-query';
import { get, isEqual } from 'lodash';
import { Upload } from 'antd';
import { useForm, Controller } from 'react-hook-form';

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
import QuillEditor from './quill-editor';

import './index.scss';

type Props = {
  onSubmit: (v: SendEmailData) => void;
  onChange: (v: SendEmailData) => void;
  onCancel: () => void;
  defaultValue: SendEmailData;
}

const props = {
  name: 'file',
  action: '/api/v1/fileserver/uploadFile',
  headers: {
    'X-Proxy': 'API',
  },
};

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
  const [errorText, setErrorText] = useState('');
  const { register, handleSubmit, control, reset, formState: { errors }, watch } = useForm();
  const { appID } = useContext(FlowContext);
  const { elements = [] } = useObservable<StoreValue>(store);
  const formDataElement = elements?.find(({ type }) => type === 'formData') as CurrentElement;
  const workFormValue = (formDataElement?.data?.businessData as FormDataData)?.form?.value;
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

  const { data: schema = {} } = useQuery(
    ['GET_WORK_FORM_FIELD_SCHEMA', workFormValue, appID],
    getFormFieldSchema, {
      enabled: !!workFormValue && !!appID,
    },
  );

  const handleSave = (data: any): void => {
    const bol = handleValidate();
    if (!bol) return;
    const content = editorRef.current.getContent();
    onSubmit({ ...data, content, templateId: 'quanliang', formulaFields, fieldType });
  };

  function handleValidate(): boolean {
    const value = editorRef.current.getContent();
    const _content = value.substring(3, value.length - 4);

    if (_content === '<br>') {
      setErrorText('请输入内容');
      return false;
    }

    if (_content.trim() === '') {
      setErrorText('消息内容不能为空');
      return false;
    }

    setErrorText('');
    return true;
  }

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
      <div className="mb-20">
        <label className='form-field-label'>
          <span className="text-red-600">*</span>
          内容
        </label>
        <QuillEditor
          ref={editorRef}
          value={defaultValueEncode?.content || ''}
          options={fieldOption}
        />
        {errorText && <div className="text-14 text-red-500">{errorText}</div>}
      </div>
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
