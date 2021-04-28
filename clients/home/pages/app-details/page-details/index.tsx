import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import TextHeader from '@c/text-header';
import AppPageData from '@appC/app-page-data';
import PageLoading from '@appC/page-loading';
import appDataStore from '@appC/app-page-data/store';

import store from '../../store';
import CreateDataForm from './create-data-form';
import './index.scss';

function PageDetails() {
  const { curPage, fetchSchemeLoading, formScheme } = store;
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    appDataStore.setCreateFun(() => setShowCreateForm(true));
    appDataStore.allowRequestData = true;
  }, []);

  if (showCreateForm) {
    return (
      <CreateDataForm
        defaultValues={appDataStore.curItemFormData}
        goBack={() => setShowCreateForm(false)}
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
    <div className='flex flex-col flex-1 relative'>
      <TextHeader
        title={curPage.name || ''}
        className="bg-white px-20 py-18 header-background-image"
        itemTitleClassName="text-h5" />
      {contentRender()}
    </div>
  );
}

export default observer(PageDetails);
