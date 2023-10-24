import React, { useContext, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Radio } from 'antd';
import { isEqual } from 'lodash';
import { usePrevious, useUpdateEffect } from 'react-use';

import formFieldWrap from '@c/form-field-wrap';
import SaveButtonGroup from '@flow/content/editor/components/_common/action-save-button-group';

import { WebMessageData } from '../../type';
import PersonPicker from '../../components/_common/person-picker';
import { approvePersonEncoder } from '../../components/_common/utils';
import QuillEditor, { QuillEditorRef } from '../send-email-config/quill-editor';
import FlowTableContext from '../flow-source-table';
import { isAdvancedField } from '../utils';

import './index.css';

type Props = {
  onSubmit: (v: WebMessageData) => void;
  onChange: (v: WebMessageData) => void;
  onCancel: () => void;
  defaultValue: WebMessageData;
}

const Input = formFieldWrap({ field: <input className='input' /> });
const FieldRadio = formFieldWrap({ FieldFC: Radio.Group });

function WebMessage({ defaultValue, onSubmit, onCancel, onChange }: Props): JSX.Element {
  const quillRef = useRef<QuillEditorRef>(null);
  const approvePersons = approvePersonEncoder(defaultValue);
  const defaultValueEncode = {
    approvePersons,
    sort: defaultValue.sort,
    content: defaultValue.content,
    title: defaultValue.title,
  };
  const { register, handleSubmit, control, reset, formState: { errors }, watch } = useForm();

  const allFields = watch(['content', 'sort', 'title', 'approvePersons']);
  const previousFields = usePrevious(allFields);
  useUpdateEffect(() => {
    const value = {
      content: allFields[0],
      sort: allFields[1],
      title: allFields[2],
      approvePersons: allFields[3],
    };
    if (!isEqual(allFields, previousFields)) {
      onChange(value);
    }
  }, [allFields]);

  const handleSave = (data: any): void => {
    // const content = quillRef.current?.getContent();
    const content = quillRef.current?.getInnerHTML();
    onSubmit({ ...data, content });
  };

  const handleCancel = (): void => {
    onCancel();
  };
  const { tableSchema } = useContext(FlowTableContext);

  const contentVariables = React.useMemo(() => {
    return tableSchema.filter(({ type, componentName }) => {
      return !isAdvancedField(type, componentName);
    }).map((item: any) => {
      const { fieldName, title } = item;
      let type: any = item?.['x-component'] || '';
      const tableID = item?.['x-component-props']?.tableID;
      const aggType = item?.['x-component-props']?.aggType;
      const sourceFieldId = item?.['x-component-props']?.sourceFieldId;
      let _fieldName = fieldName;
      const mapType: any = {
        AggregationRecords: 'aggregation',
        AssociatedRecords: 'associated_records',
        ForeignTable: 'foreign_table',
        SubTable: 'sub_table',
        Serial: 'serial',
      };
      if (mapType[type]) {
        type = mapType[type];
      }
      if (tableID) {
        _fieldName = _fieldName + `.${tableID}.${type}`;
        sourceFieldId && (_fieldName = `${_fieldName}.${sourceFieldId}`);
        (sourceFieldId && aggType) && (_fieldName = `${_fieldName}.${aggType}`);
      }
      return { label: title as string, key: _fieldName };
    });
  }, [tableSchema]);

  useEffect(() => {
    reset(defaultValueEncode);
  }, []);

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
        defaultValue={defaultValueEncode?.title || ''}
        placeholder='请输入'
        error={errors.title}
        register={register('title', { required: '请输入标题' })}
      />
      <div className='form-field-label'>消息内容</div>
      <QuillEditor
        ref={quillRef}
        value={defaultValueEncode?.content || ''}
        contentVariables={contentVariables}
      />
      <SaveButtonGroup onCancel={handleCancel} onSave={handleSubmit(handleSave)} />
    </div>
  );
}

export default WebMessage;
