import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';

import Icon from '@c/icon';
import { getQuery } from '@lib/utils';
import toast from '@lib/toast';
import ApiSelector from '@polyApi/nodes/forms/request-config/api-selector';
import ApiSpec from '../app-details/api-proxy/add-api';

import { Designer, getStore } from '@ofa/page-engine';
import { getPage, savePage, updatePageEngineMenuType } from './api';

import './index.scss';

function PageDesign(): JSX.Element {
  const { designer, page } = getStore();
  const { appID, pageId } = useParams<{appID: string; pageId: string}>();
  const { pageName } = getQuery<{ pageName: string }>();
  const history = useHistory();
  const [apiPath, setApiPath] = useState('');

  useEffect(()=> {
    getPage(appID, pageId).then((schema)=> {
      if (schema) {
        page.setSchema(JSON.parse(schema));
      }
    });
  }, []);

  useEffect(()=> {
    // set page title
    designer.setVdom('title', (
      <div className='inline-flex items-center text-gray-900 text-12'>
        <Icon name='keyboard_backspace' className='mr-8' onClick={history.goBack} clickable />
        <span className='mr-4'>正在设计页面:</span>
        <span>{pageName}</span>
      </div>
    ));

    // todo: api path not update
    designer.setVdom('platformApis', (
      <div className='flex flex-col mb-24 relative -top-8'>
        <p className='text-12 text-gray-600'>选择API</p>
        <ApiSelector
          className='api-selector-wrap'
          initRawApiPath={apiPath}
          setApiPath={setApiPath}
          simpleMode
        />
      </div>
    ));
  }, []);

  useEffect(()=> {
    designer.setVdom('apiStateDetail', renderApiStateDetail());
  }, [apiPath]);

  function renderApiStateDetail(): JSX.Element {
    if (!apiPath) {
      return (
        <div className='flex flex-col justify-center items-center h-full'>
          <img src="/dist/images/table-empty.svg" className="w-96 h-72 mb-8" />
          <span className="text-caption-no-color-weight text-gray-400">请先选择一个要加入数据源的API数据</span>
        </div>
      );
    }
    return (
      <ApiSpec apiPath={apiPath} editMode tinyMode />
    );
  }

  function handleSave(page_schema: any, options?: Record<string, any>): void {
    savePage(appID, pageId, page_schema, options).then(()=> {
      if (!options?.silent) {
        updatePageEngineMenuType(appID, pageId);
        toast.success('页面已保存');
      }
    }).catch((err: Error)=> {
      toast.error(err.message);
    });
  }

  return (
    <Designer onSave={handleSave} />
  );
}

export default observer(PageDesign);
