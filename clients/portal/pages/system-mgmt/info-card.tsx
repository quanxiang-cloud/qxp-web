import React from 'react';
import ItemWithTitleDesc from '@c/item-with-title-desc';
import ListMenu from './list-menu';

const InfoCard = (props: any) => {
  return (
    <div className="w-316 bg-white rounded-12 mr-20">
      <div className="access-background-image p-20 opacity-90">
        <ItemWithTitleDesc
          title="系统管理"
          desc="对系统全局配置的统一管理"
          itemRender={
            (<div
              className="bg-gradient-green-to-top-right
                icon-border-radius w-48 h-48 flex-initial
                flex items-center justify-center
                "
            >
              <img src="/dist/images/sys-mgmt.png"/>
            </div>)
          }
          titleClassName="text-h4"
          descClassName="text-caption"
        />
      </div>
      <div className="p-20">
        <ListMenu/>
      </div>
    </div>
  );
};

export default InfoCard;
