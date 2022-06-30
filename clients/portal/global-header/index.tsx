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

const paths = [
  '/apps/formDesign',
  '/apps/details',
  '/apps/flow/',
  '/poly',
  '/apps/page-design',
];

function shouldHideHeader(currentPath: string): boolean {
  return paths.some((path) => currentPath.startsWith(path));
}
//
export default function GlobalHeader() {
  const { pathname } = useLocation();

  const [config, loading] = useConfig<PlatformBaseInfo>(PLATFORM_BASE_INFO_KEY, VERSION, {});

  if (shouldHideHeader(pathname)) {
    return null;
  }

  return (
    <div className="flex justify-between items-center px-24 bg-white shadow-flow-header">
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
            'py-10': config?.portalLogo,
          })}>
            {
              config?.portalLogo ? (
                <img
                  className='h-full'
                  src={`${window.location.protocol}//${OSS_PUBLIC_BUCKET_NAME}.${OSS_DOMAIN}/${config?.portalLogo}`}
                  alt="portal_logo"
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
