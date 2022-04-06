import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { Designer, getStore } from '@one-for-all/page-engine';

import Icon from '@c/icon';
import toast from '@lib/toast';
import { getQuery } from '@lib/utils';
import FileUploader from '@c/file-upload';
import ApiSelector from '@polyApi/nodes/forms/request-config/api-selector';

import { getPage, savePage } from './api';
import ApiSpec from '../app-details/api-proxy/add-api';

import './index.scss';

function PageDesign(): JSX.Element {
  const { designer, page, eventBus } = getStore();
  const { appID, arteryID, pageName } = getQuery<{ appID: string; arteryID: string; pageName: string }>();
  const history = useHistory();
  const [apiPath, setApiPath] = useState('');

  useEffect(() => {
    getPage(arteryID).then((schema) => {
      if (schema) {
        page.setSchema(JSON.parse(schema));
      }
    });
  }, []);

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
          uploaderDescription={<UploadDescription />}
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
    designer.setVdom('apiStateDetail', renderApiStateDetail());

    // setApiPath from another mobx store will not trigger update
    // because mobx instance is isolated
    designer.setVdom('platformApis', (
      <div className='flex flex-col mb-24 relative -top-8'>
        <p className='text-12 text-gray-600'>选择API</p>
        <ApiSelector
          simpleMode
          usePolyApiOption
          className='api-selector-wrap'
          initRawApiPath={apiPath}
          setApiPath={setApiPath}
        />
      </div>
    ));
  }, [apiPath]);

  function handleGoBack(): void {
    history.push(`/apps/details/${appID}/app_views`);
  }

  function handleFileSuccess(file: QXPUploadFileTask): void {
    const { readable: readableBucket, domain }: OSSConfig = window.CONFIG.oss_config;
    if (file.state === 'success' || !file.state) {
      const url = `${window.location.protocol}//${readableBucket}.${domain}/${file.uid}`;
      designer.setUploadImage(url);
    }
  }

  function UploadDescription(): JSX.Element {
    return (
      <>
        <div className="my-4">点击或拖拽文件到此区域</div>
        <div className="text-gray-400">支持 20MB 以内的 csv 文件</div>
      </>
    );
  }

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
    savePage(arteryID, page_schema, options).then(() => {
      if (!options?.silent) {
        toast.success('页面已保存');
      }
    }).catch((err: Error) => {
      toast.error(err.message);
    });
  }

  return (
    <Designer onSave={handleSave} />
  );
}

export default observer(PageDesign);
