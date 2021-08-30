import React, { lazy, Suspense } from 'react';
import cs from 'classnames';
import moment from 'moment';
import { observer } from 'mobx-react';

import Tab from '@c/tab';
import Table from '@c/table';
import Toggle from '@c/toggle';
import Loading from '@c/loading';
import EmptyTips from '@c/empty-tips';
import Button from '@c/button';
import { copyContent } from '@lib/utils';

import store from './store';
import { FIELD_COLUMNS } from '../utils';

import 'highlight.js/styles/stackoverflow-light.css';

const DOC_TYPE_LIST = [
  { label: 'cURL', value: 'curl' },
  { label: 'javaScript', value: 'javascript' },
  { label: 'python', value: 'python' },
];

const Highlight = lazy(() => import('react-highlight'));

function renderApiDetails(title: string): JSX.Element {
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
        <div className='flex justify-between center'>
          <div className='api-content-title'>{title}</div>
          <div>
            {DOC_TYPE_LIST.map(({ label, value }) => {
              return (
                <span
                  key={value}
                  className={cs('px-18 cursor-pointer hover:text-blue-600', {
                    'text-blue-600': value === store.docType,
                  })}
                  onClick={() => handleDocTypeChange(value as DocType)}
                >
                  {label}
                </span>
              );
            })}
          </div>
        </div>
        <div className='api-content'>
          <Button
            className='copy-button'
            onClick={() => copyContent(store.APiContent.input)}
            modifier='primary'
            iconName="content_copy"
          >
            复&nbsp;制
          </Button>
          <Highlight language={store.docType}>{store.APiContent.input}</Highlight>
        </div>
        <div className='api-content-title'>示例返回值</div>
        <Highlight language={store.docType}>{store.APiContent.output}</Highlight>
      </Suspense>
    </>
  );
}

function ApiDocumentDetails(): JSX.Element {
  const tabItems = [
    {
      id: 'fields',
      name: 'Fields字段',
      content: (
        <Table
          className='massage_table text-14 table-full'
          rowKey="id"
          columns={FIELD_COLUMNS}
          data={store.fields}
          emptyTips={<EmptyTips text='暂无消息数据' className="pt-40" />}
        />
      ),
    },
    {
      id: 'create',
      name: '新增',
      content: renderApiDetails('新增记录'),
    },
    {
      id: 'delete',
      name: '删除',
      content: renderApiDetails('删除记录'),
    },
    {
      id: 'update',
      name: '更新',
      content: renderApiDetails('更新记录'),
    },
    {
      id: 'search',
      name: '查询',
      content: renderApiDetails('查询记录'),
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
      className='flex-1 pb-20 overflow-auto'
      style={{ width: 'calc(100% - 492px)' }}
    >
      <div className='py-20 px-40'>
        <div className='mb-16 flex justify-between'>
          <div className='text-gray-900 text-h5'>{store.currentDataModel.title || '------'}</div>
          <div>
            使用Fields ID:
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
        <div className='w-full'>
          <div className='flex align-bottom'>
            <div className='mr-20'>
              创建时间: {moment(store.currentDataModel.createdAt, 'X').format('YYYY-MM-DD HH:mm:ss')}
            </div>
            <div className='mx-20'>创建者: {store.currentDataModel.creatorName || '------'}</div>
            <div className='mx-20'>
              最后更新时间: {
                moment(store.currentDataModel.updatedAt, 'X').format('YYYY-MM-DD HH:mm:ss' || '---- -- -- --')
              }
            </div>
            <div className='mx-20'>最后更新人: {store.currentDataModel.editor || '------'}</div>
          </div>
        </div>
      </div>
      <div
        className='px-20 overflow-hidden'
        style={{ height: 'calc(100% - 110px)' }}
      >
        <Tab
          separator
          strechNavs
          items={tabItems}
          className='w-full h-full'
          onChange={(v) => {
            if (v !== 'fields') store.fetchXName(v as ApiType);
          }}
        />
      </div>
    </div>
  );
}

export default observer(ApiDocumentDetails);
