import React, { useState, useEffect } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import Icon from '@one-for-all/icon';

import store from '../store';
import TokensetItem from './tokenset-item';
import ConfirmModal from './components/confirm-modal';
import EditTokensetNameModal from './components/edit-tokenset-modal';
import DesignTokenStore from './store';

function TokensetSelector(): JSX.Element {
  const [draggedTokenSet, setDraggedTokenSet] = useState<string | null>(null);
  const { tokens, addTokenSet, deleteTokenSet, renameTokenSet } = store.designTokenStore as DesignTokenStore;
  const [showEditTokenSet, setShowEditTokenSet] = useState(false);
  const [showDeleteTokenSet, setShowDeleteTokenSet] = useState(false);
  const [tokenSetMarkedForChange, setTokenSetMarkedForChange] = useState('');
  const [allTokenSets, setAllTokenSets] = useState(Object.keys(tokens));

  const tokenKeys = Object.keys(tokens).join(',');

  useEffect(() => {
    setAllTokenSets(Object.keys(tokens));
  }, [tokenKeys]);

  useEffect(() => {
    setShowEditTokenSet(false);
  }, [tokens]);

  const handleNewTokenSetSubmit = (tokenSet: string): void => {
    addTokenSet(tokenSet.trim());
  };

  const handleDeleteTokenSet = (): void => {
    deleteTokenSet(tokenSetMarkedForChange);
    setShowDeleteTokenSet(false);
  };

  const handleRenameTokenSetSubmit = (tokenSet: string): void => {
    renameTokenSet(tokenSetMarkedForChange, tokenSet.trim());
    setTokenSetMarkedForChange('');
    setShowEditTokenSet(false);
  };

  const openEditTokenSetModal = (tokenSet: string): void => {
    setTokenSetMarkedForChange(tokenSet);
    setShowEditTokenSet(true);
  };

  const openDeleteTokenSetModal = (tokenSet: string): void => {
    setTokenSetMarkedForChange(tokenSet);
    setShowDeleteTokenSet(true);
  };

  const openAddTokenSetModal = (): void => {
    setTokenSetMarkedForChange('');
    setShowEditTokenSet(true);
  };

  return (
    <div className="w-188 border-r-1 border-cyan-50">
      <DndProvider backend={HTML5Backend}>
        {allTokenSets.map((token) => (
          <TokensetItem
            token={token}
            key={token}
            editTokenSet={openEditTokenSetModal}
            deleteTokenSet={openDeleteTokenSetModal}
            draggedTokenSet={draggedTokenSet}
            setDraggedTokenSet={setDraggedTokenSet}
          />
        ))}
      </DndProvider>
      <div
        className="flex justify-between py-4 px-10 cursor-pointer"
        onClick={openAddTokenSetModal}
      >
        添加新集合
        <Icon name="add" size={24}></Icon>
      </div>
      {showEditTokenSet && (
        <EditTokensetNameModal
          tokenSet={tokenSetMarkedForChange}
          title={tokenSetMarkedForChange ? '编辑集合' : '新增集合'}
          onCancel={() => setShowEditTokenSet(false)}
          onSubmit={
            tokenSetMarkedForChange ?
              handleRenameTokenSetSubmit :
              handleNewTokenSetSubmit
          }
        />
      )}
      {showDeleteTokenSet && (
        <ConfirmModal
          text={
            (<div className="text-14 p-20">
              确定要删除
              <span className="mx-4 font-semibold text-gray-900 text-h5">
                {tokenSetMarkedForChange}
              </span>
              吗？
            </div>)
          }
          title="删除"
          onCancel={() => setShowDeleteTokenSet(false)}
          onSubmit={handleDeleteTokenSet}
        />
      )}
    </div>
  );
}

export default TokensetSelector;
