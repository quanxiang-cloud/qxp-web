import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { UnionColumn } from 'react-table';
import dayjs from 'dayjs';

import { toast } from '@one-for-all/ui';
import Table from '@c/table';
import Button from '@c/button';
import TextHeader from '@c/text-header';
import EmptyTips from '@c/empty-tips';
import Pagination from '@c/pagination';
import { APPLICATION_CREATE } from '@portal/constants';

import store from './store';
import EditProjectModal from './edit-project-modal';
import DelProjectModal from './del-project-modal';
import { Project } from './api';

function ProjectGroup(): JSX.Element {
  const [modalType, setModalType] = useState('');

  const COLUMNS: UnionColumn<Project>[] = [
    {
      Header: '项目组',
      accessor: 'name',
    },
    {
      Header: '项目编号',
      accessor: 'serialNumber',
    },
    {
      Header: '开始日期',
      accessor: ({ startAt }) => {
        return startAt ? dayjs(startAt).format('YYYY-MM-DD') : '-';
      },
    },
    {
      Header: '结束日期',
      accessor: ({ endAt }) => {
        return endAt ? dayjs(endAt).format('YYYY-MM-DD') : '-';
      },
    },
    {
      Header: '备注',
      accessor: 'description',
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
                className="text-red-600 cursor-pointer mr-20"
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
    store.fetchProjectList().catch(() => {
      toast.error('获取项目列表失败');
    });
  }, []);

  function handelMenuClick(_modalType: string, rowData: Project): void {
    setModalType(_modalType);
    store.setCurProject(rowData);
  }

  function RenderModal(): JSX.Element {
    return (
      <>
        {modalType === 'create' && (
          <EditProjectModal
            modalType={modalType}
            onCancel={() => setModalType('')}
          />
        )}
        {modalType === 'modify' && (
          <EditProjectModal
            modalType={modalType}
            project={store.curProject}
            onCancel={() => setModalType('')}
          />
        )}
        {modalType === 'delete' &&
          <DelProjectModal projectInfo={store.curProject} onCancel={() => setModalType('')} />
        }
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full">
        <TextHeader
          title="项目库"
          desc=""
          className="app-list-headertitle bg-gray-1000 px-20 py-16 header-background-image h-44"
          itemTitleClassName="text-h6"
        />
        <div className="p-16 font-semibold flex justify-between items-center">
          我的项目 · {store.projectList?.length}
          <div>
            <Button
              iconName="add"
              onClick={() => {
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
            data={store.projectList}
            columns={COLUMNS}
            loading={store.projectListLoading}
            emptyTips={<EmptyTips text="暂无模版数据" className="py-32" />}
          />
        </div>
        <Pagination
          total={store.total}
          renderTotalTip={() => `共 ${store.total} 条数据`}
          onChange={(current, pageSize) => store.setProjectParams({ page: current, size: pageSize })}
        />
      </div>
      <RenderModal />
    </>
  );
}

export default observer(ProjectGroup);
