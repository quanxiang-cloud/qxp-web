import React from 'react';

import Icon from '@c/icon';

import './index.scss';

function FilterSetting() {
  return (
    <div className='page-setting-filter'>
      <Icon className='mr-8' name='settings' size={20} />
      筛选条件配置
    </div>
  );
}

export default FilterSetting;
