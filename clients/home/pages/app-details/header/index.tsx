import React from 'react';
import { observer } from 'mobx-react';
import { useHistory, useParams } from 'react-router-dom';

import AppsSwitcher from '@c/apps-switcher';
import Icon from '@c/icon';
import UserAvatarMenu from '@c/user-avatar-menu';
import NavMsgBar from '@portal/modules/msg-center/nav-msg-bar';

import store from '../store';

import './index.scss';

type Props = {
  onCancel?: () => void;
}

function DetailsHeader({ onCancel }: Props): JSX.Element {
  const history = useHistory();
  const { appID } = useParams<{ appID: string }>();
  const { showPageNav, operationType } = store;

  const handleChange = (newAppId: string): void => {
    history.replace(location.pathname.replace(appID, newAppId));
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
                size={20}
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
                  <Icon size={20} className='m-6' name='home_qxp'/>
                </div>
                <span className='mx-8 text-14'>/</span>
                <AppsSwitcher
                  hiddenStatus={true}
                  apps={store.appList}
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
        <NavMsgBar type='portal' className="mx-16"/>
        <div className="header-nav-btn group">
          <UserAvatarMenu />
        </div>
      </div>
    </div>
  );
}

export default observer(DetailsHeader);
