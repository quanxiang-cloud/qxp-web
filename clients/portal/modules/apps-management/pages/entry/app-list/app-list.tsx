import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import Icon from '@c/icon';
import toast from '@lib/toast';
import { MenuItem } from '@c/more-menu';
import PageLoading from '@c/page-loading';
import { subscribeStatusChange } from '@c/task-lists/utils';

import { exportAppAndCreateTask } from './api';
import AppItem from '../components/render-item';
import DeleteAppModal from './app-edit/del-app-modal';
import AppSetStatusModal from './app-edit/app-set-status-modal';
import EditTemplateModal from '../app-templates/template-edit/edit-template-modal';

type Props = {
  isLoading: boolean;
  appList: AppInfo[];
  openCreatedModal: () => void;
}

function AppList({ isLoading, appList, openCreatedModal }: Props): JSX.Element {
  const [modalType, setModalType] = useState('');
  const [curApp, setCurApp] = useState<AppInfo | null>(null);
  const history = useHistory();
  const hasUpdateAccess = window.ADMIN_USER_FUNC_TAGS.includes('application/update');
  const hasReadAccess = window.ADMIN_USER_FUNC_TAGS.includes('application/read');
  const hasDeleteAccess = window.ADMIN_USER_FUNC_TAGS.includes('application/delete');

  function getAppItemMenus(appInfo: AppInfo): MenuItem[] {
    return [
      {
        key: 'publish',
        disabled: appInfo.useStatus < -1 || !hasUpdateAccess,
        label: (
          <div className="flex items-center">
            <Icon name="toggle_on" className="mr-4" />
            {appInfo.useStatus > 0 ? '下架应用' : '发布应用'}
          </div>
        ),
      },
      {
        key: 'visit',
        disabled: appInfo.useStatus < 0 || !hasReadAccess,
        label: (
          <div className='flex items-center'>
            <Icon name="login" className="mr-4" />
            访问应用
          </div>
        ),
      },
      {
        key: 'exportApp',
        disabled: appInfo.useStatus < -1 || !hasReadAccess,
        label: (
          <div className="flex items-center">
            <Icon name="upload" className="mr-4" />
            导出应用
          </div>
        ),
      },
      {
        key: 'saveAsTemplate',
        disabled: appInfo.useStatus < -1 || !hasUpdateAccess,
        label: (
          <div className="flex items-center">
            <Icon name="save" className="mr-4" />
            保存为模版
          </div>
        ),
      },
      {
        key: 'delete',
        disabled: !hasDeleteAccess,
        label: (
          <div className="flex items-center text-red-600">
            <Icon name="restore_from_trash" className="mr-4" />
            删除
          </div>
        ),
      },
    ];
  }

  function openModal(_modalType: string, _curApp: AppInfo): void {
    setModalType(_modalType);
    setCurApp(_curApp);
  }

  function goDetails({ id }: AppInfo): void {
    history.push(`/apps/details/${id}/page_setting`);
  }

  function exportApp({ id, appName }: AppInfo): void {
    exportAppAndCreateTask({
      value: { appID: id ?? '' },
      title: `【${appName}】 应用导出`,
    }).then((res) => {
      subscribeStatusChange(res.taskID, '导出');
    }).catch((err) => {
      toast.error(err.message);
    });
  }

  const actionsExecutorMap: Record<string, (itemData: AppInfo) => void> = {
    setting: (itemData: AppInfo) => {
      history.push(`/apps/details/${itemData.id}/setting/info`);
    },
    visit: (itemData: AppInfo) => {
      window.open(`//${window.CONFIG.home_hostname}/apps/` + itemData.id);
    },
    exportApp,
  };

  function handleActions(key: string, itemData: AppInfo): void {
    const actionExecutor = actionsExecutorMap[key];
    if (!actionExecutor) {
      openModal(key, itemData);
      return;
    }

    actionExecutor(itemData);
  }

  function RenderModal() {
    if (!curApp) {
      return null;
    }

    return (
      <>
        {modalType === 'delete' && (
          <DeleteAppModal appInfo={curApp} onCancel={() => setModalType('')} />
        )}
        {modalType === 'publish' && (
          <AppSetStatusModal
            appID={curApp.id}
            onCancel={() => setModalType('')}
            status={curApp.useStatus > 0 ? 'soldOut' : 'publish'}
          />
        )}
        {modalType === 'saveAsTemplate' && (
          <EditTemplateModal
            modalType={modalType}
            tmpInfo={curApp}
            onCancel={() => setModalType('')}
          />
        )}
      </>
    );
  }

  if (isLoading) {
    return <div className='relative flex-1'><PageLoading /></div>;
  }

  if (appList.length === 0) {
    return (
      <div className='app-no-data mt-58'>
        <img src='/dist/images/new_tips.svg' />
        <span>无应用数据。点击
          <span onClick={openCreatedModal} className='text-btn'>&nbsp;新建应用</span>
          ，开始构建应用
        </span>
      </div>
    );
  }

  return (
    <div className='app-list-container'>
      {appList.map((appInfo: AppInfo) => (
        <AppItem
          key={appInfo.id}
          appInfo={appInfo}
          onClick={goDetails}
          openModal={openModal}
          handleActions={handleActions}
          menus={getAppItemMenus(appInfo)}
        />
      ))}
      <RenderModal />
    </div>
  );
}

export default AppList;
