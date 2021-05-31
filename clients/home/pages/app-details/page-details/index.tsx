import React from 'react';
import { observer } from 'mobx-react';

import TextHeader from '@c/text-header';
import FormAppDataTable from '@c/form-app-data-table';
import PageLoading from '@c/page-loading';

import store from '../../store';
import CreateDataForm from './create-data-form';
import './index.scss';

function PageDetails() {
  const { curPage, fetchSchemeLoading, formScheme, appDataStore, showCreateForm, setShowCreateForm } = store;

  const goBack = () => {
    appDataStore.curItemFormData = null;
    setShowCreateForm(false);
  };

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
    <div className='relative h-full flex-1 overflow-hidden'>
      <TextHeader
        title={curPage.name || ''}
        className="bg-white px-20 py-18 header-background-image"
        itemTitleClassName="text-h5" />
      {fetchSchemeLoading && <PageLoading />}
      {formScheme && !fetchSchemeLoading ? (
        <FormAppDataTable store={appDataStore} style={{ height: 'calc(100% - 62px)' }} className='p-20' />
      ) : null}
    </div>
  );
}

export default observer(PageDetails);
