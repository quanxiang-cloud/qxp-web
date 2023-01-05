import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';
import { useParams } from 'react-router';

import toast from '@lib/toast';
import { MenuType } from '@portal/modules/apps-management/pages/app-details/type';
import { pathPrefix } from '@m/constant';
import NavPage from '@m/components/nav-page';
import { Menu } from '../types';
import detailStore from '../page-detail/store';
import AppTableViewDetail from '@home/pages/app-table-view-detail';
// import AppItem from '@m/components/app-item';
// import { Loading } from '@one-for-all/headless-ui';
// import { Icon } from '@one-for-all/ui';
// import { Empty } from 'antd';
// import { mapColor } from '../utils';

import store from './store';
import 'antd/dist/antd.css';
import '../../../../assets/css/antd.css';
import './index.scss';
import MobileMenu from '@c/NavigateMenu';

function AppDetail(): JSX.Element {
  const { appID } = useParams<{ appID: string }>();

  useEffect(() => {
    window.isMobile = true;
    store.initApp(appID);
    return store.clear;
  }, []);

  const history = useHistory();

  useEffect(() => {
    if (store.state.error) {
      toast.error(store.state.error);
    }
  }, [store.state.error]);

  function onMenuClick(menu: Menu): void {
    switch (menu.menuType) {
    case MenuType.customPage:
      onRecordClick(menu);
      break;
    case MenuType.schemaForm:
      // Todo: Add page detail new;
      break;
    default:
      toast.error('无法打开该页面');
      break;
    }
  }

  function onRecordClick(record: Menu): void {
    detailStore.setup(record);
    history.push(`${pathPrefix}/apps/${appID}/${record.id}`);
  }

  const handleGoLink = (path: string)=>{
    store.initPageList(path);
  };

  return (
    <NavPage title={store.app?.name ?? appID} style={{ padding: '.12rem .16rem' }}>
      {/* {store.state.loading && <Loading className='pt-16 pb-16'>加载中...</Loading>}

      {!store.state.loading && store.state.error && (
        <Empty
          onClick={() => store.init(appID)}
          title={store.state.error}
          content='请点击此处重新加载'
          image='/dist/images/no-api-group.svg'/>
      )}
      {!store.state.loading && !store.state.error && !store.menu?.length && !store.records?.length && (
        <Empty
          onClick={() => store.init(appID)}
          title='暂无页面'
          content='请联系企业内管理员添加该应用的页面'
          image='/dist/images/no-api-group.svg'/>
      )}

      {!store.state.loading && !store.state.error && !!store.menu?.length && (
        <>
          <div className='title3 text-primary mb-16'>操作入口</div>
          <div className='menu-container'>
            {store.menu.map((m) => (
              <AppItem key={m.id}
                icon={m.icon}
                iconSize='.3rem'
                iconColor={mapColor(store.app?.color as BgColor)}
                appName={m.name}
                onClick={() => onMenuClick(m)}
              />
            ))}
          </div>
        </>
      )}

      {!store.state.loading && !store.state.error && !!store.records?.length && (
        <>
          <div className='title3 text-primary' style={{ margin: '.2rem 0 .08rem 0' }}>
            申请记录
          </div>
          {store.records.map((m) => {
            return (
              <div key={m.id} onClick={() => onRecordClick(m)}
                className='records-item body1 pointer-8 flex items-center text-primary'>
                <Icon name={m.icon}
                  size='.26rem'
                  style={{ color: mapColor(store.app?.color as BgColor) }}
                />
                <div className='flex-1 truncate ml-8'>{m.name}</div>
                <div className='text-placeholder ml-8 mr-8'>{m.applyCount ?? 0}</div>
                <Icon name='chevron_right' size='.16rem' />
              </div>
            );
          })}
        </>
      )} */}

      <div className='mobile-wrapper'>
        <div className='mobile-menu'>
          {<MobileMenu menus={store.menu as any} goLink={handleGoLink}></MobileMenu>}
        </div>
        {
          store.tableID &&
          (<AppTableViewDetail
            key={store.tableID}
            appID={appID || 'noAppID'}
            tableID={store.tableID || 'noTableID'}
            name={store.name || 'noName'}
            isMobile={true}
          />)
        }
        {
          !store.tableID &&
          ( <h1>自定义页面示例</h1>)
        }
      </div>

    </NavPage>
  );
}

export default observer(AppDetail);
