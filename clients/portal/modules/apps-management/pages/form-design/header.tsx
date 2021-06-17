import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { parse } from 'qs';

import Icon from '@c/icon';
import Tab, { TabProps } from '@c/no-content-tab';
import HeaderNav from '@c/header-nav';

import NotSavedModal from './not-saved-modal';
import store from './store';
import './index.scss';

const TABS: TabProps[] = [
  { label: '表单设计', key: 'formBuild' },
  { label: '页面配置', key: 'pageSetting' },
];

function FormDesignHeader(): JSX.Element {
  const [showNotSavedTips, setShowNotSavedTips] = useState(false);
  const [switchTab, setSwitchTab] = useState('switchTab');
  const { pageType, pageId, appID } = useParams<FormDesignParams>();

  const history = useHistory();

  const { pageName } = parse(window.location.search);

  const tabChange = (tabKey: string): void => {
    if (store.formStore?.hasEdit) {
      setSwitchTab('switchTab');
      setShowNotSavedTips(true);
      return;
    }
    const query = pageName ? `?pageName=${pageName}` : '';
    history.replace(`/apps/formDesign/${tabKey}/${pageId}/${appID}${query}`);
  };

  const goBack = (): void => {
    if (store.formStore?.hasEdit) {
      setSwitchTab('back');
      setShowNotSavedTips(true);
      return;
    }

    goPageDetails();
  };

  const goPageDetails = (): void => {
    history.push(`/apps/details/${appID}?pageID=${pageId}`);
  };

  const reset = (): void => {
    store.reSetFormScheme();
    setShowNotSavedTips(false);
  };

  return (
    <div className='form-design-header header-background-image h-56'>
      <div className='flex items-center'>
        <Icon
          clickable
          changeable
          onClick={goBack}
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
        <NotSavedModal
          onSaveAfter={switchTab === 'back' ? goPageDetails : () => tabChange('pageSetting')}
          onAbandon={switchTab === 'back' ? goPageDetails : reset}
          onCancel={() => setShowNotSavedTips(false)}
        />
      )}
    </div>
  );
}

export default FormDesignHeader;
