import React from 'react';

import { Icon } from '@one-for-all/ui';
import Tooltip from '@c/tooltip';
import { copyToClipboard } from '@lib/utils';
import PageLoading from '@c/page-loading';

import ViewInfo from './view-info';
import { View } from '../types.d';

type Props = {
  viewInfo?: View;
  openModal: (type: string) => void;
}

function ViewDetails({ viewInfo, openModal }: Props): JSX.Element {
  return (
    <div className='view-details-container flex flex-col h-full'>
      {!viewInfo && <PageLoading />}
      {!!viewInfo && (
        <>
          <div className='h-44 page-details-nav header-background-image border-b-1 px-16 flex gap-8 items-center bg-gray-50'>
            <span className='text-12 font-semibold flex justify-between'>{viewInfo.name}</span>
            <span className='text-caption align-top'>{viewInfo.url}</span>
            <Tooltip position="top" label="复制路径" theme='dark' >
              <Icon
                className='cursor-pointer'
                name='content_copy'
                size={16}
                onClick={() => copyToClipboard(viewInfo.url, '已经成功复制到剪切板')}
              />
            </Tooltip>
          </div>
          <ViewInfo openModal={openModal} view={viewInfo} />
        </>
      )}
    </div>
  );
}

export default ViewDetails;
