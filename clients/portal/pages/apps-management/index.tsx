import React from 'react';

import WorkFlowList from './work-flow/list';

import './style.scss';

export default function AppManagement() {
  return (
    <div className="px-58 py-20 h-full flex flex-col">
      <div className="w-172 h-24 bg-gray-300 mb-16"></div>
      <div className="flex flex-row space-between flex-1">
        <div className="w-316 bg-gray-300 mr-20 flex-none" style={{ height: '324px' }}></div>
        <WorkFlowList />
      </div>
    </div>
  );
}
