import React from 'react';
import ItemWithTitleDesc from '@c/item-with-title-desc';
import SideNavCard from '@c/side-nav-card';
import AppIcon from '@c/app-icon';

const InfoCard = () => {
  const MENU = [
    {
      id: 'message',
      icon: 'notifications',
      name: '消息管理',
      url: '/system/message',
      authority: 'system/read',
    },
    {
      id: 'log',
      icon: 'assignment',
      name: '系统日志',
      url: '/system/log',
      authority: 'audit/read',
    },
    {
      id: 'unusual',
      icon: 'article',
      name: '异常任务',
      url: '/system/unusual',
      authority: 'abnormalFlow',
    },
    {
      id: 'config',
      icon: 'outlet',
      name: '平台参数配置',
      url: '/system/config',
      authority: 'abnormalFlow',
    },
  ];

  return (
    <SideNavCard
      className="w-280"
      cardTitle={(
        <div className="access-background-image p-20 opacity-90">
          <ItemWithTitleDesc
            title="系统管理"
            desc="系统全局配置的统一管理"
            itemRender={
              (<AppIcon themeColor="fuchsia" size={48} iconName="system_management" />)
            }
            titleClassName="text-h4"
            descClassName="text-caption"
          />
        </div>
      )}
      menuData={MENU as any}
      defaultActiveLink={{ basePath: '/system', menuId: 'message' }}
    />
  );
};

export default InfoCard;
