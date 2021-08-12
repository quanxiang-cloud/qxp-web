import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { UnionColumns } from 'react-table';
import { Input, FormMegaLayout, FormSlot } from '@formily/antd-components';
import { SchemaForm, SchemaMarkupField as Field, FormButtonGroup } from '@formily/antd';

import Table from '@c/table';
import Button from '@c/button';

import EditorFieldModal from './editor-field-modal';
import store from './store';
import { FIELD_COLUMNS } from './utils';

function FieldsDesign(): JSX.Element {
  const [editorVisible, setEditorVisible] = useState(false);
  const [curModelField, setCurModelField] = useState<ModelField | null>(null);
  const [fields, setFields] = useState<ModelField[]>(store.fields);

  const COLUMNS: UnionColumns<ModelField>[] = [
    ...FIELD_COLUMNS,
    {
      Header: '操作',
      id: 'action',
      accessor: (rowData) => {
        if (rowData?.['x-internal']?.isSystem) {
          return '——';
        }

        return (
          <div className='flex gap-6'>
            <span
              onClick={() => {
                setCurModelField(rowData);
                setEditorVisible(true);
              }}
              className='text-btn'>编辑</span>
            <span onClick={() => store.delModelField(rowData.id)} className='text-btn'>删除</span>
          </div>
        );
      },
    },
  ];

  const filterField = (params: { title?: string, id?: string }): void => {
    const { title, id } = params;
    if (!title && !id) {
      return;
    }

    const newFields = store.fields.filter((field) => {
      let count = 0;
      if (title) {
        (field.title as string).includes(title) ? (count += 1) : (count -= 1);
      }

      if (id) {
        (field.id as string).includes(id) ? (count += 1) : (count -= 1);
      }

      return count > 0;
    });
    setFields(newFields);
  };

  return (
    <>
      <SchemaForm onSubmit={filterField} components={{ Input }}>
        <FormMegaLayout grid full autoRow>
          <Field x-component='Input' type="string" title="字段名称" name="title" />
          <Field x-component='Input' type="string" title="字段编码" name="id" />
          <FormSlot>
            <FormButtonGroup align="right">
              <Button type='submit'>查询</Button>
            </FormButtonGroup>
          </FormSlot>
        </FormMegaLayout>
      </SchemaForm>
      <Button onClick={() => setEditorVisible(true)} className='mb-16' modifier='primary'>新建</Button>
      <div style={{ maxHeight: 'calc(100% - 296px)' }} className='flex'>
        <Table
          rowKey='id'
          emptyTips='暂无模型字段'
          columns={COLUMNS}
          data={fields}
        />
      </div>
      {editorVisible && (
        <EditorFieldModal
          isEditor={!!curModelField}
          field={curModelField || undefined}
          onSubmit={(value: ModelField) => {
            store.addModelField(value);
            setEditorVisible(false);
            setCurModelField(null);
          }}
          onCancel={() => {
            setEditorVisible(false);
            setCurModelField(null);
          }}
        />
      )}
    </>
  );
}

export default observer(FieldsDesign);
