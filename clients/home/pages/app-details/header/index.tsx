import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useHistory, useParams } from 'react-router-dom';

import toast from '@lib/toast';
import Select from '@c/select';
import AppsSwitcher from '@c/apps-switcher';
import Icon from '@c/icon';
import UserAvatarMenu from '@c/user-avatar-menu';
import NavMsgBar from '@portal/modules/msg-center/nav-msg-bar';

import { fetchUserList, getPerOption, roleChange } from '../../../lib/api';
import store from '../store';
import './index.scss';

type Props = {
  onCancel?: () => void;
}

type PerItem = {
  id: string;
  name: string;
}

type PerRes = {
  optionPer: PerItem[];
  selectPer: PerItem;
}

function DetailsHeader({ onCancel }: Props): JSX.Element {
  const history = useHistory();
  const [appList, setAppList] = useState([]);
  const [options, setOptions] = useState<{ value: string, label: string }[]>([]);
  const [curRole, setCurRole] = useState<string>();
  const { appID } = useParams<{ appID: string }>();
  const { showPageNav, operationType } = store;

  useEffect(() => {
    getPerOption<PerRes>(appID).then((res) => {
      const { optionPer = [], selectPer = { id: '' } } = res;
      setCurRole(selectPer.id || '');
      setOptions(optionPer.map(({ id, name }) => ({ value: id, label: name })));
    });

    fetchUserList().then((res: any) => {
      if (res.data.findIndex(({ id }: AppInfo) => id === appID) === -1) {
        toast.error('应用不存在！2秒后跳转到首页');
        setTimeout(() => {
          history.replace('/');
        }, 2000);
      }
      setAppList(res.data);
    });
  }, [appID]);

  const handleChange = (newAppId: string): void => {
    history.replace(location.pathname.replace(appID, newAppId));
  };

  const handleRoleChange = (roleID: string): void => {
    roleChange(appID, roleID).then(() => {
      store.clear();
      store.fetchPageList(appID);
    });
  };

  return (
    <div className="app-global-header app-details-header">
      <div className='flex items-center'>
        {operationType ? (
          <>
            <div onClick={onCancel} className='corner-8-8-8-2 cursor-pointer hover:bg-gray-100'>
              <Icon
                clickable
                changeable
                size={21}
                className='text-gray-400'
                name='keyboard_backspace'
              />
              <span className="ml-6 text-gray-400 text-12">{store.curPage.name}</span>
            </div>
            <div className='mx-8 text-12 text-gray-600'>/</div>
            <div className="font-semibold text-gray-900 text-12">{store.operationType}</div>
          </>) : (
          <>
            {!showPageNav && (
              <>
                <div
                  onClick={() => history.push('/')}
                  className='app-header-icon text-gray-400 corner-8-8-8-2'
                >
                  <Icon size={21} className='m-6' name='home_qxp'/>
                </div>
                <span className='mx-8 text-14'>/</span>
                <AppsSwitcher
                  hiddenStatus={true}
                  apps={appList}
                  currentAppID={appID}
                  onChange={handleChange}
                />
                <span className='mx-8 text-14'>/</span>
              </>
            )}
            <span className="font-semibold text-gray-900 text-12">{store.curPage.name}</span>
            <span className="ml-8 text-gray-400 text-12">{store.curPage.describe}</span>
          </>)}
        <div>
        </div>
      </div>
      <div className='flex items-center'>
        {options.length > 1 && (
          <div className='flex items-center'>
            切换角色：
            <Select value={curRole} onChange={handleRoleChange} className='w-144' options={options} />
          </div>
        )}
        <NavMsgBar type='portal' className="mx-16"/>
        <div className="header-nav-btn group">
          <UserAvatarMenu />
        </div>
      </div>
    </div>
  );
}

export default observer(DetailsHeader);
