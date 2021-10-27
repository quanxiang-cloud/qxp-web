import React, { lazy, Suspense } from 'react';
import { observer } from 'mobx-react';
import { UnionColumns } from 'react-table';
import cs from 'classnames';

import Tab from '@c/tab';
import Icon from '@c/icon';
import Table from '@c/table';
import Switch from '@c/switch';
import Toggle from '@c/toggle';
import Loading from '@c/loading';
import Tooltip from '@c/tooltip';
import EmptyTips from '@c/empty-tips';
import TextHeader from '@c/text-header';
import { copyContent } from '@lib/utils';

import store from './store';
import 'highlight.js/styles/atelier-sulphurpool-dark.css';

const DOC_TYPE_LIST = [
  { label: 'CURL', value: 'curl' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Python', value: 'python' },
];

export const FIELD_COLUMNS: UnionColumns<ModelField>[] = [
  {
    Header: '字段名称',
    id: 'title',
    accessor: 'title',
  },
  {
    Header: '字段标识',
    id: 'id',
    accessor: (rowData) => (
      <div className='flex relative items-center field-id'>
        <span>{rowData.id}</span>
        <Tooltip
          position="top"
          label="复制"
          relative={false}
          wrapperClassName="flex-grow-0 relative z-10 invisible copy-tooltip icon-text-btn"
          labelClassName="whitespace-nowrap text-12"
        >
          <Icon
            name="content_copy"
            size={16}
            className='text-inherit ml-10'
            onClick={() => copyContent(rowData.id, '标志已复制')}
          />
        </Tooltip>
      </div>
    ),
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
    Header: '是否作为外键',
    id: 'isForeignKeys',
    accessor: (rowData) => (
      <span className={cs('foreign-key-col', {
        'text-blue-600 bg-blue-100': rowData.isForeignKeys,
      })}>{rowData.isForeignKeys ? '是' : '否'}</span>
    ),
  },
];

const Highlight = lazy(() => import('react-highlight'));

function renderApiDetails(): JSX.Element {
  if (store.isAPILoading) {
    return <Loading/>;
  }

  function handleDocTypeChange(docType: DocType): void {
    store.docType = docType;
    store.fetchApiDoc();
  }

  return (
    <>
      <Suspense fallback={<Loading />}>
        <div className='h-56 flex items-center justify-between'>
          <Switch
            value='curl'
            options={DOC_TYPE_LIST}
            onChange={(v) => handleDocTypeChange(v as DocType)}
          />
          <div className='flex items-center'>
            使用字段名称:
            <Toggle
              className='ml-8'
              defaultChecked={store.useFieldsID}
              onChange={() => {
                store.useFieldsID = !store.useFieldsID;
                store.fetchApiDoc();
              }}
            />
          </div>
        </div>
        <div className='api-content'>
          <Tooltip
            position="top"
            label="复制"
            relative={false}
            wrapperClassName="copy-button icon-text-btn"
            labelClassName="whitespace-nowrap"
          >
            <Icon
              name="content_copy"
              size={20}
              className='text-inherit'
              onClick={() => copyContent(store.APiContent.input)}
            />
          </Tooltip>
          <Highlight
            className='api-details'
            language={store.docType === 'curl' ? 'bash' : store.docType}
          >
            {store.APiContent.input}
          </Highlight>
        </div>
        <div className='api-content-title'>返回示例</div>
        <Highlight
          className='api-details mb-20'
          language={store.docType === 'curl' ? 'bash' : store.docType}
        >
          {store.APiContent.output}
        </Highlight>
      </Suspense>
    </>
  );
}

function ApiDocumentDetails(): JSX.Element {
  const tabItems = [
    {
      id: 'fields',
      name: '全部字段',
      content: (
        <>
          <div style={{ maxHeight: 'calc(100% - 45px)' }} className='flex w-full'>
            <Table
              className='massage_table'
              rowKey="id"
              columns={FIELD_COLUMNS}
              data={store.fields}
              emptyTips={<EmptyTips text='暂无消息数据' className="pt-40" />}
            />
          </div>
          <div className='px-16 py-12 border-t-1 text-12'>共{store.fields.length}条数据</div>
        </>
      ),
    },
    {
      id: 'create',
      name: '新增',
      content: renderApiDetails(),
    },
    {
      id: 'delete',
      name: '删除',
      content: renderApiDetails(),
    },
    {
      id: 'update',
      name: '更新',
      content: renderApiDetails(),
    },
    {
      id: 'get',
      name: '查询单条',
      content: renderApiDetails(),
    },
    {
      id: 'search',
      name: '查询多条',
      content: renderApiDetails(),
    },
  ];

  if (!store.tableID) {
    return <EmptyTips text='暂无数据模型' className="pt-40 m-auto" />;
  }

  if (store.isAPITabLoading && store.tableID) {
    return <Loading />;
  }

  return (
    <div
      className='relative flex-1 overflow-hidden bg-white rounded-tr-12 w-1 flex flex-col'
    >
      <TextHeader
        title={store.currentDataModel.title || '------'}
        itemTitleClassName="text-12 font-semibold"
        className="bg-gray-1000 p-16 header-background-image h-44 shadow-header rounded-t-12"
      />
      <div className='relative flex-1 overflow-hidden'>
        <Tab
          items={tabItems}
          className='w-full h-full api-tab'
          onChange={(v) => {
            if (v !== 'fields') {
              store.useFieldsID = false;
              store.docType = 'curl';
              store.fetchXName(v as ApiType)
              ;
            }
          }}
        />
      </div>
    </div>
  );
}

export default observer(ApiDocumentDetails);
