import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { UnionColumn } from 'react-table';

import Table from '@c/table';
import TextHeader from '@c/text-header';
import EmptyTips from '@c/empty-tips';

import store, { PageTemplate } from './store';
import RenameTemplateModal from './rename-template-modal';

function PageTemplatesManagement(): JSX.Element {
  const [renameTemplateKey, setRenameTemplateKey] = useState('');

  const COLUMNS: UnionColumn<PageTemplate>[] = [
    {
      Header: '模版名称',
      accessor: 'name',
    },
    {
      Header: '页面类型',
      accessor: (row) => {
        if (row.type === 'artery') {
          return <span>自定义页面</span>;
        }

        return <span>表单页面</span>;
      },
    },
    {
      Header: '操作',
      accessor: (row) => {
        return (
          <>
            <span
              className="text-blue-600 cursor-pointer mr-20"
              onClick={() => store.deleteTemplate(row.key)}
            >
              删除
            </span>
            <span className="text-blue-600 cursor-pointer" onClick={() => setRenameTemplateKey(row.key)}>
              重命名
            </span>
          </>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <TextHeader
        title="页面模板管理"
        desc=""
        className="app-list-headertitle bg-gray-1000 px-20 py-16 header-background-image h-44"
        itemTitleClassName="text-h6"
      />
      <div className="flex-1 px-16 overflow-auto">
        <Table
          rowKey="key"
          data={store.pageTemplates}
          columns={COLUMNS}
          emptyTips={<EmptyTips text="暂无模版数据" className="py-32" />}
        />
      </div>
      {renameTemplateKey && (
        <RenameTemplateModal templateKey={renameTemplateKey} onClose={() => setRenameTemplateKey('')} />
      )}
    </div>
  );
}

export default observer(PageTemplatesManagement);
