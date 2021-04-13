import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Icon from '@c/icon';
import Tab, { TabProps } from '@appC/tab';
import NavButton from '@appC/nav-button';

import './index.scss';

const TABS: TabProps[] = [
  { label: '表单设计', key: 'formBuild' },
  { label: '页面配置', key: 'pageSetting' },
  { label: '发布表单', key: 'publishForm' },
];

function FormDesignHeader() {
  const { type } = useParams<any>();
  const history = useHistory();

  const tabChange = (tabKey: string) => {
    history.replace('/appManager/formDesign/' + tabKey);
  };

  return (
    <div className='form-design-header header-background-image h-56'>
      <div className='flex items-center'>
        <Icon
          clickable
          changeable
          onClick={() => history.goBack()}
          className='mr-16'
          size={20}
          name='keyboard_backspace'
        />
        正在设计表单：固定资产转移申请
        <Icon className='ml-8' name='edit' size={20} />
      </div>
      <Tab onChange={tabChange} activeTab={type} tabs={TABS} />
      <div className='flex justify-end'>
        <NavButton name='帮助文档' icon='book' url='' />
      </div>
    </div>
  );
}

export default FormDesignHeader;
