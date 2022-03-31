import React, { useEffect } from 'react';

import Button from '@c/button';
import Tab from '@c/tab';

import ComponentStyleConfigCenter from './component-style-config-center';
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
            id: 'componentStyleConfigCenter',
            name: '组件样式配置',
            content: <ComponentStyleConfigCenter />,
          },
        ]}
      />
    </div>
  );
}
