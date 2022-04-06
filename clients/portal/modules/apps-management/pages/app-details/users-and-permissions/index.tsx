import React, { useEffect, useState, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { observer } from 'mobx-react';

import Icon from '@c/icon';
import Tab from '@c/tab';
import Modal from '@c/modal';
import Search from '@c/search';
import Popper from '@c/popper';
import MoreMenu from '@c/more-menu';
import TwoLevelMenu from '@c/two-level-menu';

import EditRightModal from './edit-right-modal';
import AssociatedPerson from './associated-personnel';
import DataSource from './data-source';
import store from './store';

import './index.scss';

const modifiers = [
  {
    name: 'offset',
    options: {
      offset: [0, 4],
    },
  },
];

function UsersAndPermissions(): JSX.Element {
  const history = useHistory();
  const [modalType, setModalType] = useState('');
  const [searchWords, setSearchWord] = useState('');
  const [showEditRightModal, setShowEditRightModal] = useState(false);
  const [tabCurrentKey, setTabCurrentKey] = useState('associate');
  const [showDeleteRightModal, setShowDeleteRightModal] = useState(false);
  const { appID } = useParams<AppParams>();
  const reference = React.useRef<Element>(null);
  const popperRef = React.useRef<Popper>(null);

  useEffect(() => {
    store.appID = appID;
    store.fetchRoles();
    return () => {
      store.clear();
    };
  }, [appID]);

  useEffect(() => {
    setTabCurrentKey('associate');
    if (store.currentRoleID) {
      store.fetchRolePerson();
    }
  }, [store.currentRoleID]);

  const roles = useMemo(() => {
    let _rolesList = [];
    if (searchWords) {
      _rolesList = store.rolesList.filter((role) => role.name?.match(searchWords));
    } else {
      _rolesList = store.rolesList;
    }
    return _rolesList.map((role) => {
      return {
        id: role.id,
        title: role.name || '',
        type: 'leaf',
        iconName: 'people_alt',
        source: role,
      };
    });
  }, [store.rolesList, searchWords]);

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
      key: 'copy',
      label: (
        <div className="flex items-center">
          <Icon name="content_copy" size={16} className="mr-8" />
          <span className="font-normal">复制权限组</span>
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
      content: <AssociatedPerson />,
    },
    {
      id: 'datasource',
      name: '数据源权限',
      content: <DataSource/>,
    },
  ];

  const handleDleteSubmit = (): void => {
    store.deleteRole(store.currentRole.id);
    setShowDeleteRightModal(false);
  };

  return (
    <>
      <div className="flex flex-col h-full flex-1 bg-white rounded-t-12 overflow-hidden">
        <div className='flex flex-1 w-full overflow-hidden'>
          <div className='app-nav flex h-full flex-col overflow-auto bg-gray-50'
            style={{ width: '220px' }}
          >
            <div className="px-8 pt-16 py-8 flex items-center text-12">
              <div className="flex-1">
                <Search
                  placeholder="搜索名称..."
                  value={searchWords}
                  onChange={setSearchWord}
                />
              </div>
              <div
                className="rights-add ml-8"
                ref={reference as any}
                onClick={() => {
                  setModalType('add');
                  setShowEditRightModal(true);
                }}
              >
                <Icon name="add" type="light" className="flex-shrink-0" size={20} />
              </div>
              <Popper
                ref={popperRef}
                trigger="hover"
                reference={reference}
                placement="bottom"
                modifiers={modifiers}
              >
                <div className="px-16 py-8 bg-gray-700 text-12 text-white rounded-8">
                  新建角色
                </div>
              </Popper>
            </div>
            {roles.length !== 0 && (
              <TwoLevelMenu<Roles>
                onSelect={(role) => {
                  store.currentRole = role.source as Roles;
                  store.currentRoleID = role.id;
                  history.push(`/apps/details/${appID}/app_control?id=${role.id}`);
                }}
                defaultSelected={store.currentRoleID}
                menus={roles}
                actions={(role) => (
                  <MoreMenu
                    menus={role.source?.types === 1 ? menus : menusTemp}
                    placement="bottom-end"
                    onMenuClick={(key) => {
                      if (key === 'edit' || key === 'copy') {
                        setModalType(key);
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
          <div className='authority-detail flex-1 pt-16 overflow-hidden w-1'>
            <Tab
              currentKey={tabCurrentKey}
              stretchNav={false}
              items={tabItems}
              className='w-full h-full rights-tab'
              navsClassName='tab-title'
              navTitleClassName="tab-label-item"
              contentClassName='m-16 mb-0'
              onChange={setTabCurrentKey}
            />
            <div
              className='rights-mes text-white '
            >
              <Icon name="people_alt" className='text-white mr-8' size={32} />
              <div className=''>
                <div className='text-12 font-semibold'>{store.currentRole.name}</div>
                <div
                  className='rights-des text-12'
                  title={store.currentRole.description}
                >
                  {store.currentRole.description}
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
            <span className='text-16 text-gray-900 mx-6'>{store.currentRole.name}</span>
            数据，确定删除该权限组吗？
          </div>
        </Modal>
      )}
    </>
  );
}

export default observer(UsersAndPermissions);
