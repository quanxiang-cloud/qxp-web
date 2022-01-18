import React, { useEffect, useState } from 'react';

import TextHeader from '@c/text-header';

import { fetchTemplateList, TemplateListRes } from './api';
import AppItem from '../apps-management/pages/entry/app-list/app-item';

function AppTemplates(): JSX.Element {
  const [state, setState] = useState<TemplateListRes>();

  useEffect(() => {
    fetchTemplateList().then((res) => {
      setState(res);
    });
  }, []);

  return (
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
        {state?.templates.map((appInfo: AppInfo) => (
          <AppItem key={appInfo.id} appInfo={appInfo} openModal={() => null} />
        ))}
      </div>
    </div>
  );
}

export default AppTemplates;
