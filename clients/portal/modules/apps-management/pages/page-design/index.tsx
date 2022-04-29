/* eslint-disable */
import React, { useState, useMemo, useEffect, useCallback, CSSProperties } from 'react';
import cs from 'classnames';
import { DndProvider } from 'react-dnd';
import { useHistory } from 'react-router-dom';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ArteryEngine from '@one-for-all/artery-engine';

import Icon from '@c/icon';
import toast from '@lib/toast';
import { getQuery } from '@lib/utils';
import FileUploader from '@c/file-upload';
import ApiSelector from '@polyApi/nodes/forms/request-config/api-selector';

import ApiSpec from '../app-details/api-proxy/add-api';
import { useQueryArtery } from './hooks';
import { PAGE_TYPE, PAGE_DESIGN_ID, LAYERS } from './constants';
import { getInitArteryByPageType } from './utils';
import Ctx from './ctx';
import stores from './stores';
import { useStyle } from './hooks/use-style';
import { savePage } from './api';

import './index.scss';
import styles from './index.m.scss';

function PageDesign(): JSX.Element | null {
  const { appID, pageName, arteryID } = getQuery<{ appID: string ,pageName: string, arteryID: string }>();
  const history = useHistory();

  const resetStyle: CSSProperties = useMemo(() => ({ overflow: 'hidden' }), [])
  useStyle('body', resetStyle);
  useStyle('html', resetStyle);

  const { data: artery, isLoading: isArteryLoading } = useQueryArtery(
    { arteryID },
    { enabled: !!arteryID },
  );

  const { layers, initialArtery } = useMemo(() => {
    const initialArtery = artery ?? getInitArteryByPageType(PAGE_TYPE.PAGE_DESIGN_EDITOR);
    const layer = LAYERS[0];
    // to remove pageId params
    layer.blocksCommunicationStateInitialValue = { activeNodeID: '', appID, arteryID: '' };
    return {
      layers: [...LAYERS],
      initialArtery,
    };
  }, [artery]);

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
    history.push(`/apps/details/${appID}/views`);
  }
  useEffect(() => {
    eventBus.on('clear:api-path', ()=> {
      setApiPath('');
    });

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
          appID={appID}
          simpleMode
          className='api-selector-wrap'
          initRawApiPath={apiPath}
          setApiPath={setApiPath}
        />
      </div>
    ));
  }, [apiPath]);

  const handleSave = useCallback((page_artery: any, options?: Record<string, any>): void => {
    savePage(arteryID, page_artery, options).then(() => {
      if (!options?.silent) {
        toast.success('页面已保存');
      }
    }).catch((err: Error) => {
      toast.error(err.message);
    });
  }, []);
  const ArteryEngineEntry = useMemo(() => (
      <DndProvider backend={HTML5Backend}>
        <Ctx.Provider value={Object.assign(stores, { onSave: handleSave })}>
          <div className={cs(styles.designer)}>
            <div id={PAGE_DESIGN_ID}>
              <ArteryEngine schema={initialArtery} layers={layers} />
            </div>
          </div>
        </Ctx.Provider>
      </DndProvider>
  ), [initialArtery, layers]);

  if (isArteryLoading) {
    return null;
  }

  return ArteryEngineEntry;
}

export default PageDesign;
