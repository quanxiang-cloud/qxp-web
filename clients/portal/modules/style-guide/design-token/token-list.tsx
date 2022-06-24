import React, { useState, MouseEvent } from 'react';
import { observer } from 'mobx-react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import Tooltip from '@c/tooltip';
import Button from '@c/button';

import TokenTree from './token-tree';
import store from '../store';
import DesignTokenStore, { TokenEdited } from './store';
import { Token } from './types/token';
import { TokenListType } from './utils';

export interface ShowFormProps {
  token?: Token | null;
  name?: string;
  isPristine?: boolean;
}

interface Props extends TokenListType {
  setEditFormShow: (show: boolean) => void;
}

function TokenList({
  label,
  schema,
  explainer = '',
  property,
  type,
  values,
  setEditFormShow,
}: Props): JSX.Element {
  const [isIntCollapsed, setIntCollapsed] = useState(false);
  const [draggedToken, setDraggedToken] = useState<Token | null>(null);
  const { setTokenToBeEdited, isEditDisabled } = store.designTokenStore as DesignTokenStore;

  const showForm = <T extends Token>({
    token = null,
    name = '',
    isPristine = false,
  }: ShowFormProps): void => {
    const editToken: TokenEdited<T> = {
      name,
      initialName: name,
      isPristine,
      type,
      property,
      explainer,
      schema: schema,
      options: {
        description: token?.description,
        type: type,
      },
      value: '',
      unit: '',
    };

    if (token?.value) {
      editToken.value = token.value;
    } else if (schema.value) {
      editToken.value = schema.value;
    }

    if (token?.unit) {
      editToken.unit = token.unit;
    } else if (schema.unit) {
      editToken.unit = schema.unit;
    }

    setEditFormShow(true);
    setTokenToBeEdited(editToken);
  };

  const showNewForm = ({ name = '' }: ShowFormProps): void => {
    showForm({ token: null, name, isPristine: true });
  };

  const handleSetIntCollapsed = (e: MouseEvent): void => {
    e.stopPropagation();
    setIntCollapsed(!isIntCollapsed);
  };

  return (
    <div className="border-b border-gray-200 pb-4">
      <div className="relative flex items-center justify-between">
        <div
          className={`flex items-center w-full h-full p-12 hover:bg-gray-100 ${
            isIntCollapsed && 'opacity-50'
          }`}
          onClick={handleSetIntCollapsed}
        >
          <p className="font-bold">{label}</p>
        </div>
        <div className="absolute right-0 flex mr-2">
          {!isEditDisabled && (<Tooltip label="Add a new token" position="left">
            <Button
              className="button button-ghost"
              iconName="add"
              iconSize={24}
              onClick={() => {
                showNewForm({});
              }}
            ></Button>
          </Tooltip>)}
        </div>
      </div>
      {values && (
        <DndProvider backend={HTML5Backend}>
          <div className={`${isIntCollapsed && 'hidden'} px-10`}>
            <TokenTree
              tokenValues={values}
              showNewForm={showNewForm}
              showForm={showForm}
              type={type}
              draggedToken={draggedToken}
              setDraggedToken={setDraggedToken}
              level={1}
            />
          </div>
        </DndProvider>

      )}
    </div>
  );
}

export default observer(TokenList);
