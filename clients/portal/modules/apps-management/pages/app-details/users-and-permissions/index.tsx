import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import cs from 'classnames';

import Icon from '@c/icon';
import Tab from '@c/tab';
import Modal from '@c/modal';
import toast from '@lib/toast';
import Search from '@c/search';
import MoreMenu from '@c/more-menu';
import TextHeader from '@c/text-header';

import EditRightModal from './edit-right-modal';
import AssociatedPerson from './associated-personnel';
import RightsGroups from './rights-groups';
import store from './store';

import './index.scss';

function UsersAndPermissions(): JSX.Element {
  const [modalType, setModalType] = useState('');
  const [showEditRightModal, setShowEditRightModal] = useState(false);
  const [showDeleteRightModal, setShowDeleteRightModal] = useState(false);
  const { appID } = useParams<AppParams>();

  useEffect(() => {
    store.appID = appID;
    store.fetchRights();
    return () => {
      store.appID = '';
    };
  }, [appID]);

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
        <RightsGroups/>
      ),
    },
  ];

  const handleDleteSubmit = (): void => {
    if (store.currentRights.scopes) {
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
          <div className='app-nav text-gray-600 flex h-full flex-col overflow-auto'
            style={{ width: '220px' }}
          >
            <Search
              className="m-10"
              placeholder="搜索应用角色名称..."
              value={store.rightsKeyword}
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
              <Icon className='text-inherit' size={20} name='add'/>
              添加授权角色
            </div>
            <ul className='flex-1 overflow-auto'>
              {store.rightsList.map((rights: Rights) => (
                <li
                  key={rights.id}
                  className={cs('group nav-item px-16', {
                    'bg-gray-100 text-blue-600': rights.id === store.rightsGroupID,
                  })}
                  onClick={() => {
                    store.currentRights = rights;
                    store.rightsGroupID = rights.id;
                  }}
                >
                  <Icon className='text-inherit mr-4' size={20} name='people_alt'/>{rights.name}
                  <div
                    className={cs('ml-auto opacity-0 group-hover:opacity-100 flex-shrink-0', {
                      'opacity-100': rights.id === store.rightsGroupID,
                    })}
                  >
                    <MoreMenu
                      menus={rights.types === 1 ? menus : menusTemp}
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
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className='authority-detail flex-1 pt-5 overflow-hidden'>
            <Tab
              separator
              strechNavs={false}
              items={tabItems}
              className='w-full h-full rights-tab'
              navsClassName='tab-title'
              contentClassName='m-16 mb-0'
            />
            <div
              className='rights-mes text-white '
            >
              <Icon name="people_alt" className='text-white mr-8' size={32}/>
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
            删除该权限组吼，在平台内无法恢复权限组
            <span className='text-16 text-gray-900 mx-6'>{store.currentRights.name}</span>
            数据，确定删除该权限组吗？
          </div>
        </Modal>
      )}
    </>
  );
}

export default observer(UsersAndPermissions);
