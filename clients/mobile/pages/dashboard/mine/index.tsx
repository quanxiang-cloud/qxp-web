import React, { useState } from 'react';
import { HomePageProps } from '../types';
import cs from 'classnames';
import Avatar from '@m/qxp-ui-mobile/avatar';
import { greeting } from '@m/lib/formatter';
import Icon from '@m/qxp-ui-mobile/icon';
import Popup from '@m/qxp-ui-mobile/popup';
import Button from '@m/qxp-ui-mobile/button';

function getDepName(dep?: UserDepartment): string {
  let child = dep;
  if (!child) return '';
  while (child.child) {
    child = child.child;
  }
  return child.departmentName;
}

const Mine: React.FC<HomePageProps> = (props) => {
  const { userName, email, dep } = window.USER;
  const [showPopup, setShowPopup] = useState(false);
  const [logout, setLogout] = useState(false);

  function onLogout(): void {
    setLogout(true);
    localStorage.removeItem('HOME_APP_PAGE_NAV_STATUS_v1');
    window.location.href = '/logout';
  }

  return (
    <div className={cs('h-full bg-white', { hidden: !props.active })} key={props.key}>
      <div className='mine-top-wrapper'>
        <div className='mine-top-bg'/>
      </div>

      <div className='mine-content-wrapper'>
        <div className='user-card bg-white'>
          <Avatar name={userName}
            size='.48rem'
            className='user-avatar title2'
          />
          <Icon name='more_horiz'
            size='.36rem'
            className='ic-more pointer-8'
            onClick={() => setShowPopup(true)}/>
          <div className="title1 text-primary">{greeting(userName)}</div>
          <div className="caption text-placeholder">不是杰出者才能做梦，而是善梦者才杰出</div>
          <div className="user-info-card mt-12">
            <div className='flex items-center text-secondary'>
              <Icon name='email' addPrefix />
              <p className='flex-1 ml-8 mr-8 truncate'>{email}</p>
            </div>
            <div className='flex items-center text-secondary mt-6'>
              <Icon name='organization_chart' addPrefix />
              <p className='flex-1 ml-8 mr-8 truncate'>{getDepName(dep)}</p>
            </div>
          </div>
        </div>

        <div className="account-security flex items-center bg-white pointer-shadow">
          <Icon name="shield_account" size=".24rem" addPrefix />
          <p className="flex-1 body1 text-secondary ml-8 mr-8 truncate">账号安全</p>
          <Icon name="chevron_right" size=".16rem"/>
        </div>

      </div>

      <Popup visible={showPopup} round safeAreaInsetBottom
        position="bottom"
        onClose={() => setShowPopup(false)}>
        <div className="padding-12">
          <h3 className="title3 text-primary text-center"
            style={{ paddingTop: '.1rem', paddingBottom: '.22rem' }}>
            确定退出登录吗？
          </h3>
          <Button block theme='tertiary' loading={logout}
            onClick={onLogout}
            className='mb-8' loadingText='退出中'>
            退出登录
          </Button>
          <Button block theme='textSecondary' className='mb-8'
            onClick={() => setShowPopup(false)}>
            取消
          </Button>
        </div>
      </Popup>
    </div>
  );
};

export default Mine;
