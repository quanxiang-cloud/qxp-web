import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { parse } from 'query-string';

import Icon from '@c/icon';
import Tab, { TabProps } from '@portal/modules/app-management/components/tab';
import NavButton from '@portal/modules/app-management/components/nav-button';
import toast from '@lib/toast';

import store from './store';
import './index.scss';

const TABS: TabProps[] = [
  { label: '表单设计', key: 'formBuild' },
  { label: '页面配置', key: 'pageSetting' },
  { label: '发布表单', key: 'publishForm' },
];

function FormDesignHeader() {
  const { pageType, pageId, appID } = useParams<any>();
  const history = useHistory();

  const { pageName } = parse(window.location.search);

  const tabChange = (tabKey: string) => {
    if (store.formStore.hasEdit) {
      toast.error('请先保存表单设计');
      return;
    }
    const navType = tabKey === 'publishForm' ? '/forEmployee' : '';
    const query = pageName ? `?pageName=${pageName}` : '';
    history.replace(`/apps/formDesign/${tabKey}/${pageId}/${appID}${navType}${query}`);
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
        <span className="text-h6-bold mr-4">正在设计表单{pageName ? ':' : ''}</span>
        <span className="text-body2">{pageName ? pageName : ''}</span>
      </div>
      <Tab onChange={tabChange} activeTab={pageType} tabs={TABS} />
      <div className='flex justify-end'>
        <NavButton name='帮助文档' icon='book' url='' />
      </div>
    </div>
  );
}

export default FormDesignHeader;
