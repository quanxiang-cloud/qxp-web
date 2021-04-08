import React from 'react';

import Icon from '@c/icon';

const BUILD_NAV = [
  { title: '新建表单', desc: '表单页通常用来做数据的收集或是单据填制。', type: 'form' },
  { title: '新建流程表单', desc: '流程审批。', type: 'flow' },
  { title: '新建仪表', desc: '仪表盘是数据可视化工具，可用于数据展示分析。', type: 'meter' },
];

function PageBuildNav() {
  return (
    <div className='app-page-build-nav rounded-tl-12 rounded-tr-12'>
      {BUILD_NAV.map(({ title, desc, type })=>(
        <div key={type} className={`app-page-build-nav-bg-${type} app-page-build-nav-item`}>
          <Icon className='mr-8' name='list_alt' type='light' size={44} />
          <div className=' flex-1 text-white'>
            <p className='text-h5-blod'>{title}</p>
            <p className='text-caption-no-color'>{desc}</p>
          </div>
          <Icon name='arrow_right_alt' type='light' size={24} />
        </div>
      ))}
    </div>
  );
}

export default PageBuildNav;
