import React, { useState, useMemo, useEffect, useCallback, CSSProperties } from 'react';
import cs from 'classnames';
import { useHistory } from 'react-router-dom';
import ArteryEngine, { Props } from '@one-for-all/artery-engine';
import { useMonaco } from '@monaco-editor/react';
import Icon from '@one-for-all/icon';

import toast from '@lib/toast';
import { getQuery } from '@lib/utils';
import FileUploader from '@c/file-upload';
import ApiSelector from '@polyApi/nodes/forms/request-config/api-selector';
import Loading from '@c/loading';

import ApiSpec from '../app-details/api-proxy/add-api';
import { queryArtery, useStyle } from './hooks';
import { PAGE_DESIGN_ID, LAYERS } from './constants';
import Ctx from './ctx';
import stores from './stores';
import { savePage } from './api';
import { getInitArtery } from './utils';
import type { BlocksCommunicationType } from './types';

import './index.scss';
import styles from './index.m.scss';

function PageDesign(): JSX.Element | null {
  const { appID, pageName, arteryID } = getQuery<{ appID: string, pageName: string, arteryID: string }>();
  const history = useHistory();
  useMonaco();

  const resetStyle: CSSProperties = useMemo(() => ({ overflow: 'hidden' }), []);
  useStyle('body', resetStyle);
  useStyle('html', resetStyle);

  const { artery, isLoading: isArteryLoading } = queryArtery(arteryID);

  const { layers, artery: initialArtery, blocksCommunicationStateInitialValue } = useMemo(
    (): Props<BlocksCommunicationType> => {
      return {
        layers: [...LAYERS],
        artery: artery ?? getInitArtery(),
        blocksCommunicationStateInitialValue: {
          appID,
          arteryID: '',
          menu: { panelWidth: 280 },
          block: {},
        },
      };
    },
    [artery],
  );

  const { designer, eventBus } = stores;
  const [apiPath, setApiPath] = useState('');
  useEffect(() => {
    eventBus.on('clear:api-path', () => {
      setApiPath('');
    });
    function handleGoBack(): void {
      history.push(`/apps/details/${appID}/views`);
    }
    // set page title
    designer.setVdom('title', (
      <div className='inline-flex items-center text-gray-900 text-12'>
        <span onClick={handleGoBack}>
          <Icon name='keyboard_backspace' className='mr-8 cursor-pointer' />
        </span>
        <span className='mr-4'>正在设计页面:</span>
        <span>{pageName}</span>
      </div>
    ));

    function handleFileSuccess(file: QXPUploadFileTask): void {
      const { readable: readableBucket, domain }: OSSConfig = window.CONFIG.oss_config;
      if (file.state === 'success' || !file.state) {
        const url = `${window.location.protocol}//${readableBucket}.${domain}/${file.uid}`;
        designer.setUploadImage(url);
      }
    }
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

  useEffect(() => {
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
    savePage(arteryID, page_artery, options)
      .then(() => !options?.silent && toast.success('页面已保存'))
      .catch((err: Error) => toast.error(err.message));
  }, []);

  const ArteryEngineEntry = useMemo(() => (
    <Ctx.Provider value={Object.assign(stores, { onSave: handleSave })}>
      <div className={cs(styles.designer)}>
        <div id={PAGE_DESIGN_ID}>
          <ArteryEngine
            artery={initialArtery}
            layers={layers}
            blocksCommunicationStateInitialValue={blocksCommunicationStateInitialValue}
          />
        </div>
      </div>
    </Ctx.Provider>
  ), [initialArtery, layers, blocksCommunicationStateInitialValue]);

  if (isArteryLoading) {
    return <Loading desc="加载中..." />;
  }

  return ArteryEngineEntry;
}

export default PageDesign;
