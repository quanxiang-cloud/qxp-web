/* eslint-disable */
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import PageEngineV2 from '@one-for-all/page-engine-v2';
import cs from 'classnames';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Icon from '@c/icon';
import FileUploader from '@c/file-upload';
import { getQuery } from '@lib/utils';
import ApiSelector from '@polyApi/nodes/forms/request-config/api-selector';

import ApiSpec from '../app-details/api-proxy/add-api';
import SelectCustomPageEditor from './select-custom-page-editor';
import SchemaEditor from './schema-editor';
import { useQuerySchema, usePageTypeKey } from './hooks';
import { PAGE_TYPE, PAGE_DESIGN_ID, LAYERS } from './constants';
import { getInitSchemaByPageType } from './utils';
import Ctx from './ctx';
import stores from './stores';

import './index.scss';
import styles from './index.m.scss';

function PageDesign(): JSX.Element | null {
  const { appID, pageId } = useParams<{appID: string; pageId: string}>();
  const [pageType, setPageType] = useState('');
  const history = useHistory();

  const { pageType: savedPageType, isLoading: isSavedPageTypeLoading } = usePageTypeKey(appID, pageId);
  const { data: schema, isLoading: isSchemaLoading } = useQuerySchema(
    { appID, pageId },
    { enabled: !!appID && !!pageId },
  );

  const { layers, initialSchema } = useMemo(() => {
    const initialSchema = schema ?? getInitSchemaByPageType(PAGE_TYPE.PAGE_DESIGN_EDITOR);
    const layer = LAYERS[0];
    layer.blocksCommunicationStateInitialValue = { activeNodeID: '', appID, pageId };
    return {
      layers: [...LAYERS],
      initialSchema,
    };
  }, [schema]);

  const { designer, page, eventBus } = stores;
  const [apiPath, setApiPath] = useState('');
  function handleFileSuccess(file: QXPUploadFileTask): void {
    const { readable: readableBucket, domain }: OSSConfig = window.CONFIG.oss_config;
    if (file.state === 'success' || !file.state) {
      const url = `${window.location.protocol}//${readableBucket}.${domain}/${file.uid}`;
      designer.setUploadImage(url);
    }
  }
  function handleGoBack(): void {
    history.push(`/apps/details/${appID}/page_setting?pageID=${pageId}`);
  }
  useEffect(() => {
    eventBus.on('clear:api-path', ()=> {
      setApiPath('');
    });
    const { pageName } = getQuery<{ pageName: string }>();
    // set page title
    designer.setVdom('title', (
      <div className='inline-flex items-center text-gray-900 text-12'>
        <Icon name='keyboard_backspace' className='mr-8' onClick={handleGoBack} clickable />
        <span className='mr-4'>正在设计页面:</span>
        <span>{pageName}</span>
      </div>
    ));

    // set img upload
    designer.setVdom('uploadImage', (
      <div>
        <FileUploader
          className='px-40 form-upload'
          uploaderDescription={(
            <>
              <div className="my-4">点击或拖拽文件到此区域</div>
              <div className="text-gray-400">支持 20MB 以内的 csv 文件</div>
            </>
          )}
          isPrivate={false}
          maxFileSize={10}
          additionalPathPrefix='message'
          accept={['image/gif', 'image/jpeg', 'image/jpg', 'image/png', 'image/svg']}
          onFileSuccess={handleFileSuccess}
        >
          <Icon name='upload_file' />
        </FileUploader>
      </div>
    ));
  }, []);
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
  useEffect(() => {
    designer.setVdom('apiStateDetail', renderApiStateDetail());

    // setApiPath from another mobx store will not trigger update
    // because mobx instance is isolated
    designer.setVdom('platformApis', (
      <div className='flex flex-col mb-24 relative -top-8'>
        <p className='text-12 text-gray-600'>选择API</p>
        <ApiSelector
          simpleMode
          className='api-selector-wrap'
          initRawApiPath={apiPath}
          setApiPath={setApiPath}
        />
      </div>
    ));
  }, [apiPath]);

  // todo refactor this
  if (pageType === PAGE_TYPE.SCHEMA_EDITOR) {
    const initialSchema = schema ?? getInitSchemaByPageType(pageType);
    return (
      <SchemaEditor
        appID={appID}
        pageId={pageId}
        initialSchema={initialSchema}
      />
    );
  }

  // todo refactor this
  if (pageType === PAGE_TYPE.PAGE_DESIGN_EDITOR) {
    return (
      <DndProvider backend={HTML5Backend}>
        <Ctx.Provider value={stores}>
          <div className={cs(styles.designer)}>
            <div id={PAGE_DESIGN_ID}>
              <PageEngineV2 schema={initialSchema} layers={layers} />
            </div>
          </div>
        </Ctx.Provider>
      </DndProvider>
    );
  }

  if (isSchemaLoading || isSavedPageTypeLoading) {
    return null;
  }

  if (!schema) {
    return (<SelectCustomPageEditor appID={appID} pageId={pageId} onSelect={setPageType} />);
  }

  if (savedPageType === PAGE_TYPE.SCHEMA_EDITOR) {
    return (<SchemaEditor appID={appID} pageId={pageId} initialSchema={schema} />);
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Ctx.Provider value={stores}>
        <div className={cs(styles.designer)}>
          <div id={PAGE_DESIGN_ID}>
            <PageEngineV2 schema={initialSchema} layers={layers} />
          </div>
        </div>
      </Ctx.Provider>
    </DndProvider>
  );
}

export default PageDesign;
