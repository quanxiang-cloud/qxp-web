import React, { useEffect } from 'react';

import { Button } from '@one-for-all/headless-ui';
import Tab from '@c/tab';

import ComponentStyleCustomization from './component-style-customization';
import store from './store';

import './index.css';

export default function StyleGuide(): JSX.Element {
  useEffect(() => {
    store.fetchStyleConfig();
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
            id: 'componentStyleCustomization',
            name: '组件样式配置',
            content: <ComponentStyleCustomization />,
          },
        ]}
      />
    </div>
  );
}