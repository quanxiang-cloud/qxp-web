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
    },
    {
      id: 'log',
      icon: 'assignment',
      name: '系统日志',
      url: '/system/log',
    },
    {
      id: 'dataset',
      icon: 'article',
      name: '数据集',
      url: '/system/dataset',
    },
  ];
  return (
    <div className="w-316 bg-white rounded-12 mr-20">
      <SideNavCard cardTitle={(
        <div className="access-background-image p-20 opacity-90">
          <ItemWithTitleDesc
            title="系统管理"
            desc="对系统全局配置的统一管理"
            itemRender={
              (<AppIcon themeColor="fuchsia" size={48} iconName="system_management" />)
            }
            titleClassName="text-h4"
            descClassName="text-caption"
          />
        </div>
      )}
      menuData={MENU}
      defaultActiveLink={{ basePath: '/system', menuId: 'message' }}
      />

    </div>
  );
};

export default InfoCard;
