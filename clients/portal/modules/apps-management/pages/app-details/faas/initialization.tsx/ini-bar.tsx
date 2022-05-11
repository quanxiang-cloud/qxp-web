
import React from 'react';
import { observer } from 'mobx-react';

import { Develop, Group, AddInGroup } from './step';
import store from './store';

function Initializate(): JSX.Element {
  const { setModalType, userAccount } = store;
  return (
    <>
      <div className='text-gray-700 mt-40'>开通该模块需要进行一些初始化程序，完成以下步骤即可开通：</div>
      <div className='flex mt-16'>
        <Develop
          step={store.step}
          userAccount={userAccount}
          onClick={() => setModalType('bindDevelop')}
        />
        <Group step={store.step} onClick={() =>setModalType('bindGroup')}/>
        <AddInGroup step={store.step} onClick={() =>setModalType('join')}/>
      </div>
    </>
  );
}

export default observer(Initializate);
