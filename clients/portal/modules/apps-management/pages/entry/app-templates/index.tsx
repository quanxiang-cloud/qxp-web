import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import Icon from '@c/icon';
import { MenuItem } from '@c/more-menu';
import TextHeader from '@c/text-header';

import store from './store';
import AppItem from '../components/render-item';
import EditTemplateModal from './template-edit/edit-template-modal';
import DelTemplateModal from './template-edit/del-template-modal';

function AppTemplates(): JSX.Element {
  const [modalType, setModalType] = useState('');
  const { templateList, fetchList, curTemplate, setCurTemplate } = store;

  useEffect(() => {
    fetchList();
  }, []);

  const menus: MenuItem[] = [
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

  const openModal = (_modalType: string, _curApp: AppInfo): void => {
    setModalType(_modalType);
    setCurTemplate(_curApp);
  };

  function handleActions(key: string, itemData: AppInfo): void {
    switch (key) {
    case 'editTemplate':
      openModal('editTemplate', itemData);
      break;
    case 'delTemplate':
      openModal('delTemplate', itemData);
      break;
    default:
      break;
    }
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
            tmpInfo={curTemplate}
            onCancel={() => setModalType('')}
          />
        )}
        {modalType === 'delTemplate' &&
          <DelTemplateModal appInfo={curTemplate} onCancel={() => setModalType('')} />
        }
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
        <div className="flex-1 border-t-1 border-gray-200 app-list-container p-16">
          {templateList.map((tmpInfo: AppInfo) => (
            <AppItem
              menus={menus}
              key={tmpInfo.id}
              appInfo={tmpInfo}
              openModal={openModal}
              handleActions={handleActions}
            />
          ))}
        </div>
      </div>
      <RenderModal />
    </>
  );
}

export default observer(AppTemplates);
