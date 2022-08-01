import React from 'react';
import { useLocation } from 'react-router-dom';
import cs from 'classnames';

import HeaderNav from './header-nav';
import HeaderMenu from './header-menu';
import { useConfig } from '@lib/hooks';
import {
  PlatformBaseInfo,
  PLATFORM_BASE_INFO_KEY,
  VERSION,
} from '@portal/modules/system-mgmt/platform-setting/logo-setting';
import { Icon } from '@one-for-all/ui';
import { OSS_PUBLIC_BUCKET_NAME, OSS_DOMAIN } from '@c/file-upload/constants';

export default function GlobalHeader(): JSX.Element {
  const location = useLocation();

  const [config, loading] = useConfig<PlatformBaseInfo>(PLATFORM_BASE_INFO_KEY, VERSION, {});

  if (location.pathname.startsWith('/apps')) {
    return <></>;
  }

  return (
    <div className="flex justify-between items-center py-2 px-24 bg-blue-600 home-global-header">
      <HeaderNav />
      {
        loading ? (
          <Icon
            name='image'
            size={20}
            className='animate-pulse'
          />
        ) : (
          <div className={cs('flex-1 h-52 flex items-center justify-center', {
            'py-10': config?.homeLogo,
          })}>
            {
              config?.homeLogo ? (
                <img
                  className='h-full'
                  src={`${window.location.protocol}//${OSS_PUBLIC_BUCKET_NAME}.${OSS_DOMAIN}/${config?.homeLogo}`}
                  alt="home_logo"
                />
              ) : (
                <Icon
                  name='image'
                  size={20}
                />
              )
            }
          </div>
        )
      }
      <HeaderMenu />
    </div>
  );
}
