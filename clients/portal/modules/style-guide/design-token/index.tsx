import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';

import Icon from '@one-for-all/icon';
import ToolTip from '@c/tooltip';
import Button from '@c/button';
import Loading from '@c/loading';

import store from '../store';
import TokensetSelector from './tokenset-selector';
import TokenFilter from './token-filter';
import JSONEditor from './json-editor';
import TokenList from './token-list';
import EditTokenForm from './components/edit-token-modal';
import { TokenListType } from './utils';
import { parseTokenValues } from './utils/parse';
import ConfirmModal from './components/confirm-modal';

import './index.scss';

function DesignToken(): JSX.Element {
  const [activeTokensTab, setActiveTokensTab] = useState<'list' | 'json'>('list');
  const designStore = store.designTokenStore;
  const [stringTokens, setStringTokens] = useState(
    JSON.stringify(designStore?.tokens[designStore?.activeTokenSet], null, 2),
  );
  const [error, setError] = useState<string>('');
  const [editFormShow, setEditFormShow] = useState<boolean>(false);
  const [showLoadPreset, setShowLoadPreset] = useState<boolean>(false);

  useEffect(() => {
    setError('');
    setStringTokens(designStore?.getStringTokens() || '');
  }, [designStore?.tokens, designStore?.activeTokenSet]);

  useEffect(() => {
    if (designStore?.getStringTokens() !== stringTokens) {
      designStore?.setHasUnsavedChanges(true);
    } else {
      designStore?.setHasUnsavedChanges(false);
    }
  }, [designStore?.tokens, stringTokens, designStore?.activeTokenSet]);

  function handleChangeJSON(val: string): void {
    setError('');
    try {
      const parsedTokens = JSON.parse(val);
      parseTokenValues(parsedTokens);
    } catch (e) {
      setError(`Unable to read JSON: ${JSON.stringify(e)}`);
    }
    setStringTokens(val);
  }

  function handleSave(): void {
    if (error || !designStore?.hasUnsavedChanges) {
      return;
    }

    designStore?.setJSONData(stringTokens);
    designStore?.setHasUnsavedChanges(false);
  }

  if (!designStore) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center pb-5 border-b-1 border-cyan-50">
        <div className="w-188 p-10 flex items-center border-r-1 border-cyan-50">
          {designStore?.activeTokenSet}
        </div>
        <TokenFilter />
        <div className="flex items-center p-4">
          <ToolTip label="list" position="bottom">
            <span
              className="cursor-pointer mr-8"
              onClick={() => setActiveTokensTab('list')}
            >
              <Icon name="list" size={24}></Icon>
            </span>
          </ToolTip>
          <ToolTip label="json" position="bottom">
            <span
              className="cursor-pointer mr-8"
              onClick={() => setActiveTokensTab('json')}
            >
              <Icon name="code" size={24}></Icon>
            </span>
          </ToolTip>
        </div>
        <Button onClick={() => setShowLoadPreset(true)}>
          重置GLOBAL
        </Button>
      </div>
      <div className="flex h-full overflow-hidden relative">
        <TokensetSelector />
        <div className="flex flex-col flex-1 h-full overflow-y-auto">
          {activeTokensTab === 'json' ? (
            <>
              <JSONEditor
                stringTokens={stringTokens}
                handleChange={handleChangeJSON}
                error={error}
              />
              <div className="flex justify-end px-10">
                <Button forbidden={!designStore?.hasUnsavedChanges} onClick={handleSave}>
                  保存
                </Button>
              </div>
            </>
          ) : (
            <div className="p-4">
              {designStore?.memoizedTokens.map(([key, group]: [string, TokenListType]) => (
                <TokenList
                  key={key}
                  label={group.label || key}
                  explainer={group.explainer}
                  schema={group.schema}
                  property={group.property}
                  type={group.type}
                  values={group.values}
                  setEditFormShow={setEditFormShow}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {editFormShow && (
        <EditTokenForm
          onClose={() => setEditFormShow(false)}
        />
      )}
      {showLoadPreset && (
        <ConfirmModal
          text={
            (<div className="text-14 p-20">
              当前操作将会覆盖对global的修改，确定要执行此操作吗？
            </div>)
          }
          title="重置"
          onCancel={() => setShowLoadPreset(false)}
          onSubmit={() => {
            designStore?.resetGlobal();
            setShowLoadPreset(false);
          }}
        />
      )}
    </div>
  );
}

export default observer(DesignToken);
