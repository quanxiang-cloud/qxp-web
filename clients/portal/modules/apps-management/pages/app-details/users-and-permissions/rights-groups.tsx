import React, { useEffect, useRef, useState, useMemo } from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import cs from 'classnames';
import { useHistory } from 'react-router-dom';

import Tab from '@c/no-content-tab';
import Button from '@c/button';
import Search from '@c/search';
import { savePer } from './api';
import toast from '@lib/toast';
import Loading from '@c/loading';
import PageLoading from '@c/page-loading';
import AbsoluteCentered from '@c/absolute-centered';
import TwoLevelMenu, { NodeItem, pageListToTree } from '@c/two-level-menu';

import store from './store';
import Authorized from './authorized';
import DataPermission from './data-permission';
import FieldPermissions from './field-permissions';

function RightsGroups(): JSX.Element {
  const history = useHistory();
  const { rightsList, perFormLoading } = store;
  const [activeTab, setActiveTab] = useState('authorized');
  const [openset, setOpenSet] = useState(false);
  const fieldRef = useRef<{ getFieldPer:() => any, reset: () => void }>(null);
  const authorizedRef = useRef<{ getAuthorizedPer:() => number, reset: () => void }>(null);
  const dataPerRef = useRef<{ getDataValues:() => Promise<ConditionMap>, reset: () => void }>(null);

  useEffect(() => {
    store.fetchPerGroupForm(store.currentRights.id);
    setOpenSet(false);
    setActiveTab('authorized');
  }, [store.rightsGroupID]);

  const handleClickMenu = (node: NodeItem<PageInfo>): void => {
    store.currentPage = store.perFormList.find((page) => page.id === node.id) as PerPageInfo;
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
      if (authority === 0) {
        store.rightsLoading = true;
        store.deleteFormPer(store.currentPage.id, store.rightsGroupID).then(() => {
          store.perData = ({
            conditions: {},
            schema: null,
            authority: 0,
          });
          store.rightsLoading = false;
        });
        setOpenSet(false);
        return;
      }

      if (conditions) {
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

  const menus = useMemo(() => pageListToTree(toJS(store.menuList)), [store.menuList]);

  if (perFormLoading) {
    return <Loading />;
  }

  if (rightsList.length) {
    return (
      <div className='h-full flex border border-b-0'>
        <div className='app-nav h-full menu-nav'>
          <div className='text-12 text-gray-600 font-semibold m-16'>选择菜单</div>
          <Search
            className="mx-8 mb-8"
            placeholder="搜索菜单名称..."
            onChange={store.changeMenuKeyword}
          />
          { !!store.menuList.length && (
            <TwoLevelMenu<PageInfo>
              defaultSelected={store.currentPage.id}
              menus={menus}
              onSelect={handleClickMenu}
              groupBanSelect
            />
          )}
        </div>
        {!store.menuList.length && (
          <div className='app-no-data mt-58'>
            <img src='/dist/images/new_tips.svg' />
            <span>无{store.MenuKeyword}菜单。
            </span>
          </div>
        )}
        {!!store.menuList.length && (
          <div className='h-full flex-1 overflow-hidden flex flex-col'>
            <div className='conf-title text-12'>
              <div className='text-gray-400 font-semibold'>
                配置权限：<span className='text-gray-900'>{store.currentPage.name}</span>
              </div>
              {store.currentRights.types !== 1 && !store.noSchema && (
                <div>
                  {openset ? (
                    <>
                      <Button onClick={handleCancel} iconName="close" className='mr-16'>取消</Button>
                      <Button onClick={handleSave} modifier='primary' iconName="check">保存配置</Button>
                    </>) : (
                    <Button
                      onClick={() => setOpenSet(true)}
                      modifier='primary'
                      iconName="settings"
                      iconSize={16}
                      textClassName="text-12 leading-20"
                      className='mr-16 px-16 py-6'>
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
                        history.push(`/apps/details/${store.appID}/page_setting?pageID=${store.currentPage.id}`)
                      }
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
                    labelClassName="tab-label-item"
                    size='small'
                    onChange={(key: string) => setActiveTab(key)}
                    tabs={tabItem}
                  />
                  <div className="w-full border-t-1 h-1 -mt-16 mb-16"></div>
                  <Authorized
                    abled={openset}
                    authorized={store.perData.authority}
                    ref={authorizedRef}
                    className={cs({ ['rights-hidden']: activeTab !== 'authorized' })}
                  />
                  {store.currentPage.menuType !== 2 && (
                    <>
                      <FieldPermissions
                        abled={openset}
                        fieldPer={store.perData.schema}
                        ref={fieldRef}
                        className={cs({ ['rights-hidden']: activeTab !== 'fieldPermissions' })}
                        fields={store.Fields}
                      />
                      <DataPermission
                        abled={openset}
                        dataPer={store.perData.conditions}
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
        )}
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
