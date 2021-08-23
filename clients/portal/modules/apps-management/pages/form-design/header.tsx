import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Icon from '@c/icon';
import Tab, { TabProps } from '@c/no-content-tab';

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

  const tabChange = (tabKey: string): void => {
    if (store.formStore?.hasEdit && tabKey === 'pageSetting') {
      setSwitchTab('switchTab');
      setShowNotSavedTips(true);
      return;
    }

    const query = store.pageName ? `?pageName=${store.pageName}` : '';
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
    history.push(`/apps/details/${appID}/page_setting?pageID=${pageId}`);
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
        <span className="text-h6-bold mr-4">正在设计表单：{store.pageName}</span>
      </div>
      <Tab onChange={tabChange} activeTab={pageType} tabs={TABS} />
      <div className='flex justify-end'>
        <a
          href={`//${window.CONFIG.docs_hostname}`}
          target="_blank"
          rel="noreferrer"
          className="app-nav-button corner-8-8-8-2"
        >
          <Icon size={20} className='mr-4 app-icon-color-inherit' name="book" />
          帮助文档
        </a>
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
