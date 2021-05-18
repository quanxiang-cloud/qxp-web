import React from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';

import TextHeader from '@c/text-header';
import AppPageData from '@c/app-page-data';
import PageLoading from '@c/page-loading';
import Button from '@c/button';

import PageBuildNav from './page-build-nav';
import appPagesStore from '../store';
import './index.scss';

function PageDetails() {
  const { curPage, appID } = appPagesStore;
  const history = useHistory();
  const goFormBuild = () => {
    history.push(`/apps/formDesign/formBuild/${curPage.id}/${appID}?pageName=${curPage.name}`);
  };

  const contentRender = () => {
    if (appPagesStore.fetchSchemeLoading) {
      return <PageLoading />;
    }

    if (appPagesStore.formScheme) {
      return (
        <div className='p-20'>
          <AppPageData />
        </div>
      );
    }

    return <PageBuildNav appID={appID} pageId={curPage.id} pageName={curPage.name} />;
  };

  if (!curPage.id) {
    return null;
  }

  return (
    <div className='flex flex-col flex-1 relative'>
      <TextHeader
        title={curPage.name || ''}
        desc={curPage.describe || ''}
        action={appPagesStore.formScheme ? (
          <Button onClick={goFormBuild} modifier='primary' iconName='edit'>设计表单</Button>
        ) : '📌  表单、流程、报表何时使用？快速上手'}
        className="bg-white px-20 h-62 py-0 header-background-image gap-x-20"
        itemTitleClassName="text-h5" />
      {contentRender()}
    </div>
  );
}

export default observer(PageDetails);
