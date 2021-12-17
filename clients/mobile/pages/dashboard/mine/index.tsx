import React, { useState } from 'react';
import { HomePageProps } from '../types';
import cs from 'classnames';
import Avatar from '@m/qxp-ui-mobile/avatar';
import { greeting } from '@m/lib/formatter';
import Icon from '@m/qxp-ui-mobile/icon';
import { useHistory } from 'react-router-dom';
import AlertDialog from '@m/components/alert-dialog';
import { accountPath } from '@m/constant';

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
  const history = useHistory();

  function onLogout(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      localStorage?.removeItem('HOME_APP_PAGE_NAV_STATUS_v1');
      window.location.href = '/logout';
      setTimeout(() => resolve(false), 10000);
    });
  }

  return (
    <div className={cs('h-full', { hidden: !props.active })} key={props.key}>
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

        <div className="account-security flex items-center bg-white pointer-shadow"
          onClick={() => history.push(accountPath)}>
          <Icon name="shield_account" size=".24rem" addPrefix />
          <p className="flex-1 body1 text-secondary ml-8 mr-8 truncate">账号安全</p>
          <Icon name="chevron_right" size=".16rem"/>
        </div>

      </div>

      <AlertDialog
        positiveButton={{ text: '退出登录', loadingText: '退出中' }}
        onPositiveClick={onLogout}
        title='确定退出登录吗？'
        titleStyle={{ paddingTop: '.1rem', paddingBottom: '.22rem' }}
        show={showPopup}
        negativeButton={true}
        onClose={() => setShowPopup(false)} />
    </div>
  );
};

export default Mine;
