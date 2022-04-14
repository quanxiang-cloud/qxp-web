import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react';

import Icon from '@c/icon';
import Search from '@c/search';
import Popper from '@c/popper';
import TwoLevelMenu from '@c/two-level-menu';

import EditRoleModal from './edit-role-modal';
import DelRoleModal from './del-role-modal';
import RoleMenu from './role-menu';

import store from './store';

const modifiers = [
  {
    name: 'offset',
    options: {
      offset: [0, 4],
    },
  },
];

type Props = {
  setRole: (role: RoleRight | undefined) => void
}

function RoleNav({ setRole }: Props): JSX.Element {
  const { appID } = useParams<AppParams>();
  const reference = React.useRef<Element>(null);
  const popperRef = React.useRef<Popper>(null);

  useEffect(() => {
    appID && store.setAppID(appID);
    return () => {
      store.clear();
    };
  }, []);

  useEffect(() => {
    setRole(store.curRole);
  }, [store.curRole]);

  return (
    <>
      <div className='app-nav flex h-full flex-col overflow-auto bg-gray-50'>
        <div className="px-8 pt-16 py-8 flex items-center text-12">
          <Search
            className='flex-1'
            placeholder="搜索名称..."
            value={store.searchRoleWords}
            onChange={store.setSearchRoleInput}
          />
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
        {store.roles.length !== 0 && (
          <TwoLevelMenu<RoleRight>
            defaultSelected={store.curRole?.id}
            onSelect={(role) => {
              store.setCurRole(role.source as RoleRight);
            }}
            menus={store.roles}
            actions={(role) => <RoleMenu role={role}/>}
          />
        )}
      </div>
      {['edit', 'copy', 'add'].includes(store.modalType) && <EditRoleModal/>}
      {store.modalType === 'delete' && <DelRoleModal/>}
    </>
  );
}

export default observer(RoleNav);
