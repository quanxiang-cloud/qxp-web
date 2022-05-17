import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import TextHeader from '@c/text-header';
import Loading from '@c/loading';

import store from './store';
import DataList from './data-list';
import StepsTip from './steps-tip';
import EditModal from './edit-modal';
import FuncDetailsDrawer from './func-drawer';

import '../index.scss';

 type Props = {
   appID: string,
   group: string,
 }

function FuncList({ group, appID }: Props): JSX.Element {
  const { modalType, setModalType, funcListLoading } = store;

  useEffect(() => {
    store.setGroupID(group);
    store.setAppID(appID);
  }, []);

  if (funcListLoading) {
    return <Loading/>;
  }

  return (
    <>
      {modalType !== 'VersionDetail' && (
        <>
          <TextHeader
            title="Faas函数"
            itemTitleClassName="text-12 font-semibold"
            desc="函数计算（Function Compute）是一个事件驱动的全托管 Serverless 计算服务"
            actionClassName="text-12"
            action={<a className="ease-linear underline">📌 &nbsp;四步完成 Faas 函数</a>}
            className="bg-gray-1000 p-16 header-background-image h-44 shadow-header rounded-t-12"
            descClassName="text-gray-400"
          />
          <StepsTip />
          <div
            className="flex flex-col w-full p-16 flex-1 overflow-hidden pb-0"
            style={{ height: 'calc(100% - 82px)' }}
          >
            <DataList />
          </div>
        </>
      )}
      {modalType === 'editModel' && (
        <EditModal modalType={modalType} onClose={() => setModalType('')} />
      )}
      {modalType === 'funDetail' && (
        <FuncDetailsDrawer/>
      )}
    </>

  );
}

export default observer(FuncList);
