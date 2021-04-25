import React, { useState } from 'react';

import Icon from '@c/icon';
import Drawer from '@c/drawer';

import RightSetting from './rights-setting';
import './index.scss';

type Props = {
  rights: Rights;
  actions: (key: string, rights: Rights) => void
}

function RightsItem({ rights, actions }: Props) {
  const [settingVisible, setSettingVisible] = useState(false);

  return (
    <div className='pb-form-right-item'>
      <div className='pb-form-right-title'>
        <span className='text-h5 mr-8'>{rights.name}</span>
        <span className='text-caption-no-color text-gray-600'>{rights.description}</span>
        <span className='text-caption-no-color bg-red-50 text-red-600 mx-8 px-6'>
          优先级：{rights.sequence}
        </span>
        <p className='pb-form-right-action flex gap-x-16'>
          {/* <span>复制</span> */}
          <span onClick={() => setSettingVisible(true)}>修改</span>
          <span className='text-red-400' onClick={() => actions('del', rights)}>删除</span>
        </p>
      </div>
      <div className='p-20'>
        <div className='mb-4'>
          <div className='text-icon-btn py-4 px-8'>
            <Icon name='add' />
            添加员工与部门
          </div>
        </div>
        <div className='flex gap-8 flex-wrap'>
          {/* {rights.users.map(({ name }: any) => (
            <p className='pb-form-right-user' key={name}>{name}</p>
          ))}
          {rights.dep.map(({ name }: any) => (
            <p className='pb-form-right-dep' key={name}>{name}</p>
          ))} */}
        </div>
      </div>
      {settingVisible && (
        <Drawer title='编辑权限组' onCancel={() => setSettingVisible(false)}>
          <RightSetting rights={rights} />
        </Drawer>
      )}
    </div>
  );
}

export default RightsItem;
