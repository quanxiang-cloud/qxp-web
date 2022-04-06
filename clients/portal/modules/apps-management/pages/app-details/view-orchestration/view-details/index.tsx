import React from 'react';

import EmptyTips from '@c/empty-tips';

import ViewInfo from './view-info';
import { View } from '../types.d';

type Props = {
  viewInfo?: View;
  openModal: (type: string) => void;
}

function ViewDetails({ viewInfo, openModal }: Props): JSX.Element {
  // todo get pageDescriptions and related
  return (
    <div className='view-details-container flex flex-col h-full'>
      {!viewInfo && <EmptyTips className="empty" text='暂无页面数据,请先新建页面' />}
      {!!viewInfo && (
        <>
          <div className='h-44 page-details-nav header-background-image border-b-1 px-16 flex items-center bg-gray-50'>
            <span className='text-12 mr-8 font-semibold flex justify-between'>{viewInfo.name}</span>
            <span className='text-caption align-top'>{viewInfo.url}</span>
          </div>
          <ViewInfo openModal={openModal} view={viewInfo} />
        </>
      )}
    </div>
  );
}

export default ViewDetails;
