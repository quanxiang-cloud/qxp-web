import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Schema } from '@one-for-all/schema-spec';

import toast from '@lib/toast';

import Header from './header';
import Preview from './preview';
import { savePage } from '../api';

export type EditorMode = 'edit' | 'preview';

type Props = {
  appID: string;
  schemaID: string;
  initialSchema: Schema
}

function SchemaEditor({ appID, schemaID, initialSchema }: Props): JSX.Element {
  const [schemaStr, setSchemaStr] = useState(JSON.stringify(initialSchema, null, 2));
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<EditorMode>('edit');
  const history = useHistory();

  function handleSaveSchema(): Promise<boolean> {
    if (!schemaStr) {
      toast.error('schema 不能为空');
      return Promise.resolve(false);
    }

    if (saving) {
      return Promise.resolve(false);
    }

    setSaving(true);

    try {
      const schema = JSON.stringify(JSON.parse(schemaStr));
      return savePage(schemaID, schema).then(() => {
        toast.success('页面已保存');
        setSaving(false);
        return true;
      }).catch((err: Error) => {
        toast.error(err.message);
        setSaving(false);
        return false;
      });
    } catch (error) {
      toast.error('schema 不是合法的 json 字符串');
      setSaving(false);
      return Promise.resolve(false);
    }
  }

  function handleSaveAndExit(): void {
    handleSaveSchema().then((isSuccess) => {
      if (!isSuccess) {
        return;
      }

      handleBack();
    });
  }

  function handleBack(): void {
    history.push(`/apps/details/${appID}/app_views`);
  }

  function handleChangeMode(editorMode: EditorMode): void {
    if (editorMode === 'edit') {
      setMode(editorMode);
      return;
    }

    try {
      JSON.stringify(JSON.parse(schemaStr));
    } catch (error) {
      toast.error('schema 不是合法的 json 字符串');
      return;
    }

    setMode(editorMode);
  }

  return (
    <div>
      <Header
        editorMode={mode}
        onChangeMode={handleChangeMode}
        onSave={handleSaveSchema}
        onSaveAndExit={handleSaveAndExit}
        onGoBack={handleBack}
      />
      {mode === 'edit' && (
        <div
          style={{ height: 'calc(100vh - 80px)' }}
          className="block w-10/12 mt-20 mx-auto outline-none"
        >
          <textarea
            className="block p-20 h-full w-full outline-none"
            value={schemaStr}
            onChange={(e) => setSchemaStr(e.target.value)}
          />
        </div>
      )}
      {mode === 'preview' && <Preview schemaID={schemaID} previewSchema={JSON.parse(schemaStr)} />}
    </div>
  );
}

export default SchemaEditor;
