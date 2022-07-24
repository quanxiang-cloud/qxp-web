import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import PageLoading from '@c/page-loading';
import Icon from '@c/icon';
import Tooltip from '@c/tooltip';
import Modal from '@c/modal';
import { toast } from '@one-for-all/ui';

import ViewList from './view-list';
import ViewDetails from './view-details';
import EditViewModal from './view-creation-modal';
import { deleteSchema } from '../data-models/api';

import EditStaticViewModal from './view-details/edit-static-view-modal';
import pageTemplatesStore from '@portal/modules/apps-management/page-templates/store';
import CreateFromTemplate from './create-from-template';

import appStore from '../store';

import { CreateViewParams, StaticView, TableSchemaView, View, ViewType } from '../view-orchestration/types.d';

import './index.scss';

function AppViews(): JSX.Element {
  const { viewStore } = appStore;
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const handleModalSubmit = useCallback(
    (viewInfo: CreateViewParams<View>): void => {
      setBtnLoading(true);
      viewStore
        ?.handleViewInfoSubmit(viewInfo)
        .then(() => {
          toast.success((viewStore.modalType === 'createView' ? '添加' : '修改') + '成功');
          closeModal();
        })
        .catch(() => {
          toast.error('修改失败，请重试');
        })
        .finally(() => {
          setBtnLoading(false);
        });
    },
    [viewStore?.modalType],
  );

  function closeModal(): void {
    viewStore?.setModalType('');
  }

  function onViewOptionClick(key: string, view: View): void {
    viewStore?.setCurrentView(view);
    viewStore?.setModalType(key);
    if (key === 'delView') {
      const delViewModal = Modal.open({
        title: '删除页面',
        content: `确定要删除页面 ${view.name} 吗?`,
        confirmText: '确认删除',
        onConfirm: () => {
          viewStore
            ?.deleteViewOrLayout(view.id)
            .then(() => {
              delViewModal.close();
              toast.success(`已删除页面 ${view.name} `);
              if ((view as TableSchemaView).tableID) {
                deleteSchema(viewStore.appID, (view as TableSchemaView).tableID);
              }
            })
            .catch((err) => {
              toast.error(err);
            });
        },
      });
    }
    if (key === 'setHomeView') {
      viewStore?.setHomeView(view.id).then(() => {
        toast.success(`已将 ${view.name} 设置为应用主页`);
      });
    }

    if (
      key === 'saveAsTemplate' &&
      (view.type === ViewType.SchemaView || view.type === ViewType.TableSchemaView)
    ) {
      if (view.type === ViewType.SchemaView) {
        pageTemplatesStore.createTemplate({
          type: 'artery',
          name: view.name,
          arteryID: view.arteryID,
        });
      } else {
        pageTemplatesStore.createTemplate({
          type: 'form',
          appID: view.appID,
          tableID: view.tableID,
          name: view.name,
        });
      }
    }
  }

  useEffect(() => {
    if (appStore.lastFocusViewID && viewStore) {
      const view = viewStore.views.find((view) => (view as View).id === appStore.lastFocusViewID );
      viewStore.setCurrentView(view as View);
    }
  }, [viewStore?.views]);

  window.store = viewStore;

  if (appStore.loading || !viewStore) {
    return (
      <div className="flex h-full">
        <div className="app-details-nav">
          <PageLoading />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="app-details-nav rounded-tl-8 bg-gray-50">
        <div className="h-44 flex flex-end items-center px-16 py-20 justify-center">
          <span className="font-semibold text-gray-400 mr-auto text-12">页面</span>
          <div className="flex items-center">
            <div onClick={() => viewStore.setModalType('createView')}>
              <Tooltip label="新建页面" position="top" theme="dark">
                <Icon className="cursor-pointer mr-8 hover:text-blue-600" size={16} name="post_add" />
              </Tooltip>
            </div>
            <CreateFromTemplate />
          </div>
        </div>
        <div style={{ height: 'calc(100% - 44px)' }} className="app-view-list-wrapper h-full">
          <ViewList
            currentView={viewStore.currentView as View}
            homeView={viewStore.homeView}
            views={viewStore.views as View[]}
            onViewClick={(view) => {
              viewStore.setCurrentView(view);
              appStore.setLastFocusViewID(view.id);
            }}
            onOptionClick={onViewOptionClick}
          />
        </div>
      </div>
      <ViewDetails openModal={(type) => viewStore.setModalType(type)} viewInfo={viewStore.currentView as View} />
      {['editView', 'createView'].includes(viewStore.modalType) && (
        <EditViewModal
          modalType={viewStore.modalType}
          layouts={viewStore.layouts || []}
          views={viewStore.views || []}
          onCancel={closeModal}
          viewParams={viewStore.modalType === 'editView' ? (viewStore.currentView as View) : undefined}
          onSubmit={handleModalSubmit}
          isPending={btnLoading}
        />
      )}
      {viewStore.modalType === 'editStaticView' && (
        <EditStaticViewModal
          view={viewStore.currentView as StaticView}
          onClose={closeModal}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
}

export default observer(AppViews);
