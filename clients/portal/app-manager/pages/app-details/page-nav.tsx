import React from 'react';
import useCss from 'react-use/lib/useCss';

import Icon from '@c/icon';

const ItemRender = ({ title, iconName }) => {
  return (
    <div className={`p-16 flex items-center cursor-pointer ${useCss({
      '&:hover': {
        'background-color': '#F1F5F9',
        span: {
          color: '#0F172A',
        },
      },
    })}`}>
      <Icon size={24} className='mr-8' name={iconName} />
      <span className='text-gray-400'>{title}</span>
    </div>
  );
};

function PageNav() {
  return (
    <div className='app-details-nav'>
      <ItemRender title='新建页面' iconName='add' />
    </div>
  );
}

export default PageNav;
