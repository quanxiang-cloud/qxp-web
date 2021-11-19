import React from 'react';

import Button from '@c/button';

import store from '../store';

function DataEmpty(): JSX.Element {
  const { setModalType } = store;
  return (
    <div className="w-259 m-auto flex flex-col h-full items-center text-center justify-center">
      <img src="/dist/images/nodata.svg" alt="no data" className="mb-8" />
      <span className='text-12 text-gray-400'>暂无数据。您可以点击新建函数 </span>
      <span className='text-12 text-gray-400'>通过定义函数、构建、上线创建符合需求的函数</span>
      <Button
        iconName="add"
        modifier="primary"
        className="mt-16"
        onClick={() => setModalType('editModel')}>
          新建函数
      </Button>
    </div>
  );
}

export default DataEmpty;
