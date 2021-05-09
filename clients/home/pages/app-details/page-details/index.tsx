import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import TextHeader from '@c/text-header';
import AppPageData from '@c/app-page-data';
import appDataStore from '@c/app-page-data/store';
import PageLoading from '@portal/modules/apps-management/components/page-loading';

import store from '../../store';
import CreateDataForm from './create-data-form';
import './index.scss';

function PageDetails() {
  const { curPage, fetchSchemeLoading, formScheme } = store;
  const [showCreateForm, setShowCreateForm] = useState(false);

  const goBack = () => {
    appDataStore.curItemFormData = null;
    setShowCreateForm(false);
  };

  useEffect(() => {
    appDataStore.setCreateFun(() => setShowCreateForm(true));
    appDataStore.allowRequestData = true;
    return () => {
      appDataStore.clear();
    };
  }, []);

  if (showCreateForm) {
    return (
      <CreateDataForm
        defaultValues={appDataStore.curItemFormData}
        goBack={goBack}
      />
    );
  }

  const contentRender = () => {
    if (fetchSchemeLoading) {
      return <PageLoading />;
    }

    if (formScheme) {
      return (
        <div className='p-20'>
          <AppPageData />
        </div>
      );
    }
  };

  if (!curPage.id) {
    return null;
  }

  return (
    <div className='flex flex-col flex-1 relative overflow-hidden'>
      <TextHeader
        title={curPage.name || ''}
        className="bg-white px-20 py-18 header-background-image"
        itemTitleClassName="text-h5" />
      {contentRender()}
    </div>
  );
}

export default observer(PageDetails);
