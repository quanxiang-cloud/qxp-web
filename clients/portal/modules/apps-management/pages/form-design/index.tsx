import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';

import PageLoad from '@c/page-loading';
import { getQuery } from '@lib/utils';

import FormBuild from './form-build';
import PageSetting from './page-setting';
import FormDesignHeader from './header';
import NoSchema from './no-schema';
import store from './store';

import './index.scss';

function FormDesign() {
  const { pageType, pageId, appID } = useParams<FormDesignParams>();
  const { pageName } = getQuery<{ pageName: string }>();

  useEffect(() => {
    store.setAppID(appID);
    store.setPageID(pageId);
    store.pageName = pageName;
    return () => {
      store.clear();
    };
  }, []);

  const contentRender = () => {
    if (store.pageLoading || !store.formStore) {
      return <PageLoad />;
    }

    if (pageType === 'formBuild') {
      return <FormBuild />;
    }

    if (store.formStore.flattenFields.length === 0) {
      return <NoSchema />;
    }

    if (pageType === 'pageSetting') {
      return <PageSetting />;
    }
  };

  return (
    <div style={{ height: '100vh' }} className='flex flex-col form-design'>
      <FormDesignHeader />
      {contentRender()}
    </div>
  );
}

export default observer(FormDesign);
