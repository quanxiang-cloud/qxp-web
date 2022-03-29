import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import { useQuery } from 'react-query';

import PageLoading from '@c/page-loading';
import Icon from '@c/icon';
import Tooltip from '@c/tooltip';
import { getBatchGlobalConfig } from '@lib/api/user-config';
import toast from '@lib/toast';
import Modal from '@c/modal';

import ViewList from './view-list';
import ViewDetails from './view-details';
import EditViewModal from './edit-view-modal';
import Orchestrator from '../view-orchestration/orchestrator';

import { CreateViewParams, ExternalView, SchemaView, StaticView, TableSchemaView, View, ViewType } from '../view-orchestration/types.d';

import EditStaticViewModal from './view-details/edit-static-view-modal';

import './index.scss';

function PageList(): JSX.Element {
  const { appID } = useParams<{ appID: string }>();
  const [appSchemaStore, setAppSchemaStore] = useState<Orchestrator>();
  const [modalType, setModalType] = useState('');
  const [currentView, setCurrentView] = useState<View>();

  const { isLoading } = useQuery(['desktop_view_schema'], () => {
    const key = `app_id:${appID}:desktop_view_schema:root`;
    return getBatchGlobalConfig([{ key: key, version: '1.0.0' }])
      .then(({ result }) => JSON.parse(result[key])).then((appLayoutSchema) => {
        setAppSchemaStore(() => {
          const store = new Orchestrator(appID, appLayoutSchema);
          window.store = store;
          setCurrentView(store.views[0] as View);
          console.log(appLayoutSchema);
          return store;
        });
        return appLayoutSchema;
      });
  });

  function handleViewInfoSubmit(
    viewInfo: CreateViewParams<View>,
  ): void {
    Promise.resolve().then(() => {
      if (modalType === 'createView') {
        if (viewInfo.layoutType === ViewType.TableSchemaView) {
          return appSchemaStore?.addTableSchemaView(viewInfo as CreateViewParams<TableSchemaView>);
        }

        if (viewInfo.layoutType === ViewType.SchemaView) {
          return appSchemaStore?.addSchemaView(viewInfo as CreateViewParams<SchemaView>);
        }

        if (viewInfo.layoutType === ViewType.StaticView) {
          return appSchemaStore?.addStaticView(viewInfo as CreateViewParams<StaticView>);
        }
        if (viewInfo.layoutType === ViewType.ExternalView) {
          return appSchemaStore?.addExternalView(viewInfo as CreateViewParams<ExternalView>);
        }
      }

      if (modalType === 'editStaticView') {
        return appSchemaStore?.editStaticView(viewInfo as StaticView);
      }

      return appSchemaStore?.updateViewName(currentView!, viewInfo.name!);
    }).then(() => {
      closeModal();
      toast.success((modalType === 'createView' ? '添加' : '修改') + '成功');
      setCurrentView(viewInfo);
    });
  }

  function closeModal(): void {
    setModalType('');
  }

  if (isLoading) {
    return (
      <div className="flex h-full">
        <div className='app-details-nav'><PageLoading /></div>
      </div >
    );
  }

  return (
    <div className="flex h-full">
      <div className='app-details-nav rounded-tl-8 bg-gray-50'>
        <div className='h-44 flex flex-end items-center px-16 py-20 justify-center'>
          <span className='font-semibold text-gray-400 mr-auto text-12'>页面</span>
          <div className="flex items-center">
            <div onClick={() => setModalType('createView')}>
              <Tooltip label='新建页面' position='bottom' wrapperClassName="whitespace-nowrap">
                <Icon className='cursor-pointer mr-8 hover:text-blue-600' size={16} name='post_add' />
              </Tooltip>
            </div>
          </div>
        </div>
        <div className='app-view-list-wrapper h-full'>
          <ViewList
            className='pb-10'
            currentViewID={(currentView as View)?.id || ''}
            views={appSchemaStore?.views as View[]}
            onViewClick={(view) => setCurrentView(view)}
            onOptionClick={(key, view) => {
              setCurrentView(view);
              setModalType(key);
              if (key === 'delView') {
                const delViewModal = Modal.open({
                  title: '删除页面',
                  content: `确定要删除页面 ${view.name} 吗?`,
                  confirmText: '确认删除',
                  onConfirm: () => {
                    appSchemaStore?.deleteViewOrLayout(view.id).then(() => {
                      delViewModal.close();
                      toast.success('删除成功');
                      setCurrentView(appSchemaStore?.views[0] as View);
                    });
                  },
                });
              }
            }}
          />
        </div>
      </div>
      <ViewDetails openModal={setModalType} viewInfo={currentView} />
      {['editView', 'createView'].includes(modalType) && (
        <EditViewModal
          modalType={modalType}
          layouts={appSchemaStore?.layouts || []}
          views={appSchemaStore?.views || []}
          onCancel={closeModal}
          viewParams={modalType === 'editView' ? currentView : undefined}
          onSubmit={handleViewInfoSubmit}
        />
      )}
      {modalType === 'editStaticView' && (
        <EditStaticViewModal
          view={currentView as StaticView}
          onClose={closeModal}
          onSubmit={handleViewInfoSubmit}
        />
      )}
    </div >
  );
}

export default observer(PageList);
