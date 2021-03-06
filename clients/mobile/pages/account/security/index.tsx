import React from 'react';
import { useHistory } from 'react-router-dom';

import Icon from '@m/qxp-ui-mobile/icon';
import NavPage from '@m/components/nav-page';
import Divider from '@m/qxp-ui-mobile/divider';
import { changePwdPath } from '@m/constant';

export default function AccountSecurity(): JSX.Element {
  const history = useHistory();

  return (
    <NavPage title='账号安全'>
      <div className='padding-10-16 pointer mt-16 flex text-secondary items-center w-full'
        onClick={() => history.push(changePwdPath)}>
        <p className='flex-1 truncate mr-8'>修改密码</p>
        <Icon name="chevron_right" size='.16rem' />
      </div>
      <Divider color='var(--gray-200)' size='calc(100% - .16rem)' className='ml-16'/>
    </NavPage>
  );
}
