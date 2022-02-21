import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import { UnionColumn } from 'react-table';

import Icon from '@c/icon';
import Table from '@c/table';
import MoreMenu from '@c/more-menu';
import TextHeader from '@c/text-header';

import store from './store';
import EditTemplateModal from './template-edit/edit-template-modal';
import DelTemplateModal from './template-edit/del-template-modal';
import CreatedAppModal from '../app-list/app-edit/created-app-modal';

function AppTemplates(): JSX.Element {
  const [modalType, setModalType] = useState('');
  const { templateList, templateListLoading, fetchList, curTemplate, setCurTemplate } = store;
  const MENUS = useMemo(() => {
    return [
      {
        key: 'editTemplate',
        label: (
          <div className="flex items-center">
            <Icon name="save" className="mr-4" />
            修改信息
          </div>
        ),
      },
      {
        key: 'delTemplate',
        label: (
          <div className="flex items-center text-red-600">
            <Icon name="restore_from_trash" className="mr-4" />
            删除
          </div>
        ),
      },
    ];
  }, []);
  const COLUMNS: UnionColumn<TemplateInfo>[] = [
    {
      Header: '名称',
      accessor: 'name',
    },
    {
      Header: '来源',
      accessor: 'appName',
    },
    {
      Header: '操作',
      accessor: (row) => {
        return (
          <>
            <span
              className="text-blue-600 cursor-pointer mr-20"
              onClick={() => handelMenuClick('createdApp', row)}
            >
              使用
            </span>
            <MoreMenu
              menus={MENUS}
              onMenuClick={(key) => handelMenuClick(key, row)}
            >
              <Icon changeable clickable name='more_horiz' />
            </MoreMenu>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    fetchList();
  }, []);

  function handelMenuClick(_modalType: string, rowData: TemplateInfo): void {
    setModalType(_modalType);
    setCurTemplate(rowData);
  }

  function RenderModal() {
    if (!curTemplate) {
      return null;
    }

    return (
      <>
        {modalType === 'editTemplate' && (
          <EditTemplateModal
            modalType={modalType}
            templateInfo={curTemplate}
            onCancel={() => setModalType('')}
          />
        )}
        {modalType === 'delTemplate' &&
          <DelTemplateModal templateInfo={curTemplate} onCancel={() => setModalType('')} />
        }
        {modalType === 'createdApp' && (
          <CreatedAppModal
            modalType={modalType}
            templateID={curTemplate.id}
            onCancel={() => setModalType('')}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full">
        <TextHeader
          title="模版库"
          desc="……"
          // action="👋 快速开始"
          className="app-list-headertitle bg-gray-1000 px-20 py-16 header-background-image h-44"
          itemTitleClassName="text-h6"
        />
        <div className="p-16 font-semibold">我的模板 · {templateList.length}</div>
        <div className="flex-1 px-16">
          <Table
            rowKey="id"
            data={templateList}
            columns={COLUMNS}
            loading={templateListLoading}
          />
        </div>
      </div>
      <RenderModal />
    </>
  );
}

export default observer(AppTemplates);
