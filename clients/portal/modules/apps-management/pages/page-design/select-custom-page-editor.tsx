import React from 'react';

import toast from '@lib/toast';
import { Button } from '@one-for-all/headless-ui';
import { setGlobalConfig } from '@lib/configuration-center';

import { savePage, updatePageEngineMenuType } from './api';
import {
  getKeyOfCustomPageEditor,
  CUSTOM_PAGE_EDITOR_SCHEMA,
  CUSTOM_PAGE_EDITOR_PAGE_ENGINE,
  initialSchema,
} from './utils';

type Props = {
  appID: string;
  pageId: string;
  onSelect: (editor: string) => void;
}

function SelectCustomPageEditor({ pageId, appID, onSelect }: Props): JSX.Element {
  function handleSelect(editor: string): void {
    const [key, newKey] = getKeyOfCustomPageEditor(appID, pageId);
    setGlobalConfig(key, '1.0.0', editor);
    setGlobalConfig(newKey, '1.0.0', editor);
    savePage(appID, pageId, initialSchema).then(() => {
      updatePageEngineMenuType(appID, pageId);
      onSelect(editor);
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
        <Button onClick={() => handleSelect(CUSTOM_PAGE_EDITOR_SCHEMA)}>
          使用 Schema 编辑器
        </Button>
        <Button onClick={() => handleSelect(CUSTOM_PAGE_EDITOR_PAGE_ENGINE)}>
          使用页面引擎
        </Button>
      </div>
    </div>
  );
}

export default SelectCustomPageEditor;
