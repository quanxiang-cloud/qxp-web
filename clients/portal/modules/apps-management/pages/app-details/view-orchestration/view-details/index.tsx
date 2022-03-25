import React from 'react';

import EmptyTips from '@c/empty-tips';

import ViewInfo from './view-info';
import { View, ViewType, CardInfo } from '../types.d';

type Props = {
  viewInfo?: View;
}
const DEFAULT_CARD_LIST = [
  {
    id: 'linkedFlows',
    title: '关联工作流',
    list: [],
  },
  {
    id: 'AuthorizedRoles',
    title: '已授权角色',
    list: [],
  },
];

function getCardList(type?: ViewType): CardInfo[] {
  if (type !== ViewType.TableSchemaView) {
    return [DEFAULT_CARD_LIST[1]];
  }

  return DEFAULT_CARD_LIST;
}

function ViewDetails({ viewInfo }: Props): JSX.Element {
  const cardList = getCardList(viewInfo?.type);

  // todo get pageDescriptions and related

  return (
    <div className='view-details-container h-full'>
      {!viewInfo && <EmptyTips className="empty" text='暂无页面数据,请先新建页面' />}
      {!!viewInfo && (
        <>
          <div className='h-44 page-details-nav header-background-image border-b-1 px-16 flex items-center bg-gray-50'>
            <span className='text-12 mr-8 font-semibold'>{viewInfo.name}</span>
            {/* <span className='text-caption align-top'>{currentView.describe}</span> */}
          </div>
          <ViewInfo cardList={cardList} view={viewInfo} />
        </>
      )}
    </div>
  );
}

export default ViewDetails;
