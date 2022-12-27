import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { UnionColumn } from 'react-table';

import { toast } from '@one-for-all/ui';
import Table from '@c/table';
import Button from '@c/button';
import TextHeader from '@c/text-header';
import EmptyTips from '@c/empty-tips';

import store from './store';
import EditProjectModal from './edit-project-modal';
// import DelTemplateModal from './template-edit/del-template-modal';
// import CreatedAppModal from '../app-list/app-edit/created-app-modal';
import { APPLICATION_CREATE } from '@portal/constants';

function ProjectGroup(): JSX.Element {
  const [modalType, setModalType] = useState('');
  const { templateList, templateListLoading, fetchList, curTemplate, setCurTemplate } = store;

  const COLUMNS: UnionColumn<TemplateInfo>[] = [
    {
      Header: '项目组',
      accessor: 'name',
    },
    {
      Header: '项目成员',
      accessor: 'version',
    },
    {
      Header: '备注',
      accessor: 'appName',
    },
    {
      Header: '操作',
      accessor: (row) => {
        return (
          window.ADMIN_USER_FUNC_TAGS.includes(APPLICATION_CREATE) ?
            (<>
              <span
                className="text-blue-600 cursor-pointer mr-20"
                onClick={() => handelMenuClick('modify', row)}
              >
                编辑
              </span>
              <span
                className="text-blue-600 cursor-pointer mr-20"
                onClick={() => handelMenuClick('delete', row)}
              >
                删除
              </span>
            </>) :
            '-'
        );
      },
    },
  ];

  useEffect(() => {
    fetchList().catch(() => {
      toast.error('获取模版列表失败');
    });
    return () => {
      setCurTemplate(store.templateList?.[0]);
    };
  }, []);

  function handelMenuClick(_modalType: string, rowData: TemplateInfo): void {
    setModalType(_modalType);
    setCurTemplate(rowData);
  }

  function RenderModal() {
    return (
      <>
        {modalType === 'create' && (

          <EditProjectModal
            modalType={modalType}
            templateInfo={curTemplate}
            onCancel={() => setModalType('')}
          />
        )}
        {/* {modalType === 'delTemplate' &&
          <DelTemplateModal templateInfo={curTemplate} onCancel={() => setModalType('')} />
        } */}

      </>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full">
        <TextHeader
          title="模版库"
          desc=""
          // action="👋 快速开始"
          className="app-list-headertitle bg-gray-1000 px-20 py-16 header-background-image h-44"
          itemTitleClassName="text-h6"
        />
        <div className="p-16 font-semibold flex justify-between items-center">
          我的项目 · {templateList.length}
          <div>
            <Button
              iconName="add"
              onClick={() => {
                console.log('11');
                setModalType('create');
              }}
              className="mr-16"
            >
              添加项目
            </Button>
          </div>
        </div>
        <div className="flex-1 px-16 overflow-auto">
          <Table
            rowKey="id"
            data={templateList}
            columns={COLUMNS}
            loading={templateListLoading}
            emptyTips={<EmptyTips text="暂无模版数据" className="py-32" />}
          />
        </div>
      </div>
      <RenderModal />
    </>
  );
}

export default observer(ProjectGroup);
