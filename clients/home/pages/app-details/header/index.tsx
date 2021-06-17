import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useHistory, useParams } from 'react-router-dom';

import HeaderNav from '@c/header-nav';
import toast from '@lib/toast';
import Select from '@c/select';
import AppsSwitcher from '@c/apps-switcher';
import Avatar from '@c/avatar';
import Icon from '@c/icon';
import MoreMenu from '@c/more-menu';

import { fetchUserList, getPerOption, roleChange } from '../../../lib/api';
import store from '../store';
import './index.scss';
import ResetPasswordModal from '../../../components/global-header/reset-password-modal';

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
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState<boolean>(false);

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
  }, []);

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
      <ResetPasswordModal
        visible={openResetPasswordModal}
        onCancel={() => setOpenResetPasswordModal(false)}
      />
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
      <MoreMenu
        menus={[
          { key: 'resetPassword', label: '重置密码' },
          { key: 'logout', label: '登出' },
        ]}
        onMenuClick={(menuKey) => {
          if (menuKey === 'logout') {
            window.location.href = '/logout';
            return;
          }

          setOpenResetPasswordModal(true);
        }}
      >
        <div
          className="cursor-pointer flex items-center h-36
            hover:blue-100 transition group-hover:text-blue-600"
        >
          <Avatar
            username={window.USER.userName}
          />
          <Icon name="arrow_drop_down" size={20} />
        </div>
      </MoreMenu>
      {options.length > 1 && (
        <div className='flex items-center'>
          切换角色：
          <Select value={curRole} onChange={handleRoleChange} className='w-144' options={options} />
        </div>
      )}
    </div>
  );
}

export default observer(DetailsHeader);
