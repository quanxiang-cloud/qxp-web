import React, { useEffect } from 'react';

import Button from '@c/button';
import Tab from '@c/tab';

import ComponentStyleCustomization from './component-style-customization';
import DesignToken from './design-token';
import store from './store';

import './index.css';

export default function StyleGuide(): JSX.Element {
  useEffect(() => {
    store.fetchStyleConfig();
    store.fetchDesignTokenConfig();
  }, []);

  return (
    <div className='h-screen flex flex-col'>
      <div className='flex justify-between items-center p-20'>
        <div>Style Guide</div>
        <Button onClick={store.saveStyleConfig}>保存</Button>
      </div>
      <Tab
        className='bg-white'
        items={[
          {
            id: 'designToken',
            name: '通用样式配置',
            content: <DesignToken />,
          },
          {
            id: 'componentStyleCustomization',
            name: '组件样式配置',
            content: <ComponentStyleCustomization />,
          },
        ]}
      />
    </div>
  );
}
