import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { UnionColumns } from 'react-table';
import { Input, FormMegaLayout, FormSlot } from '@formily/antd-components';
import { SchemaForm, SchemaMarkupField as Field, FormButtonGroup } from '@formily/antd';

import Table from '@c/table';
import Button from '@c/button';

import EditorFieldModal from './editor-field-modal';
import store from './store';

function FieldsDesign(): JSX.Element {
  const [editorVisible, setEditorVisible] = useState(false);
  const [curModelField, setCurModelField] = useState<ModelField | null>(null);

  const COLUMNS: UnionColumns<ModelField>[] = [
    {
      Header: '字段编码',
      id: 'id',
      accessor: 'id',
    },
    {
      Header: '字段名称',
      id: 'title',
      accessor: 'title',
    },
    {
      Header: '数据格式',
      id: 'type',
      accessor: 'type',
    },
    {
      Header: '是否允许为空',
      id: 'not_null',
      accessor: (rowData) => rowData.not_null ? '允许' : '不允许',
    },
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

  return (
    <div>
      <SchemaForm onSubmit={console.log} components={{ Input }}>
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
      <Table
        rowKey='id'
        columns={COLUMNS}
        data={store.fields}
      />
      {editorVisible && (
        <EditorFieldModal
          isEditor={!!curModelField}
          field={curModelField || undefined}
          onSubmit={(value: ModelField) => {
            store.addModelField(value);
            setEditorVisible(false);
            setCurModelField(null);
          }}
          onCancel={() =>{
            setEditorVisible(false);
            setCurModelField(null);
          }}
        />
      )}
    </div>
  );
}

export default observer(FieldsDesign);
