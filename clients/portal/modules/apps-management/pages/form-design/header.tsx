import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { parse } from 'qs';

import Icon from '@c/icon';
import Tab, { TabProps } from '@c/no-content-tab';
import HeaderNav from '@c/header-nav';

import NotSavedModal from './not-saved-modal';
import './index.scss';

const TABS: TabProps[] = [
  { label: '表单设计', key: 'formBuild' },
  { label: '页面配置', key: 'pageSetting' },
];

function FormDesignHeader() {
  const [showNotSavedTips, setShowNotSavedTips] = useState(false);
  const { pageType, pageId, appID } = useParams<FormDesignParams>();

  const history = useHistory();

  const { pageName } = parse(window.location.search);

  const tabChange = (tabKey: string) => {
    // if (store.formStore?.hasEdit) {
    //   setShowNotSavedTips(true);
    //   return;
    // }
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
        <HeaderNav name='帮助文档' icon='book' url='' />
      </div>
      {showNotSavedTips && (
        <NotSavedModal onCancel={() => setShowNotSavedTips(false)} />
      )}
    </div>
  );
}

export default FormDesignHeader;
