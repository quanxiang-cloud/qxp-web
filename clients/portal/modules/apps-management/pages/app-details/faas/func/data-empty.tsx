import React from 'react';

import Button from '@c/button';
import EmptyTips from '@c/empty-tips';

import store from '../store';

function DataEmpty(): JSX.Element {
  const { setModalType } = store;
  return (
    <div className="w-259 m-auto flex flex-col h-full justify-around">
      <div className="text-center">
        <EmptyTips text="暂无数据。您可以点击新建函数通过定义函数、构建、上线创建符合需求的函数" />
        <Button
          iconName="add"
          modifier="primary"
          className="mt-16"
          onClick={() => setModalType('create')}>
          新建函数
        </Button>
      </div>
    </div>
  );
}

export default DataEmpty;
