import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import cs from 'classnames';
import { Menu } from 'antd';
import { useHistory } from 'react-router-dom';

import Tab from '@c/no-content-tab';
import Icon from '@c/icon';
import Button from '@c/button';
import Search from '@c/search';
import { savePer } from './api';
import toast from '@lib/toast';
import Loading from '@c/loading';
import PageLoading from '@c/page-loading';
import AbsoluteCentered from '@c/absolute-centered';

import store from './store';
import Authorized from './authorized';
import DataPermission from './data-permission';
import FieldPermissions from './field-permissions';

const { SubMenu } = Menu;

function RightsGroups(): JSX.Element {
  const history = useHistory();
  const { rightsList, perFormLoading } = store;
  const [activeTab, setActiveTab] = useState('authorized');
  const [openset, setOpenSet] = useState(false);
  const fieldRef = useRef<{ getFieldPer:() => any, reset: () => void}>(null);
  const authorizedRef = useRef<{ getAuthorizedPer:() => number, reset: () => void}>(null);
  const dataPerRef = useRef<{ getDataValues:() => Promise<ConditionMap>, reset: () => void }>(null);

  useEffect(() => {
    store.fetchPerGroupForm(store.currentRights.id);
    setOpenSet(false);
    setActiveTab('authorized');
  }, [store.rightsGroupID]);

  const handleClickMenu = (item: any): void => {
    store.currentPage = store.perFormList.find((page) => page.id === item.key) as PerPageInfo;
    store.getPageSchema();
    setOpenSet(false);
    setActiveTab('authorized');
  };

  const tabItem = [{
    label: '操作权限',
    key: 'authorized',
  }];

  if (store.currentPage.menuType !== 2) {
    tabItem.push(...[
      {
        label: '字段权限',
        key: 'fieldPermissions',
      },
      {
        label: '数据权限',
        key: 'dataPermission',
      },
    ]);
  }

  const handleSave = (): void => {
    const authority = authorizedRef.current?.getAuthorizedPer() || 0;
    if (store.currentPage.menuType === 2) {
      store.updatePerCustom(authority);
      setOpenSet(false);
      return;
    }
    dataPerRef.current?.getDataValues().then((conditions) => {
      if (conditions) {
        if (
          JSON.stringify(conditions) !== '{}' && !conditions.delete?.arr.length &&
          !conditions.find?.arr.length && !conditions.update?.arr.length) {
          toast.error(`${store.currentRights.name}自定义数据权限需要至少填写 1 条有效数据。!`);
          return;
        }
        savePer(store.appID, {
          formID: store.currentPage.id,
          perGroupID: store.rightsGroupID,
          schema: fieldRef.current?.getFieldPer(),
          conditions,
          authority,
        }).then(() => {
          toast.success('保存成功!');
          store.updatePerFormList({ ...store.currentPage, authority }, store.rightsGroupID);
          setOpenSet(false);
        }).catch((err) => {
          toast.error(err);
        });
      } else {
        toast.error('数据权限填写不完整');
      }
    });
  };

  const handleCancel = (): void => {
    store.rightsLoading = true;
    setTimeout(() => {
      store.rightsLoading = false;
    }, 100);
    setOpenSet(false);
  };

  if (perFormLoading) {
    return <Loading/>;
  }

  if (rightsList.length) {
    return (
      <div className='h-full flex border border-b-0'>
        <div className='app-nav h-full menu-nav'>
          <div className='text-14 text-gray-400 m-16'>选择菜单</div>
          <Search
            className="search-menu mx-16 ml-18"
            placeholder="搜索菜单名称..."
            onChange={store.changeMenuKeyword}
          />
          {store.currentPage.id && !!store.menuList.length && (
            <Menu
              onClick={handleClickMenu}
              className = 'text-16'
              defaultSelectedKeys={[store.currentPage.id]}
              defaultOpenKeys={[store.currentPageGroup?.id || '']}
              mode="inline"
            >
              {store.menuList.map((menu) => {
                if (menu.menuType === 1) {
                  return (
                    <SubMenu key={menu.id} title={menu.name}>
                      {menu.child && menu.child.map((PageInfo: PageInfo) => (
                        <Menu.Item key={PageInfo.id}>
                          <Icon
                            name={PageInfo.icon || 'event_available'}
                            className='text-inherit mr-8'
                            size={20}
                          />
                          {PageInfo.name}
                        </Menu.Item>
                      ))}
                    </SubMenu>
                  );
                }
                return (
                  <Menu.Item key={menu.id} >
                    <Icon
                      name={menu.icon || 'event_available'}
                      className='text-inherit font-inherit mr-8'
                      size={20}
                    />
                    {menu.name}
                  </Menu.Item>
                );
              })}
            </Menu>
          )}
        </div>
        { !store.menuList.length && (
          <div className='app-no-data mt-58'>
            <img src='/dist/images/new_tips.svg' />
            <span>无{store.MenuKeyword}菜单。
            </span>
          </div>
        )}
        { !!store.menuList.length && (
          <div className='h-full flex-1 overflow-hidden flex flex-col'>
            <div className='conf-title text-14'>
              <div className='text-gray-400 font-semibold'>
              配置权限：<span className='text-gray-900'>{store.currentPage.name}</span>
              </div>
              {store.currentRights.types !== 1 && !store.noSchema && (
                <div>
                  { openset ? (
                    <>
                      <Button onClick={handleCancel} iconName="close" className='mr-16'>取消</Button>
                      <Button onClick={handleSave} modifier='primary' iconName="check">保存配置</Button>
                    </>) : (
                    <Button
                      onClick={() => setOpenSet(true)}
                      modifier='primary'
                      iconName="settings"
                      className='mr-16'>
                      配置权限
                    </Button>)
                  }
                </div>
              )
              }
            </div>
            <div className="p-16 flex-1 overflow-auto">
              {store.rightsLoading && (
                <div className='h-56 p-20'>
                  <PageLoading />
                </div>
              )}
              {store.noSchema && (
                <div className='h-56 p-20'>
                  <AbsoluteCentered>
                未配置页面，请点击
                    <span
                      className='text-btn'
                      onClick={() =>
                        history.push(`/apps/details/${store.appID}/page_setting?pageID=${store.currentPage.id}`)}
                    >
                    前往配置
                    </span>
                  </AbsoluteCentered>
                </div>
              )}
              {!store.rightsLoading && !store.noSchema && (
                <>
                  <Tab
                    className='mb-16'
                    activeTab={activeTab}
                    size='small'
                    onChange={(key: string) => setActiveTab(key)}
                    tabs={tabItem}
                  />
                  <Authorized
                    abled={openset}
                    authorized={store.PerData.authority}
                    ref={authorizedRef}
                    className={cs({ ['rights-hidden']: activeTab !== 'authorized' })}
                  />
                  {store.currentPage.menuType !== 2 && (
                    <>
                      <FieldPermissions
                        abled={openset}
                        fieldPer={store.PerData.schema}
                        ref={fieldRef}
                        className={cs({ ['rights-hidden']: activeTab !== 'fieldPermissions' })}
                        fields={store.Fields}
                      />
                      <DataPermission
                        abled={openset}
                        dataPer={store.PerData.conditions}
                        ref={dataPerRef}
                        className={cs({ ['rights-hidden']: activeTab !== 'dataPermission' })}
                        fields={store.Fields}
                      />
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )
        }
      </div>
    );
  }

  return (
    <div className='app-no-data mt-58'>
      <img src='/dist/images/new_tips.svg' />
      <span>暂无权限组</span>
    </div>
  );
}

export default observer(RightsGroups);
