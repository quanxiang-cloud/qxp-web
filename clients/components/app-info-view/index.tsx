import React from 'react';

import Icon from '@c/icon';
import AppIcon from '@c/app-icon';
import Tooltip from '@c/tooltip';
import { parseJSON } from '@lib/utils';

import './index.scss';

type Props = {
  appInfo: AppInfo;
  className?: string;
  onClick?: () => void;
}

const STATUS_MAP: Record<string, string> = {
  1: '已发布',
  '-1': '未发布',
  '-2': '导入中',
  '-3': '导入失败',
  '-4': '应用初始化失败',
  '-5': '应用初始化中',
};

function AppInfoView({ appInfo, onClick, className = '' }: Props): JSX.Element {
  const appIcon = parseJSON<AppIconInfo>(appInfo.appIcon, { bgColor: 'amber', iconName: '' });

  return (
    <div onClick={onClick} className={`${className} flex-1 flex overflow-hidden items-center`}>
      <AppIcon
        className='mr-8'
        themeColor={appIcon.bgColor}
        iconName={appIcon.iconName}
        size={44}
      />
      <div className='flex-1 app-info-view-text overflow-hidden'>
        <p className='truncate app-info-view-name text-gray-900'>{appInfo.appName}</p>
        {'useStatus' in appInfo && (
          <p className='app-info-view-status flex items-center'>
            {STATUS_MAP[appInfo.useStatus]}
            {appInfo.useStatus === -2 &&
              <img src='/dist/images/loading.svg' alt="loading" className="w-16 h-16 ml-4" />
            }
            {appInfo.useStatus === -3 && (
              <Tooltip className="z-10 text-12" position="bottom" label="该应用文件内容有误或不完整，请删除该APP后重新导入">
                <Icon name="error" className="ml-4 cursor-pointer" style={{ color: 'var(--red-600)' }} />
              </Tooltip>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

export default AppInfoView;
