import React from 'react';
import { observer } from 'mobx-react';

import PageLoading from '@c/page-loading';
import Icon from '@c/icon';
import Tooltip from '@c/tooltip';
import toast from '@lib/toast';
import Modal from '@c/modal';

import ViewList from './view-list';
import ViewDetails from './view-details';
import EditViewModal from './edit-view-modal';

import EditStaticViewModal from './view-details/edit-static-view-modal';

import useAppStore from './hooks';

import {
  CreateViewParams,
  StaticView,
  View,
} from '../view-orchestration/types.d';

import './index.scss';

function AppViews(): JSX.Element {
  const { isLoading, store } = useAppStore();

  function handleModalSubmit(viewInfo: CreateViewParams<View>): void {
    store?.handleViewInfoSubmit(viewInfo).then(()=> {
      closeModal();
      toast.success((store?.modalType === 'createView' ? '添加' : '修改') + '成功');
    });
  }

  function closeModal(): void {
    store?.setModalType('');
  }

  function onViewOptionClick(key: string, view: View): void {
    store?.setCurrentView(view);
    store?.setModalType(key);
    if (key === 'delView') {
      const delViewModal = Modal.open({
        title: '删除页面',
        content: `确定要删除页面 ${view.name} 吗?`,
        confirmText: '确认删除',
        onConfirm: () => {
          store?.deleteViewOrLayout(view.id).then(() => {
            delViewModal.close();
            toast.success('删除成功');
            store?.setCurrentView(store?.views[0] as View);
          });
        },
      });
    }
    if ( key === 'setHomeView') {
      store?.setHomeView(view.name).then(()=> {
        toast.success(`已将 ${view.name} 设置为应用主页`);
      });
    }
  }

  if (isLoading || !store) {
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
            <div onClick={() => store.setModalType('createView')}>
              <Tooltip label='新建页面' position='bottom' wrapperClassName="whitespace-nowrap">
                <Icon className='cursor-pointer mr-8 hover:text-blue-600' size={16} name='post_add' />
              </Tooltip>
            </div>
          </div>
        </div>
        <div className='app-view-list-wrapper h-full'>
          <ViewList
            className='pb-10'
            currentView={(store.currentView as View)}
            homeView={store.homeView}
            views={store.views as View[]}
            onViewClick={(view) => store.setCurrentView(view)}
            onOptionClick={onViewOptionClick}
          />
        </div>
      </div>
      <ViewDetails openModal={(type) => store.setModalType(type)} viewInfo={store.currentView as View} />
      {['editView', 'createView'].includes(store.modalType) && (
        <EditViewModal
          modalType={store.modalType}
          layouts={store.layouts || []}
          views={store.views || []}
          onCancel={closeModal}
          viewParams={store.modalType === 'editView' ? store.currentView as View : undefined}
          onSubmit={handleModalSubmit}
        />
      )}
      {store.modalType === 'editStaticView' && (
        <EditStaticViewModal
          view={store.currentView as StaticView}
          onClose={closeModal}
          onSubmit={handleModalSubmit}
        />
      )}
    </div >
  );
}

export default observer(AppViews);
