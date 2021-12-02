import React from 'react';
import { observer } from 'mobx-react';

import Button from '@c/button';

import store from './store';

function NotAvailable(): JSX.Element {
  const { hasGroup, initLoading, initFaas, initErr } = store;

  return (
    <div className="text-12 p-40">
      <p className="text-24 font-semibold">FaaS 函数计算</p>
      <p className="my-20">
        函数计算（Function Compute）是一个事件驱动的全托管 Serverless 计算服务，
        您无需管理服务器等基础设施，只需编写代码并上传，函数计算会为您准备好计算资源，并以弹性、可靠的方式运行您的代码。开通该模块会进行一些初始化程序，大约需要10秒可开通。
        <span className="text-blue-600 cursor-pointer">查看文档</span>
      </p>
      <div className="flex items-center">
        <Button
          className="mr-12"
          textClassName="flex items-center"
          modifier="primary"
          onClick={() => initFaas(window.USER.email)}
        >
          {initLoading && <img src='/dist/images/loading.svg' alt="loading" className="w-16 h-16 mr-8" />}
          {initErr ? '重试' : `${!hasGroup ? '开通 FaaS 函数计算' : '加入 FaaS 函数协作'}`}

        </Button>
        <Button iconName="help_outline">操作指南</Button>
      </div>
    </div>
  );
}

export default observer(NotAvailable);
