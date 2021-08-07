import React, { useState } from 'react';
import { UnionColumns } from 'react-table';
import { Input, FormMegaLayout, FormSlot } from '@formily/antd-components';
import { SchemaForm, SchemaMarkupField as Field, FormButtonGroup } from '@formily/antd';

import Table from '@c/table';
import Pagination from '@c/pagination';
import Button from '@c/button';

import EditorFieldModal from './editor-field-modal';

const COLUMNS: UnionColumns<any>[] = [
  {
    Header: '字段编码',
    id: 'name',
    accessor: 'name',
  },
  {
    Header: '字段名称',
    id: 'code',
    accessor: 'code',
  },
  {
    Header: '数据格式',
    id: 'number',
    accessor: 'number',
  },
  {
    Header: '是否允许为空',
    id: 'desc',
    accessor: 'desc',
  },
  {
    Header: '操作',
    id: 'action',
    accessor: (rowData: any) => {
      return (
        <div className='flex gap-6'>
          <span className='text-btn'>编辑</span>
          <span className='text-btn'>删除</span>
        </div>
      );
    },
  },
];

function FieldsDesign(): JSX.Element {
  const [editorVisible, setEditorVisible] = useState(false);

  return (
    <div>
      <SchemaForm onSubmit={console.log} components={{ Input }}>
        <FormMegaLayout grid full autoRow>
          <Field x-component='Input' type="string" title="字段名称" name="name" />
          <Field x-component='Input' type="string" title="字段编码" name="code" />
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
        data={[{ id: '1' }]}
      />
      <Pagination
        current={1}
        total={10}
        pageSize={10}
        onChange={(page: number, size: number) => {
          console.log('page: ', page, size);
        }}
      />
      {editorVisible && (
        <EditorFieldModal
          isEditor={false}
          onSubmit={console.log}
          onCancel={() => setEditorVisible(false)}
        />
      )}
    </div>
  );
}

export default FieldsDesign;
