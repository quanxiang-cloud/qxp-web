import React, { useEffect, useState } from 'react';

import Icon from '@c/icon';
import { MenuItem } from '@c/more-menu';
import TextHeader from '@c/text-header';

import { fetchTemplateList, TemplateListRes } from './api';
import AppItem from '../apps-management/pages/entry/app-list/app-item';
import EditTemplateModal from './template-edit/edit-template-modal';
import DelTemplateModal from './template-edit/del-template-modal';

type TemplateInfo = AppInfo & {
  name: string;
}
function AppTemplates(): JSX.Element {
  const [state, setState] = useState<TemplateListRes>();
  const [modalType, setModalType] = useState('');
  const [currentAppInfo, setCurrentAppInfo] = useState<AppInfo | null>(null);

  useEffect(() => {
    fetchTemplateList().then((res) => {
      setState(res);
    });
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
    setCurrentAppInfo(_curApp);
  };

  function RenderModal() {
    if (!currentAppInfo) {
      return null;
    }

    return (
      <>
        {modalType === 'editTemplate' &&
          (<EditTemplateModal
            modalType={modalType}
            tmpInfo={currentAppInfo}
            onCancel={() => setModalType('')}
          />)
        }
        {modalType === 'delTemplate' &&
          <DelTemplateModal appInfo={currentAppInfo} onCancel={() => setModalType('')} />
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
        <div className="p-16 font-semibold">我的模板 · {state?.count ?? 0}</div>
        <div className="flex-1 border-t-1 border-gray-200 app-list-container p-16">
          {state?.templates.map((tmpInfo: TemplateInfo) => (
            <AppItem
              menus={menus}
              key={tmpInfo.id}
              appInfo={{ ...tmpInfo, appName: tmpInfo.name }}
              openModal={openModal}
            />
          ))}
        </div>
      </div>
      <RenderModal />
    </>
  );
}

export default AppTemplates;
