import React from 'react';

import toast from '@lib/toast';
import Button from '@c/button';
import { setGlobalConfig } from '@lib/configuration-center';

import { savePage, updateArteryEngineMenuType } from './api';
import { getInitArteryByPageType, getPageTypeKey } from './utils';
import { PAGE_TYPE } from './constants';

type Props = {
  appID: string;
  pageId: string;
  onSelect: (editor: string) => void;
}

function SelectCustomPageEditor({ pageId, appID, onSelect }: Props): JSX.Element {
  function handleSelect(pageType: string): void {
    const [key, newKey] = getPageTypeKey(appID, pageId);
    setGlobalConfig(key, '1.0.0', pageType);
    setGlobalConfig(newKey, '1.0.0', pageType);
    savePage(appID, pageId, getInitArteryByPageType(pageType)).then(() => {
      updateArteryEngineMenuType(appID, pageId);
      onSelect(pageType);
    }).catch((err: Error) => {
      toast.error(err.message);
    });
  }

  return (
    <div
      style={{ width: '600px', marginTop: '100px' }}
      className="text-gray-900 text-12 bg-white shadow-flow-header p-20 mx-auto"
    >
      <h1 className="text-center mb-20">请选择构建自定义页面的方式</h1>
      <div className="w-6/12 flex items-center justify-between m-auto">
        <Button onClick={() => handleSelect(PAGE_TYPE.ARTERY_EDITOR)}>
          使用 Artery 编辑器
        </Button>
        <Button onClick={() => handleSelect(PAGE_TYPE.PAGE_DESIGN_EDITOR)}>
          使用页面引擎
        </Button>
      </div>
    </div>
  );
}

export default SelectCustomPageEditor;
