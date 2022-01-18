import React, { useEffect, useState } from 'react';

import TextHeader from '@c/text-header';
import { fetchTemplateList } from './api';

function AppTemplates(): JSX.Element {
  const [state, setState] = useState(0);

  useEffect(() => {
    fetchTemplateList().then(({ count }) => {
      setState(count);
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
      <div className="p-16 font-semibold">我的模板 · {state}</div>
      <div className="flex-1 border-t-1 border-gray-200"></div>
    </div>
  );
}

export default AppTemplates;
