import React, { useState } from 'react';

import TextHeader from '@c/text-header';

import WorkFlowListTable from './table';
import WorkFlowToolbar from './toolbar';

export default function WorkFlowCard(): JSX.Element {
  const [triggerType, setTriggerType] = useState<'' | 'FORM_TIME' | 'FORM_DATA'>('');
  const [searchInput, setSearchInput] = useState<string>('');

  return (
    <div className="h-full flex-1 bg-white rounded-t-12">
      <TextHeader
        title="工作流"
        itemTitleClassName="text-12 font-semibold"
        desc="使用可视化工作流技术为业务高效流转提供支持，轻松创建业务流程应用"
        actionClassName="text-12"
        className="bg-gray-1000 p-16 header-background-image h-44 shadow-header rounded-t-12"
        descClassName="text-gray-400"
      />
      <div
        className="flex flex-col w-full p-16 h-full"
        style={{ height: 'calc(100% - 44px)' }}
      >
        <WorkFlowToolbar onTriggerTypeChange={setTriggerType} onSearchInputChange={setSearchInput} />
        <WorkFlowListTable type={triggerType} searchInput={searchInput} />
      </div>
    </div>
  );
}
