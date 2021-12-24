import React, { ReactNode, useEffect } from 'react';
import { useParams } from 'react-router';
import { useSetState } from 'react-use';
import { observer } from 'mobx-react';

import NavPage from '@m/components/nav-page';
import Loading from '@m/qxp-ui-mobile/loading';
import { Empty } from '@m/qxp-ui-mobile/empty';
import { MenuType } from '@portal/modules/apps-management/pages/app-details/type';
import PullRefresh from '@m/qxp-ui-mobile/pull-refresh';
import List from '@m/qxp-ui-mobile/list';
import TaskCard from '@m/components/task-card';
import Divider from '@m/qxp-ui-mobile/divider';
import AlertDialog from '@m/components/alert-dialog';
import Icon from '@m/qxp-ui-mobile/icon';

import store from './store';
import './index.scss';

function PageDetail(): JSX.Element {
  const { appID, pageID } = useParams<{ appID: string, pageID: string }>();
  const [state, setState] = useSetState({
    showPopup: false,
    id: '',
  });

  function init(): void {
    store.init(appID, pageID);
  }

  useEffect(() => {
    init();
    return store.clear;
  }, []);

  function onDeleteClick(e: React.MouseEvent, id: string): void {
    e.stopPropagation();
    setState({ showPopup: true, id });
  }

  function onUpdateClick(e: React.MouseEvent): void {
    e.stopPropagation();
  }

  function renderEmptyPage(): JSX.Element {
    return (
      <Empty
        onClick={init}
        title='暂无页面'
        content='请联系企业内管理员添加页面'
        image='/dist/images/no-api-group.svg'/>
    );
  }

  function renderEmptyList(): JSX.Element {
    return (
      <Empty
        title='暂无数据'
        image='/dist/images/no-api-group.svg'/>
    );
  }

  function renderPageDetail(): ReactNode | ReactNode[] {
    switch (store.page?.menuType) {
    case MenuType.schemaForm:
      return (
        <>
          <PullRefresh
            onRefresh={() => store.loadTables(1)}
            className='flex-1'>
            <List finished={store.finished}
              style={{ padding: '0 .16rem' }}
              onLoad={() => store.loadTables(store.currentPage + 1)}
              className='h-full overflow-scroll safe-area-bottom'>
              {store.list.length > 0 && (store.list.map((task) =>
                (<TaskCard
                  key={task.id}
                  task={task}
                  className='mt-4 mb-8'>
                  <div className='card-bottom'>
                    <Divider color='#E6ECF9'/>
                    <div className='operate-button-wrapper flex justify-center items-center body1'>
                      {store.canDelete && (
                        <button
                          style={{ borderRadius: `0 0 ${store.canUpdate ? '0' : '.12rem'} .12rem` }}
                          className='operate-button btn-delete pointer'
                          onClick={(e) => onDeleteClick(e, task.id)}
                        >
                            删除
                        </button>
                      )}
                      {store.canUpdate && store.canDelete &&
                          <Divider direction='vertical' size='.16rem' color='var(--gray-200)'/>}
                      {store.canUpdate && (
                        <button
                          className='operate-button btn-update pointer'
                          style={{ borderRadius: `0 0 .12rem ${store.canDelete ? '0' : '.12rpm'}` }}
                          onClick={onUpdateClick}
                        >
                            修改
                        </button>
                      )}
                    </div>
                  </div>
                </TaskCard>
                )))
              }
              {store.list.length < 1 && store.inited && renderEmptyList()}
            </List>
          </PullRefresh>
          <div className='floating-button flex justify-center items-center'>
            <Icon size='.26rem' name='add' style={{ color: 'white' }}/>
          </div>
        </>
      );
    case MenuType.customPage:
      if (!store.customPageInfo?.fileUrl) {
        return renderEmptyPage();
      }
      return (
        <iframe
          className='w-full h-full'
          src={store.customPageInfo?.fileUrl}
        />
      );
    default:
      return (
        <Empty
          onClick={init}
          title='加载失败'
          content='无法加载此页面类型'
          image='/dist/images/no-api-group.svg'/>
      );
    }
  }
  return (
    <>
      <NavPage title={store.page?.name ?? pageID} absolute className='flex flex-col'>
        {store.state.loading && <Loading className='pt-16 pb-16'>加载中...</Loading>}
        {!store.state.loading && store.state.error && (
          <Empty
            onClick={init}
            title={store.state.error}
            content='请点击此处重新加载'
            image='/dist/images/no-api-group.svg'/>
        )}
        {!store.state.loading && !store.state.error && renderPageDetail()}
      </NavPage>

      <AlertDialog
        title='确定要删除该数据？'
        show={state.showPopup}
        onPositiveClick={() => store.delete(state.id)}
        positiveButton={{ text: '确定删除', loadingText: '删除中' }}
        negativeButton
        onClose={() => setState({ showPopup: false, id: '' })} />
    </>
  );
}

export default observer(PageDetail);
