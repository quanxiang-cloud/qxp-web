import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import Loading from '@c/loading';

import store from './store';
import Initializate from './ini-bar';
import BindDeveloperModal from './bind-developer-modal';
import JoinGroupModal from './join-group-modal';
import BindGroupModal from './bind-group-modal';

type Props = {
  appID: string,
  onChangeStep: (step: number) => void,
  onChangeGrroup: (group: string) => void,
}

function NotAvailable({ appID, onChangeStep, onChangeGrroup }: Props): JSX.Element {
  const { modalType } = store;
  const { checkUserState, setAppID } = store;

  useEffect(() => {
    if (appID) {
      setAppID(appID);
      checkUserState();
    }
  }, [appID]);

  useEffect(() => {
    onChangeStep(store.step);
  }, [store.step]);

  useEffect(() => {
    onChangeGrroup(store.groupID);
  }, [store.groupID]);

  if (store.checkUserLoading) {
    return <Loading />;
  }

  return (
    <div className="h-full overflow-hidden flex flex-col text-12 p-40">
      <p className="text-24 font-semibold">FaaS 函数计算</p>
      <div className="mt-20 pb-40 border-b-1 border-gray-200">
        <p>
          函数计算（Function Compute）是一个事件驱动的全托管 Serverless 计算服务，
          您无需管理服务器等基础设施，只需编写代码并上传，函数计算会为您准备好计算资源，并以弹性、可靠的方式运行您的代码。
        </p>
        <p>
          FaaS函数的开发和使用需要用户具备一定的技术背景。用户可通过FaaS函数进行编码开发，去实现业务逻辑的编写。
          同时FaaS函数可支持多语言，用户可选择自己掌握的语言，进行业务逻辑编辑。在完成业务代码的编写，并推送到仓库之后，由系统完成构建镜像、上架以及生成API等操作。让用户更聚焦业务。
          <span className="text-blue-600 cursor-pointer">查看文档</span>
        </p>
      </div>
      <Initializate />
      {modalType === 'bindDevelop' && <BindDeveloperModal />}
      {modalType === 'bindGroup' && <BindGroupModal />}
      {modalType === 'join' && <JoinGroupModal />}
    </div>
  );
}

export default observer(NotAvailable);
