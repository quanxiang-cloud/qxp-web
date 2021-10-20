import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react';

import Icon from '@c/icon';
import Tab from '@c/tab';
import Modal from '@c/modal';
import toast from '@lib/toast';
import Search from '@c/search';
import MoreMenu from '@c/more-menu';
import TextHeader from '@c/text-header';
import TwoLevelMenu from '@c/two-level-menu';

import EditRightModal from './edit-right-modal';
import AssociatedPerson from './associated-personnel';
import RightsGroups from './rights-groups';
import store from './store';

import './index.scss';

function UsersAndPermissions(): JSX.Element {
  const [modalType, setModalType] = useState('');
  const [showEditRightModal, setShowEditRightModal] = useState(false);
  const [tabCurrentKey, setTabCurrentKey] = useState('associate');
  const [showDeleteRightModal, setShowDeleteRightModal] = useState(false);
  const { appID } = useParams<AppParams>();

  useEffect(() => {
    store.appID = appID;
    store.fetchRights();
    return () => {
      store.appID = '';
    };
  }, [appID]);

  useEffect(() => {
    setTabCurrentKey('associate');
  }, [store.rightsGroupID]);

  const roles = useMemo(() => {
    return store.rightsList.map((role) => {
      return {
        id: role.id,
        title: role.name || '',
        type: 'leaf',
        iconName: 'people_alt',
        source: role,
      };
    });
  }, [store.rightsList]);

  const menus = [
    {
      key: 'edit',
      label: (
        <div className="flex items-center">
          <Icon name="create" size={16} className="mr-8" />
          <span className="font-normal">修改信息</span>
        </div>
      ),
    },
  ];

  const menusTemp = [
    {
      key: 'edit',
      label: (
        <div className="flex items-center">
          <Icon name="create" size={16} className="mr-8" />
          <span className="font-normal">修改信息</span>
        </div>
      ),
    },
    {
      key: 'delete',
      label: (
        <div className="flex items-center" >
          <Icon name="restore_from_trash" size={16} className="mr-8" />
          <span className="font-normal">删除权限组</span>
        </div>
      ),
    },
  ];

  const tabItems = [
    {
      id: 'associate',
      name: '关联员工与部门',
      content: (
        <AssociatedPerson></AssociatedPerson>
      ),
    },
    {
      id: 'configuration',
      name: '配置访问权限',
      content: (
        <RightsGroups />
      ),
    },
  ];

  const handleDleteSubmit = (): void => {
    if (store.currentRights.scopes?.length) {
      toast.error(`${store.currentRights.name}  权限组已存在员工数据，请先移除该权限组下的所有员工数据。`);
      setShowDeleteRightModal(false);
      return;
    }
    store.deleteRight(store.currentRights.id);
    setShowDeleteRightModal(false);
  };

  return (
    <>
      <div className="flex flex-col h-full flex-1 bg-white rounded-t-12 overflow-hidden">
        <TextHeader
          title='业务功能授权'
          desc='控制该应用允许哪些员工使用，可以查看哪些模块，查看哪些数据，允许使用什么操作。'
          className="bg-gray-1000 px-20 py-16 header-background-image"
          itemClassName='items-center'
          itemTitleClassName="text-h5"
        />
        <div className='flex flex-1 w-full overflow-hidden'>
          <div className='bg-gray-50 app-nav text-gray-600 flex h-full flex-col overflow-auto'
            style={{ width: '220px' }}
          >
            <Search
              className="m-10"
              placeholder="搜索应用角色名称..."
              onChange={store.changeKeyword}
            />
            <div className='ml-10'>共{store.rightsList.length}条数据</div>
            <div
              className='nav-item pl-16'
              onClick={() => {
                setModalType('add');
                setShowEditRightModal(true);
              }}
            >
              <Icon className='text-inherit' size={20} name='add' />
              添加授权角色
            </div>
            {roles.length !== 0 && (
              <TwoLevelMenu<Rights>
                onSelect={(role) => {
                  store.currentRights = role.source as Rights;
                  store.rightsGroupID = role.id;
                }}
                defaultSelected={store.rightsGroupID}
                menus={roles}
                actions={(role) => (
                  <MoreMenu
                    menus={role.source?.types === 1 ? menus : menusTemp}
                    placement="bottom-end"
                    onMenuClick={(key) => {
                      if (key === 'edit') {
                        setModalType('edit');
                        setShowEditRightModal(true);
                      }
                      if (key === 'delete') {
                        setShowDeleteRightModal(true);
                      }
                    }}
                  >
                    <Icon
                      changeable
                      clickable
                      name='more_horiz'
                    />
                  </MoreMenu>
                )}
              />
            )}
          </div>
          <div className='authority-detail flex-1 pt-5 overflow-hidden w-1'>
            <Tab
              currentKey={tabCurrentKey}
              strechNavs={false}
              items={tabItems}
              className='w-full h-full rights-tab'
              navsClassName='tab-title'
              contentClassName='m-16 mb-0'
              onChange={setTabCurrentKey}
            />
            <div
              className='rights-mes text-white '
            >
              <Icon name="people_alt" className='text-white mr-8' size={32} />
              <div className=''>
                <div className='text-14 font-semibold'>{store.currentRights.name}</div>
                <div
                  className='rights-des text-12'
                  title={store.currentRights.description}
                >
                  {store.currentRights.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showEditRightModal && (
        <EditRightModal
          type={modalType}
          onCancel={() => setShowEditRightModal(false)}
        />
      )}

      {showDeleteRightModal && (
        <Modal
          className="static-modal"
          title='提示'
          onClose={() => setShowDeleteRightModal(false)}
          footerBtns={[
            {
              text: '取消',
              key: 'cancel',
              iconName: 'close',
              onClick: () => setShowDeleteRightModal(false),
            },
            {
              text: '确定',
              key: 'confirm',
              iconName: 'check',
              modifier: 'primary',
              onClick: handleDleteSubmit,
            },
          ]}
        >
          <div className='px-20 py-32'>
            删除该权限组后，在平台内无法恢复权限组
            <span className='text-16 text-gray-900 mx-6'>{store.currentRights.name}</span>
            数据，确定删除该权限组吗？
          </div>
        </Modal>
      )}
    </>
  );
}

export default observer(UsersAndPermissions);
