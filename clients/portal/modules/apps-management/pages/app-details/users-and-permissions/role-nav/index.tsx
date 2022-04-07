import React, { useState, useMemo, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';

import Icon from '@c/icon';
import Search from '@c/search';
import Popper from '@c/popper';
import Loading from '@c/loading';
import MoreMenu from '@c/more-menu';
import ErrorTips from '@c/error-tips';
import TwoLevelMenu from '@c/two-level-menu';

import EditRightModal from './edit-right-modal';
import DelRoleModal from './del-role-modal';
import { fetchRoles } from '../api';
import { useQuery } from 'react-query';
import store from './store';
import UserAndPerStore from '../store';

const modifiers = [
  {
    name: 'offset',
    options: {
      offset: [0, 4],
    },
  },
];

const ROOL_TOOlS: Record<string, string> = {
  edit: '修改信息',
  copy: '复制权限组',
  delete: '删除权限组',
};

function RoleNav(): JSX.Element {
  const history = useHistory();
  const [searchWords, setSearchWord] = useState('');

  const reference = React.useRef<Element>(null);
  const popperRef = React.useRef<Popper>(null);
  const { appID, setCurrentRole } = UserAndPerStore;

  useEffect(() => {
    appID && store.setAppID(appID);
  }, [appID]);

  const { data: rolesList, isLoading, isError } = useQuery(
    ['GET_ROLES', appID],
    () => fetchRoles(appID), {
      enabled: !!appID,
    });

  useEffect(() => {
    rolesList && store.setRolesList(rolesList) && store.setCurRole(rolesList[0]);
  }, [rolesList]);

  useEffect(() => {
    setCurrentRole(store.curRole);
  }, [store.curRole]);

  const roles = useMemo(() => {
    if (store.rolesList.length) {
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
    }
    return [];
  }, [store.rolesList, searchWords]);

  const MenuLabel = useMemo(() => {
    const menu: Record<string, any> = {};
    Object.keys(ROOL_TOOlS).forEach((label) => {
      const _MenuLabel = (
        <div className="flex items-center" key={label}>
          <Icon name="create" size={16} className="mr-8" />
          <span className="font-normal">{ROOL_TOOlS[label]}</span>
        </div>
      );
      menu[label] = _MenuLabel;
    });
    return menu;
  }, []);

  const menus = Object.keys(ROOL_TOOlS).map((key) => {
    return { key, label: MenuLabel[key] };
  });

  if (isLoading) {
    return <Loading/>;
  }

  if (isError) {
    return <ErrorTips desc="something wrong!" />;
  }

  return (
    <>
      <div className='app-nav flex h-full flex-col overflow-auto bg-gray-50'>
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
              store.setModalType('add');
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
          <TwoLevelMenu<RoleRight>
            defaultSelected={store.curRole.id}
            onSelect={(role) => {
              store.setCurRole(role.source as RoleRight);
              history.push(`/apps/details/${appID}/app_control?id=${role.id}`);
            }}
            menus={roles}
            actions={(role) => (
              <MoreMenu
                menus={role.source?.types === 1 ? menus.slice(0, 1) : menus}
                placement="bottom-end"
                onMenuClick={store.setModalType}
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
      {['edit', 'copy', 'add'].includes(store.modalType) && <EditRightModal/>}
      {store.modalType === 'delete' && <DelRoleModal/>}
    </>
  );
}

export default observer(RoleNav);
