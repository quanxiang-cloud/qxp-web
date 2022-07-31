import React from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';

import Card from '@c/card';
import Loading from '@c/loading';
import appStore from '../../store';
import { Button, Icon } from '@one-for-all/ui';
import ArteryRenderer from '@c/artery-renderer';
import { ARTERY_KEY_VERSION } from '@portal/constants';

import { LayoutType } from '../types.d';
import EmptyTips from '@c/empty-tips';
import AbsoluteCentered from '@c/absolute-centered';

export const LAYOUT_TYPE_MAP = {
  [LayoutType.HeaderContent]: '顶部导航',
  [LayoutType.LeftSidebarContent]: '侧边导航',
  [LayoutType.RightSidebarContent]: '侧边导航',
};

function AppNav(): JSX.Element {
  const { viewStore } = appStore;
  const history = useHistory();
  const rootLayout = viewStore?.layouts.find((view) => view.id === 'root_node');

  if (appStore.loading) {
    return <Loading />;
  }

  if (!viewStore?.appLayout) {
    return (
      <AbsoluteCentered>
        <EmptyTips text="该没有应用导航" className="py-10" />
      </AbsoluteCentered>
    );
  }

  return (
    <Card
      className="h-full transition-opacity flex flex-col flex-1 mt-0"
      headerClassName="px-20 py-16 h-48 nav-card-header bg-gray-50 header-background-image rounded-t-8"
      title="应用导航"
      itemTitleClassName="text-caption-no-color-weight font-semibold"
      desc='预设有Logo位、菜单项和个人，位于所有页面固定位置，拥有点击链接只加载页面内容的特性'
      descClassName="text-caption"
      contentClassName='px-24 pt-24 flex flex-col gap-16 flex-1'
    >
      <div className='px-16 py-8 rounded-8 border-1 flex items-center'>
        <div className="page-details-icon">
          <Icon
            size={24}
            type="dark"
            name={'schema-form'}
          />
        </div>
        <div className='flex-1 grid grid-cols-6 mr-48'>
          {
            [
              {
                id: 'type',
                title: '导航结构',
                value: LAYOUT_TYPE_MAP[rootLayout?.type || LayoutType.HeaderContent],
              },
            ]?.map(({ title, value }) => {
              return (
                <div
                  key={title}
                  className='flex flex-col justify-between'
                >
                  <p className={!value ? 'text-gray-400' : ''}>{value ? value : '-'}</p>
                  <p className='page-details-text'>{title}</p>
                </div>
              );
            })}
        </div>
        <Button
          modifier='primary'
          onClick={() => {
            history.push(`/artery-engine?appID=${viewStore.appID}&pageName=应用布局&arteryID=${rootLayout?.refSchemaID}`, {
              isNav: true,
            });
          }} >
          设计导航
        </Button>
      </div>
      <div className='rounded-t-8 border-1 flex-1'>
        <ArteryRenderer
          arteryID={rootLayout?.refSchemaID || ''}
          version={ARTERY_KEY_VERSION}
        />
      </div>
    </Card>
  );
}

export default observer(AppNav);
