import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Artery } from '@one-for-all/artery';

import toast from '@lib/toast';

import Header from './header';
import Preview from './preview';
import { savePage } from '../api';

export type EditorMode = 'edit' | 'preview';

type Props = {
  appID: string;
  arteryID: string;
  initialArtery: Artery
}

function ArteryEditor({ appID, arteryID, initialArtery }: Props): JSX.Element {
  const [arteryStr, setArteryStr] = useState(JSON.stringify(initialArtery, null, 2));
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<EditorMode>('edit');
  const history = useHistory();

  async function handleSaveArtery(): Promise<boolean> {
    if (!arteryStr) {
      toast.error('artery 不能为空');
      return Promise.resolve(false);
    }

    if (saving) {
      return Promise.resolve(false);
    }

    setSaving(true);

    try {
      const artery = JSON.stringify(JSON.parse(arteryStr));
      try {
        await savePage(arteryID, artery);
        toast.success('页面已保存');
        setSaving(false);
        return true;
      } catch (err: any) {
        toast.error(err.message);
        setSaving(false);
        return false;
      }
    } catch (error) {
      toast.error('artery 不是合法的 json 字符串');
      setSaving(false);
      return Promise.resolve(false);
    }
  }

  function handleSaveAndExit(): void {
    handleSaveArtery().then((isSuccess) => {
      if (!isSuccess) {
        return;
      }

      handleBack();
    });
  }

  function handleBack(): void {
    history.push(`/apps/details/${appID}/views`);
  }

  function handleChangeMode(editorMode: EditorMode): void {
    if (editorMode === 'edit') {
      setMode(editorMode);
      return;
    }

    try {
      JSON.stringify(JSON.parse(arteryStr));
    } catch (error) {
      toast.error('artery 不是合法的 json 字符串');
      return;
    }

    setMode(editorMode);
  }

  return (
    <div>
      <Header
        editorMode={mode}
        onChangeMode={handleChangeMode}
        onSave={handleSaveArtery}
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
            value={arteryStr}
            onChange={(e) => setArteryStr(e.target.value)}
          />
        </div>
      )}
      {mode === 'preview' && <Preview draftArteryID={arteryID} previewSchema={JSON.parse(arteryStr)} />}
    </div>
  );
}

export default ArteryEditor;
