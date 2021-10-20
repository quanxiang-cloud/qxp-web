import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useHistory, useParams } from 'react-router-dom';

import HeaderNav from '@c/header-nav';
import toast from '@lib/toast';
import Select from '@c/select';
import AppsSwitcher from '@c/apps-switcher';
import UserAvatarMenu from '@c/user-avatar-menu';

import { fetchUserList, getPerOption, roleChange } from '../../../lib/api';
import store from '../store';
import './index.scss';

type PerItem = {
  id: string;
  name: string;
}

type PerRes = {
  optionPer: PerItem[];
  selectPer: PerItem;
}

function DetailsHeader(): JSX.Element {
  const history = useHistory();
  const [appList, setAppList] = useState([]);
  const [options, setOptions] = useState<{ value: string, label: string }[]>([]);
  const [curRole, setCurRole] = useState<string>();
  const { appID } = useParams<{ appID: string }>();

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
        <HeaderNav {...{ name: '工作台', icon: 'home_add_task', inside: true, url: '/' }} />
        <span className='mr-16 ml-8'>/</span>
        <AppsSwitcher
          hiddenStatus={true}
          apps={appList}
          currentAppID={appID}
          onChange={handleChange}
        />
      </div>
      <div className='flex items-center'>
        {options.length > 1 && (
          <div className='flex items-center'>
            切换角色：
            <Select value={curRole} onChange={handleRoleChange} className='w-144' options={options} />
          </div>
        )}
        <UserAvatarMenu />
      </div>
    </div>
  );
}

export default observer(DetailsHeader);
