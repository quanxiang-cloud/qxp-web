import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import TextHeader from '@c/text-header';

import store from '../store';
import DataList from './data-list';
import StepsTip from './steps-tip';
import DataEmpty from './data-empty';
import EditModal from './edit-modal';

import '../index.scss';

function FuncList(): JSX.Element {
  const { funcList, fetchDataList, modalType, setModalType } = store;

  useEffect(() => {
    fetchDataList('', { appID: '', size: '', page: '' });
  }, []);

  return (
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
      <div className="flex flex-col" style={{ height: 'calc(100% - 44px)' }}>
        <StepsTip />
        <div className="p-16 flex-1">
          {funcList.length ? <DataList /> : <DataEmpty />}
        </div>
      </div>
      {modalType && <EditModal modalType={modalType} onClose={() => setModalType('')} />}
    </>
  );
}

export default observer(FuncList);
