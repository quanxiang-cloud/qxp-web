import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';

import PageLoad from '@appC/page-loading';

import FormBuild from './form-build';
import PageSetting from './page-setting';
import PublishForm from './publish-form';
import FormDesignHeader from './header';
import NoSchema from './no-schema';
import store from './store';

import './index.scss';

function FormDesign() {
  const { pageType, pageId } = useParams<any>();

  useEffect(() => {
    store.setPageID(pageId);
    return () => {
      store.clear();
    };
  }, [pageId]);

  const contentRender = () => {
    if (store.pageLoading) {
      return <PageLoad />;
    }

    if (pageType === 'formBuild') {
      return <FormBuild />;
    }

    if (!store.formMetadata.id) {
      return <NoSchema />;
    }

    if (pageType === 'pageSetting') {
      return <PageSetting />;
    }

    if (pageType === 'publishForm') {
      return <PublishForm />;
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
