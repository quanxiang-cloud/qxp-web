import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import TextHeader from '@c/text-header';
import FormAppDataTable from '@c/form-app-data-table';
import appDataStore from '@c/form-app-data-table/store';
import PageLoading from '@c/page-loading';

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
    setShowCreateForm(false);
  }, [formScheme]);

  useEffect(() => {
    appDataStore.setCreateFun(() => setShowCreateForm(true));
    appDataStore.allowRequestData = true;
    return () => {
      appDataStore.clear();
    };
  }, []);

  if (showCreateForm && formScheme) {
    return (
      <CreateDataForm
        defaultValues={appDataStore.curItemFormData}
        goBack={goBack}
      />
    );
  }

  if (!curPage.id) {
    return null;
  }

  return (
    <div className='relative h-full flex-1'>
      <TextHeader
        title={curPage.name || ''}
        className="bg-white px-20 py-18 header-background-image"
        itemTitleClassName="text-h5" />
      {fetchSchemeLoading && <PageLoading />}
      {formScheme && !fetchSchemeLoading ? (
        <FormAppDataTable style={{ height: 'calc(100% - 62px)' }} className='p-20' />
      ) : null}
    </div>
  );
}

export default observer(PageDetails);
